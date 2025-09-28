import { useContext } from "react";
import { ThemeContext, type ThemeContextValue,  } from "./theme-mode-context";

export default function useThemeMode(): ThemeContextValue {
  return useContext(ThemeContext);
}
