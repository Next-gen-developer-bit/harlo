import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class AnalyticsSnapshotDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  impressions?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  likes?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  comments?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  shares?: number;
}
