import {
  IsBoolean,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateWorkspaceDto {
  @ValidateIf((body) => !body.remove)
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  remove?: boolean;

  @IsOptional()
  @IsString()
  description?: string;
}
