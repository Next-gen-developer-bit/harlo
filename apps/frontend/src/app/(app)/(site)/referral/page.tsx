import { ReferralComponent } from '@gitroom/frontend/components/referral/referral.component';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Referral - Harlo Social',
  description: 'Invite creators to Harlo Social and earn referral rewards.',
};

export default function ReferralPage() {
  return <ReferralComponent />;
}
