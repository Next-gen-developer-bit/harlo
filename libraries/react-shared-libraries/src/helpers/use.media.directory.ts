import { resolveMediaUrl } from '@gitroom/helpers/utils/has.extension';
import { useCallback } from 'react';
export const useMediaDirectory = () => {
  const set = useCallback((path: string) => {
    return resolveMediaUrl(path);
  }, []);
  return {
    set,
  };
};
