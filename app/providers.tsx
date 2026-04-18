"use client";

import { CssBaseline, ThemeProvider, createTheme, type PaletteMode } from "@mui/material";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type ThemeModeContextValue = {
  mode: PaletteMode;
  toggleMode: () => void;
};

const THEME_STORAGE_KEY = "testgenie_theme_mode";

const ThemeModeContext = createContext<ThemeModeContextValue>({
  mode: "light",
  toggleMode: () => undefined,
});

function getDesignTheme(mode: PaletteMode) {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? "#58a6ff" : "#155eef",
      },
      secondary: {
        main: isDark ? "#2dd4bf" : "#0ea5a4",
      },
      background: {
        default: isDark ? "#060b14" : "#ecf6ff",
        paper: isDark ? "rgba(15, 23, 42, 0.72)" : "rgba(255, 255, 255, 0.72)",
      },
      text: {
        primary: isDark ? "#dbeafe" : "#102a43",
        secondary: isDark ? "#9db4d1" : "#486581",
      },
    },
    shape: {
      borderRadius: 18,
    },
    typography: {
      fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
      h3: {
        fontWeight: 800,
        letterSpacing: "-0.03em",
      },
      h6: {
        fontWeight: 650,
      },
    },
  });
}

export function useThemeMode() {
  return useContext(ThemeModeContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      setMode(stored);
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setMode(prefersDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
      return next;
    });
  };

  const theme = useMemo(() => getDesignTheme(mode), [mode]);

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
