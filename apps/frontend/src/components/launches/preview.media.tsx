'use client';

import { FC } from 'react';
import clsx from 'clsx';
import { VideoOrImage } from '@gitroom/react/helpers/video.or.image';
import { useMediaDirectory } from '@gitroom/react/helpers/use.media.directory';
import { SliderComponent } from '@gitroom/frontend/components/third-parties/slider.component';
import { platformFamily } from '@gitroom/frontend/components/launches/helpers/mvp.platforms';

// Feed frames match how each network crops a single image.
const ASPECT_CLASS: Record<string, string> = {
  instagram: 'aspect-[4/5]',
  facebook: 'aspect-[4/5]',
  linkedin: 'aspect-[4/5]',
  threads: 'aspect-[4/5]',
  x: 'aspect-video',
  tiktok: 'aspect-[9/16]',
  youtube: 'aspect-video',
  pinterest: 'aspect-[2/3]',
};

export const previewAspectClass = (identifier?: string) =>
  ASPECT_CLASS[platformFamily(identifier)] || 'aspect-[4/5]';

export const PreviewMedia: FC<{
  identifier?: string;
  images?: { path: string }[];
  className?: string;
  natural?: boolean;
}> = ({ identifier, images, className, natural }) => {
  const mediaDir = useMediaDirectory();
  if (!images?.length) {
    return null;
  }

  if (natural) {
    return (
      <div className={clsx('flex w-full flex-col', className)}>
        {images.map((image, index) => (
          <VideoOrImage
            key={`preview-media-${index}`}
            autoplay={true}
            isContain={true}
            src={mediaDir.set(image.path)}
            imageClassName="!h-auto !w-full !object-contain"
            videoClassName="!h-auto !w-full bg-black"
          />
        ))}
      </div>
    );
  }

  const aspect = previewAspectClass(identifier);
  const slides = images.map((image, index) => (
    <a
      key={`preview-media-${index}`}
      href={mediaDir.set(image.path)}
      target="_blank"
      className="absolute inset-0 block"
    >
      <VideoOrImage autoplay={true} src={mediaDir.set(image.path)} />
    </a>
  ));

  if (slides.length === 1) {
    return (
      <div className={clsx('relative w-full overflow-hidden', aspect, className)}>
        {slides[0]}
      </div>
    );
  }

  return (
    <SliderComponent
      className={clsx('w-full overflow-hidden', aspect, className)}
      list={slides}
    />
  );
};
