export const hasExtension = (
  path: string | undefined | null,
  extension: string
): boolean => {
  if (!path) {
    return false;
  }
  const ext = extension.startsWith('.') ? extension : `.${extension}`;
  return path.toLowerCase().indexOf(ext.toLowerCase()) > -1;
};

// Media is stored as a JSON string (`[{ path, thumbnail }]`). Callers that put
// that blob in an img/video src, or that lost a slash (`https:/host`), make
// the browser and Instagram request a URL that 404s.
export const resolveMediaUrl = (value?: string | null): string => {
  if (!value) {
    return '';
  }

  let current = String(value).trim();
  for (let i = 0; i < 2; i++) {
    if (!(current.startsWith('[') || current.startsWith('{'))) {
      break;
    }
    try {
      const parsed = JSON.parse(current);
      const first = Array.isArray(parsed) ? parsed[0] : parsed;
      const next = first?.thumbnail || first?.path || first?.url;
      if (typeof next !== 'string' || !next.trim()) {
        return '';
      }
      current = next.trim();
    } catch {
      return '';
    }
  }

  return current.replace(/^(https?):\/(?!\/)/i, '$1://');
};
