'use client';

import clsx from 'clsx';
import { platformFamily } from '@gitroom/frontend/components/launches/helpers/mvp.platforms';

const OPTIONS = [
  { value: 'post', label: 'Post' },
  { value: 'reel', label: 'Reel' },
  { value: 'story', label: 'Story' },
] as const;

export type MetaPostFormat = (typeof OPTIONS)[number]['value'];

export const isMetaFormatPlatform = (identifier?: string) => {
  const family = platformFamily(identifier);
  return family === 'facebook' || family === 'instagram';
};

export const MetaFormatSwitch = ({
  identifier,
  value,
  onChange,
}: {
  identifier?: string;
  value: MetaPostFormat;
  onChange: (value: MetaPostFormat) => void;
}) => {
  if (!isMetaFormatPlatform(identifier)) {
    return null;
  }

  const family = platformFamily(identifier);

  return (
    <div className="mb-3 flex items-center gap-4">
      <img
        src={`/icons/platforms/${family}.png`}
        alt={family === 'facebook' ? 'Facebook' : 'Instagram'}
        className="h-8 w-8 shrink-0 rounded-[8px]"
      />
      <div className="flex flex-wrap items-center gap-4">
        {OPTIONS.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onChange(option.value);
              }}
              className="flex items-center gap-2 text-[16px] font-medium text-[#0f172a]"
            >
              <span
                className={clsx(
                  'flex h-[18px] w-[18px] items-center justify-center rounded-full border-2',
                  selected ? 'border-[#22c55e]' : 'border-[#cbd5e1]'
                )}
              >
                {selected ? (
                  <span className="h-[8px] w-[8px] rounded-full bg-[#22c55e]" />
                ) : null}
              </span>
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
