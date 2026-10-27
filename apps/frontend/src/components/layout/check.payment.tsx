import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import Loading from '@gitroom/frontend/components/layout/loading';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { timer } from '@gitroom/helpers/utils/timer';
import { useToaster } from '@gitroom/react/toaster/toaster';
import { useDecisionModal } from '@gitroom/frontend/components/layout/new-modal';
export const CheckPayment: FC<{
  check: string;
  mutate: () => void;
  children: ReactNode;
}> = (props) => {
  if (!props.check) {
    return <>{props.children}</>;
  }
  return <CheckPaymentInner {...props} />;
};

export const CheckPaymentInner: FC<{
  check: string;
  mutate: () => void;
  children: ReactNode;
}> = (props) => {
  const [showLoader, setShowLoader] = useState(true);
  const fetch = useFetch();
  const toaster = useToaster();
  const modal = useDecisionModal();
  const attempts = useRef(0);

  const finish = useCallback(
    (paid: boolean) => {
      setShowLoader(false);
      const url = new URL(window.location.href);
      url.searchParams.delete('check');
      window.history.replaceState({}, '', `${url.pathname}${url.search}`);
      if (paid) {
        props.mutate();
      }
    },
    [props]
  );

  useEffect(() => {
    if (showLoader) {
      document.querySelector('body')?.classList.add('overflow-hidden');
      Array.from(document.querySelectorAll('.blurMe') || []).map((p) =>
        p.classList.add('blur-xs', 'pointer-events-none')
      );
    } else {
      document.querySelector('body')?.classList.remove('overflow-hidden');
      Array.from(document.querySelectorAll('.blurMe') || []).map((p) =>
        p.classList.remove('blur-xs', 'pointer-events-none')
      );
    }
  }, [showLoader]);

  const checkSubscription = useCallback(async () => {
    attempts.current += 1;
    let response: Response;
    try {
      response = await fetch('/billing/check/' + props.check);
    } catch {
      toaster.show(
        'We could not confirm the payment. Open Billing and try the plan again.',
        'warning'
      );
      finish(false);
      return;
    }
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || typeof payload.status !== 'number') {
      toaster.show(
        payload.message ||
          'We could not confirm the payment. Open Billing and try the plan again.',
        'warning'
      );
      finish(false);
      return;
    }
    if (payload.status === 0) {
      if (attempts.current >= 45) {
        toaster.show(
          'Payment is still confirming. Check Billing in a moment instead of waiting on this screen.',
          'warning'
        );
        finish(false);
        return;
      }
      await timer(1000);
      return checkSubscription();
    }
    if (payload.status === 1) {
      modal.open({
        title: 'Payment not confirmed',
        onlyApprove: true,
        approveLabel: 'OK',
        description:
          payload.message ||
          'We could not validate your payment method, please try again',
      });
      finish(false);
      return;
    }
    if (payload.status === 2) {
      finish(true);
    }
  }, [fetch, finish, modal, props.check, toaster]);
  useEffect(() => {
    checkSubscription();
  }, []);
  if (showLoader) {
    return (
      <div className="fixed bg-black/40 w-full h-full flex justify-center items-center z-[400]">
        <div>
          <Loading type="spin" color="#612AD5" height={250} width={250} />
        </div>
      </div>
    );
  }
  return props.children;
};
