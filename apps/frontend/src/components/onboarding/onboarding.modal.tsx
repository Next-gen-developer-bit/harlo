'use client';

import React, { FC, useCallback, useMemo, useState } from 'react';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import useSWR from 'swr';
import { orderBy } from 'lodash';
import clsx from 'clsx';
import SafeImage from '@gitroom/react/helpers/safe.image';
import { AddProviderComponent } from '@gitroom/frontend/components/launches/add.provider.component';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { useModals } from '@gitroom/frontend/components/layout/new-modal';

interface OnboardingModalProps {
  onClose: (next?: string) => void;
}

export const OnboardingModal: FC<OnboardingModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const modals = useModals();
  const t = useT();

  return (
    <div className="w-full min-h-full flex-1 p-[40px] flex relative">
      <style>
        {`#support-discord {display: none}`}
      </style>
      <div className="flex flex-1 bg-newBgColorInner rounded-[20px] flex-col relative">
        <button
          className="outline-none absolute end-[20px] top-[20px] mantine-UnstyledButton-root mantine-ActionIcon-root hover:bg-tableBorder cursor-pointer mantine-Modal-close mantine-1dcetaa"
          type="button"
          onClick={modals.closeAll}
        >
          <svg
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
          >
            <path
              d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
        <div className="flex-1 flex p-[40px]">
          <div className="flex flex-col gap-[24px] flex-1">
            {/* Step indicators */}
            <div className="flex items-center justify-center gap-[16px]">
              <div className="flex items-center gap-[8px]">
                <div
                  className={clsx(
                    'w-[32px] h-[32px] rounded-full flex items-center justify-center text-[14px] font-semibold transition-colors',
                    step === 1
                      ? 'bg-boxFocused text-textItemFocused'
                      : 'bg-newTableHeader'
                  )}
                >
                  1
                </div>
                <span
                  className={clsx(
                    'text-[14px]',
                    step === 1 ? 'font-medium' : 'text-textColor'
                  )}
                >
                  {t('connect_channels', 'Connect Channels')}
                </span>
              </div>
              <div className="w-[40px] h-[2px] bg-boxFocused" />
              <div className="flex items-center gap-[8px]">
                <div
                  className={clsx(
                    'w-[32px] h-[32px] rounded-full flex items-center justify-center text-[14px] font-semibold transition-colors',
                    step === 2
                      ? 'bg-boxFocused text-textItemFocused'
                      : 'bg-newTableHeader'
                  )}
                >
                  2
                </div>
                <span
                  className={clsx(
                    'text-[14px]',
                    step === 2 ? 'font-medium' : 'text-textColor'
                  )}
                >
                  {t('create_first_post', 'Create a post')}
                </span>
              </div>
            </div>

            {/* Step content */}
            {step === 1 && (
              <OnboardingStep1
                onNext={() => setStep(2)}
                onSkip={() => setStep(2)}
              />
            )}
            {step === 2 && (
              <OnboardingStep2
                onBack={() => setStep(1)}
                onFinish={onClose}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const OnboardingStep1: FC<{ onNext: () => void; onSkip: () => void }> = ({
  onNext,
  onSkip,
}) => {
  const fetch = useFetch();
  const t = useT();

  const getIntegrations = useCallback(async () => {
    return (await fetch('/integrations')).json();
  }, []);

  const load = useCallback(async (path: string) => {
    const list = (await (await fetch(path)).json()).integrations;
    return list;
  }, []);

  const { data: integrations } = useSWR('/integrations/list', load, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    revalidateOnMount: true,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    fallbackData: [],
  });

  const sortedIntegrations = useMemo(() => {
    return orderBy(
      integrations,
      ['type', 'disabled', 'identifier'],
      ['desc', 'asc', 'asc']
    );
  }, [integrations]);

  const { data } = useSWR('get-all-integrations-onboarding', getIntegrations);

  return (
    <div className="flex flex-col gap-[24px]">
      <div className="flex gap-[4px] flex-col text-center">
        <div className="text-[24px] font-semibold">
          {t('connect_your_channels', 'Connect Your Channels')}
        </div>
        <div className="text-[14px] text-customColor18">
          {t(
            'connect_social_media_to_start',
            'Connect your social media accounts to start scheduling posts'
          )}
        </div>
      </div>

      {/* Connected channels */}
      {sortedIntegrations.length > 0 && (
        <div className="bg-newTableHeader rounded-[8px] p-[16px]">
          <div className="text-[14px] font-medium mb-[12px]">
            {t('connected_channels', 'Connected Channels')} (
            {sortedIntegrations.length})
          </div>
          <div className="flex flex-wrap gap-[12px]">
            {sortedIntegrations.map((integration: any) => (
              <div
                key={integration.id}
                className="flex items-center gap-[8px] bg-customColor47/30 rounded-[8px] px-[12px] py-[8px]"
              >
                <div className="relative w-[28px] h-[28px]">
                  <SafeImage
                    src={integration.picture}
                    className="rounded-full"
                    alt={integration.identifier}
                    width={28}
                    height={28}
                  />
                  <SafeImage
                    src={`/icons/platforms/${integration.identifier}.png`}
                    className="rounded-full absolute -bottom-[3px] -end-[3px] border border-fifth"
                    alt={integration.identifier}
                    width={14}
                    height={14}
                  />
                </div>
                <span className="text-[13px]">{integration.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available platforms - using AddProviderComponent */}
      <div className="flex flex-col gap-[12px]">
        <div className="text-[14px] font-medium">
          {t('click_channel_to_add', 'Click a channel to add it')}
        </div>
        {data && (
          <AddProviderComponent
            invite={false}
            social={data.social || []}
            article={data.article || []}
            onboarding={true}
          />
        )}
      </div>

      {/* Action buttons */}
      <div className="flex justify-end pt-[24px] mt-[8px]">
        <button
          onClick={onNext}
          className="group flex items-center gap-[12px] bg-gradient-to-r from-[#622aff] to-[#8b5cf6] hover:from-[#7c3aff] hover:to-[#9d6eff] text-white font-semibold px-[32px] py-[14px] rounded-[12px] text-[16px] transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
        >
          {sortedIntegrations.length > 0
            ? t('continue', 'Continue')
            : t('continue_without_channels', 'Continue without channels')}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:translate-x-1 transition-transform"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const OnboardingStep2: FC<{
  onBack: () => void;
  onFinish: (next?: string) => void;
}> = ({ onBack, onFinish }) => {
  const t = useT();

  return (
    <div className="flex flex-col gap-[24px] flex-1 justify-center">
      <div className="flex gap-[4px] flex-col text-center">
        <div className="text-[24px] font-semibold">
          {t('create_your_first_post', 'Create your first post')}
        </div>
        <div className="text-[14px] text-customColor18 max-w-[520px] mx-auto">
          {t(
            'create_first_post_description',
            'Write a caption, pick accounts, then publish now or schedule. You can save a draft later if you need to.'
          )}
        </div>
      </div>

      <div className="bg-newTableHeader rounded-[12px] p-[20px] max-w-[560px] mx-auto w-full text-[14px] leading-relaxed">
        <div className="font-medium mb-[8px]">
          {t('first_post_flow', 'The usual flow')}
        </div>
        <div className="text-textColor/80">
          {t(
            'first_post_steps',
            'Select accounts → write content → preview → Publish now, Schedule, or Save as draft.'
          )}
        </div>
      </div>

      <div className="flex justify-between pt-[24px] mt-[8px] max-w-[560px] mx-auto w-full">
        <button
          onClick={onBack}
          className="group flex items-center gap-[8px] bg-transparent border-2 border-boxFocused font-medium px-[24px] py-[12px] rounded-[12px] text-[15px] transition-all"
        >
          {t('back', 'Back')}
        </button>
        <div className="flex gap-[12px]">
          <button
            onClick={() => onFinish('/overview')}
            className="px-[20px] py-[12px] rounded-[12px] text-[15px] font-medium border border-newBorder"
          >
            {t('skip_for_now', 'Skip for now')}
          </button>
          <button
            onClick={() => onFinish('/overview?create=1')}
            className="group flex items-center gap-[12px] bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] text-white font-semibold px-[32px] py-[14px] rounded-[12px] text-[16px] transition-all shadow-lg shadow-emerald-500/25"
          >
            {t('create_first_post_cta', 'Create first post')}
          </button>
        </div>
      </div>
    </div>
  );
};
