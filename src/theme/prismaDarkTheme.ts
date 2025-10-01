import { createTheme } from "@mui/material/styles";

const prismaDarkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2563eb", // azul ainda funciona bem no dark
    },
    background: {
      default: "#111827", // fundo principal quase preto
      paper: "#1f2937", // cinza escuro para cards e superfícies
    },
    text: {
      primary: "#f9fafb", // branco suave
      secondary: "#9ca3af", // cinza claro para menor destaque
    },
    grey: {
      100: "#1f2937",
      200: "#374151",
      300: "#4b5563",
      400: "#6b7280",
      500: "#9ca3af",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: "2.25rem",
      lineHeight: 1.3,
      color: "#f9fafb",
    },
    h2: {
      fontWeight: 700,
      fontSize: "1.875rem",
      lineHeight: 1.35,
      color: "#f9fafb",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.4,
      color: "#f9fafb",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.4,
      color: "#f9fafb",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.125rem",
      lineHeight: 1.4,
      color: "#f9fafb",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: 1.4,
      color: "#f9fafb",
    },
    body1: { fontSize: "0.95rem", color: "#e5e7eb" },
    body2: { fontSize: "0.875rem", color: "#9ca3af" },
    button: {
      textTransform: "none",
      fontWeight: 500,
      fontSize: "0.875rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        containedPrimary: {
          backgroundColor: "#2563eb",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#1e40af",
          },
        },
        outlined: {
          borderColor: "#4b5563",
          color: "#e5e7eb",
          "&:hover": {
            backgroundColor: "#1f2937",
            borderColor: "#6b7280",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            fontSize: "0.875rem",
            backgroundColor: "#1f2937",
            color: "#f9fafb",
            "& fieldset": {
              borderColor: "#374151",
            },
            "&:hover fieldset": {
              borderColor: "#6b7280",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#2563eb",
            },
            "& input": {
              color: "#f9fafb",
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#e5e7eb",
          "&:hover": {
            backgroundColor: "#374151",
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "#f9fafb",
        },
      },
    },
  },
});

export default prismaDarkTheme;
