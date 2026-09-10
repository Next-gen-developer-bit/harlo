import { internalFetch } from '@gitroom/helpers/utils/internal.fetch';
import { sanitizePostContent } from '@gitroom/helpers/utils/sanitize.post.content';
export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import Link from 'next/link';
import { CommentsComponents } from '@gitroom/frontend/components/preview/comments.components';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { VideoOrImage } from '@gitroom/react/helpers/video.or.image';
import { CopyClient } from '@gitroom/frontend/components/preview/copy.client';
import { getT } from '@gitroom/react/translation/get.translation.service.backend';
import { RenderPreviewDateClient } from '@gitroom/frontend/components/preview/render.preview.date.client';
import { CreationMethodBadge } from '@gitroom/frontend/components/launches/creation.method.badge';
import { LogoTextComponent } from '@gitroom/frontend/components/ui/logo-text.component';

dayjs.extend(utc);
export const metadata: Metadata = {
  title: 'Harlo Social Preview',
  description: '',
};

export default async function PostPreviewPage(props: {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    share?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { id } = params;

  const post = await (await internalFetch(`/public/posts/${id}`)).json();
  const t = await getT();
  if (!post.length) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
          <p className="text-base font-semibold text-slate-900">
            {t('post_not_found', 'Post not found')}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            This preview link may have expired or been removed.
          </p>
        </div>
      </div>
    );
  }

  const integration = post[0].integration;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="shrink-0 text-slate-900">
            <div className="[&>svg]:h-9 [&>svg]:w-[180px]">
              <LogoTextComponent />
            </div>
          </Link>
          <div className="flex min-w-0 items-center gap-3 sm:gap-5">
            {!!searchParams?.share && <CopyClient />}
            <div className="hidden min-w-0 flex-col items-end sm:flex">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                {t('scheduled_for', 'Scheduled for')}
              </span>
              <span className="truncate text-sm font-medium text-slate-800">
                <RenderPreviewDateClient date={post[0].publishDate} />
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1100px] gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-4">
          {post.map((item: any, index: number) => {
            let images: any[] = [];
            try {
              images = JSON.parse(item?.image || '[]');
              if (!Array.isArray(images)) {
                images = [];
              }
            } catch {
              images = [];
            }
            return (
              <article
                key={String(item.id)}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                  <div className="relative shrink-0">
                    <img
                      className="h-11 w-11 rounded-full border border-slate-200 object-cover bg-slate-100"
                      alt={integration.name}
                      src={integration.picture}
                    />
                    <img
                      className="absolute -bottom-0.5 -end-0.5 h-5 w-5 rounded-full border-2 border-white bg-white object-cover"
                      alt={integration.providerIdentifier}
                      src={`/icons/platforms/${integration.providerIdentifier}.png`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="truncate text-sm font-semibold text-slate-900">
                        {integration.name}
                      </h2>
                      {index === 0 && (
                        <CreationMethodBadge
                          creationMethod={item.creationMethod}
                          size="sm"
                          className="!bg-slate-100 !text-slate-600 !font-semibold"
                        />
                      )}
                    </div>
                    {integration.profile && (
                      <p className="truncate text-sm text-slate-500">
                        @{integration.profile}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4 px-5 py-5">
                  {item.content ? (
                    <div
                      className="whitespace-pre-wrap text-[15px] leading-relaxed text-slate-800"
                      dangerouslySetInnerHTML={{
                        __html: sanitizePostContent(item.content),
                      }}
                    />
                  ) : null}
                  {images.length > 0 && (
                    <div
                      className={`grid gap-3 ${
                        images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'
                      }`}
                    >
                      {images.map((media: any, mediaIndex: number) => (
                        <div
                          key={String(
                            media.id || media.path || media.name || mediaIndex
                          )}
                          className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50"
                        >
                          <VideoOrImage
                            isContain={true}
                            src={media.path}
                            autoplay={true}
                            imageClassName="mx-auto max-h-[560px] w-auto object-contain"
                            videoClassName="mx-auto max-h-[560px] w-auto"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
          <p className="px-1 text-center text-xs text-slate-400 sm:hidden">
            {t('scheduled_for', 'Scheduled for')}{' '}
            <RenderPreviewDateClient date={post[0].publishDate} />
          </p>
        </div>

        <aside className="h-fit lg:sticky lg:top-24">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold tracking-tight text-slate-900">
              {t('comments', 'Comments')}
            </h2>
            <CommentsComponents postId={id} />
          </div>
        </aside>
      </main>
    </div>
  );
}
