import { FC } from 'react';
import { clsx } from 'clsx';
import { hasExtension, resolveMediaUrl } from '@gitroom/helpers/utils/has.extension';
export const VideoOrImage: FC<{
  src: string;
  autoplay: boolean;
  isContain?: boolean;
  imageClassName?: string;
  videoClassName?: string;
}> = (props) => {
  const { src, autoplay, isContain, imageClassName, videoClassName } = props;
  const source = resolveMediaUrl(src);
  if (!source) {
    return null;
  }
  if (hasExtension(source, 'mp4')) {
    return (
      <video
        src={source}
        autoPlay={autoplay}
        className={clsx('w-full h-full', videoClassName)}
        muted={true}
        loop={true}
      />
    );
  }
  return (
    <img
      className={clsx(
        isContain ? 'object-contain' : 'object-cover',
        'w-full h-full',
        imageClassName
      )}
      src={source}
    />
  );
};
