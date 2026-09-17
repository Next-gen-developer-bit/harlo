import { Metadata } from 'next';
import { ApiIntegrationsComponent } from '@gitroom/frontend/components/third-parties/api-integrations.component';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Integrations - Harlo Social',
  description: 'Manage API-key integrations for your Harlo workspace.',
};

export default function IntegrationsPage() {
  return <ApiIntegrationsComponent />;
}
