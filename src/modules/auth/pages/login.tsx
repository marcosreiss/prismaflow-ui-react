import {
    Box,
    Button,
    TextField,
    Paper,
    Stack,
    Typography,
    FormControlLabel,
    Checkbox,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Select,
    InputAdornment,
    IconButton,
} from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import type { AdminBranchSelectionResponse, LoginRequest, LoginResponse } from "@/modules/auth/types/auth";
import { useNotification } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";
import { useLogin } from "@/modules/auth/hooks/useAuth";
import baseApi from "@/services/config/api";

/** ================== util de "criptografia" (ofuscação) ================== */
const APP_KDF_SALT = "prismaflow::rememberme::v1";
const APP_STATIC_KEY = "prismaflow-remember-me-🔐";

async function deriveKey(): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const baseKey = await crypto.subtle.importKey(
        "raw",
        enc.encode(APP_STATIC_KEY),
        "PBKDF2",
        false,
        ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: enc.encode(APP_KDF_SALT),
            iterations: 150000,
            hash: "SHA-256",
        },
        baseKey,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}

function b64encode(buf: ArrayBuffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function b64decode(b64: string) {
    return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)).buffer;
}

async function encryptJSON<T>(data: T) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey();
    const enc = new TextEncoder();
    const plaintext = enc.encode(JSON.stringify(data));
    const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext);
    return {
        iv: b64encode(iv.buffer),
        ct: b64encode(ciphertext),
    };
}

async function decryptJSON<T>(payload: { iv: string; ct: string }): Promise<T> {
    const key = await deriveKey();
    const iv = new Uint8Array(b64decode(payload.iv));
    const ct = b64decode(payload.ct);
    const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
    const dec = new TextDecoder();
    return JSON.parse(dec.decode(decrypted)) as T;
}

/** ================== chaves de storage ================== */
const LS_KEY_REMEMBER = "pf.remember";
const LS_KEY_CREDS = "pf.creds";

type LoginForm = {
    email: string;
    password: string;
    rememberMe: boolean;
};

type StoredCredentials = {
    email: string;
    password: string;
};

export default function Login() {
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

    // Carrega do localStorage ao montar
    useEffect(() => {
        if (mounted.current) return;
        mounted.current = true;

        try {
            const remembered = localStorage.getItem(LS_KEY_REMEMBER);
            if (remembered !== "true") return;

            const raw = localStorage.getItem(LS_KEY_CREDS);
            if (!raw) return;

            const payload = JSON.parse(raw) as { iv: string; ct: string };

            (async () => {
                try {
                    const { email, password } = await decryptJSON<StoredCredentials>(payload);
                    setValue("email", email);
                    setValue("password", password);
                    setValue("rememberMe", true);
                } catch {
                    localStorage.removeItem(LS_KEY_CREDS);
                    localStorage.removeItem(LS_KEY_REMEMBER);
                }
            })();
        } catch {
            // storage inacessível
        }
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
                localStorage.setItem(LS_KEY_CREDS, JSON.stringify(enc));
                localStorage.setItem(LS_KEY_REMEMBER, "true");
            } else {
                localStorage.removeItem(LS_KEY_CREDS);
                localStorage.removeItem(LS_KEY_REMEMBER);
            }
        } catch { /* empty */ }

        const payload: LoginRequest = {
            email: data.email,
            password: data.password,
        };

        login(payload, {
            onSuccess: (res) => {
                // 🔹 Caso especial: admin com múltiplas filiais
                if ("data" in res && res.data != undefined && "branches" in res.data && "tempToken" in res.data) {
                    const selection = res as AdminBranchSelectionResponse;
                    setBranches(selection!.data!.branches);
                    localStorage.setItem("tempAuthToken", selection!.data!.tempToken);
                    setOpenBranchModal(true);
                    return;
                }

                // 🔹 Caso normal (login direto)
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

                    addNotification(success.message || "Login realizado com sucesso!", "success");
                } else {
                    addNotification("Erro: resposta inválida do servidor.", "error");
                }
            },

            onError: (err) => {
                const apiMessage =
                    err.response?.data?.message || "Erro ao fazer login. Tente novamente.";
                addNotification(apiMessage, "error");
                console.error("❌", apiMessage);

                const remember = getValues("rememberMe");
                if (!remember) {
                    try {
                        localStorage.removeItem(LS_KEY_CREDS);
                        localStorage.removeItem(LS_KEY_REMEMBER);
                    } catch (storageErr) {
                        console.warn("Erro ao limpar storage:", storageErr);
                    }
                }
            },
        });
    };

    return (
        <>
            {/* ================= Modal Seleção de Filial ================= */}
            <Dialog open={openBranchModal} onClose={() => setOpenBranchModal(false)}>
                <DialogTitle>Selecione a filial para continuar</DialogTitle>
                <DialogContent>
                    <Select
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        fullWidth
                        displayEmpty
                        sx={{ mt: 2 }}
                    >
                        <MenuItem disabled value="">
                            Escolha uma filial
                        </MenuItem>
                        {branches.map((b) => (
                            <MenuItem key={b.id} value={b.id}>
                                {b.name}
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenBranchModal(false)}>Cancelar</Button>
                    <Button
                        variant="contained"
                        onClick={handleBranchSelection}
                        disabled={!selectedBranch}
                    >
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ================= Layout de Login ================= */}
            <Paper
                elevation={4}
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    width: { xs: "100%", sm: "90%", md: 800 },
                    maxWidth: "95%",
                    height: { xs: "auto", md: 460 },
                    borderRadius: 4,
                    overflow: "hidden",
                    mx: "auto",
                }}
            >
                {/* Lado Esquerdo */}
                <Box
                    sx={{
                        flex: 1,
                        backgroundImage: 'url("/images/bg_black_layout_dark.webp")',
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        color: "#fff",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: { xs: "center", md: "flex-start" },
                        alignItems: { xs: "center", md: "flex-start" },
                        textAlign: { xs: "center", md: "left" },
                        gap: 4,
                        px: { xs: 3, md: 4 },
                        py: { xs: 4, md: 5 },
                    }}
                >
                    <Box>
                        <img
                            src="/images/logo_prismaflow_dark.webp"
                            alt="Logo PrismaFlow"
                            style={{ height: 55 }}
                        />
                    </Box>

                    <Box>
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            color="white"
                            sx={{ fontSize: { xs: 22, sm: 28, md: 40 } }}
                        >
                            Olá, bem-vindo ao PrismaFlow!
                        </Typography>
                        <Typography
                            sx={{
                                mt: 2,
                                fontSize: { xs: 14, sm: 15 },
                                lineHeight: 1.4,
                                color: "white",
                            }}
                        >
                            Organize sua ótica com clareza e fluidez. <br />
                            Faça login para acessar sua gestão integrada.
                        </Typography>
                    </Box>
                </Box>

                {/* Lado Direito (Formulário) */}
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        px: { xs: 3, md: 4 },
                        py: { xs: 4, md: 0 },
                        backgroundColor: { xs: "rgba(255,255,255,0.9)", md: "background.paper" },
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 3, sm: 4 },
                            borderRadius: 3,
                            width: "100%",
                            maxWidth: 320,
                            boxShadow: { xs: 3, md: "none" },
                        }}
                    >
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack spacing={2} width="100%">
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{
                                        required: "E-mail é obrigatório",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "E-mail inválido",
                                        },
                                    }}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="E-mail:"
                                            variant="outlined"
                                            size="small"
                                            autoComplete="email"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                        />
                                    )}
                                />

                                <Controller
                                    name="password"
                                    control={control}
                                    rules={{ required: "Senha é obrigatória" }}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Senha:"
                                            type={showPassword ? "text" : "password"}
                                            variant="outlined"
                                            size="small"
                                            autoComplete="current-password"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => setShowPassword((v) => !v)}
                                                            edge="end"
                                                        >
                                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />

                                <Controller
                                    name="rememberMe"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={field.value}
                                                    onChange={(e) => field.onChange(e.target.checked)}
                                                />
                                            }
                                            label="Lembrar-me neste dispositivo"
                                        />
                                    )}
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={isPending}
                                    sx={{
                                        backgroundColor: "#1f344a",
                                        color: "#fff",
                                        fontWeight: "bold",
                                        mt: 1,
                                        "&:hover": { backgroundColor: "#172b3f" },
                                    }}
                                >
                                    {isPending ? "Entrando..." : "AVANÇAR"}
                                </Button>
                            </Stack>
                        </form>
                    </Paper>
                </Box>
            </Paper>
        </>
    );
}
