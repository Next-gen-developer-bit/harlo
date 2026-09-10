import {
  AnalyticsData,
  AuthTokenDetails,
  PendingCheckResponse,
  PostDetails,
  PostResponse,
  SocialProvider,
} from '@gitroom/nestjs-libraries/integrations/social/social.integrations.interface';
import { Integration } from '@prisma/client';
import { makeId } from '@gitroom/nestjs-libraries/services/make.is';
import { PinterestSettingsDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/pinterest.dto';
import FormData from 'form-data';
import { timer } from '@gitroom/helpers/utils/timer';
import {
  BadBody,
  RefreshToken,
  SocialAbstract,
  ValidityMedia,
} from '@gitroom/nestjs-libraries/integrations/social.abstract';
import dayjs from 'dayjs';
import { Tool } from '@gitroom/nestjs-libraries/integrations/tool.decorator';
import { Rules } from '@gitroom/nestjs-libraries/chat/rules.description.decorator';
import { hasExtension } from '@gitroom/helpers/utils/has.extension';

// Travels through the workflow history between postPending, checkPostStatus
// and finalizePost - keep it small JSON (the media id and the pin content).
type PinterestPendingData = {
  mediaId: string; // empty for image-only pins (no asynchronous processing)
  message: string;
  settings: {
    link?: string;
    title?: string;
    dominant_color?: string;
    board: string;
  };
  imagePaths: string[];
  coverPath?: string;
  // Arm -> confirm -> publish handshake (same as the Facebook story flow):
  // finalizePost arms without mutating, checkPostStatus witnesses, and only a
  // witnessed attempt runs the create - so a create that dies with an unknown
  // outcome is detected instead of run again (Pinterest has no idempotency
  // key).
  attempting?: boolean;
  confirmed?: boolean;
};

@Rules(
  'Pinterest requires at least one media, if posting a video, you must have two attachment, one for video, one for the cover picture, When posting a video, there can be only one, if posting images, there can be maximum 5'
)
export class PinterestProvider
  extends SocialAbstract
  implements SocialProvider
{
  identifier = 'pinterest';
  name = 'Pinterest';
  isBetweenSteps = false;
  scopes = [
    'boards:read',
    'boards:write',
    'pins:read',
    'pins:write',
    'user_accounts:read',
  ];
  override maxConcurrentJob = 3; // Pinterest has more lenient rate limits
  maxLength() {
    return 500;
  }

  dto = PinterestSettingsDto;

  override async checkValidity(
    [firstItem]: Array<ValidityMedia[]>,
    settings?: PinterestSettingsDto
  ): Promise<string | true> {
    const media = firstItem || [];
    const videos = media.filter((item) => hasExtension(item?.path, 'mp4'));
    const pictures = media.filter((item) => !hasExtension(item?.path, 'mp4'));
    const coverFromSettings = settings?.cover?.path;

    if (media.length === 0) {
      return 'Requires at least one media';
    }
    if (videos.length === 0 && media.length > 5) {
      return 'You can only have up to 5 media items';
    }
    if (videos.length > 1) {
      return 'If posting a video you can only attach one video';
    }
    if (videos.length === 1 && pictures.length === 0 && !coverFromSettings) {
      return 'Video pins need a cover image. Open Settings and add a Cover image.';
    }
    if (videos.length === 1 && pictures.length > 1) {
      return 'If posting a video you can only have one extra image as the cover';
    }

    if (videos.length === 0 && pictures.length > 1) {
      const loadAll = await Promise.all(
        pictures.map((p) => this.getImageDimensions(p?.path))
      );
      const checkAllTheSameWidthHeight = loadAll?.every((p, i, arr) => {
        return p?.width === arr?.[0]?.width && p?.height === arr?.[0]?.height;
      });
      if (!checkAllTheSameWidthHeight) {
        return 'Requires all images to have the same width and height';
      }
    }
    return true;
  }

  editor = 'normal' as const;

  public override handleErrors(body: string):
    | {
        type: 'refresh-token' | 'bad-body' | 'retry';
        value: string;
      }
    | undefined {
    if (body.indexOf('constraint: maxItems=5') > -1) {
      return {
        type: 'bad-body' as const,
        value: 'You can upload a maximum of 5 images per post on Pinterest.',
      };
    }
    if (body.indexOf('Unable to reach the URL') > -1) {
      return {
        type: 'retry' as const,
        value:
          'Pinterest was unable to reach the URL provided. Please check the link and try again.',
      };
    }
    if (body.indexOf(`does not match '^\\\\\\\\\\\\\\\\d+$'`) > -1) {
      return {
        type: 'bad-body' as const,
        value:
          'The board ID must be a numeric string. Please check the board ID format.',
      };
    }
    if (body.indexOf('Board not found') > -1) {
      return {
        type: 'bad-body' as const,
        value: 'The specified board was not found. Please check the board ID.',
      };
    }
    if (body.indexOf('cover_image_url or cover_image_content_type') > -1) {
      return {
        type: 'bad-body' as const,
        value:
          'When uploading a video, you must add also an image to be used as a cover image.',
      };
    }
    if (body.indexOf('Authentication failed') > -1) {
      return {
        type: 'refresh-token' as const,
        value: 'Pinterest authentication failed. Please reconnect the channel.',
      };
    }
    if (body.indexOf('Authorization failed') > -1) {
      return {
        type: 'bad-body' as const,
        value:
          'Pinterest could not authorize this request. Reconnect the channel with board permissions.',
      };
    }
    if (body.indexOf('consumer type is not supported') > -1) {
      return {
        type: 'bad-body' as const,
        value:
          'Pinterest has not enabled API access for this app yet. Check the app status in the Pinterest developer portal.',
      };
    }

    if (
      body.indexOf('Trial access may not create Pins') > -1 ||
      body.indexOf('"code":29') > -1 ||
      body.indexOf('"code": 29') > -1
    ) {
      return {
        type: 'bad-body' as const,
        value:
          'Pinterest Trial access cannot create live pins. Request Standard access in the Pinterest developer portal. Until it is approved, this pin cannot be published.',
      };
    }
    if (body.indexOf('not permitted to access') > -1) {
      return {
        type: 'bad-body' as const,
        value:
          'Pinterest blocked this pin. Trial apps often cannot create pins until Standard access is approved.',
      };
    }
    if (body.indexOf('API access not granted') > -1) {
      return {
        type: 'bad-body' as const,
        value:
          'This Pinterest app does not have permission to create pins yet.',
      };
    }

    try {
      const parsed = JSON.parse(body);
      const apiMessage = parsed?.message || parsed?.error?.message;
      if (typeof apiMessage === 'string' && apiMessage.trim()) {
        return {
          type: 'bad-body' as const,
          value: apiMessage.trim(),
        };
      }
    } catch {
      // body is not JSON
    }

    return undefined;
  }

  async refreshToken(refreshToken: string): Promise<AuthTokenDetails> {
    const { access_token, expires_in } = await (
      await fetch('https://api.pinterest.com/v5/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${process.env.PINTEREST_CLIENT_ID}:${process.env.PINTEREST_CLIENT_SECRET}`
          ).toString('base64')}`,
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          scope: this.scopes.join(','),
          redirect_uri: `${process.env.FRONTEND_URL}/integrations/social/pinterest`,
        }),
      })
    ).json();

    const { id, profile_image, username } = await (
      await fetch('https://api.pinterest.com/v5/user_account', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();

    return {
      id: id,
      name: username,
      accessToken: access_token,
      refreshToken: refreshToken,
      expiresIn: expires_in,
      picture: profile_image || '',
      username,
    };
  }

  async generateAuthUrl() {
    const state = makeId(6);
    // Secret boards need extra scopes. Request them on connect, but keep
    // this.scopes as the required set so Trial apps that omit them still connect.
    const scope = [
      ...this.scopes,
      'boards:read_secret',
      'boards:write_secret',
    ].join(',');
    return {
      url: `https://www.pinterest.com/oauth/?client_id=${
        process.env.PINTEREST_CLIENT_ID
      }&redirect_uri=${encodeURIComponent(
        `${process.env.FRONTEND_URL}/integrations/social/pinterest`
      )}&response_type=code&scope=${encodeURIComponent(scope)}&state=${state}`,
      codeVerifier: makeId(10),
      state,
    };
  }

  async authenticate(params: {
    code: string;
    codeVerifier: string;
    refresh: string;
  }) {
    const { access_token, refresh_token, expires_in, scope } = await (
      await fetch('https://api.pinterest.com/v5/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${process.env.PINTEREST_CLIENT_ID}:${process.env.PINTEREST_CLIENT_SECRET}`
          ).toString('base64')}`,
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: params.code,
          redirect_uri: `${process.env.FRONTEND_URL}/integrations/social/pinterest`,
        }),
      })
    ).json();

    this.checkScopes(this.scopes, scope);

    const { id, profile_image, username } = await (
      await fetch('https://api.pinterest.com/v5/user_account', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();

    return {
      id: id,
      name: username,
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresIn: expires_in,
      picture: profile_image,
      username,
    };
  }

  @Tool({ description: 'List of boards', dataSchema: [] })
  async boards(accessToken: string) {
    const collected: { name: string; id: string }[] = [];
    const seen = new Set<string>();

    const list = async (privacy?: string) => {
      let bookmark: string | undefined;
      do {
        const params = new URLSearchParams({
          page_size: '250',
        });
        if (privacy) {
          params.set('privacy', privacy);
        }
        if (bookmark) {
          params.set('bookmark', bookmark);
        }

        const response = await this.fetch(
          `https://api.pinterest.com/v5/boards?${params.toString()}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const json = await response.json();
        for (const item of json.items || []) {
          if (!item?.id || seen.has(item.id)) {
            continue;
          }
          seen.add(item.id);
          collected.push({
            name: item.name,
            id: item.id,
          });
        }
        bookmark = json.bookmark;
      } while (bookmark);
    };

    try {
      await list('ALL');
    } catch (err) {
      await list();
    }

    // Secret boards need boards:read_secret. Ignore 403 so public boards still show.
    try {
      await list('SECRET');
    } catch {
      // Token may not include boards:read_secret yet.
    }

    return collected;
  }

  async createBoard(accessToken: string, data: { name?: string }) {
    const name = data?.name?.trim();
    if (!name) {
      return false;
    }

    const response = await this.fetch('https://api.pinterest.com/v5/boards', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        privacy: 'PUBLIC',
      }),
    });
    const created = await response.json();
    if (!created?.id) {
      return false;
    }

    return {
      id: created.id,
      name: created.name,
    };
  }

  private pinterestHost(sandbox = false) {
    if (sandbox) {
      return 'https://api-sandbox.pinterest.com';
    }
    return (
      process.env.PINTEREST_API_HOST || 'https://api.pinterest.com'
    ).replace(/\/$/, '');
  }

  private isTrialCreateBlocked(err: unknown) {
    const blob = [err, (err as any)?.details, (err as any)?.message]
      .map((value) => {
        try {
          return JSON.stringify(value);
        } catch {
          return String(value);
        }
      })
      .join(' ');
    return (
      blob.includes('Trial access may not create Pins') ||
      blob.includes('use API Sandbox') ||
      blob.includes('Trial access cannot create live pins') ||
      blob.includes('"code":29') ||
      blob.includes('"code": 29')
    );
  }

  private pinPayload(pendingData: PinterestPendingData, mediaId?: string) {
    const mapImages = (pendingData.imagePaths || []).map((path) => ({ path }));
    const videoId = mediaId ?? pendingData.mediaId;
    return {
      ...(pendingData.settings.link
        ? { link: pendingData.settings.link }
        : {}),
      ...(pendingData.settings.title
        ? { title: pendingData.settings.title }
        : {}),
      description: pendingData.message,
      ...(pendingData.settings.dominant_color
        ? { dominant_color: pendingData.settings.dominant_color }
        : {}),
      board_id: pendingData.settings.board,
      media_source: videoId
        ? {
            source_type: 'video_id',
            media_id: videoId,
            cover_image_url: pendingData.coverPath,
          }
        : mapImages.length === 1
        ? {
            source_type: 'image_url',
            url: mapImages[0].path,
          }
        : {
            source_type: 'multiple_image_urls',
            items: mapImages.map((m) => ({
              url: m.path,
            })),
          },
    };
  }

  private async uploadVideo(
    accessToken: string,
    videoPath: string,
    sandbox = false
  ) {
    const { upload_url, media_id, upload_parameters } = await (
      await this.fetch(`${this.pinterestHost(sandbox)}/v5/media`, {
        method: 'POST',
        body: JSON.stringify({
          media_type: 'video',
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
    ).json();

    const { data } = await this.getSsrfSafeAxios().get(videoPath, {
      responseType: 'stream',
    });
    const formData = Object.keys(upload_parameters || {})
      .filter((key) => key)
      .reduce((acc, key) => {
        acc.append(key, upload_parameters[key]);
        return acc;
      }, new FormData());
    formData.append('file', data);
    await this.getSsrfSafeAxios().post(upload_url, formData);
    return media_id as string;
  }

  private async waitForMedia(
    accessToken: string,
    mediaId: string,
    sandbox = false
  ) {
    const started = Date.now();
    while (Date.now() - started < 8 * 60 * 1000) {
      const mediafile = await (
        await this.fetch(
          `${this.pinterestHost(sandbox)}/v5/media/${mediaId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
          '',
          0,
          true
        )
      ).json();
      if (mediafile.status === 'succeeded') {
        return;
      }
      if (mediafile.status === 'failed') {
        throw new BadBody(
          'pinterest',
          JSON.stringify(mediafile),
          '{}',
          'The file is corrupted and cannot be uploaded'
        );
      }
      await timer(10000);
    }

    throw new BadBody(
      'pinterest',
      '{}',
      '{}',
      'The file took too long to process, please try again'
    );
  }

  private async createPin(
    accessToken: string,
    pendingData: PinterestPendingData,
    sandbox = false,
    mediaId?: string
  ) {
    const created = await (
      await this.fetch(`${this.pinterestHost(sandbox)}/v5/pins`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...this.pinPayload(pendingData, mediaId),
          board_id: pendingData.settings.board,
        }),
      })
    ).json();
    return created.id as string;
  }

  async postPending(
    id: string,
    accessToken: string,
    postDetails: PostDetails<PinterestSettingsDto>[]
  ): Promise<PostResponse[]> {
    let mediaId = '';
    const findMp4 = postDetails?.[0]?.media?.find((p) =>
      hasExtension(p.path, 'mp4')
    );
    const picture =
      postDetails?.[0]?.settings?.cover ||
      postDetails?.[0]?.media?.find((p) => !hasExtension(p.path, 'mp4'));

    // Upload the video now; the processing wait moves to checkPostStatus and
    // the pin itself is only created by finalizePost, so nothing here is
    // irreversible - a failure leaves only an orphaned media upload.
    if (findMp4) {
      mediaId = await this.uploadVideo(accessToken, findMp4.path);
    }

    return [
      {
        id: postDetails?.[0]?.id,
        releaseURL: '',
        postId: '',
        status: 'pending',
        pendingData: {
          mediaId,
          message: postDetails?.[0]?.message,
          settings: {
            link: postDetails?.[0]?.settings.link,
            title: postDetails?.[0]?.settings.title,
            dominant_color: postDetails?.[0]?.settings.dominant_color,
            board: postDetails?.[0]?.settings.board,
          },
          imagePaths: (postDetails?.[0]?.media || []).map((m) => m.path),
          coverPath: picture?.path,
        } as PinterestPendingData,
      },
    ];
  }

  override async checkPostStatus(
    accessToken: string,
    pendingData: PinterestPendingData,
    integration: Integration
  ): Promise<PendingCheckResponse> {
    // A confirmed create attempt died without reporting its result: Pinterest
    // gives no way to ask whether that pin was created, so never run the
    // create again - stop with an explicit warning instead.
    if (pendingData.attempting && pendingData.confirmed) {
      throw new BadBody(
        'pinterest',
        JSON.stringify({}),
        {} as any,
        'Pinterest may have already published this pin, please check your account before posting again to avoid duplicates'
      );
    }

    // witness the armed create so finalizePost knows the attempt is uniquely
    // accounted for before it mutates anything
    const witness = (): PendingCheckResponse =>
      pendingData.attempting && !pendingData.confirmed
        ? {
            status: 'ready',
            pendingData: { ...pendingData, confirmed: true },
          }
        : { status: 'ready', pendingData };

    // Image-only pins have no asynchronous processing step.
    if (!pendingData.mediaId) {
      return witness();
    }

    let mediafile: { status?: string };
    try {
      mediafile = await (
        await this.fetch(
          'https://api.pinterest.com/v5/media/' + pendingData.mediaId,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
          '',
          0,
          true
        )
      ).json();
    } catch (err) {
      if (err instanceof RefreshToken) {
        throw err;
      }

      // Transient status-check error: the media may finish processing just
      // fine, keep polling - if Pinterest stays broken the workflow exhausts
      // its checks and warns the user properly.
      return { status: 'pending', pendingData };
    }

    if (mediafile.status === 'failed') {
      throw new BadBody(
        'pinterest',
        JSON.stringify({}),
        {} as any,
        'The file is corrupted and cannot be uploaded'
      );
    }

    if (mediafile.status !== 'succeeded') {
      return { status: 'pending', pendingData };
    }

    return witness();
  }

  override async finalizePost(
    accessToken: string,
    pendingData: PinterestPendingData,
    integration: Integration
  ): Promise<PendingCheckResponse> {
    // Create with an arm -> confirm -> publish handshake: the create only runs
    // after checkPostStatus witnessed the intent, so a run that dies
    // mid-create is detectable and the pin is never published twice.
    if (!pendingData.attempting || !pendingData.confirmed) {
      return {
        status: 'pending',
        pendingData: { ...pendingData, attempting: true, confirmed: false },
      };
    }

    let pId: string;
    try {
      pId = await this.createPin(accessToken, pendingData, false);
    } catch (err) {
      if (!this.isTrialCreateBlocked(err)) {
        throw err;
      }

      // Production OAuth tokens cannot be used on api-sandbox.pinterest.com.
      throw new BadBody(
        'pinterest',
        (err as any)?.details?.[0]?.json || '{}',
        '{}',
        'Pinterest Trial access cannot create live pins. Request Standard access in the Pinterest developer portal. Until it is approved, this pin cannot be published.'
      );
    }

    return {
      status: 'completed',
      postId: pId,
      releaseURL: `https://www.pinterest.com/pin/${pId}`,
    };
  }

  // Old blocking behavior, kept for workflow versions before v1.0.6 that still
  // run and don't know how to resolve a `pending` response - they wait for the
  // processing and create the pin inside the activity like before.
  async post(
    id: string,
    accessToken: string,
    postDetails: PostDetails<PinterestSettingsDto>[],
    integration: Integration
  ): Promise<PostResponse[]> {
    const [response] = await this.postPending(id, accessToken, postDetails);

    let pendingData = response.pendingData;
    const started = Date.now();

    // eslint-disable-next-line no-constant-condition
    while (true) {
      // Cap below the 10-minute activity timeout of the old workflows using
      // this method: failing here is safe (the pin is only created once the
      // media is ready), timing the activity out is not - a retried activity
      // would upload and publish again.
      if (Date.now() - started > 8 * 60 * 1000) {
        throw new BadBody(
          'pinterest',
          JSON.stringify({}),
          {} as any,
          'The file took too long to process, please try again'
        );
      }

      const check = await this.checkPostStatus(
        accessToken,
        pendingData,
        integration
      );

      if (check.status === 'pending') {
        pendingData = check.pendingData;
        await timer(20000);
        continue;
      }

      const result =
        check.status === 'ready'
          ? await this.finalizePost(accessToken, check.pendingData, integration)
          : check;

      if (result.status === 'completed') {
        return [
          {
            id: response.id,
            postId: result.postId,
            releaseURL: result.releaseURL,
            status: 'success',
          },
        ];
      }

      // finalize only armed the handshake (nothing to wait for), loop straight
      // into the witnessing check
      pendingData = result.pendingData;
    }
  }

  async analytics(
    id: string,
    accessToken: string,
    date: number
  ): Promise<AnalyticsData[]> {
    const until = dayjs().format('YYYY-MM-DD');
    // Pinterest analytics only cover the last 90 days (89 for a UTC safety margin)
    const since = dayjs()
      .subtract(Math.min(date, 89), 'day')
      .format('YYYY-MM-DD');

    const {
      all: { daily_metrics },
    } = await (
      await fetch(
        `https://api.pinterest.com/v5/user_account/analytics?start_date=${since}&end_date=${until}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
    ).json();

    return daily_metrics.reduce(
      (acc: any, item: any) => {
        if (typeof item.metrics.PIN_CLICK_RATE !== 'undefined') {
          acc[0].data.push({
            date: item.date,
            total: item.metrics.PIN_CLICK_RATE,
          });

          acc[1].data.push({
            date: item.date,
            total: item.metrics.IMPRESSION,
          });

          acc[2].data.push({
            date: item.date,
            total: item.metrics.PIN_CLICK,
          });

          acc[3].data.push({
            date: item.date,
            total: item.metrics.ENGAGEMENT,
          });

          acc[4].data.push({
            date: item.date,
            total: item.metrics.SAVE,
          });
        }

        return acc;
      },
      [
        { label: 'Pin click rate', data: [] as any[] },
        { label: 'Impressions', data: [] as any[] },
        { label: 'Pin Clicks', data: [] as any[] },
        { label: 'Engagement', data: [] as any[] },
        { label: 'Saves', data: [] as any[] },
      ]
    );
  }

  async postAnalytics(
    integrationId: string,
    accessToken: string,
    postId: string,
    date: number
  ): Promise<AnalyticsData[]> {
    const today = dayjs().format('YYYY-MM-DD');
    const since = dayjs()
      .subtract(Math.min(date, 89), 'day')
      .format('YYYY-MM-DD');
    const pinId = this.pinterestPinId(postId);
    if (!pinId) {
      return [];
    }

    try {
      const response = await fetch(
        `https://api.pinterest.com/v5/pins/${pinId}/analytics?start_date=${since}&end_date=${today}&metric_types=IMPRESSION,PIN_CLICK,OUTBOUND_CLICK,SAVE,TOTAL_COMMENTS,TOTAL_REACTIONS`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return [];
      }

      const bucket = this.pinterestAnalyticsBucket(data);
      if (!bucket) {
        return [];
      }

      const totals = this.pinterestMetricTotals(bucket);
      const result: AnalyticsData[] = [];
      const push = (label: string, value?: number) => {
        if (value === undefined || Number.isNaN(value)) {
          return;
        }
        result.push({
          label,
          percentageChange: 0,
          data: [{ total: String(value), date: today }],
        });
      };

      push('Impressions', totals.IMPRESSION);
      push('Pin Clicks', totals.PIN_CLICK);
      push('Outbound Clicks', totals.OUTBOUND_CLICK);
      push('Saves', totals.SAVE);
      push('Comments', totals.TOTAL_COMMENTS);
      push('Likes', totals.TOTAL_REACTIONS);

      return result;
    } catch (err) {
      console.error('Error fetching Pinterest post analytics:', err);
      return [];
    }
  }

  private pinterestPinId(postId: string) {
    const raw = String(postId || '').trim();
    const fromUrl = raw.match(/pin\/(\d+)/i);
    if (fromUrl?.[1]) {
      return fromUrl[1];
    }
    return /^\d+$/.test(raw) ? raw : '';
  }

  private pinterestAnalyticsBucket(data: any) {
    if (!data || typeof data !== 'object') {
      return null;
    }
    if (
      data.all?.summary_metrics ||
      data.all?.daily_metrics ||
      data.all?.lifetime_metrics
    ) {
      return data.all;
    }
    const nested = Object.values(data).find(
      (value: any) =>
        value &&
        typeof value === 'object' &&
        (value.summary_metrics || value.daily_metrics || value.lifetime_metrics)
    );
    return (nested as any) || null;
  }

  private pinterestMetricTotals(bucket: {
    summary_metrics?: Record<string, number>;
    lifetime_metrics?: Record<string, number>;
    daily_metrics?: Array<{ metrics?: Record<string, number> }>;
  }) {
    const summary = bucket.summary_metrics || {};
    const lifetime = bucket.lifetime_metrics || {};
    const daily = Array.isArray(bucket.daily_metrics)
      ? bucket.daily_metrics
      : [];
    const fromDaily = (key: string) =>
      daily.reduce((sum, row) => sum + Number(row?.metrics?.[key] || 0), 0);
    const pick = (key: string) => {
      if (summary[key] !== undefined) {
        return Number(summary[key]);
      }
      if (lifetime[key] !== undefined) {
        return Number(lifetime[key]);
      }
      if (daily.length) {
        return fromDaily(key);
      }
      return undefined;
    };

    return {
      IMPRESSION: pick('IMPRESSION'),
      PIN_CLICK: pick('PIN_CLICK'),
      OUTBOUND_CLICK: pick('OUTBOUND_CLICK'),
      SAVE: pick('SAVE'),
      TOTAL_COMMENTS: pick('TOTAL_COMMENTS'),
      TOTAL_REACTIONS: pick('TOTAL_REACTIONS'),
    };
  }
}
