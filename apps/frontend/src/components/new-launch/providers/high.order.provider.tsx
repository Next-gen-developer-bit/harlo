'use client';

import React, {
  FC,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
} from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { IsOptional } from 'class-validator';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useLaunchStore } from '@gitroom/frontend/components/new-launch/store';
import { useShallow } from 'zustand/react/shallow';
import { GeneralPreviewComponent } from '@gitroom/frontend/components/launches/general.preview.component';
import { IntegrationContext } from '@gitroom/frontend/components/launches/helpers/use.integration';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import useSWR from 'swr';
import { InternalChannels } from '@gitroom/frontend/components/launches/internal.channels';
import {
  PLATFORM_LABELS,
  platformFamily,
} from '@gitroom/frontend/components/launches/helpers/mvp.platforms';
import { platformIconSrc } from '@gitroom/frontend/components/harlo-pages/ui';

class Empty {
  @IsOptional()
  empty: string;
}

const plainCaption = (value?: string) =>
  (value || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const captionToHtml = (value: string) => {
  const lines = value.split('\n');
  return lines
    .map((line) => {
      const safe = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return `<p>${safe}</p>`;
    })
    .join('');
};

export { PostComment } from '@gitroom/frontend/components/new-launch/providers/post-comment.enum';
import { PostComment } from '@gitroom/frontend/components/new-launch/providers/post-comment.enum';

interface CharacterCondition {
  format: 'no-pictures' | 'with-pictures';
  type: 'post' | 'comment';
  maximumCharacters: number;
}

export const withProvider = function <T extends object>(params: {
  comments?: boolean | 'no-media';
  postComment: PostComment;
  minimumCharacters: CharacterCondition[];
  SettingsComponent: FC<{
    values?: any;
  }> | null;
  CustomPreviewComponent?: FC<{
    maximumCharacters?: number;
  }>;
  dto?: any;
  maximumCharacters?: number | ((settings: any) => number);
}) {
  const {
    postComment,
    SettingsComponent,
    CustomPreviewComponent,
    dto,
    maximumCharacters,
  } = params;

  const Wrapped = forwardRef((props: { id: string }, ref) => {
    const t = useT();
    const fetch = useFetch();
    const {
      current,
      selectedIntegration,
      selectedCount,
      setCurrent,
      internal,
      global,
      addRemoveInternal,
      setInternalValueText,
      date,
      isGlobal,
      setTotalChars,
      justCurrent,
      allIntegrations,
      setPostComment,
      setEditor,
      dummy,
      setChars,
      setComments,
      setHide,
    } = useLaunchStore(
      useShallow((state) => ({
        date: state.date,
        global: state.global,
        dummy: state.dummy,
        selectedCount: state.selectedIntegrations.length,
        addRemoveInternal: state.addRemoveInternal,
        setInternalValueText: state.setInternalValueText,
        internal: state.internal.find((p) => p.integration.id === props.id),
        integrations: state.selectedIntegrations,
        setHide: state.setHide,
        allIntegrations: state.integrations,
        justCurrent: state.current,
        current: state.current === props.id,
        isGlobal: state.current === 'global',
        setCurrent: state.setCurrent,
        setComments: state.setComments,
        setTotalChars: state.setTotalChars,
        setPostComment: state.setPostComment,
        setEditor: state.setEditor,
        setChars: state.setChars,
        selectedIntegration: state.selectedIntegrations.find(
          (p) => p.integration.id === props.id
        ),
      }))
    );

    useEffect(() => {
      if (!setTotalChars) {
        return;
      }

      setChars(
        props.id,
        typeof maximumCharacters === 'number'
          ? maximumCharacters
          : maximumCharacters(
              JSON.parse(
                selectedIntegration.integration.additionalSettings || '[]'
              )
            )
      );

      if (isGlobal) {
        setComments(true);
        setPostComment(PostComment.ALL);
        setTotalChars(0);
        setEditor('normal');
      }

      if (current) {
        setComments(
          typeof params.comments === 'undefined' ? true : params.comments
        );
        setEditor(selectedIntegration?.integration.editor);
        setPostComment(postComment);
        setTotalChars(
          typeof maximumCharacters === 'number'
            ? maximumCharacters
            : maximumCharacters(
                JSON.parse(
                  selectedIntegration.integration.additionalSettings || '[]'
                )
              )
        );
      }
    }, [justCurrent, current, isGlobal, setTotalChars]);

    const getInternalPlugs = useCallback(async () => {
      return (
        await fetch(
          `/integrations/${selectedIntegration.integration.identifier}/internal-plugs`
        )
      ).json();
    }, [selectedIntegration.integration.identifier]);
    const { data } = useSWR(
      `internal-${selectedIntegration.integration.identifier}`,
      getInternalPlugs,
      {
        revalidateOnReconnect: true,
      }
    );

    const hasMeaningfulContent = (values?: any[]) =>
      (values || []).some(
        (v: any) =>
          (v.content || '').replace(/<[^>]*>/g, '').trim() ||
          (v.media || []).length
      );

    const value = useMemo(() => {
      if (
        internal?.integrationValue?.length &&
        hasMeaningfulContent(internal.integrationValue)
      ) {
        return internal.integrationValue;
      }

      return global;
    }, [internal, global, isGlobal]);

    const form = useForm({
      resolver: classValidatorResolver(dto || Empty),
      ...(Object.keys(selectedIntegration.settings).length > 0
        ? { values: { ...selectedIntegration.settings } }
        : {}),
      mode: 'all',
      criteriaMode: 'all',
      reValidateMode: 'onChange',
    });

    useImperativeHandle(
      ref,
      () => ({
        isValid: async () => {
          const settings = form.getValues();
          return {
            id: props.id,
            identifier: selectedIntegration.integration.identifier,
            integration: selectedIntegration.integration,
            valid: await form.trigger(),
            err: form.formState.errors,
            settings,
            values: value,
            maximumCharacters:
              typeof maximumCharacters === 'number'
                ? maximumCharacters
                : maximumCharacters(
                    JSON.parse(
                      selectedIntegration.integration.additionalSettings || '[]'
                    )
                  ),
            fix: () => {
              setCurrent(props.id);
              setHide(true);
              document
                .getElementById(`platform-section-${props.id}`)
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            },
            preview: () => {
              setCurrent(props.id);
              setHide(true);
              document
                .getElementById(`platform-section-${props.id}`)
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            },
          };
        },
        getValues: () => {
          return {
            id: props.id,
            identifier: selectedIntegration.integration.identifier,
            values: value,
            settings: form.getValues(),
          };
        },
        trigger: () => {
          return form.trigger();
        },
      }),
      [value]
    );

    const characterLimit =
      typeof maximumCharacters === 'number'
        ? maximumCharacters
        : maximumCharacters(
            JSON.parse(
              selectedIntegration.integration.additionalSettings || '[]'
            )
          );
    const hasContent = hasMeaningfulContent(value);
    const caption = plainCaption(value?.[0]?.content);
    const changeCaption = (text: string) => {
      if (plainCaption(text) === plainCaption(global?.[0]?.content)) {
        if (internal) {
          addRemoveInternal(props.id);
        }
        return;
      }
      if (!internal) {
        addRemoveInternal(props.id);
      }
      setInternalValueText(props.id, 0, captionToHtml(text));
    };
    const family = platformFamily(selectedIntegration.integration.identifier);
    const platformLabel =
      PLATFORM_LABELS[family] ||
      family
        .split('-')
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
    const showSettings =
      !!SettingsComponent || (!!data?.internalPlugs?.length && !dummy);

    return (
      <IntegrationContext.Provider
        value={{
          date,
          integration: selectedIntegration.integration,
          allIntegrations,
          value: value.map((p) => ({
            id: p.id,
            content: p.content,
            image: p.media,
          })),
        }}
      >
        <FormProvider {...form}>
          <section
            id={`platform-section-${props.id}`}
            className="mb-4 flex scroll-mt-4 flex-col overflow-hidden rounded-xl border border-[#e6e8ee] bg-white"
          >
            <div className="flex items-center gap-2.5 border-b border-[#e6e8ee] px-3 py-3">
              <img
                src={platformIconSrc(selectedIntegration.integration.identifier)}
                alt={platformLabel}
                className="h-5 w-5 rounded-full object-contain"
              />
              <span className="text-[14px] font-semibold text-[#0f172a]">
                {platformLabel}
              </span>
            </div>
            {selectedCount > 1 && (
              <div className="border-b border-[#e6e8ee] px-3 py-3">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="text-[12px] font-medium text-slate-500">
                    {t('caption_for_account', 'Caption for this account')}
                  </span>
                  {!!internal && (
                    <button
                      type="button"
                      onClick={() => addRemoveInternal(props.id)}
                      className="text-[12px] font-medium text-[#612BD3]"
                    >
                      {t('use_shared_post', 'Use shared post')}
                    </button>
                  )}
                </div>
                <textarea
                  value={caption}
                  rows={3}
                  onChange={(event) => changeCaption(event.target.value)}
                  placeholder={t('write_something', 'Write something…')}
                  className="w-full resize-none rounded-lg border border-[#e6e8ee] bg-white px-3 py-2 text-[13px] leading-5 text-[#0f172a] outline-none focus:border-[#612BD3]"
                />
              </div>
            )}
            <div className="relative overflow-hidden bg-white [&>div.absolute]:!relative [&>div.absolute]:!inset-auto [&>div.absolute]:!h-auto [&>div.absolute]:!w-full">
              {hasContent ? (
                CustomPreviewComponent ? (
                  <CustomPreviewComponent maximumCharacters={characterLimit} />
                ) : (
                  <GeneralPreviewComponent
                    maximumCharacters={characterLimit}
                    forceAccount
                  />
                )
              ) : (
                <div className="flex min-h-[160px] items-center justify-center px-6 text-center text-[13px] leading-5 text-slate-400">
                  {t(
                    'start_writing_your_post',
                    'Start writing your post for a preview'
                  )}
                </div>
              )}
            </div>
            {showSettings ? (
              <div className="border-t border-[#e6e8ee] p-3">
                {SettingsComponent ? <SettingsComponent /> : null}
                {!!data?.internalPlugs?.length && !dummy ? (
                  <InternalChannels plugs={data.internalPlugs} />
                ) : null}
              </div>
            ) : null}
          </section>
        </FormProvider>
      </IntegrationContext.Provider>
    );
  });

  // Expose the settings configuration as static metadata so the preview /
  // mobile settings page can render <SettingsComponent /> in isolation
  // without pulling the launch store + DOM portals.
  (Wrapped as any).__settings = {
    SettingsComponent,
    CustomPreviewComponent,
    dto,
    postComment,
    maximumCharacters,
  };

  return Wrapped;
};

/** Pulls the settings metadata off a withProvider-wrapped component. */
export const getProviderSettingsMeta = (component: unknown) => {
  return (component as any)?.__settings as
    | {
        SettingsComponent: FC<{ values?: any }> | null;
        CustomPreviewComponent?: FC<{ maximumCharacters?: number }>;
        dto?: any;
        postComment: PostComment;
        maximumCharacters?: number | ((settings: any) => number);
      }
    | undefined;
};
