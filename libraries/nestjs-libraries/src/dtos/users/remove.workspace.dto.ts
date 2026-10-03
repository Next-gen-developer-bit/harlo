import { IsString, MinLength } from 'class-validator';

export class RemoveWorkspaceDto {
  @IsString()
  @MinLength(1)
  id: string;
}
