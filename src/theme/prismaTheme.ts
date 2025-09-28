import { createTheme } from "@mui/material/styles";

const prismaTheme = createTheme({
  palette: {
    primary: {
      main: "#2563eb", // azul suave
    },
    text: {
      primary: "#111827", // quase preto
      secondary: "#6b7280", // cinza discreto
    },
    grey: {
      100: "#f9fafb",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: { fontWeight: 700, fontSize: "2.25rem", lineHeight: 1.3 },
    h2: { fontWeight: 700, fontSize: "1.875rem", lineHeight: 1.35 },
    h3: { fontWeight: 600, fontSize: "1.5rem", lineHeight: 1.4 },
    h4: { fontWeight: 600, fontSize: "1.25rem", lineHeight: 1.4 },
    h5: { fontWeight: 600, fontSize: "1.125rem", lineHeight: 1.4 },
    h6: { fontWeight: 600, fontSize: "1rem", lineHeight: 1.4 }, // usado no toolbar
    body1: { fontSize: "0.95rem", color: "#374151" },
    body2: { fontSize: "0.875rem", color: "#6b7280" },
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
          "&:hover": {
            backgroundColor: "#1e40af",
          },
        },
        outlined: {
          borderColor: "#d1d5db",
          color: "#374151",
          "&:hover": {
            backgroundColor: "#f9fafb",
            borderColor: "#9ca3af",
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
            "& fieldset": {
              borderColor: "#d1d5db",
            },
            "&:hover fieldset": {
              borderColor: "#9ca3af",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#2563eb",
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#374151",
          "&:hover": {
            backgroundColor: "#f3f4f6",
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "#111827",
        },
      },
    },
  },
});

export default prismaTheme;
