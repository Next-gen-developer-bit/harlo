import { createClient, SupabaseClient } from '@supabase/supabase-js';
import 'multer';
import { makeId } from '@gitroom/nestjs-libraries/services/make.is';
import { IUploadProvider } from './upload.interface';
import { isSafePublicHttpsUrl } from '@gitroom/nestjs-libraries/dtos/webhooks/webhook.url.validator';
import { ssrfSafeDispatcher } from '@gitroom/nestjs-libraries/dtos/webhooks/ssrf.safe.dispatcher';
import { parseDataUrl } from '@gitroom/nestjs-libraries/upload/data.url';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { fromBuffer } = require('file-type');

const ALLOWED_MIME_TYPES = new Set<string>([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/avif',
  'image/bmp',
  'image/tiff',
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'audio/mpeg',
  'audio/mp4',
  'audio/wav',
  'audio/ogg',
]);

export class SupabaseStorage implements IUploadProvider {
  private _client: SupabaseClient;
  private _bucket: string;
  private _ensured?: Promise<void>;

  constructor(
    supabaseUrl: string,
    supabaseKey: string,
    bucket = 'media'
  ) {
    this._bucket = bucket;
    this._client = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  private objectKey(extension: string) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}/${makeId(32)}.${extension}`;
  }

  private publicUrl(key: string) {
    return this._client.storage.from(this._bucket).getPublicUrl(key).data
      .publicUrl;
  }

  private async ensureBucket() {
    if (!this._ensured) {
      this._ensured = (async () => {
        const { data } = await this._client.storage.getBucket(this._bucket);
        if (data) {
          if (!data.public) {
            const { error } = await this._client.storage.updateBucket(
              this._bucket,
              { public: true }
            );
            if (error) {
              throw new Error(
                `Supabase storage bucket "${this._bucket}" is private and could not be made public: ${error.message}`
              );
            }
          }
          return;
        }

        const { error } = await this._client.storage.createBucket(this._bucket, {
          public: true,
        });

        if (
          error &&
          !/already exists|duplicate|resource already/i.test(error.message)
        ) {
          throw new Error(
            `Supabase storage bucket "${this._bucket}" is missing and could not be created: ${error.message}. Create a public bucket named "${this._bucket}" in the Supabase dashboard, or set SUPABASE_SERVICE_ROLE_KEY.`
          );
        }
      })();
    }

    await this._ensured;
  }

  private toBytes(body: Buffer) {
    return new Uint8Array(body.buffer, body.byteOffset, body.byteLength);
  }

  private async putObject(key: string, body: Buffer, contentType: string) {
    await this.ensureBucket();

    const { error } = await this._client.storage
      .from(this._bucket)
      .upload(key, this.toBytes(body), {
        contentType,
        upsert: false,
        cacheControl: '3600',
      });

    if (error) {
      throw new Error(
        `Supabase upload failed: ${error.message}. Create a public "${this._bucket}" bucket in Supabase Storage and allow uploads, or set SUPABASE_SERVICE_ROLE_KEY in .env.`
      );
    }

    return this.publicUrl(key);
  }

  async uploadSimple(path: string) {
    const dataUrl = path.startsWith('data:') ? parseDataUrl(path) : null;

    let body: Buffer;
    if (dataUrl) {
      body = dataUrl.buffer;
    } else {
      if (!(await isSafePublicHttpsUrl(path))) {
        throw new Error('Unsafe URL');
      }
      const loadImage = await fetch(path, {
        // @ts-ignore — undici option, not in lib.dom fetch types
        dispatcher: ssrfSafeDispatcher,
      });
      body = Buffer.from(await loadImage.arrayBuffer());
    }

    const detected = await fromBuffer(body);
    if (!detected || !ALLOWED_MIME_TYPES.has(detected.mime)) {
      throw new Error('Unsupported file type.');
    }

    const key = this.objectKey(detected.ext);
    return this.putObject(key, body, detected.mime);
  }

  async uploadFile(file: Express.Multer.File): Promise<any> {
    try {
      const detected = await fromBuffer(file.buffer);
      if (!detected || !ALLOWED_MIME_TYPES.has(detected.mime)) {
        throw new Error('Unsupported file type.');
      }

      const key = this.objectKey(detected.ext);
      const path = await this.putObject(key, file.buffer, detected.mime);
      const filename = key.split('/').pop();

      return {
        filename,
        mimetype: detected.mime,
        size: file.size,
        buffer: file.buffer,
        originalname: filename,
        fieldname: 'file',
        path,
        destination: path,
        encoding: '7bit',
        stream: file.buffer as any,
      };
    } catch (err) {
      console.error('Error uploading file to Supabase Storage:', err);
      throw err;
    }
  }

  async removeFile(filePath: string): Promise<void> {
    const marker = `/object/public/${this._bucket}/`;
    const index = filePath.indexOf(marker);
    if (index === -1) {
      return;
    }

    const key = decodeURIComponent(filePath.slice(index + marker.length));
    if (!key) {
      return;
    }

    await this._client.storage.from(this._bucket).remove([key]);
  }
}
