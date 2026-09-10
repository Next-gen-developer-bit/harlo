import { IsOptional, IsString, MinLength } from 'class-validator';

export class FeedbackDto {
  @IsString()
  @MinLength(1)
  message: string;

  @IsOptional()
  @IsString()
  category?: string;
}
