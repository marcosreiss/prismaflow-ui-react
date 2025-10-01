import {
    Box,
    Button,
    TextField,
    Paper,
    Stack,
    Typography,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useRef } from "react";
import { useLogin } from "@/hooks/useAuth";
import type { UserLoginRequest } from "@/types/auth";
import { useNotification } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";

/** ================== util de "criptografia" (ofuscação) ================== */
// AVISO: chave embutida no front só ofusca. Use apenas se aceitar esse trade-off.
const APP_KDF_SALT = "prismaflow::rememberme::v1";
const APP_STATIC_KEY = "prismaflow-remember-me-🔐"; // mude isso e versione

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
    return Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer;
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

type LoginForm = UserLoginRequest & { rememberMe: boolean };

export default function Login() {
    const { addNotification } = useNotification();
    const { setToken } = useAuth();

    const { control, handleSubmit, setValue, getValues } = useForm<LoginForm>({
        defaultValues: {
            username: "",
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
                    const { username, password } = await decryptJSON<{ username: string; password: string }>(payload);
                    setValue("username", username);
                    setValue("password", password);
                    setValue("rememberMe", true);
                } catch {
                    // se falhar decriptação, limpa
                    localStorage.removeItem(LS_KEY_CREDS);
                    localStorage.removeItem(LS_KEY_REMEMBER);
                }
            })();
        } catch {
            // storage inacessível (Private mode restrito etc). Ignora.
        }
    }, [setValue]);

    const { mutate: login, isPending } = useLogin();

    const onSubmit = async (data: LoginForm) => {
        // persiste/limpa antes de chamar a API, conforme checkbox
        try {
            if (data.rememberMe) {
                const enc = await encryptJSON({ username: data.username, password: data.password });
                localStorage.setItem(LS_KEY_CREDS, JSON.stringify(enc));
                localStorage.setItem(LS_KEY_REMEMBER, "true");
            } else {
                localStorage.removeItem(LS_KEY_CREDS);
                localStorage.removeItem(LS_KEY_REMEMBER);
                // se você REALMENTE quiser limpar os inputs quando desmarcado, descomente:
                // setValue("username", "");
                // setValue("password", "");
            }
        } catch {
            // Se falhar salvar, segue o fluxo de login normalmente
        }

        // chama a API
        const payload: UserLoginRequest = { username: data.username, password: data.password };

        login(payload, {
            onSuccess: (res) => {
                const user = res.data;
                const token = res.token;

                if (token && user) {
                    setToken(token, {
                        username: user.username,
                        role: user.role,
                    });
                    addNotification("Login realizado com sucesso!", "success");
                } else {
                    addNotification("Erro: resposta inválida do servidor.", "error");
                }
            },
            onError: (err) => {
                addNotification("Erro ao fazer login. Tente novamente.", "error");
                console.error(err.message);
                // opcional: em caso de erro e rememberMe desligado, garantimos limpeza
                const remember = getValues("rememberMe");
                if (!remember) {
                    try {
                        localStorage.removeItem(LS_KEY_CREDS);
                        localStorage.removeItem(LS_KEY_REMEMBER);
                    } catch(err) {console.log(err);
                     }
                }
            },
        });
    };

    return (
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
                                name="username"
                                control={control}
                                rules={{ required: "Usuário é obrigatório" }}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Usuário de Acesso:"
                                        variant="outlined"
                                        size="small"
                                        autoComplete="username"
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
                                        type="password"
                                        variant="outlined"
                                        size="small"
                                        autoComplete="current-password"
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />

                            {/* Checkbox Lembrar-me */}
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
    );
}
