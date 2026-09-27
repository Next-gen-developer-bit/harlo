'use client';

import React, { FC, useMemo } from 'react';
import { useLaunchStore } from '@gitroom/frontend/components/new-launch/store';
import { useShallow } from 'zustand/react/shallow';
import clsx from 'clsx';
import SafeImage from '@gitroom/react/helpers/safe.image';
import { capitalize } from 'lodash';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { hasLinks } from '@gitroom/helpers/utils/strip.links';

const Valid: FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M6 7.33333L8 9.33333L14.6667 2.66667M10.6667 2H5.2C4.0799 2 3.51984 2 3.09202 2.21799C2.71569 2.40973 2.40973 2.71569 2.21799 3.09202C2 3.51984 2 4.07989 2 5.2V10.8C2 11.9201 2 12.4802 2.21799 12.908C2.40973 13.2843 2.71569 13.5903 3.09202 13.782C3.51984 14 4.07989 14 5.2 14H10.8C11.9201 14 12.4802 14 12.908 13.782C13.2843 13.5903 13.5903 13.2843 13.782 12.908C14 12.4802 14 11.9201 14 10.8V8"
        stroke="#00EB75"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const Invalid: FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <g clipPath="url(#clip0_2482_97670)">
        <path
          d="M8.00049 6.00015V8.66682M8.00049 11.3335H8.00715M7.07737 2.59464L1.59411 12.0657C1.28997 12.591 1.1379 12.8537 1.16038 13.0693C1.17998 13.2573 1.2785 13.4282 1.4314 13.5394C1.60671 13.6668 1.91022 13.6668 2.51723 13.6668H13.4837C14.0908 13.6668 14.3943 13.6668 14.5696 13.5394C14.7225 13.4282 14.821 13.2573 14.8406 13.0693C14.8631 12.8537 14.711 12.591 14.4069 12.0657L8.92361 2.59463C8.62056 2.07119 8.46904 1.80947 8.27135 1.72157C8.09892 1.64489 7.90206 1.64489 7.72962 1.72157C7.53193 1.80947 7.38041 2.07119 7.07737 2.59464Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_2482_97670">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
export const InformationComponent: FC<{
  chars: Record<string, number>;
  totalChars: number;
  totalAllowedChars: number;
  isPicture: boolean;
  text?: string;
}> = ({ totalChars, totalAllowedChars, chars, isPicture, text }) => {
  const t = useT();
  const { isGlobal, selectedIntegrations, internal, currentIntegration } =
    useLaunchStore(
      useShallow((state) => ({
        isGlobal: state.current === 'global',
        selectedIntegrations: state.selectedIntegrations,
        internal: state.internal,
        currentIntegration: state.integrations.find(
          (p) => p.id === state.current
        ),
      }))
    );

  const stripLinkNames = useMemo(() => {
    if (!hasLinks(text)) {
      return [] as string[];
    }

    if (!isGlobal) {
      return currentIntegration?.stripLinks ? [currentIntegration.name] : [];
    }

    return selectedIntegrations
      .filter((p) => p.integration.stripLinks)
      .map((p) => p.integration.name);
  }, [text, isGlobal, currentIntegration, selectedIntegrations]);

  const showStripLinkWarning = stripLinkNames.length > 0;

  const isInternal = useMemo(() => {
    if (!isGlobal) {
      return [];
    }
    return selectedIntegrations.map((p) => {
      const findIt = internal.find(
        (a) => a.integration.id === p.integration.id
      );

      return !!findIt;
    });
  }, [isGlobal, internal, selectedIntegrations]);

  const isValid = useMemo(() => {
    if (showStripLinkWarning) {
      return false;
    }

    if (!isPicture && !totalChars) {
      return false;
    }

    if (totalChars > totalAllowedChars && !isGlobal) {
      return false;
    }

    if (totalChars <= totalAllowedChars && !isGlobal) {
      return true;
    }

    if (
      selectedIntegrations.some((p, index) => {
        if (isInternal[index]) {
          return false;
        }

        return totalChars > (chars?.[p.integration.id] || 0);
      })
    ) {
      return false;
    }

    return true;
  }, [
    totalAllowedChars,
    totalChars,
    isInternal,
    isPicture,
    chars,
    showStripLinkWarning,
  ]);

  const globalDisplayLimit = useMemo(() => {
    if (!isGlobal || !selectedIntegrations.length) {
      return null;
    }

    // Get all limits from non-internal integrations, sorted ascending
    const limits = selectedIntegrations
      .map((p, index) => ({
        limit: chars?.[p.integration.id] || 0,
        isInternal: isInternal[index],
      }))
      .filter((item) => !item.isInternal && item.limit > 0)
      .map((item) => item.limit)
      .sort((a, b) => a - b);

    if (!limits.length) {
      return null;
    }

    // Find the smallest limit that hasn't been exceeded yet
    // If all are exceeded, show the smallest one
    const validLimit = limits.find((limit) => totalChars <= limit);
    return validLimit ?? limits[0];
  }, [isGlobal, selectedIntegrations, chars, isInternal, totalChars]);

  const showInlineWarning =
    showStripLinkWarning || (totalChars > 0 && !isValid);

  return (
    <div className="flex w-full flex-col items-stretch gap-2">
      <div
        className={clsx(
          'flex h-8 items-center gap-1 self-end rounded-md border px-2 text-[12px] font-medium',
          showInlineWarning
            ? 'border-[#fecaca] bg-[#fff7f7] text-[#9f1239]'
            : 'border-[#e6e8ee] bg-white text-[#475569]'
        )}
      >
        {showInlineWarning ? <Invalid /> : <Valid />}
        {!isGlobal && (
          <span>
            {totalChars}/{totalAllowedChars}
          </span>
        )}
        {isGlobal && globalDisplayLimit !== null && (
          <span>
            {totalChars}/{globalDisplayLimit}
          </span>
        )}
      </div>
      {showInlineWarning && (
        <div className="w-full rounded-md border border-[#fecaca] bg-[#fff7f7] px-3 py-2 text-[12px] leading-5 text-[#9f1239]">
          {!isPicture && !totalChars && (
            <p>
              {t(
                'your_post_should_have_at_least_one_character_or_one_image',
                'Your post should have at least one character or one image.'
              )}
            </p>
          )}
          {isGlobal && (
            <div className="mt-1 flex flex-col gap-1.5">
              {selectedIntegrations.map((p, index) => (
                <div
                  key={p.integration.id}
                  className="flex items-center gap-2 text-[12px]"
                >
                  <SafeImage
                    src={`/icons/platforms/${p.integration.identifier}.png`}
                    alt={p.integration.name}
                    className="h-4 w-4 min-h-4 min-w-4 rounded-[3px]"
                    width={16}
                    height={16}
                  />
                  <span
                    className={clsx(
                      'min-w-0 flex-1 truncate',
                      !isInternal?.[index] &&
                        totalChars > (chars?.[p.integration.id] || 0) &&
                        'font-medium'
                    )}
                  >
                    {p.integration.name} (
                    {capitalize(p.integration.identifier.split('-')[0])})
                  </span>
                  <span className="shrink-0">
                    {isInternal?.[index]
                      ? t('internal_edit', 'Internal Edit')
                      : `${totalChars}/${chars?.[p.integration.id] || 0}`}
                  </span>
                </div>
              ))}
            </div>
          )}
          {showStripLinkWarning && (
            <p className={clsx(isGlobal && 'mt-2')}>
              {t('links_will_be_removed_from', 'Links will be removed from')}:{' '}
              {stripLinkNames.join(', ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
