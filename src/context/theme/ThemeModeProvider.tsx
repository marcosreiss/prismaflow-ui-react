import { useEffect, useMemo, useState } from "react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { ThemeContext, type ThemeMode } from "./theme-mode-context";
import prismaTheme from "@/design-system/theme/prismaTheme";

type Props = { children: React.ReactNode };

export default function ThemeModeProvider({ children }: Props) {
  const [mode, setMode] = useState<ThemeMode>("light");

  // lê preferência salva / sistema
  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme-mode") as ThemeMode | null;
      if (saved) {
        setMode(saved);
      } else if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
        setMode("dark");
      }
    } catch (err) {console.log(err);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("theme-mode", mode);
    } catch (err) {
      console.log(err);
    }
  }, [mode]);

  const toggleMode = () => setMode((m) => (m === "light" ? "dark" : "light"));

  const theme = useMemo(() => {
    // para claro usamos o prismaTheme já existente
    if (mode === "light") return prismaTheme;

    // para escuro, derivamos do prismaTheme ajustando palette
    return createTheme({
      ...prismaTheme,
      palette: {
        ...prismaTheme.palette,
        mode: "dark",
        background: {
          ...(prismaTheme.palette.background ?? {}),
          default: "#0f172a", // slate-900
          paper: "#1e293b",   // slate-800
        },
        text: {
          primary: "#f8fafc",   // slate-50
          secondary: "#cbd5e1", // slate-300
        },
        divider: "rgba(255,255,255,0.12)",
      },
    });
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
