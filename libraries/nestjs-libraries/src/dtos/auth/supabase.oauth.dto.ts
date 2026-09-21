import { IsBoolean, IsDefined, IsOptional, IsString } from 'class-validator';

export class SupabaseOauthDto {
  @IsString()
  @IsDefined()
  accessToken: string;

  @IsBoolean()
  @IsOptional()
  register?: boolean;
}
