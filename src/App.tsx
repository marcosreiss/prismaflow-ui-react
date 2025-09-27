import { LinearProgress } from "@mui/material";
import { useAuth } from "./context/AuthContext";
import { PrivateRouter, PublicRouter } from "./routes/section";
import ErrorBoundary from "./components/ErrorBoundary"; // 👈 importar
import '@/global.css';

function App() {
  const { isAuthenticated } = useAuth();
  const auth = isAuthenticated();

  if (auth === null) {
    return <LinearProgress />;
  }

  return (
    <ErrorBoundary>
      {auth ? <PrivateRouter /> : <PublicRouter />}
    </ErrorBoundary>
  );
}

export default App;
