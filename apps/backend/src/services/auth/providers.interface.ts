import { Injectable } from '@nestjs/common';

export abstract class AuthProviderAbstract {
  abstract generateLink(query?: any): Promise<string> | string;
  abstract getToken(code: string, redirectUri?: string): Promise<string>;
  async exchangeCode(
    code: string,
    options?: { redirectUri?: string; state?: string }
  ): Promise<{ token: string; allowRegistration: boolean }> {
    return {
      token: await this.getToken(code, options?.redirectUri),
      allowRegistration: false,
    };
  }
  abstract getUser(
    providerToken: string
  ): Promise<{ email: string; id: string } | false> | false;
  async postRegistration(providerToken: string, orgId: string): Promise<void> {}
}

export interface AuthProviderParams {
  provider: string;
}

export function AuthProvider(params: AuthProviderParams) {
  return function (target: any) {
    Injectable()(target);

    const existingMetadata =
      Reflect.getMetadata('auth-provider', AuthProviderAbstract) || [];

    existingMetadata.push({ target, provider: params.provider });

    Reflect.defineMetadata(
      'auth-provider',
      existingMetadata,
      AuthProviderAbstract
    );
  };
}
