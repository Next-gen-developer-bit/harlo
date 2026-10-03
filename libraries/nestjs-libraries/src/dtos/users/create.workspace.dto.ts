import {
  IsBoolean,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateWorkspaceDto {
  // Keep name optional whenever this request is a delete. Otherwise Nest validates
  // name before the controller runs and delete fails with MinLength.
  @ValidateIf((body) => body?.remove !== true && body?.remove !== 'true')
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true' || value === 1)
  @IsBoolean()
  remove?: boolean;

  @IsOptional()
  @IsString()
  description?: string;
}
