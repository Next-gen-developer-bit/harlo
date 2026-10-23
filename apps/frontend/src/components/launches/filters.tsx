'use client';

import { useCalendar, ListStateFilter } from '@gitroom/frontend/components/launches/calendar.context';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import i18next from 'i18next';
import {
  getTimezone,
  newDayjs,
} from '@gitroom/frontend/components/layout/set.timezone';
import {
  PLATFORM_LABELS,
  platformFamily,
} from '@gitroom/frontend/components/launches/helpers/mvp.platforms';

// Helper function to get start and end dates based on display type
function getDateRange(
  display: 'day' | 'week' | 'month' | 'list',
  referenceDate?: string
) {
  const date = referenceDate ? newDayjs(referenceDate) : newDayjs();

  switch (display) {
    case 'day':
      return {
        startDate: date.format('YYYY-MM-DD'),
        endDate: date.format('YYYY-MM-DD'),
      };
    case 'week':
      return {
        startDate: date.startOf('isoWeek').format('YYYY-MM-DD'),
        endDate: date.endOf('isoWeek').format('YYYY-MM-DD'),
      };
    case 'month':
      return {
        startDate: date.startOf('month').format('YYYY-MM-DD'),
        endDate: date.endOf('month').format('YYYY-MM-DD'),
      };
    case 'list':
      return {
        startDate: date.format('YYYY-MM-DD'),
        endDate: date.format('YYYY-MM-DD'),
      };
  }
}

export const Filters = () => {
  const calendar = useCalendar();
  const t = useT();

  // Set dayjs locale based on current language
  const currentLanguage = i18next.resolvedLanguage || 'en';
  dayjs.locale();

  // Calculate display date range text
  const getDisplayText = () => {
    const startDate = newDayjs(calendar.startDate);
    const endDate = newDayjs(calendar.endDate);

    switch (calendar.display) {
      case 'day':
        return startDate.format('dddd (L)');
      case 'week':
        return `${startDate.format('L')} - ${endDate.format('L')}`;
      case 'month':
        return startDate.format('MMMM YYYY');
      default:
        return '';
    }
  };

  const scrollToToday = useCallback(() => {
    requestAnimationFrame(() => {
      document.getElementById('calendar-today')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    });
  }, []);

  const setToday = useCallback(() => {
    const currentRange = getDateRange(
      calendar.display as 'day' | 'week' | 'month'
    );
    const alreadyHere =
      calendar.startDate === currentRange.startDate &&
      calendar.endDate === currentRange.endDate;

    if (!alreadyHere) {
      calendar.setFilters({
        startDate: currentRange.startDate,
        endDate: currentRange.endDate,
        display: calendar.display as 'day' | 'week' | 'month',
        customer: calendar.customer,
      });
      window.setTimeout(scrollToToday, 150);
      return;
    }

    scrollToToday();
  }, [calendar, scrollToToday]);

  const setWeek = useCallback(() => {
    // If already in week view and showing current week, don't change
    if (calendar.display === 'week') {
      const currentWeekRange = getDateRange('week');
      if (calendar.startDate === currentWeekRange.startDate) {
        return;
      }
    }

    const range = getDateRange('week');
    calendar.setFilters({
      startDate: range.startDate,
      endDate: range.endDate,
      display: 'week',
      customer: calendar.customer,
    });
  }, [calendar]);

  const setMonth = useCallback(() => {
    // If already in month view and showing current month, don't change
    if (calendar.display === 'month') {
      const currentMonthRange = getDateRange('month');
      if (calendar.startDate === currentMonthRange.startDate) {
        return;
      }
    }

    const range = getDateRange('month');
    calendar.setFilters({
      startDate: range.startDate,
      endDate: range.endDate,
      display: 'month',
      customer: calendar.customer,
    });
  }, [calendar]);

  const setList = useCallback(() => {
    if (calendar.display === 'list') {
      return;
    }

    calendar.setListState('all');
  }, [calendar.display, calendar.setListState]);

  const next = useCallback(() => {
    const currentStart = newDayjs(calendar.startDate);
    let nextStart: dayjs.Dayjs;

    switch (calendar.display) {
      case 'day':
        nextStart = currentStart.add(1, 'day');
        break;
      case 'week':
        nextStart = currentStart.add(1, 'week');
        break;
      case 'month':
        nextStart = currentStart.add(1, 'month');
        break;
      default:
        nextStart = currentStart.add(1, 'week');
    }

    const range = getDateRange(
      calendar.display as 'day' | 'week' | 'month',
      nextStart.format('YYYY-MM-DD')
    );
    calendar.setFilters({
      startDate: range.startDate,
      endDate: range.endDate,
      display: calendar.display as 'day' | 'week' | 'month',
      customer: calendar.customer,
    });
  }, [calendar]);

  const previous = useCallback(() => {
    const currentStart = newDayjs(calendar.startDate);
    let prevStart: dayjs.Dayjs;

    switch (calendar.display) {
      case 'day':
        prevStart = currentStart.subtract(1, 'day');
        break;
      case 'week':
        prevStart = currentStart.subtract(1, 'week');
        break;
      case 'month':
        prevStart = currentStart.subtract(1, 'month');
        break;
      default:
        prevStart = currentStart.subtract(1, 'week');
    }

    const range = getDateRange(
      calendar.display as 'day' | 'week' | 'month',
      prevStart.format('YYYY-MM-DD')
    );
    calendar.setFilters({
      startDate: range.startDate,
      endDate: range.endDate,
      display: calendar.display as 'day' | 'week' | 'month',
      customer: calendar.customer,
    });
  }, [calendar]);

  const isListView = calendar.display === 'list';

  const setListStateFilter = useCallback(
    (next: ListStateFilter) => () => {
      if (calendar.listState === next) return;
      calendar.setListState(next);
    },
    [calendar]
  );

  const listStateOptions: { value: ListStateFilter; label: string }[] = [
    { value: 'all', label: t('all', 'All') },
    { value: 'scheduled', label: t('scheduled', 'Scheduled') },
    { value: 'draft', label: t('draft', 'Draft') },
    { value: 'published', label: t('published', 'Published') },
    { value: 'failed', label: t('failed', 'Failed') },
  ];

  const previousPage = useCallback(() => {
    if (calendar.listPage > 0) {
      calendar.setListPage(calendar.listPage - 1);
    }
  }, [calendar]);

  const nextPage = useCallback(() => {
    if (calendar.listPage < calendar.listTotalPages - 1) {
      calendar.setListPage(calendar.listPage + 1);
    }
  }, [calendar]);

  const viewToggleClass = (active: boolean) =>
    clsx(
      'h-8 min-w-[68px] px-3 rounded-full text-[13px] font-medium transition-colors',
      active
        ? 'bg-white text-slate-900 shadow-sm'
        : 'text-slate-500 hover:text-slate-800'
    );

  const platforms = useMemo(() => {
    const families = new Set(
      calendar.integrations
        .map((integration) => platformFamily(integration.identifier))
        .filter(Boolean)
    );
    return [...families];
  }, [calendar.integrations]);

  const selectClass =
    'h-9 appearance-none rounded-lg bg-slate-100 px-3 pr-8 text-[13px] font-medium text-slate-700 outline-none';

  const viewButtonClass = (active: boolean) =>
    clsx(
      'inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium',
      active
        ? 'bg-[#2563eb] text-white'
        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
    );

  return (
    <div className="text-textColor flex flex-wrap gap-3 items-center justify-between select-none w-full mb-4">
      {!isListView && (
          <div className="flex items-center gap-1 text-slate-500">
            <button
              type="button"
              onClick={previous}
              aria-label={t('previous', 'Previous')}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100 hover:text-slate-800 rtl:rotate-180"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="8"
                height="12"
                viewBox="0 0 8 12"
                fill="none"
              >
                <path
                  d="M6.5 11L1.5 6L6.5 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <span className="min-w-[148px] px-1 text-center text-[15px] font-medium text-slate-800">
              {getDisplayText()}
            </span>
            <button
              type="button"
              onClick={next}
              aria-label={t('next', 'Next')}
              className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-100 hover:text-slate-700 rtl:rotate-180"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="8"
                height="12"
                viewBox="0 0 8 12"
                fill="none"
              >
                <path
                  d="M1.5 11L6.5 6L1.5 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
      )}
      <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
        {isListView && (
          <>
            <div className="border h-9 border-slate-200 bg-slate-200 gap-px flex items-center rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={previousPage}
                className={clsx(
                  'text-slate-600 rtl:rotate-180 px-2.5 bg-white h-full flex items-center justify-center',
                  calendar.listPage > 0
                    ? 'cursor-pointer hover:bg-slate-50'
                    : 'opacity-50 cursor-not-allowed'
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="12"
                  viewBox="0 0 8 12"
                  fill="none"
                >
                  <path
                    d="M6.5 11L1.5 6L6.5 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div className="min-w-[140px] text-center bg-white h-full flex items-center justify-center text-[13px] text-slate-600">
                {t('page', 'Page')} {calendar.listPage + 1} {t('of', 'of')}{' '}
                {Math.max(1, calendar.listTotalPages)}
              </div>
              <button
                type="button"
                onClick={nextPage}
                className={clsx(
                  'text-slate-600 rtl:rotate-180 px-2.5 bg-white h-full flex items-center justify-center',
                  calendar.listPage < calendar.listTotalPages - 1
                    ? 'cursor-pointer hover:bg-slate-50'
                    : 'opacity-50 cursor-not-allowed'
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="12"
                  viewBox="0 0 8 12"
                  fill="none"
                >
                  <path
                    d="M1.5 11L6.5 6L1.5 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className="flex rounded-full bg-slate-100 p-1 text-[13px] font-medium">
              {listStateOptions.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  onClick={setListStateFilter(option.value)}
                  className={viewToggleClass(calendar.listState === option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}
        {!isListView && (
          <>
            <button
              type="button"
              onClick={setToday}
              aria-label={getTimezone()}
              className="h-9 rounded-lg bg-slate-100 px-3 text-[13px] font-medium text-slate-700 hover:bg-slate-200"
            >
              {t('my_time', 'My time')}
            </button>
            <div className="relative">
              <select
                aria-label={t('all_platforms', 'All Platforms')}
                value={calendar.calendarPlatform}
                onChange={(event) =>
                  calendar.setCalendarPlatform(event.target.value)
                }
                className={selectClass}
              >
                <option value="all">{t('all_platforms', 'All Platforms')}</option>
                {platforms.map((platform) => (
                  <option key={platform} value={platform}>
                    {PLATFORM_LABELS[platform] || platform}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <select
                aria-label={t('show_all', 'Show all')}
                value={calendar.calendarStatus}
                onChange={(event) =>
                  calendar.setCalendarStatus(
                    event.target.value as typeof calendar.calendarStatus
                  )
                }
                className={selectClass}
              >
                <option value="all">{t('show_all', 'Show all')}</option>
                <option value="QUEUE">{t('scheduled', 'Scheduled')}</option>
                <option value="DRAFT">{t('draft', 'Draft')}</option>
                <option value="PUBLISHED">{t('published', 'Published')}</option>
                <option value="ERROR">{t('failed', 'Failed')}</option>
              </select>
            </div>
          </>
        )}
        <div className="flex items-center gap-1.5 text-[13px] font-medium">
          <button
            type="button"
            className={viewButtonClass(calendar.display === 'month')}
            onClick={setMonth}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
              <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            {t('month', 'Month')}
          </button>
          <button
            type="button"
            className={viewButtonClass(calendar.display === 'week')}
            onClick={setWeek}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
              <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
              <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
              <rect x="13" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
            </svg>
            {t('week', 'Week')}
          </button>
          <button
            type="button"
            className={viewButtonClass(isListView)}
            onClick={setList}
          >
            {t('list', 'List')}
          </button>
        </div>
      </div>
    </div>
  );
};
