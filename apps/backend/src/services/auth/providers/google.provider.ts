import { google } from 'googleapis';
import {
  AuthProvider,
  AuthProviderAbstract,
} from '@gitroom/backend/services/auth/providers.interface';
import { ioRedis } from '@gitroom/nestjs-libraries/redis/redis.service';
import { randomBytes } from 'node:crypto';

const defaultRedirect = () => `${process.env.FRONTEND_URL}/login`;

const makeClient = (redirectUri: string) =>
  new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID || process.env.YOUTUBE_CLIENT_ID,
    clientSecret:
      process.env.GOOGLE_CLIENT_SECRET || process.env.YOUTUBE_CLIENT_SECRET,
    redirectUri,
  });

@AuthProvider({ provider: 'GOOGLE' })
export class GoogleProvider extends AuthProviderAbstract {
  async generateLink(query?: { redirect_uri?: string; auth_intent?: string }) {
    const redirectUri = query?.redirect_uri || defaultRedirect();
    const state = randomBytes(24).toString('hex');
    await ioRedis.set(
      `google_oauth:${state}`,
      JSON.stringify({
        redirectUri,
        intent: query?.auth_intent === 'signup' ? 'signup' : 'login',
      }),
      'EX',
      600
    );
    return makeClient(redirectUri).generateAuthUrl({
      access_type: 'online',
      prompt: 'select_account',
      state,
      redirect_uri: redirectUri,
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
    });
  }

  async getToken(code: string, redirectUri?: string) {
    const client = makeClient(redirectUri || defaultRedirect());
    const { tokens } = await client.getToken(code);
    return tokens.access_token!;
  }

  override async exchangeCode(
    code: string,
    options?: { redirectUri?: string; state?: string }
  ) {
    const state = options?.state || '';
    const oauthState = await ioRedis.get(`google_oauth:${state}`);
    await ioRedis.del(`google_oauth:${state}`);
    if (!oauthState) {
      throw new Error('Google sign-in expired. Please try again.');
    }

    const parsedState = JSON.parse(oauthState) as {
      redirectUri: string;
      intent: 'login' | 'signup';
    };
    if (parsedState.redirectUri !== options?.redirectUri) {
      throw new Error('Invalid Google sign-in redirect.');
    }

    return {
      token: await this.getToken(code, options.redirectUri),
      allowRegistration: parsedState.intent === 'signup',
    };
  }

  async getUser(providerToken: string) {
    const client = makeClient(defaultRedirect());
    client.setCredentials({ access_token: providerToken });
    const { data } = await google
      .oauth2({ version: 'v2', auth: client })
      .userinfo.get();

    if (!data.id || !data.email || !data.verified_email) {
      return false;
    }

    return {
      id: data.id,
      email: data.email,
    };
  }
}
