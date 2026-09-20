import { useEffect, useState } from 'react';
import type { ThemeId } from '../types';
import { getTheme } from '../utils/themes';

function isDocumentDark() {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

export function useStoreTheme(themeId: ThemeId) {
  const [dark, setDark] = useState(isDocumentDark);

  useEffect(() => {
    const observer = new MutationObserver(() => setDark(isDocumentDark()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return getTheme(dark ? 'midnight' : themeId);
}
