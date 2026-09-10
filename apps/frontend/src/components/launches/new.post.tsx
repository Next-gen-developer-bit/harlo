'use client';

import React, { useCallback } from 'react';
import { useModals } from '@gitroom/frontend/components/layout/new-modal';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { CreatePostModal } from '@gitroom/frontend/components/new-launch/create.post.modal';

export const NewPost = () => {
  const modal = useModals();
  const t = useT();

  const createAPost = useCallback(() => {
    modal.openModal({
      id: 'create-post-modal',
      closeOnClickOutside: true,
      withCloseButton: false,
      classNames: {
        modal: 'w-[95%] max-w-[1000px] text-textColor p-0 bg-transparent shadow-none',
      },
      children: <CreatePostModal />,
    });
  }, [modal]);

  return (
    <button
      onClick={createAPost}
      className="text-white flex-1 pt-[12px] pb-[14px] ps-[16px] pe-[20px] group-[.sidebar]:p-0 min-h-[44px] max-h-[44px] rounded-md bg-btnPrimary flex justify-center items-center gap-[5px] outline-none"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="20"
        viewBox="0 0 21 20"
        fill="none"
        className="min-w-[21px] min-h-[20px]"
      >
        <path
          d="M10.5001 4.16699V15.8337M4.66675 10.0003H16.3334"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="flex-1 text-start text-[14px] group-[.sidebar]:hidden font-medium">
        {t('create_new_post', 'Create Post')}
      </div>
    </button>
  );
};
