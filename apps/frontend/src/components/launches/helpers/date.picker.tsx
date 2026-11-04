import { FC, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import dayjs from 'dayjs';
import { isUSCitizen } from './isuscitizen.utils';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { newDayjs } from '@gitroom/frontend/components/layout/set.timezone';
import { CalendarIcon } from '@gitroom/frontend/components/ui/icons';

const weekdayLabels = (weekStartsOn: number) => {
  const labels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  return [...labels.slice(weekStartsOn), ...labels.slice(0, weekStartsOn)];
};

export const DatePicker: FC<{
  date: dayjs.Dayjs;
  onChange: (day: dayjs.Dayjs) => void;
}> = (props) => {
  const { date, onChange } = props;
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => date.startOf('month'));
  const [popoverStyle, setPopoverStyle] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const t = useT();
  const us = isUSCitizen();
  const weekStartsOn = us ? 0 : 1;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const changeShow = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      if (next) {
        setView(date.startOf('month'));
      }
      return next;
    });
  }, [date]);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) {
        return;
      }
      if (
        triggerRef.current?.contains(target) ||
        popoverRef.current?.contains(target)
      ) {
        return;
      }
      close();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };
    const onScroll = (event: Event) => {
      if (popoverRef.current?.contains(event.target as Node)) {
        return;
      }
      close();
    };
    document.addEventListener('mousedown', onPointerDown);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', close);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', close);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [open, close]);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) {
      setPopoverStyle(null);
      return;
    }
    const trigger = triggerRef.current.getBoundingClientRect();
    const popoverWidth = 280;
    const popoverHeight = popoverRef.current?.offsetHeight || 360;
    const gap = 8;
    const padding = 12;

    let left = trigger.right - popoverWidth;
    left = Math.min(left, window.innerWidth - popoverWidth - padding);
    left = Math.max(padding, left);

    let top = trigger.top - popoverHeight - gap;
    if (top < padding) {
      top = Math.min(trigger.bottom + gap, window.innerHeight - popoverHeight - padding);
    }
    top = Math.max(padding, top);

    setPopoverStyle({ top, left });
  }, [open, view, date]);

  const days = useMemo(() => {
    const first = view.startOf('month');
    const offset = (first.day() - weekStartsOn + 7) % 7;
    const gridStart = first.subtract(offset, 'day');
    return Array.from({ length: 42 }, (_, index) => gridStart.add(index, 'day'));
  }, [view, weekStartsOn]);

  const selectDay = useCallback(
    (day: dayjs.Dayjs) => {
      onChange(
        newDayjs(
          day.format('YYYY-MM-DD') + ' ' + date.format('HH:mm:ss')
        )
      );
    },
    [date, onChange]
  );

  const selectTime = useCallback(
    (value: string) => {
      if (!value) {
        return;
      }
      onChange(newDayjs(date.format('YYYY-MM-DD') + ' ' + value + ':00'));
    },
    [date, onChange]
  );

  return (
    <div className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        onClick={changeShow}
        className="flex h-9 cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[#e6e8ee] bg-white px-3 text-[13px] font-semibold text-[#334155]"
      >
        <CalendarIcon />
        <span>{date.format(us ? 'MMM D, h:mm A' : 'D MMM, HH:mm')}</span>
      </button>
      {open &&
        createPortal(
          <div
            ref={popoverRef}
            onClick={(event) => event.stopPropagation()}
            style={{
              position: 'fixed',
              top: popoverStyle?.top ?? -9999,
              left: popoverStyle?.left ?? -9999,
              visibility: popoverStyle ? 'visible' : 'hidden',
            }}
            className="z-[5000] w-[280px] rounded-xl border border-[#e6e8ee] bg-white p-3 text-[#0f172a] shadow-lg"
          >
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                aria-label="Previous month"
                onClick={() => setView((current) => current.subtract(1, 'month'))}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#334155] hover:bg-[#f8f7fc]"
              >
                ‹
              </button>
              <div className="text-[13px] font-semibold">
                {view.format('MMMM YYYY')}
              </div>
              <button
                type="button"
                aria-label="Next month"
                onClick={() => setView((current) => current.add(1, 'month'))}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#334155] hover:bg-[#f8f7fc]"
              >
                ›
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-[#94a3b8]">
              {weekdayLabels(weekStartsOn).map((label) => (
                <div key={label} className="py-1">
                  {label}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => {
                const selected = day.isSame(date, 'day');
                const outside = !day.isSame(view, 'month');
                return (
                  <button
                    key={day.format('YYYY-MM-DD')}
                    type="button"
                    onClick={() => selectDay(day)}
                    className={
                      selected
                        ? 'h-8 rounded-lg bg-[#612BD3] text-[12px] font-semibold text-white'
                        : outside
                        ? 'h-8 rounded-lg text-[12px] text-[#cbd5e1] hover:bg-[#f8f7fc]'
                        : 'h-8 rounded-lg text-[12px] font-medium text-[#334155] hover:bg-[#f8f7fc]'
                    }
                  >
                    {day.format('D')}
                  </button>
                );
              })}
            </div>
            <label className="mt-3 block text-[12px] font-semibold text-[#64748b]">
              {t('pick_time', 'Pick time')}
              <input
                type="time"
                value={date.format('HH:mm')}
                onChange={(event) => selectTime(event.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-[#e6e8ee] bg-white px-3 text-[13px] font-semibold text-[#0f172a] outline-none focus:border-[#612BD3]"
              />
            </label>
            <button
              type="button"
              onClick={close}
              className="mt-3 h-9 w-full rounded-lg bg-[#612BD3] text-[13px] font-semibold text-white"
            >
              {t('close', 'Close')}
            </button>
          </div>,
          document.body
        )}
    </div>
  );
};
