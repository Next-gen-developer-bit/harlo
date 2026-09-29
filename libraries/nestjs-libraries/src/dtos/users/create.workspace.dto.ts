import { IsBoolean, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';

export class CreateWorkspaceDto {
  @ValidateIf((body) => !body.remove)
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsBoolean()
  remove?: boolean;

  @IsOptional()
  @IsString()
  description?: string;
}
