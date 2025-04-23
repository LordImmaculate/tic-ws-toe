import React, { useContext, useEffect, useState } from 'react';

const validThemes = ['oatmilk', 'cyberworld'] as const; // Added 'as const'

type Theme = (typeof validThemes)[number];

export function createTheme() {
  const storedTheme = window.localStorage.getItem('theme');
  const initialTheme = validThemes.includes(storedTheme as Theme)
    ? (storedTheme as Theme)
    : 'oatmilk';

  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  return { theme, setTheme };
}

export const ThemeContext = React.createContext<ReturnType<typeof createTheme>>(
  {
    theme: 'oatmilk', // Provide a default value
    setTheme: () => {}, // Provide a default function
  },
);

export function useTheme() {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) {
    throw new Error('useTheme hook must be used inside a ThemeContext!');
  }
  return themeContext;
}
