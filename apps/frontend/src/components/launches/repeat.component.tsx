'use client';

import { FC, useMemo, useState } from 'react';
import { Select } from '@gitroom/react/form/select';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { useClickOutside } from '@mantine/hooks';
import { isUSCitizen } from '@gitroom/frontend/components/launches/helpers/isuscitizen.utils';
import clsx from 'clsx';
import { RepeatIcon, DropdownArrowIcon } from '@gitroom/frontend/components/ui/icons';
const getList = (t: (key: string, fallback: string) => string) => [
  {
    value: 1,
    label: t('day', 'Day'),
  },
  {
    value: 2,
    label: t('two_days', 'Two Days'),
  },
  {
    value: 3,
    label: t('three_days', 'Three Days'),
  },
  {
    value: 4,
    label: t('four_days', 'Four Days'),
  },
  {
    value: 5,
    label: t('five_days', 'Five Days'),
  },
  {
    value: 6,
    label: t('six_days', 'Six Days'),
  },
  {
    value: 7,
    label: t('week', 'Week'),
  },
  {
    value: 14,
    label: t('two_weeks', 'Two Weeks'),
  },
  {
    value: 30,
    label: t('month', 'Month'),
  },
  {
    value: null,
    label: t('cancel', 'Cancel'),
  },
];
export const RepeatComponent: FC<{
  repeat: number | null;
  onChange: (newVal: number) => void;
}> = (props) => {
  const { repeat } = props;
  const t = useT();
  const list = getList(t);
  const [isOpen, setIsOpen] = useState(false);

  const ref = useClickOutside(() => {
    if (!isOpen) {
      return;
    }
    setIsOpen(false);
  });

  const everyLabel = useMemo(() => {
    if (!repeat) {
      return '';
    }
    return list.find((p) => p.value === repeat)?.label;
  }, [repeat, list]);

  return (
    <div
      ref={ref}
      className={clsx(
        'relative flex h-9 shrink-0 items-center whitespace-nowrap rounded-lg border bg-white px-3 text-[13px] font-semibold text-[#334155] select-none',
        isOpen ? 'border-[#612BD3]' : 'border-[#e6e8ee]',
      )}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-full cursor-pointer items-center gap-2"
      >
        <RepeatIcon />
        <span>
          {repeat
            ? `${t('every', 'Every')} ${everyLabel}`
            : t('repeat', 'Repeat')}
        </span>
        <DropdownArrowIcon rotated={isOpen} />
      </div>
      {isOpen && (
        <div className="absolute start-0 bottom-[calc(100%+8px)] z-[400] flex max-h-[240px] w-[240px] flex-col overflow-y-auto rounded-lg border border-[#e6e8ee] bg-white p-2 shadow-sm">
          {list.map((p) => (
            <div
              onClick={() => {
                props.onChange(Number(p.value));
                setIsOpen(false);
              }}
              key={p.label}
              className="h-[40px] py-[8px] px-[20px] -mx-[12px] hover:bg-newBgColor"
            >
              {p.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
