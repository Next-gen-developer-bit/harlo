import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsIn,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class AddTeamMemberDto {
  @IsDefined()
  @IsEmail()
  @ValidateIf((o) => o.sendEmail)
  email: string;

  @IsString()
  @IsIn(['USER', 'ADMIN'])
  role: string;

  @IsDefined()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  sendEmail: boolean;
}
