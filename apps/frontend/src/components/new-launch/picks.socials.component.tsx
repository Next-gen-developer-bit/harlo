'use client';

import { FC } from 'react';
import clsx from 'clsx';
import SafeImage from '@gitroom/react/helpers/safe.image';
import { useLaunchStore } from '@gitroom/frontend/components/new-launch/store';
import { useShallow } from 'zustand/react/shallow';
import { useExistingData } from '@gitroom/frontend/components/launches/helpers/use.existing.data';
import { makeId } from '@gitroom/nestjs-libraries/services/make.is';
import ImageWithFallback from '@gitroom/react/helpers/image.with.fallback';

export const PicksSocialsComponent: FC<{ toolTip?: boolean }> = ({
  toolTip,
}) => {
  const exising = useExistingData();

  const {
    locked,
    addOrRemoveSelectedIntegration,
    integrations,
    selectedIntegrations,
  } = useLaunchStore(
    useShallow((state) => ({
      integrations: state.integrations,
      selectedIntegrations: state.selectedIntegrations,
      addOrRemoveSelectedIntegration: state.addOrRemoveSelectedIntegration,
      locked: state.locked,
    }))
  );

  return (
    <div className={clsx('flex', locked && 'opacity-50 pointer-events-none')}>
      <div className="flex flex-1">
        <div className="innerComponent flex-1 flex">
          <div className="flex flex-1 flex-wrap gap-2">
            {integrations
              .filter((f) => {
                if (exising.integration) {
                  return f.id === exising.integration;
                }
                return !f.inBetweenSteps && !f.disabled;
              })
              .map((integration) => (
                <div
                  key={integration.id}
                  className="flex gap-[8px] items-center"
                  {...(toolTip && {
                    'data-tooltip-id': 'tooltip',
                    'data-tooltip-content': integration.name,
                  })}
                >
                  <div
                    onClick={() => {
                      if (exising.integration) {
                        return;
                      }
                      addOrRemoveSelectedIntegration(integration, {});
                    }}
                    className={clsx(
                      'relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white transition-all',
                      selectedIntegrations.findIndex(
                        (p) => p.integration.id === integration.id
                      ) === -1
                        ? 'opacity-60 ring-1 ring-[#e6e8ee]'
                        : 'opacity-100 ring-2 ring-[#612BD3]'
                    )}
                  >
                    <ImageWithFallback
                      fallbackSrc="/no-picture.jpg"
                      src={integration.picture || '/no-picture.jpg'}
                      className="h-8 w-8 min-h-8 min-w-8 rounded-full object-cover"
                      alt={integration.identifier}
                      width={32}
                      height={32}
                    />
                    {integration.identifier === 'youtube' ? (
                      <img
                        src="/icons/platforms/youtube.svg"
                        className="absolute -bottom-0.5 -end-0.5 z-10 h-3.5 w-3.5 rounded-[3px] bg-white"
                        width={14}
                      />
                    ) : (
                      <SafeImage
                        src={`/icons/platforms/${integration.identifier}.png`}
                        className="absolute -bottom-0.5 -end-0.5 z-10 h-3.5 w-3.5 min-h-[14px] min-w-[14px] rounded-[3px] bg-white"
                        alt={integration.identifier}
                        width={14}
                        height={14}
                      />
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
