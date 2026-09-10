'use client';

import { FC, useCallback, useEffect, useState } from 'react';
import { useCustomProviderFunction } from '@gitroom/frontend/components/launches/helpers/use.custom.provider.function';
import { Select } from '@gitroom/react/form/select';
import { useSettings } from '@gitroom/frontend/components/launches/helpers/use.values';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { Button } from '@gitroom/react/form/button';
export const PinterestBoard: FC<{
  name: string;
  onChange: (event: {
    target: {
      value: string;
      name: string;
    };
  }) => void;
}> = (props) => {
  const { onChange, name } = props;
  const t = useT();

  const customFunc = useCustomProviderFunction();
  const [orgs, setOrgs] = useState<undefined | any[]>();
  const [error, setError] = useState<string>();
  const [boardName, setBoardName] = useState('');
  const [creating, setCreating] = useState(false);
  const { getValues } = useSettings();
  const [currentMedia, setCurrentMedia] = useState<string | undefined>();
  const onChangeInner = (event: {
    target: {
      value: string;
      name: string;
    };
  }) => {
    setCurrentMedia(event.target.value);
    onChange(event);
  };
  const loadBoards = useCallback(async () => {
    const data = await customFunc.get('boards');
    if (!Array.isArray(data)) {
      setOrgs([]);
      setError(
        t(
          'pinterest_boards_load_failed',
          'Could not load Pinterest boards. Reconnect the channel and try again.'
        )
      );
      return;
    }
    setError(undefined);
    setOrgs(data);
  }, [customFunc, t]);
  const createBoard = useCallback(async () => {
    const nextName = boardName.trim();
    if (!nextName || creating) {
      return;
    }
    setCreating(true);
    setError(undefined);
    try {
      const created = await customFunc.get('createBoard', { name: nextName });
      if (!created?.id) {
        setError(
          t(
            'pinterest_board_create_failed',
            'Could not create the board. Create a public board on Pinterest, then reconnect this channel.'
          )
        );
        return;
      }
      setOrgs((current) => [...(current || []), created]);
      setBoardName('');
      setCurrentMedia(created.id);
      onChange({
        target: {
          name,
          value: created.id,
        },
      });
    } finally {
      setCreating(false);
    }
  }, [boardName, creating, customFunc, name, onChange, t]);
  useEffect(() => {
    loadBoards();
    const settings = getValues()[props.name];
    if (settings) {
      setCurrentMedia(settings);
    }
  }, []);
  if (!orgs) {
    return null;
  }
  return (
    <div className="flex flex-col gap-[16px]">
      {orgs.length > 0 && (
        <Select
          name={name}
          label="Select board"
          hideErrors={true}
          onChange={onChangeInner}
          value={currentMedia}
        >
          <option value="">{t('select_1', '--Select--')}</option>
          {orgs.map((org: any) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </Select>
      )}
      {orgs.length === 0 && (
        <div className="text-[14px] text-textColor">
          {t(
            'pinterest_no_boards',
            'No boards found. Secret boards are hidden unless the channel is reconnected. Create a public board below, or on Pinterest, then try again.'
          )}
        </div>
      )}
      {error && <div className="text-[12px] text-red-400">{error}</div>}
      <div className="flex flex-col gap-[8px]">
        <div className="text-[14px]">
          {t('pinterest_create_board', 'Create a board')}
        </div>
        <div className="flex gap-[10px]">
          <div className="bg-newBgColorInner h-[42px] border-newTableBorder border rounded-[8px] text-textColor flex-1 flex items-center">
            <input
              className="h-full bg-transparent outline-none flex-1 text-[14px] text-textColor px-[16px]"
              value={boardName}
              onChange={(event) => setBoardName(event.target.value)}
              placeholder={t('pinterest_board_name', 'Board name')}
            />
          </div>
          <Button
            type="button"
            className="rounded-[8px]"
            disabled={!boardName.trim()}
            loading={creating}
            onClick={createBoard}
          >
            {t('create', 'Create')}
          </Button>
        </div>
      </div>
    </div>
  );
};
