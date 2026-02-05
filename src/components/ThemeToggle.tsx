'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  // Initialize state to null to prevent hydration mismatch.
  // The theme will be determined on the client-side.
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    // This effect runs only on the client, after the component has mounted.
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []); // The empty dependency array ensures this runs only once on mount.

  useEffect(() => {
    // This effect applies the theme to the document and localStorage whenever it changes.
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // On the server, and during the initial client render, `theme` is null.
  // We return null to ensure the server and client render the same thing initially.
  if (theme === null) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="brutalist-button !w-auto !h-auto !p-3 !bg-white !border-2 !shadow-[4px_4px_0_#000] hover:!shadow-[6px_6px_0_#000] active:!shadow-none"
      aria-label="Toggle theme"
    >
      <span className="sr-only">Toggle theme</span>
      {theme === 'light' ? (
        <Sun className="h-6 w-6 text-black" />
      ) : (
        <Moon className="h-6 w-6 text-black" />
      )}
    </Button>
  );
}
