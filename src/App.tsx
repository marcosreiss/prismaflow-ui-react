import { LinearProgress } from "@mui/material";
import { useAuth } from "./context/AuthContext";
import { PrivateRouter, PublicRouter } from "./routes/section";
import PFErrorBoundary from "./components/PFErrorBoundary"; // 👈 importar
import '@/global.css';

function App() {
  const { isAuthenticated } = useAuth();
  const auth = isAuthenticated();

  if (auth === null) {
    return <LinearProgress />;
  }

  return (
    <PFErrorBoundary>
      {auth ? <PrivateRouter /> : <PublicRouter />}
    </PFErrorBoundary>
  );
}

export default App;
