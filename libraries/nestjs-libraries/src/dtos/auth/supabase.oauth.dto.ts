import { IsDefined, IsString } from 'class-validator';

export class SupabaseOauthDto {
  @IsString()
  @IsDefined()
  accessToken: string;
}
