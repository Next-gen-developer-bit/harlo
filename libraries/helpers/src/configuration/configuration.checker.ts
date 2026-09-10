import { readFileSync, existsSync } from 'fs';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

export class ConfigurationChecker {
  cfg: dotenv.DotenvParseOutput;
  issues: string[] = [];

  readEnvFromFile() {
    const envFile = resolve(__dirname, '../../../.env');

    if (!existsSync(envFile)) {
      console.error('Env file not found!: ', envFile);
      return;
    }

    const handle = readFileSync(envFile, 'utf-8');

    this.cfg = dotenv.parse(handle);
  }

  readEnvFromProcess() {
    this.cfg = process.env;
  }

  check() {
    this.checkDatabaseServers();
    this.checkNonEmpty('JWT_SECRET');
    this.checkIsValidUrl('MAIN_URL');
    this.checkIsValidUrl('FRONTEND_URL');
    this.checkIsValidUrl('NEXT_PUBLIC_BACKEND_URL');
    this.checkIsValidUrl('BACKEND_INTERNAL_URL');
    this.checkNonEmpty('STORAGE_PROVIDER', 'Needed to setup storage.');
    this.checkStorageProvider();
    this.checkProductionSafety();
  }

  checkProductionSafety() {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    if (this.get('NOT_SECURED') === 'true') {
      this.issues.push(
        'NOT_SECURED=true must not be set in production (auth cookies become readable by JavaScript).'
      );
    }

    const jwt = this.get('JWT_SECRET') || '';
    if (
      jwt.length < 32 ||
      jwt.includes('change-in-production') ||
      jwt.includes('random string')
    ) {
      this.issues.push(
        'JWT_SECRET is a placeholder or too short. Set a long unique secret before production.'
      );
    }

    const frontend = this.get('FRONTEND_URL') || '';
    if (frontend.includes('localhost') || frontend.includes('127.0.0.1')) {
      this.issues.push(
        'FRONTEND_URL is localhost. OAuth redirects and invite links will be wrong in production.'
      );
    }

    if (!this.get('REDIS_URL')) {
      this.issues.push(
        'REDIS_URL is required in production. MockRedis will drop locks and rate limits on restart.'
      );
    }

    if (!this.get('EMAIL_FROM_ADDRESS') || (!this.get('RESEND_API_KEY') && !this.get('EMAIL_HOST'))) {
      this.issues.push(
        'Email is not configured. Team invites, password resets, and activation emails will not send.'
      );
    }
  }

  checkStorageProvider() {
    const storage = this.get('STORAGE_PROVIDER');
    if (storage !== 'supabase') {
      return;
    }

    if (!this.get('SUPABASE_URL') && !this.get('NEXT_PUBLIC_SUPABASE_URL')) {
      this.issues.push(
        'SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL is required when STORAGE_PROVIDER=supabase'
      );
    }

    if (
      !this.get('SUPABASE_SERVICE_ROLE_KEY') &&
      !this.get('SUPABASE_SECRET_KEY') &&
      !this.get('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY') &&
      !this.get('NEXT_PUBLIC_SUPABASE_ANON_KEY')
    ) {
      this.issues.push(
        'SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is required when STORAGE_PROVIDER=supabase'
      );
    }
  }

  checkNonEmpty(key: string, description?: string): boolean {
    const v = this.get(key);

    if (!description) {
      description = '';
    }

    if (!v) {
      this.issues.push(key + ' not set. ' + description);
      return false;
    }

    if (v.length === 0) {
      this.issues.push(key + ' is empty.' + description);
      return false;
    }

    return true;
  }

  get(key: string): string | undefined {
    return this.cfg[key as keyof typeof this.cfg];
  }

  checkDatabaseServers() {
    this.checkRedis();
    this.checkIsValidUrl('DATABASE_URL');
  }

  checkRedis() {
    if (!this.cfg.REDIS_URL) {
      this.issues.push('REDIS_URL not set');
      return;
    }

    try {
      const redisUrl = new URL(this.cfg.REDIS_URL);

      if (redisUrl.protocol !== 'redis:') {
        this.issues.push('REDIS_URL must start with redis://');
      }
    } catch (error) {
      this.issues.push('REDIS_URL is not a valid URL');
    }
  }

  checkIsValidUrl(key: string) {
    if (!this.checkNonEmpty(key)) {
      return;
    }

    const urlString = this.get(key);

    try {
      new URL(urlString);
    } catch (error) {
      this.issues.push(key + ' is not a valid URL');
    }

    if (urlString.endsWith('/')) {
      this.issues.push(key + ' should not end with /');
    }
  }

  hasIssues() {
    return this.issues.length > 0;
  }

  getIssues() {
    return this.issues;
  }

  getIssuesCount() {
    return this.issues.length;
  }
}
