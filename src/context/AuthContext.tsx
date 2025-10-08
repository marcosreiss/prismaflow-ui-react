import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import React, {
  useMemo,
  useState,
  useEffect,
  useContext,
  useCallback,
  createContext,
} from "react";
import { useRouter } from "@/routes/hooks";
import type { UserRole } from "@/modules/auth/types/auth";

// Tipos extras para organização
interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole; // ✅ agora tipado corretamente
  tenantId: string;
  tenantName: string;
  branchId: string | null;
  branchName: string | null;
}

interface DecodedToken {
  exp: number;
  sub?: string;
  email?: string;
  role?: UserRole;
  tenantId?: string;
}

interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  setToken: (token: string | null, user?: AuthUser) => void;
  isAuthenticated: () => boolean | null;
  useLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const setToken = useCallback(
    (newToken: string | null, userData?: AuthUser) => {
      setTokenState(newToken);

      if (newToken) {
        localStorage.setItem("authToken", newToken);
        if (userData) {
          setUserState(userData);
          localStorage.setItem("authUser", JSON.stringify(userData));
        }
      } else {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        setUserState(null);
      }
    },
    []
  );

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("authUser");

    if (savedToken) {
      setTokenState(savedToken);
      if (savedUser) setUserState(JSON.parse(savedUser));

      try {
        const decoded: DecodedToken = jwtDecode(savedToken);
        const currentTime = Date.now() / 1000;

        if (decoded.exp <= currentTime) {
          setToken(null);
          router.push("/");
        } else {
          const timeout = (decoded.exp - currentTime) * 1000;
          const timer = setTimeout(() => {
            setToken(null);
            router.push("/");
          }, timeout);

          setIsLoading(false);
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        setToken(null);
      }
    } else {
      setIsLoading(false);
    }

    return undefined;
  }, [setToken, router]);

  const isAuthenticated = useCallback(() => {
    if (isLoading) return null;
    if (!token) return false;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
      return false;
    }
  }, [token, isLoading]);

  const useLogout = useCallback(() => {
    setToken(null);
    router.push("/");
  }, [setToken, router]);

  const value = useMemo(
    () => ({
      token,
      user,
      setToken,
      isAuthenticated,
      useLogout,
    }),
    [token, user, setToken, isAuthenticated, useLogout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
