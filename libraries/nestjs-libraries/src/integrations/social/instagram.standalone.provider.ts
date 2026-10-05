import {
  AuthTokenDetails,
  PostDetails,
  PostResponse,
  SocialProvider,
} from '@gitroom/nestjs-libraries/integrations/social/social.integrations.interface';
import { makeId } from '@gitroom/nestjs-libraries/services/make.is';
import dayjs from 'dayjs';
import {
  SocialAbstract,
  ValidityMedia,
} from '@gitroom/nestjs-libraries/integrations/social.abstract';
import { InstagramDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/instagram.dto';
import { InstagramProvider } from '@gitroom/nestjs-libraries/integrations/social/instagram.provider';
import { Integration } from '@prisma/client';
import { Rules } from '@gitroom/nestjs-libraries/chat/rules.description.decorator';

const instagramProvider = new InstagramProvider();

@Rules(
  "Instagram should have at least one attachment, if it's a story, it can have only one picture"
)
export class InstagramStandaloneProvider
  extends SocialAbstract
  implements SocialProvider
{
  identifier = 'instagram-standalone';
  name = 'Instagram\n(Standalone)';
  isBetweenSteps = false;
  refreshCron = true;
  scopes = [
    'instagram_business_basic',
    'instagram_business_content_publish',
    'instagram_business_manage_comments',
    'instagram_business_manage_insights',
  ];
    override maxConcurrentJob = 200; // Instagram standalone has stricter limits
  dto = InstagramDto;

  editor = 'normal' as const;
  maxLength() {
    return 2200;
  }

  override async checkValidity(
    [firstPost]: Array<ValidityMedia[]>,
    settings: any
  ): Promise<string | true> {
    if (!firstPost?.length) {
      return 'Should have at least one media';
    }
    if (this.assetBoolean(settings?.is_trial_reel)) {
      if ((firstPost?.length ?? 0) > 1) {
        return 'Trial Reels can only have one video';
      }
      const hasVideo = firstPost?.some(
        (f) => (f?.path?.indexOf?.('mp4') ?? -1) > -1
      );
      if (!hasVideo) {
        return 'Trial Reels must be a video';
      }
    }
    return true;
  }

  public override handleErrors(
    body: string,
    status: number
  ):
    | { type: 'refresh-token' | 'bad-body' | 'retry'; value: string }
    | undefined {
    return instagramProvider.handleErrors(body, status);
  }

  private redirectUri() {
    const frontend = process.env.FRONTEND_URL || '';
    const prefix =
      frontend.indexOf('https') === -1 ? 'https://redirectmeto.com/' : '';
    return `${prefix}${frontend}/integrations/social/instagram-standalone`;
  }

  private instagramError(body: any) {
    return (
      body?.error_message ||
      body?.error?.message ||
      (typeof body?.error === 'string' ? body.error : '') ||
      ''
    );
  }

  private shortLivedToken(body: any) {
    const token = Array.isArray(body?.data) ? body.data[0] : body;
    if (!token?.access_token) {
      throw new Error(
        this.instagramError(body) ||
          'Instagram did not return an access token. Check the Instagram App ID and App Secret.'
      );
    }
    return token;
  }

  private grantedScopes(permissions: any) {
    if (Array.isArray(permissions)) {
      return permissions
        .map((item) =>
          typeof item === 'string'
            ? item
            : item?.status === 'declined'
            ? ''
            : item?.permission || ''
        )
        .filter(Boolean);
    }
    if (typeof permissions === 'string') {
      return decodeURIComponent(permissions)
        .split(/[,\s]+/)
        .filter(Boolean);
    }
    return [];
  }

  private async instagramProfile(accessToken: string) {
    const token = encodeURIComponent(accessToken);
    const basic = await (
      await fetch(
        `https://graph.instagram.com/me?fields=user_id,username&access_token=${token}`
      )
    ).json();
    const extra = await (
      await fetch(
        `https://graph.instagram.com/me?fields=name,profile_picture_url&access_token=${token}`
      )
    ).json();

    return {
      user_id: basic?.user_id || basic?.id,
      username: basic?.username || extra?.username,
      name: extra?.error ? basic?.username : extra?.name || basic?.username,
      profile_picture_url: extra?.error ? '' : extra?.profile_picture_url || '',
      error: this.instagramError(basic),
    };
  }

  async refreshToken(refresh_token: string): Promise<AuthTokenDetails> {
    const refreshed = await (
      await fetch(
        `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(
          refresh_token
        )}`
      )
    ).json();
    const accessToken = refreshed?.access_token || refresh_token;
    const profile = await this.instagramProfile(accessToken);
    if (!profile.user_id) {
      throw new Error(
        profile.error || 'Instagram did not return an account id.'
      );
    }

    return {
      id: String(profile.user_id),
      name: profile.name || profile.username,
      accessToken,
      refreshToken: accessToken,
      expiresIn: dayjs().add(58, 'days').unix() - dayjs().unix(),
      picture: profile.profile_picture_url || '',
      username: profile.username,
    };
  }

  async generateAuthUrl() {
    const appId = process.env.INSTAGRAM_APP_ID;
    if (!appId) {
      throw new Error(
        'INSTAGRAM_APP_ID is not set on the API server. Add it to your environment and restart.'
      );
    }
    const state = makeId(6);
    return {
      url:
        `https://www.instagram.com/oauth/authorize?enable_fb_login=0&client_id=${appId}&redirect_uri=${encodeURIComponent(
          this.redirectUri()
        )}&response_type=code&scope=${encodeURIComponent(
          this.scopes.join(',')
        )}` + `&state=${state}`,
      codeVerifier: makeId(10),
      state,
    };
  }

  async authenticate(params: {
    code: string;
    codeVerifier: string;
    refresh: string;
  }) {
    const appId = process.env.INSTAGRAM_APP_ID;
    const appSecret = process.env.INSTAGRAM_APP_SECRET;
    if (!appId || !appSecret) {
      throw new Error(
        'Instagram App ID or App Secret is missing on the API server.'
      );
    }

    const formData = new FormData();
    formData.append('client_id', appId);
    formData.append('client_secret', appSecret);
    formData.append('grant_type', 'authorization_code');
    formData.append('redirect_uri', this.redirectUri());
    formData.append('code', String(params.code || '').replace(/#_$/, ''));

    const tokenBody = await (
      await fetch('https://api.instagram.com/oauth/access_token', {
        method: 'POST',
        body: formData,
      })
    ).json();
    const shortLived = this.shortLivedToken(tokenBody);
    const scopes = this.grantedScopes(shortLived.permissions);
    if (!scopes.length) {
      throw new Error(
        this.instagramError(tokenBody) ||
          'Instagram did not grant the requested permissions.'
      );
    }
    this.checkScopes(this.scopes, scopes);

    const longLived = await (
      await fetch(
        'https://graph.instagram.com/access_token' +
          '?grant_type=ig_exchange_token' +
          `&client_secret=${encodeURIComponent(appSecret)}` +
          `&access_token=${encodeURIComponent(shortLived.access_token)}`
      )
    ).json();
    const accessToken = longLived?.access_token || shortLived.access_token;
    const profile = await this.instagramProfile(accessToken);
    const accountId = profile.user_id || shortLived.user_id;
    if (!accountId) {
      throw new Error(
        profile.error ||
          this.instagramError(longLived) ||
          'Instagram did not return an account id.'
      );
    }

    return {
      id: String(accountId),
      name: profile.name || profile.username,
      accessToken,
      refreshToken: accessToken,
      expiresIn: dayjs().add(58, 'days').unix() - dayjs().unix(),
      picture: profile.profile_picture_url || '',
      username: profile.username,
    };
  }

  async post(
    id: string,
    accessToken: string,
    postDetails: PostDetails<InstagramDto>[],
    integration: Integration
  ): Promise<PostResponse[]> {
    return instagramProvider.post(
      id,
      accessToken,
      postDetails,
      integration,
      'graph.instagram.com'
    );
  }

  async postPending(
    id: string,
    accessToken: string,
    postDetails: PostDetails<InstagramDto>[],
    integration: Integration
  ): Promise<PostResponse[]> {
    return instagramProvider.postPending(
      id,
      accessToken,
      postDetails,
      integration,
      'graph.instagram.com'
    );
  }

  // the graph domain travels inside pendingData, so these are pure delegations
  override async checkPostStatus(
    accessToken: string,
    pendingData: any,
    integration: Integration
  ) {
    return instagramProvider.checkPostStatus(
      accessToken,
      pendingData,
      integration
    );
  }

  override async finalizePost(
    accessToken: string,
    pendingData: any,
    integration: Integration
  ) {
    return instagramProvider.finalizePost(accessToken, pendingData, integration);
  }

  async comment(
    id: string,
    postId: string,
    lastCommentId: string | undefined,
    accessToken: string,
    postDetails: PostDetails<InstagramDto>[],
    integration: Integration
  ): Promise<PostResponse[]> {
    return instagramProvider.comment(
      id,
      postId,
      lastCommentId,
      accessToken,
      postDetails,
      integration,
      'graph.instagram.com'
    );
  }

  async analytics(id: string, accessToken: string, date: number) {
    return instagramProvider.analytics(
      id,
      accessToken,
      date,
      'graph.instagram.com'
    );
  }

  async postAnalytics(
    integrationId: string,
    accessToken: string,
    postId: string,
    date: number
  ) {
    return instagramProvider.postAnalytics(
      integrationId,
      accessToken,
      postId,
      date,
      'graph.instagram.com'
    );
  }
}
