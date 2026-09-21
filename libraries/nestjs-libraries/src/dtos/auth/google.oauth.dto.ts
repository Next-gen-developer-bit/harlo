import { IsDefined, IsOptional, IsString, IsUrl } from 'class-validator';

export class GoogleOauthDto {
  @IsString()
  @IsDefined()
  code: string;

  @IsUrl({ require_tld: false })
  @IsDefined()
  redirect_uri: string;

  @IsString()
  @IsDefined()
  state: string;

  @IsString()
  @IsOptional()
  org?: string;
}
