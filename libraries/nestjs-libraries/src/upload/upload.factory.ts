import { CloudflareStorage } from './cloudflare.storage';
import { IUploadProvider } from './upload.interface';
import { LocalStorage } from './local.storage';
import { SupabaseStorage } from './supabase.storage';

export class UploadFactory {
  static createStorage(): IUploadProvider {
    const storageProvider = process.env.STORAGE_PROVIDER || 'local';

    switch (storageProvider) {
      case 'local':
        if (!process.env.UPLOAD_DIRECTORY) {
          throw new Error(
            'UPLOAD_DIRECTORY is required when STORAGE_PROVIDER=local'
          );
        }
        return new LocalStorage(process.env.UPLOAD_DIRECTORY);
      case 'cloudflare':
        return new CloudflareStorage(
          process.env.CLOUDFLARE_ACCOUNT_ID!,
          process.env.CLOUDFLARE_ACCESS_KEY!,
          process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
          process.env.CLOUDFLARE_REGION!,
          process.env.CLOUDFLARE_BUCKETNAME!,
          process.env.CLOUDFLARE_BUCKET_URL!
        );
      case 'supabase': {
        const supabaseUrl = (
          process.env.SUPABASE_URL ||
          process.env.NEXT_PUBLIC_SUPABASE_URL ||
          ''
        ).trim();
        const supabaseKey = (
          process.env.SUPABASE_SERVICE_ROLE_KEY ||
          process.env.SUPABASE_SECRET_KEY ||
          process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
          ''
        ).trim();

        if (!supabaseUrl || !supabaseKey) {
          throw new Error(
            'Supabase storage requires SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)'
          );
        }

        return new SupabaseStorage(
          supabaseUrl,
          supabaseKey,
          (process.env.SUPABASE_STORAGE_BUCKET || 'media').trim()
        );
      }
      default:
        throw new Error(`Invalid storage type ${storageProvider}`);
    }
  }
}
