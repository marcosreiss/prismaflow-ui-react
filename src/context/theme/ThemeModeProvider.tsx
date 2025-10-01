import { useEffect, useMemo, useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { ThemeContext, type ThemeMode } from "./theme-mode-context";
import prismaTheme from "@/theme/prismaTheme";
import prismaDarkTheme from "@/theme/prismaDarkTheme";

type Props = { children: React.ReactNode };

export default function ThemeModeProvider({ children }: Props) {
  // 1) Inicializa já respeitando localStorage > sistema (no client)
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme-mode") as ThemeMode | null;
      if (saved === "light" || saved === "dark") return saved;
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
    }
    // SSR: usa 'light' só para render inicial no servidor
    return "light";
  });

  // 2) Sinaliza quando montou para evitar salvar antes da hora
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  // 3) Salva a preferência somente depois de montado
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem("theme-mode", mode);
    } catch (err) {
      console.error("Erro ao salvar tema:", err);
    }
  }, [mode, ready]);

  const toggleMode = () => setMode((m) => (m === "light" ? "dark" : "light"));

  const theme = useMemo(() => (mode === "light" ? prismaTheme : prismaDarkTheme), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        {/* Ajuda o navegador a aplicar cor nativa de UI (scrollbar, form controls) */}
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
