import { IsIn } from 'class-validator';

export class BillingSubscribeDto {
  @IsIn(['MONTHLY', 'YEARLY'])
  period: 'MONTHLY' | 'YEARLY';

  @IsIn(['CREATOR', 'PRO', 'AGENCY'])
  billing: 'CREATOR' | 'PRO' | 'AGENCY';

  utm: string;

  dub: string;

  datafast_session_id: string;
  datafast_visitor_id: string;
}
