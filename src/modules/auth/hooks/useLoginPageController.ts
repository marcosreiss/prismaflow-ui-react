import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type {
  LoginForm,
  LoginRequest,
  LoginResponse,
  StoredCredentials,
  AdminBranchSelectionResponse,
} from "@/modules/auth/types/auth";
import { useNotification } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";
import baseApi from "@/utils/axios";
import { encryptJSON, decryptJSON } from "@/utils/crypto";
import {
  getRememberedStatus,
  getStoredCredentials,
  setStoredCredentials,
  setRememberedStatus,
  clearStoredCredentials,
} from "@/utils/storage";
import { useLogin } from "./useAuth";

export function useLoginPageController() {
  const { addNotification } = useNotification();
  const { setToken } = useAuth();
  const [branches, setBranches] = useState<{ id: string; name: string }[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [openBranchModal, setOpenBranchModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, setValue, getValues } = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    if (!getRememberedStatus()) return;

    const raw = getStoredCredentials();
    if (!raw) return;

    (async () => {
      try {
        const payload = JSON.parse(raw) as { iv: string; ct: string };
        const { email, password } = await decryptJSON<StoredCredentials>(
          payload
        );
        setValue("email", email);
        setValue("password", password);
        setValue("rememberMe", true);
      } catch {
        clearStoredCredentials();
      }
    })();
  }, [setValue]);

  const { mutate: login, isPending } = useLogin();

  const handleBranchSelection = async () => {
    const tempToken = localStorage.getItem("tempAuthToken");
    if (!tempToken || !selectedBranch) {
      addNotification("Selecione uma filial antes de continuar.", "warning");
      return;
    }

    try {
      const { data } = await baseApi.post(
        "/api/auth/branch-selection",
        { branchId: selectedBranch },
        { headers: { Authorization: `Bearer ${tempToken}` } }
      );

      const token = data.token;
      const user = data.data;

      if (token && user) {
        setToken(token, {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId,
          tenantName: user.tenant?.name ?? "",
          branchId: user.branchId,
          branchName: user.branch?.name ?? "",
        });

        localStorage.removeItem("tempAuthToken");
        localStorage.removeItem("availableBranches");
        addNotification("Login completado com sucesso!", "success");
        setOpenBranchModal(false);
      } else {
        addNotification("Erro: resposta inválida do servidor.", "error");
      }
    } catch (err) {
      console.log(err);
      addNotification("Erro ao completar o login. Tente novamente.", "error");
    }
  };

  const onSubmit = async (data: LoginForm) => {
    try {
      if (data.rememberMe) {
        const credentials: StoredCredentials = {
          email: data.email,
          password: data.password,
        };
        const enc = await encryptJSON(credentials);
        setStoredCredentials(JSON.stringify(enc));
        setRememberedStatus(true);
      } else {
        clearStoredCredentials();
      }
    } catch {
      /* empty */
    }

    const payload: LoginRequest = {
      email: data.email,
      password: data.password,
    };

    login(payload, {
      onSuccess: (res) => {
        if (
          "data" in res &&
          res.data != undefined &&
          "branches" in res.data &&
          "tempToken" in res.data
        ) {
          const selection = res as AdminBranchSelectionResponse;
          setBranches(selection!.data!.branches);
          localStorage.setItem("tempAuthToken", selection!.data!.tempToken);
          setOpenBranchModal(true);
          return;
        }

        const success = res as LoginResponse;
        const user = success.data;
        const token = success.token;

        if (token && user) {
          setToken(token, {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            tenantId: user.tenantId,
            tenantName: user.tenant?.name ?? "",
            branchId: user.branchId,
            branchName: user.branch?.name ?? "",
          });

          addNotification(
            success.message || "Login realizado com sucesso!",
            "success"
          );
        } else {
          addNotification("Erro: resposta inválida do servidor.", "error");
        }
      },

      onError: (err) => {
        const apiMessage =
          err.response?.data?.message ||
          "Erro ao fazer login. Tente novamente.";
        addNotification(apiMessage, "error");
        console.error("❌", apiMessage);

        const remember = getValues("rememberMe");
        if (!remember) {
          clearStoredCredentials();
        }
      },
    });
  };

  return {
    control,
    handleSubmit,
    branches,
    selectedBranch,
    setSelectedBranch,
    openBranchModal,
    setOpenBranchModal,
    showPassword,
    setShowPassword,
    isPending,
    handleBranchSelection,
    onSubmit,
  };
}
