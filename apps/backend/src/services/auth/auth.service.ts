import { Injectable } from '@nestjs/common';
import { Provider, User } from '@prisma/client';
import { CreateOrgUserDto } from '@gitroom/nestjs-libraries/dtos/auth/create.org.user.dto';
import { LoginUserDto } from '@gitroom/nestjs-libraries/dtos/auth/login.user.dto';
import { UsersService } from '@gitroom/nestjs-libraries/database/prisma/users/users.service';
import { OrganizationService } from '@gitroom/nestjs-libraries/database/prisma/organizations/organization.service';
import { AuthService as AuthChecker } from '@gitroom/helpers/auth/auth.service';
import { AuthProviderManager } from '@gitroom/backend/services/auth/providers/providers.manager';
import dayjs from 'dayjs';
import { NotificationService } from '@gitroom/nestjs-libraries/database/prisma/notifications/notification.service';
import { ForgotReturnPasswordDto } from '@gitroom/nestjs-libraries/dtos/auth/forgot-return.password.dto';
import { EmailService } from '@gitroom/nestjs-libraries/services/email.service';
import { NewsletterService } from '@gitroom/nestjs-libraries/newsletter/newsletter.service';

@Injectable()
export class AuthService {
  constructor(
    private _userService: UsersService,
    private _organizationService: OrganizationService,
    private _notificationService: NotificationService,
    private _emailService: EmailService,
    private _providerManager: AuthProviderManager
  ) {}
  async canRegister(provider: string) {
    if (
      process.env.DISABLE_REGISTRATION !== 'true' ||
      provider === Provider.GENERIC
    ) {
      return true;
    }

    return (await this._organizationService.getCount()) === 0;
  }

  async routeAuth(
    provider: Provider,
    body: CreateOrgUserDto | LoginUserDto,
    ip: string,
    userAgent: string,
    addToOrg?:
      | boolean
      | { orgId: string; role: 'USER' | 'ADMIN'; id: string; email?: string }
  ) {
    if (provider === Provider.LOCAL) {
      if (process.env.DISALLOW_PLUS && body.email.includes('+')) {
        throw new Error('Email with plus sign is not allowed');
      }
      if (body instanceof CreateOrgUserDto) {
        body.email = body.email.toLowerCase();
      }
      const user = await this._userService.getUserByEmail(body.email);
      if (body instanceof CreateOrgUserDto) {
        if (user) {
          throw new Error('Email already exists');
        }

        if (!(await this.canRegister(provider))) {
          throw new Error('Registration is disabled');
        }

        const create = await this._organizationService.createOrgAndUser(
          body,
          ip,
          userAgent
        );

        const addedOrg = await this.maybeAddToOrg(
          create.users[0].user,
          addToOrg
        );

        const obj = { addedOrg, jwt: await this.jwt(create.users[0].user) };
        await this._emailService.sendEmail(
          body.email,
          'Activate your account',
          `Click <a href="${process.env.FRONTEND_URL}/auth/activate/${obj.jwt}">here</a> to activate your account`,
          'top'
        );
        return obj;
      }

      if (!user || !AuthChecker.comparePassword(body.password, user.password)) {
        throw new Error('Invalid user name or password');
      }

      if (!user.activated) {
        throw new Error('User is not activated');
      }

      return {
        addedOrg: await this.maybeAddToOrg(user, addToOrg),
        jwt: await this.jwt(user),
      };
    }

    const user = await this.loginOrRegisterProvider(
      provider,
      body as CreateOrgUserDto,
      ip,
      userAgent
    );

    return {
      addedOrg: await this.maybeAddToOrg(user, addToOrg),
      jwt: await this.jwt(user),
    };
  }

  private async maybeAddToOrg(
    user: Pick<User, 'id' | 'email'>,
    addToOrg?:
      | boolean
      | { orgId: string; role: 'USER' | 'ADMIN'; id: string; email?: string }
  ) {
    if (!addToOrg || typeof addToOrg === 'boolean') {
      return false;
    }

    if (
      addToOrg.email &&
      user.email.toLowerCase() !== addToOrg.email.toLowerCase()
    ) {
      return false;
    }

    return this._organizationService.addUserToOrg(
      user.id,
      addToOrg.id,
      addToOrg.orgId,
      addToOrg.role
    );
  }

  public getOrgFromCookie(cookie?: string) {
    if (!cookie) {
      return false;
    }

    try {
      const getOrg: any = AuthChecker.verifyJWT(cookie);
      if (dayjs(getOrg.timeLimit).isBefore(dayjs())) {
        return false;
      }

      return getOrg as {
        email: string;
        role: 'USER' | 'ADMIN';
        orgId: string;
        id: string;
      };
    } catch (err) {
      return false;
    }
  }

  private async loginOrRegisterProvider(
    provider: Provider,
    body: CreateOrgUserDto,
    ip: string,
    userAgent: string
  ) {
    const providerInstance = this._providerManager.getProvider(provider);
    const providerUser = await providerInstance.getUser(body.providerToken);

    if (!providerUser) {
      throw new Error('Invalid provider token');
    }

    const user = await this._userService.getUserByProvider(
      providerUser.id,
      provider
    );
    if (user) {
      return user;
    }

    return this.loginOrRegisterKnownUser(
      provider,
      { id: providerUser.id, email: providerUser.email },
      ip,
      userAgent
    );
  }

  private async _track(
    name: string,
    email: string,
    datafast_visitor_id: string
  ) {
    if (email && datafast_visitor_id && process.env.DATAFAST_API_KEY) {
      try {
        await fetch('https://datafa.st/api/v1/goals', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.DATAFAST_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            datafast_visitor_id: datafast_visitor_id,
            name: name,
            metadata: {
              email,
            },
          }),
        });
      } catch (err) {}
    }
  }

  async forgot(email: string) {
    const user = await this._userService.getUserByEmail(email);
    if (!user || user.providerName !== Provider.LOCAL) {
      return false;
    }

    const resetValues = AuthChecker.signJWT({
      id: user.id,
      expires: dayjs().add(20, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
    });

    await this._notificationService.sendEmail(
      user.email,
      'Reset your password',
      `You have requested to reset your passsord. <br />Click <a href="${process.env.FRONTEND_URL}/auth/forgot/${resetValues}">here</a> to reset your password<br />The link will expire in 20 minutes`
    );
  }

  forgotReturn(body: ForgotReturnPasswordDto) {
    const user = AuthChecker.verifyJWT(body.token) as {
      id: string;
      expires: string;
    };
    if (dayjs(user.expires).isBefore(dayjs())) {
      return false;
    }

    return this._userService.updatePassword(user.id, body.password);
  }

  async activate(code: string, tracking: string) {
    const user = AuthChecker.verifyJWT(code) as {
      id: string;
      activated: boolean;
      email: string;
    };
    if (user.id && !user.activated) {
      const getUserAgain = await this._userService.getUserByEmail(user.email);
      if (getUserAgain.activated) {
        return false;
      }
      await this._userService.activateUser(user.id);
      user.activated = true;
      this._track('register', user.email, tracking).catch((err) => {});
      await NewsletterService.register(user.email);
      return this.jwt(user as any);
    }

    return false;
  }

  async resendActivationEmail(email: string) {
    const user = await this._userService.getUserByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    if (user.activated) {
      throw new Error('Account is already activated');
    }

    const jwt = await this.jwt(user);

    await this._emailService.sendEmail(
      user.email,
      'Activate your account',
      `Click <a href="${process.env.FRONTEND_URL}/auth/activate/${jwt}">here</a> to activate your account`,
      'top'
    );

    return true;
  }

  oauthLink(provider: string, query?: any) {
    const providerInstance = this._providerManager.getProvider(provider);
    return providerInstance.generateLink(query);
  }

  async routeSupabaseGoogle(
    accessToken: string,
    ip: string,
    userAgent: string,
    addToOrg?:
      | boolean
      | { orgId: string; role: 'USER' | 'ADMIN'; id: string; email?: string }
  ) {
    const providerUser = await this.getSupabaseAuthUser(accessToken);
    const user = await this.loginOrRegisterKnownUser(
      Provider.GOOGLE,
      providerUser,
      ip,
      userAgent
    );

    return {
      addedOrg: await this.maybeAddToOrg(user, addToOrg),
      jwt: await this.jwt(user),
    };
  }

  async routeGoogleAuthCode(
    code: string,
    redirectUri: string,
    ip: string,
    userAgent: string,
    addToOrg?:
      | boolean
      | { orgId: string; role: 'USER' | 'ADMIN'; id: string; email?: string }
  ) {
    const providerInstance = this._providerManager.getProvider('GOOGLE');
    const token = await providerInstance.getToken(code, redirectUri);
    const providerUser = await providerInstance.getUser(token);
    if (!providerUser || !providerUser.email) {
      throw new Error('Could not get Google user info');
    }

    const user = await this.loginOrRegisterKnownUser(
      Provider.GOOGLE,
      providerUser,
      ip,
      userAgent
    );

    return {
      addedOrg: await this.maybeAddToOrg(user, addToOrg),
      jwt: await this.jwt(user),
    };
  }

  private async loginOrRegisterKnownUser(
    provider: Provider,
    providerUser: { id: string; email: string },
    ip: string,
    userAgent: string
  ) {
    const email = providerUser.email.toLowerCase();

    const byProviderId = await this._userService.getUserByProvider(
      providerUser.id,
      provider
    );
    if (byProviderId) {
      return byProviderId;
    }

    const byGoogleEmail = await this._userService.getUserByEmailAndProvider(
      email,
      provider
    );
    if (byGoogleEmail) {
      if (providerUser.id && byGoogleEmail.providerId !== providerUser.id) {
        await this._userService.linkProviderId(
          byGoogleEmail.id,
          providerUser.id
        );
      }
      return byGoogleEmail;
    }

    const existingLocal = await this._userService.getUserByEmail(email);
    if (existingLocal) {
      return existingLocal;
    }

    if (!(await this.canRegister(provider))) {
      throw new Error('Registration is disabled');
    }

    try {
      const create = await this._organizationService.createOrgAndUser(
        {
          company: '',
          email,
          password: '',
          provider,
          providerId: providerUser.id,
          datafast_visitor_id: '',
        },
        ip,
        userAgent
      );

      this._track('register', email, '').catch(() => {});
      await NewsletterService.register(email);

      return create.users[0].user;
    } catch (err: any) {
      const existing =
        (await this._userService.getUserByEmailAndProvider(email, provider)) ||
        (await this._userService.getUserByEmail(email));
      if (existing) {
        return existing;
      }
      throw new Error('Could not complete Google sign-in. Please try again.');
    }
  }

  private async getSupabaseAuthUser(accessToken: string) {
    const url = (
      process.env.SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      ''
    ).replace(/\/+$/, '');
    const apiKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      '';

    if (!url || !apiKey) {
      throw new Error('Supabase is not configured');
    }

    const response = await fetch(`${url}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apikey: apiKey,
      },
    });

    if (!response.ok) {
      throw new Error('Invalid Google session');
    }

    const data = (await response.json()) as { id?: string; email?: string };
    if (!data.id || !data.email) {
      throw new Error('Google account is missing an email');
    }

    return {
      id: data.id,
      email: data.email.toLowerCase(),
    };
  }

  async checkExists(provider: string, code: string, redirectUri?: string) {
    const providerInstance = this._providerManager.getProvider(provider);
    const token = await providerInstance.getToken(code, redirectUri);
    const user = await providerInstance.getUser(token);
    if (!user) {
      throw new Error('Invalid user');
    }
    const checkExists = await this._userService.getUserByProvider(
      user.id,
      provider as Provider
    );
    if (checkExists) {
      return { jwt: await this.jwt(checkExists) };
    }

    return { token };
  }

  private async jwt(user: User) {
    if (user.password) {
      delete user.password;
    }
    return AuthChecker.signJWT(user);
  }
}
