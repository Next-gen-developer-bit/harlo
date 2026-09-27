'use client';

import { FC, RefObject, useCallback, useEffect, useRef, useState } from 'react';
import {
  SelectedIntegrations,
  useLaunchStore,
} from '@gitroom/frontend/components/new-launch/store';
import clsx from 'clsx';
import SafeImage from '@gitroom/react/helpers/safe.image';
import { useShallow } from 'zustand/react/shallow';
import { GlobalIcon } from '@gitroom/frontend/components/ui/icons';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { Integrations } from '@gitroom/frontend/components/launches/calendar.context';
import {
  useDecisionModal,
  useModals,
} from '@gitroom/frontend/components/layout/new-modal';

export function useHasScroll(ref: RefObject<HTMLElement | null>): boolean {
  const [hasHorizontalScroll, setHasHorizontalScroll] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const checkScroll = () => {
      const el = ref.current;
      if (el) {
        setHasHorizontalScroll(el.scrollWidth > el.clientWidth);
      }
    };

    checkScroll(); // initial check

    const resizeObserver = new ResizeObserver(checkScroll);
    resizeObserver.observe(ref.current);

    const mutationObserver = new MutationObserver(checkScroll);
    mutationObserver.observe(ref.current, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [ref]);

  return hasHorizontalScroll;
}

export const SelectCurrent: FC = () => {
  const modals = useDecisionModal();
  const {
    selectedIntegrations,
    current,
    setCurrent,
    locked,
    setHide,
    addOrRemoveSelectedIntegration,
  } = useLaunchStore(
    useShallow((state) => ({
      selectedIntegrations: state.selectedIntegrations,
      addOrRemoveSelectedIntegration: state.addOrRemoveSelectedIntegration,
      current: state.current,
      setCurrent: state.setCurrent,
      locked: state.locked,
      setHide: state.setHide,
    }))
  );

  const contentRef = useRef<HTMLDivElement>(null);
  const hasScroll = useHasScroll(contentRef);

  const removeSocial = useCallback(
    (sIntegration: Integrations) => async (e: any) => {
      e.stopPropagation();
      e.preventDefault();
      const open = await modals.open({
        title: 'Remove Social Account',
        description:
          'Are you sure you want to remove this social from scheduling?',
      });

      if (!open) {
        return;
      }

      addOrRemoveSelectedIntegration(sIntegration, {});
    },
    []
  );

  return (
    <>
      <div className="absolute left-0 z-[100] w-full select-none px-4">
        <div
          ref={contentRef}
          className={clsx(
            'flex w-full gap-2 overflow-x-auto pb-1',
            locked && 'pointer-events-none opacity-50'
          )}
        >
          <div
            onClick={() => {
              setHide(true);
              setCurrent('global');
            }}
            className={clsx(
              'flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white text-[#64748b]',
              current !== 'global'
                ? 'ring-1 ring-[#e6e8ee]'
                : 'text-[#612BD3] ring-2 ring-[#612BD3]'
            )}
          >
            <GlobalIcon />
          </div>
          {selectedIntegrations.map(({ integration }) => (
            <div
              onClick={() => {
                setHide(true);
                setCurrent(integration.id);
              }}
              key={integration.id}
              className={clsx(
                'group relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white',
                current === integration.id
                  ? 'ring-2 ring-[#612BD3]'
                  : 'ring-1 ring-[#e6e8ee]'
              )}
            >
              <button
                type="button"
                aria-label="Remove account"
                onClick={removeSocial(integration)}
                className="absolute -end-1 -top-1 z-20 hidden h-4 w-4 items-center justify-center rounded-full border border-[#e6e8ee] bg-white text-[10px] leading-none text-[#64748b] group-hover:flex"
              >
                ×
              </button>
              <IsGlobal id={integration.id} />
              <div
                {...{
                  'data-tooltip-id': 'tooltip',
                  'data-tooltip-content': integration.name,
                }}
                className="relative flex h-full w-full items-center justify-center rounded-full"
              >
                <SafeImage
                  src={integration.picture || '/no-picture.jpg'}
                  className="h-8 w-8 min-w-8 rounded-full object-cover"
                  alt={integration.identifier}
                  width={32}
                  height={32}
                  onError={(e) => {
                    e.currentTarget.src = '/no-picture.jpg';
                    e.currentTarget.srcset = '/no-picture.jpg';
                  }}
                />
                {integration.identifier === 'youtube' ? (
                  <img
                    src="/icons/platforms/youtube.svg"
                    className="absolute bottom-0 end-0 z-10 h-3 w-3 rounded-[2px] bg-white"
                    width={12}
                  />
                ) : (
                  <SafeImage
                    src={`/icons/platforms/${integration.identifier}.png`}
                    className="absolute bottom-0 end-0 z-10 h-3 w-3 min-h-3 min-w-3 rounded-[2px] bg-white"
                    alt={integration.identifier}
                    width={12}
                    height={12}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={clsx(hasScroll ? 'h-11' : 'h-8')} />
    </>
  );
};

export const IsGlobal: FC<{ id: string }> = ({ id }) => {
  const t = useT();
  const { isInternal } = useLaunchStore(
    useShallow((state) => ({
      isInternal: !!state.internal.find((p) => p.integration.id === id),
    }))
  );

  if (!isInternal) {
    return null;
  }

  return (
    <div
      data-tooltip-id="tooltip"
      data-tooltip-content={t(
        'no_longer_global_mode',
        'No longer in global mode'
      )}
      className="absolute -end-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#612BD3]"
    />
  );
};
