import {
  IsDefined, IsOptional, IsString, IsUrl, MaxLength, MinLength, ValidateIf, ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { JSONSchema } from 'class-validator-jsonschema';
import { MediaDto } from '@gitroom/nestjs-libraries/dtos/media/media.dto';

export class PinterestSettingsDto {
  @IsString()
  @ValidateIf((o) => !!o.title)
  @MaxLength(100)
  title: string;

  @IsString()
  @ValidateIf((o) => !!o.link)
  @IsUrl()
  link: string;

  @IsString()
  @ValidateIf((o) => !!o.dominant_color)
  dominant_color: string;

  @IsDefined({
    message: 'Board is required',
  })
  @IsString({
    message: 'Board is required',
  })
  @MinLength(1, {
    message: 'Board is required',
  })
    @JSONSchema({
    description: 'board must be an id',
  })
  board: string;

  @IsOptional()
  @ValidateIf((o) => !!o.cover?.path)
  @ValidateNested()
  @Type(() => MediaDto)
  @JSONSchema({
    description: 'cover image for video pins',
  })
  cover?: MediaDto;
}
