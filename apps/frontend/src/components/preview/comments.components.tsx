'use client';

import { useUser } from '@gitroom/frontend/components/layout/user.context';
import { FC, useCallback, useMemo } from 'react';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import useSWR from 'swr';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useT } from '@gitroom/react/translation/get.transation.service.client';

export const RenderComponents: FC<{
  postId: string;
}> = (props) => {
  const { postId } = props;
  const fetch = useFetch();
  const comments = useCallback(async () => {
    return (await fetch(`/public/posts/${postId}/comments`)).json();
  }, [postId]);
  const { data, mutate, isLoading } = useSWR(`comments-${postId}`, comments);
  const mapUsers = useMemo(() => {
    return (data?.comments || []).reduce(
      (all: any, current: any) => {
        all.users[current.userId] = all.users[current.userId] || all.counter++;
        return all;
      },
      {
        users: {},
        counter: 1,
      }
    ).users;
  }, [data]);
  const { handleSubmit, register, setValue } = useForm();
  const submit: SubmitHandler<FieldValues> = useCallback(
    async (e) => {
      setValue('comment', '');
      await fetch(`/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify(e),
      });
      mutate();
    },
    [postId, mutate]
  );

  const t = useT();

  if (isLoading) {
    return (
      <p className="text-sm text-slate-400">{t('loading', 'Loading...')}</p>
    );
  }

  const commentList = data?.comments || [];

  return (
    <>
      <form className="space-y-3" onSubmit={handleSubmit(submit)}>
        <textarea
          {...register('comment', {
            required: true,
          })}
          className="min-h-[96px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
          placeholder={t('add_a_comment', 'Add a comment...')}
          defaultValue={''}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex h-9 items-center gap-2 rounded-full bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
            {t('post', 'Post')}
          </button>
        </div>
      </form>
      <div className="mt-5 space-y-0 divide-y divide-slate-100 border-t border-slate-100">
        {commentList.length === 0 && (
          <p className="pt-4 text-sm text-slate-400">
            {t('no_comments_yet', 'No comments yet.')}
          </p>
        )}
        {commentList.map((comment: any) => (
          <div key={comment.id} className="py-3.5">
            <h3 className="text-sm font-semibold text-slate-900">
              {t('user', 'User')}
              {mapUsers[comment.userId]}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              {comment.content}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};
export const CommentsComponents: FC<{
  postId: string;
}> = (props) => {
  const user = useUser();
  const t = useT();

  const { postId } = props;
  const goToComments = useCallback(() => {
    window.location.href = `/auth?returnUrl=${window.location.href}`;
  }, []);
  if (!user?.id) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
        <p className="mb-3 text-sm text-slate-500">
          {t('login_to_add_comments', 'Sign in to leave a comment')}
        </p>
        <button
          type="button"
          onClick={goToComments}
          className="inline-flex h-9 items-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
        >
          {t('sign_in', 'Sign in')}
        </button>
      </div>
    );
  }
  return <RenderComponents postId={postId} />;
};
