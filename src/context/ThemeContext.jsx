import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadThemeFromStorage, saveThemeToStorage } from '../utils/storageUtils';

const ThemeContext = createContext();

export const THEMES = [
  { id: 'light', name: 'Light Theme', preview: '#2563eb', bgPreview: '#ffffff' },
  { id: 'dark', name: 'Dark Theme', preview: '#3b82f6', bgPreview: '#111827' },
  { id: 'ocean', name: 'Ocean Blue', preview: '#0284c7', bgPreview: '#f0f7ff' },
  { id: 'forest', name: 'Forest Green', preview: '#059669', bgPreview: '#f2f8f4' },
  { id: 'sunset', name: 'Sunset Orange', preview: '#ea580c', bgPreview: '#fff9f5' },
  { id: 'lavender', name: 'Lavender Purple', preview: '#7c3aed', bgPreview: '#faf8ff' },
  { id: 'rose', name: 'Rose Pink', preview: '#e11d48', bgPreview: '#fff7f9' },
  { id: 'minimal', name: 'Minimal Grey', preview: '#27272a', bgPreview: '#f4f4f5' }
];

export const ACCENT_PRESETS = [
  '#2563eb', // Royal Blue
  '#3b82f6', // Dodger Blue
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#84cc16', // Lime
  '#eab308', // Amber
  '#f97316', // Orange
  '#ef4444', // Red
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#6366f1'  // Indigo
];

export function ThemeProvider({ children }) {
  const [themeState, setThemeState] = useState(() => loadThemeFromStorage());

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', themeState.theme);

    // Apply custom accent color if set
    if (themeState.accent) {
      root.style.setProperty('--accent-color', themeState.accent);
      root.style.setProperty('--accent-hover', adjustColorBrightness(themeState.accent, -15));
      root.style.setProperty('--accent-light', hexToRgba(themeState.accent, 0.12));
      root.style.setProperty('--accent-ring', hexToRgba(themeState.accent, 0.3));
    } else {
      root.style.removeProperty('--accent-color');
      root.style.removeProperty('--accent-hover');
      root.style.removeProperty('--accent-light');
      root.style.removeProperty('--accent-ring');
    }

    saveThemeToStorage(themeState.theme, themeState.accent);
  }, [themeState]);

  const setTheme = (themeId) => {
    setThemeState(prev => ({ ...prev, theme: themeId }));
  };

  const setAccent = (accentHex) => {
    setThemeState(prev => ({ ...prev, accent: accentHex }));
  };

  const resetAccent = () => {
    setThemeState(prev => ({ ...prev, accent: '' }));
  };

  const toggleDarkLight = () => {
    setThemeState(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  };

  const isDarkMode = themeState.theme === 'dark';

  return (
    <ThemeContext.Provider value={{
      theme: themeState.theme,
      accent: themeState.accent,
      isDarkMode,
      setTheme,
      setAccent,
      resetAccent,
      toggleDarkLight,
      availableThemes: THEMES,
      accentPresets: ACCENT_PRESETS
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Helpers for color manipulation
function hexToRgba(hex, alpha = 1) {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function adjustColorBrightness(hex, percent) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  let r = (num >> 16) + Math.round(255 * (percent / 100));
  let g = ((num >> 8) & 0x00FF) + Math.round(255 * (percent / 100));
  let b = (num & 0x0000FF) + Math.round(255 * (percent / 100));

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
