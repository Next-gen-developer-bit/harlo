import { MediaLayoutComponent } from '@gitroom/frontend/components/new-layout/layout.media.component';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@gitroom/helpers/utils/is.general.server.side';

export const metadata: Metadata = {
  title: 'Content Library - Harlo Social',
  description: 'Store, organise and reuse your content across all your channels.',
};

export default async function Page() {
  return <MediaLayoutComponent />
}
