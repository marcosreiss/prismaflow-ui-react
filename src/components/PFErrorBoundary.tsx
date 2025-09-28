import React, { type ReactNode, type ErrorInfo } from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import { AlertTriangle } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class PFErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    console.error("ErrorBoundary captured an error: ", _ );
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Erro capturado pelo ErrorBoundary:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 2,
            backgroundImage: 'url("/images/bg_black_layout_dark.webp")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 3,
              width: "100%",
              maxWidth: { xs: "100%", sm: 420 },
              textAlign: "center",
              bgcolor: "background.paper",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <AlertTriangle size={48} color="#f59e0b" />
            </Box>

            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Oops! Algo deu errado
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3, lineHeight: 1.5 }}
            >
              Um erro inesperado ocorreu. Você pode tentar atualizar a página
              para continuar usando o sistema.
            </Typography>

            <Button
              variant="contained"
              onClick={this.handleReload}
              sx={{ borderRadius: 2, px: 4 }}
              fullWidth={true}
            >
              Recarregar página
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default PFErrorBoundary;
