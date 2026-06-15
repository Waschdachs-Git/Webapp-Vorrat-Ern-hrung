import { useEffect } from 'react';
import { useSettings } from './useSettings';

/** Convert a hex colour to an "r g b" string for CSS variables. */
function hexToRgbTriplet(hex: string): string | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const int = parseInt(m[1]!, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `${r} ${g} ${b}`;
}

/**
 * Applies the chosen theme (system/light/dark) and accent colour to the
 * document. Listens to the OS colour-scheme when set to "system".
 */
export function useTheme(): void {
  const { theme, accentColor } = useSettings();

  useEffect(() => {
    const root = document.documentElement;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');

    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && mql.matches);
      root.classList.toggle('dark', dark);
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.setAttribute('content', dark ? '#121210' : '#faf8f4');
      }
    };

    apply();
    if (theme === 'system') {
      mql.addEventListener('change', apply);
      return () => mql.removeEventListener('change', apply);
    }
    return;
  }, [theme]);

  useEffect(() => {
    const triplet = hexToRgbTriplet(accentColor);
    if (triplet) {
      document.documentElement.style.setProperty('--c-accent', triplet);
    }
  }, [accentColor]);
}
