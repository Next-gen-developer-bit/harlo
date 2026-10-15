'use client';

import { forwardRef, useCallback } from 'react';
import clsx from 'clsx';
import { useFormContext } from 'react-hook-form';

export const Checkbox = forwardRef<
  null,
  {
    checked?: boolean;
    disableForm?: boolean;
    name?: string;
    className?: string;
    label?: string;
    onChange?: (event: {
      target: {
        name?: string;
        value: boolean;
      };
    }) => void;
    variant?: 'default' | 'hollow';
  }
>((props, ref: any) => {
  const { checked, className, label, disableForm, variant } = props;
  const form = useFormContext();

  // Read the current value from the form store (or fall back to the prop)
  const val = disableForm ? !!checked : !!form.watch(props.name!);

  const changeStatus = useCallback(() => {
    const next = !val;

    // Notify any external onChange handler
    props?.onChange?.({
      target: {
        name: props.name!,
        value: next,
      },
    });

    // Write the new value directly into RHF so watch() updates correctly
    if (!disableForm && props.name) {
      form.setValue(props.name, next, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [val, props.name, disableForm, form]);

  return (
    <div className="flex gap-[10px] items-center">
      {/* flex-shrink-0 prevents the box from resizing when siblings change */}
      <div
        ref={ref}
        onClick={changeStatus}
        className={clsx(
          'cursor-pointer rounded-[4px] select-none flex-shrink-0 w-[24px] h-[24px] justify-center items-center flex text-white transition-colors',
          variant === 'default' || !variant
            ? 'bg-forth'
            : val
              ? 'bg-forth border-2 border-forth'
              : 'border-customColor1 border-2 bg-customColor2',
          className
        )}
      >
        {val && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      {!!label && <div className="select-none">{label}</div>}
    </div>
  );
});
