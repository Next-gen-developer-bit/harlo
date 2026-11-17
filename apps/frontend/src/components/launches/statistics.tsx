import React, { FC, Fragment, useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { ChartSocial } from '@gitroom/frontend/components/analytics/chart-social';
import { Select } from '@gitroom/react/form/select';
import { LoadingComponent } from '@gitroom/frontend/components/layout/loading';
import { MissingReleaseModal } from '@gitroom/frontend/components/launches/missing-release.modal';
import { useModals } from '@gitroom/frontend/components/layout/new-modal';
import { ImportStatsModal } from '@gitroom/frontend/components/platform-analytics/import.stats.modal';
import {
  formatMetric,
  PublishedPostAnalytics,
  useGroupPostInsights,
} from '@gitroom/frontend/components/platform-analytics/use.published.posts.analytics';

interface AnalyticsData {
  label: string;
  data: Array<{ total: number; date: string }>;
  percentageChange: number;
  average?: boolean;
}

export const StatisticsModal: FC<{
  postId: string;
}> = (props) => {
  const { postId } = props;
  const t = useT();
  const fetch = useFetch();
  const modals = useModals();
  const [dateRange, setDateRange] = useState(7);
  const [selectedId, setSelectedId] = useState(postId);

  const loadStatistics = useCallback(async () => {
    return (await fetch(`/posts/${postId}/statistics`)).json();
  }, [postId, fetch]);

  const loadPostAnalytics = useCallback(async () => {
    return (await fetch(`/analytics/post/${selectedId}?date=${dateRange}`)).json();
  }, [selectedId, dateRange, fetch]);

  const { data: statisticsData, isLoading: isLoadingStatistics } = useSWR(
    `/posts/${postId}/statistics`,
    loadStatistics
  );

  const { data: analyticsData, isLoading: isLoadingAnalytics, mutate: mutateAnalytics } = useSWR(
    `/analytics/post/${selectedId}?date=${dateRange}`,
    loadPostAnalytics,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      revalidateOnMount: true,
      refreshWhenHidden: false,
      refreshWhenOffline: false,
    }
  );

  const isMissing = analyticsData && !Array.isArray(analyticsData) && analyticsData.missing;

  const dateOptions = useMemo(() => {
    return [
      { key: 7, value: t('7_days', '7 Days') },
      { key: 30, value: t('30_days', '30 Days') },
      { key: 90, value: t('90_days', '90 Days') },
    ];
  }, [t]);

  const totals = useMemo(() => {
    if (!analyticsData || !Array.isArray(analyticsData)) return [];
    return analyticsData.map((p: AnalyticsData) => {
      const value =
        (p?.data?.reduce((acc: number, curr: any) => acc + Number(curr.total), 0) || 0) /
        (p.average ? p.data.length : 1);
      if (p.average) {
        return value.toFixed(2) + '%';
      }
      return Math.round(value);
    });
  }, [analyticsData]);

  const {
    data: groupInsights,
    isLoading: isLoadingGroup,
    mutate: mutateGroup,
  } = useGroupPostInsights(postId, dateRange);
  const channels = groupInsights?.posts || [];

  const openImport = useCallback(
    (channel: PublishedPostAnalytics) => {
      modals.openModal({
        title: 'Add post stats',
        withCloseButton: true,
        children: (
          <ImportStatsModal
            post={channel}
            onSaved={() => {
              mutateGroup();
              mutateAnalytics();
            }}
          />
        ),
      });
    },
    [modals, mutateAnalytics, mutateGroup]
  );

  const isLoading = isLoadingStatistics || isLoadingAnalytics || isLoadingGroup;

  return (
    <div className="relative min-h-[200px]">
      {isLoading ? (
        <div className="flex items-center justify-center py-[40px]">
          <LoadingComponent />
        </div>
      ) : isMissing && channels.length === 0 ? (
        <MissingReleaseModal postId={selectedId} onSuccess={() => mutateAnalytics()} />
      ) : (
        <div className="flex flex-col gap-[24px]">
          {channels.length > 0 && (
            <div className="flex flex-col gap-[10px]">
              <h3 className="text-[18px] font-[500]">
                {t('channel_insights', 'Each channel')}
              </h3>
              <div className="flex flex-col gap-[8px]">
                {channels.map((channel) => (
                  <div
                    key={channel.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedId(channel.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        setSelectedId(channel.id);
                      }
                    }}
                    className={`rounded-[12px] border bg-white px-[14px] py-[12px] text-left ${
                      selectedId === channel.id
                        ? 'border-[#2563eb]'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-[12px]">
                      <div className="flex min-w-0 items-center gap-[8px]">
                        {channel.integration?.providerIdentifier && (
                          <img
                            src={
                              channel.integration.providerIdentifier === 'youtube'
                                ? '/icons/platforms/youtube.svg'
                                : `/icons/platforms/${channel.integration.providerIdentifier}.png`
                            }
                            alt=""
                            className="h-[16px] w-[16px] rounded-[3px] object-cover"
                          />
                        )}
                        <span className="truncate text-[14px] font-medium text-slate-800">
                          {channel.integration?.name ||
                            t('unknown_account', 'Unknown account')}
                        </span>
                      </div>
                      {channel.canImportStats && (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            openImport(channel);
                          }}
                          className="shrink-0 rounded-lg border border-blue-200 px-[8px] py-[4px] text-[12px] font-medium text-blue-600"
                        >
                          {channel.available
                            ? t('update_stats', 'Update stats')
                            : t('add_stats', 'Add stats')}
                        </button>
                      )}
                    </div>
                    <div className="mt-[10px] grid grid-cols-2 gap-[8px] sm:grid-cols-4">
                      {(
                        [
                          [channel.reachLabel || 'Impressions', channel.impressions],
                          ['Likes', channel.likes],
                          ['Comments', channel.comments],
                          ['Shares', channel.shares],
                        ] as Array<[string, number | null]>
                      ).map(([label, value]) => (
                        <div key={label}>
                          <div className="text-[11px] text-slate-400">{label}</div>
                          <div className="text-[16px] font-medium text-slate-800">
                            {formatMetric(value)}
                          </div>
                        </div>
                      ))}
                    </div>
                    {!channel.available && channel.unavailableHint && (
                      <div className="mt-[8px] text-[12px] text-slate-500">
                        {channel.unavailableHint}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Post Analytics Section */}
          {analyticsData && Array.isArray(analyticsData) && analyticsData.length > 0 && (
            <div className="flex flex-col gap-[14px]">
              <div className="flex items-center justify-between">
                <h3 className="text-[18px] font-[500]">
                  {t('post_analytics', 'Post Analytics')}
                </h3>
                <div className="max-w-[150px]">
                  <Select
                    label=""
                    name="date"
                    disableForm={true}
                    hideErrors={true}
                    value={dateRange}
                    onChange={(e) => setDateRange(+e.target.value)}
                  >
                    {dateOptions.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.value}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px]">
                {analyticsData.map((p: AnalyticsData, index: number) => {
                  const colorVariants = ['purple', 'green', 'blue'] as const;
                  const color = colorVariants[index % colorVariants.length];
                  return (
                    <div key={`analytics-${index}`} className="group">
                      <div className="flex flex-col h-full bg-newTableHeader border border-newTableBorder rounded-[12px] overflow-hidden transition-all duration-200 hover:border-[#612bd3]/50">
                        <div className="flex items-center justify-between px-[16px] pt-[14px] pb-[8px]">
                          <div className="flex items-center gap-[10px]">
                            <div
                              className={`w-[8px] h-[8px] rounded-full ${
                                color === 'purple' ? 'bg-[#612bd3]' : ''
                              } ${color === 'green' ? 'bg-[#32d583]' : ''} ${
                                color === 'blue' ? 'bg-[#1d9bf0]' : ''
                              }`}
                            />
                            <span className="text-[15px] font-medium text-newTableText">
                              {p.label}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 px-[12px] py-[8px]">
                          <div className="h-[120px] relative">
                            <ChartSocial data={p.data} color={color} key={`chart-${index}`} />
                          </div>
                        </div>
                        <div className="px-[16px] pb-[14px]">
                          <div className="text-[36px] leading-[42px] font-semibold tracking-tight">
                            {totals[index]}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Short Links Statistics Section */}
          <div className="flex flex-col gap-[14px]">
            <h3 className="text-[18px] font-[500]">
              {t('short_links_statistics', 'Short Links Statistics')}
            </h3>
            {statisticsData?.clicks?.length === 0 ? (
              <div className="text-gray-400">
                {t('no_short_link_results', 'No short link results')}
              </div>
            ) : (
              <div className="grid grid-cols-3">
                <div className="bg-forth p-[4px] rounded-tl-lg">
                  {t('short_link', 'Short Link')}
                </div>
                <div className="bg-forth p-[4px]">
                  {t('original_link', 'Original Link')}
                </div>
                <div className="bg-forth p-[4px] rounded-tr-lg">
                  {t('clicks', 'Clicks')}
                </div>
                {statisticsData?.clicks?.map((p: any) => (
                  <Fragment key={p.short}>
                    <div className="p-[4px] py-[10px] bg-customColor6">
                      {p.short}
                    </div>
                    <div className="p-[4px] py-[10px] bg-customColor6">
                      {p.original}
                    </div>
                    <div className="p-[4px] py-[10px] bg-customColor6">
                      {p.clicks}
                    </div>
                  </Fragment>
                ))}
              </div>
            )}
          </div>

          {/* No analytics available message */}
          {channels.length === 0 &&
            (!analyticsData || !Array.isArray(analyticsData) || analyticsData.length === 0) &&
            (!statisticsData?.clicks || statisticsData.clicks.length === 0) && (
              <div className="text-center text-gray-400 py-[20px]">
                {t('no_statistics_available', 'No statistics available for this post')}
              </div>
            )}
        </div>
      )}
    </div>
  );
};
