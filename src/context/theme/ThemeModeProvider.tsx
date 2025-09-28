import { useEffect, useMemo, useState } from "react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { ThemeContext, type ThemeMode } from "./theme-mode-context";
import prismaTheme from "@/design-system/theme/prismaTheme";

type Props = { children: React.ReactNode };

export default function ThemeModeProvider({ children }: Props) {
  const [mode, setMode] = useState<ThemeMode>("light"); // sempre inicia claro

  // lê preferência salva (sem checar sistema)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme-mode") as ThemeMode | null;
      if (saved) {
        setMode(saved);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  // salva preferência no localStorage
  useEffect(() => {
    try {
      localStorage.setItem("theme-mode", mode);
    } catch (err) {
      console.log(err);
    }
  }, [mode]);

  const toggleMode = () => setMode((m) => (m === "light" ? "dark" : "light"));

  const theme = useMemo(() => {
    if (mode === "light") return prismaTheme;

    return createTheme({
      ...prismaTheme,
      palette: {
        ...prismaTheme.palette,
        mode: "dark",
        background: {
          ...(prismaTheme.palette.background ?? {}),
          default: "#0f172a",
          paper: "#1e293b",
        },
        text: {
          primary: "#f8fafc",
          secondary: "#cbd5e1",
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
