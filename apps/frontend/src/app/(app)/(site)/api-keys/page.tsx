export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@gitroom/helpers/utils/is.general.server.side';
import { PublicComponent } from '@gitroom/frontend/components/public-api/public.component';

export const metadata: Metadata = {
  title: 'API Keys - Harlo Social',
  description: 'Manage API keys and webhook integrations.',
};

export default function ApiKeysPage() {
  return <PublicComponent />;
}
