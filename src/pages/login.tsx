// src/pages/Login.tsx
import {
    Box,
    Button,
    TextField,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useLogin } from "@/hooks/useAuth";
import type { UserLoginRequest } from "@/types/auth";
import { useNotification } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
    const { addNotification } = useNotification();
    const { setToken } = useAuth();


    const { control, handleSubmit } = useForm<UserLoginRequest>({
        defaultValues: {
            username: "marcos",
            password: "Naosei_87#",
        },
    });

    const { mutate: login, isPending } = useLogin();

    const onSubmit = (data: UserLoginRequest) => {
        login(data, {
            onSuccess: (res) => {
                if (res.token && res.data) {
                    // Primeiro seta o token e usuário no contexto
                    setToken(res.token, {
                        username: res.data.username,
                        role: res.data.role,
                    });

                    // Depois do setToken, garante que o contexto já marcou como autenticado
                    // Fazendo o redirect logo em seguida com replace (evita voltar pro login no histórico)
                    setTimeout(() => {
                        addNotification("Login realizado com sucesso!", "success");
                    }, 0);
                } else {
                    addNotification("Erro: resposta inválida do servidor.", "error");
                }
            },
            onError: (err) => {
                addNotification("Erro ao fazer login. Tente novamente.", "error");
                console.error(err);
            },
        });
    };



    return (
        <Paper
            elevation={4}
            sx={{
                display: "flex",
                width: 800,
                maxWidth: "95%",
                height: 460,
                borderRadius: 4,
                overflow: "hidden",
            }}
        >
            {/* Lado Esquerdo com fundo e texto */}
            <Box
                sx={{
                    flex: 1,
                    backgroundImage:
                        'url("/images/bg_black_layout_dark.webp")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    color: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    gap: 7,
                    px: 4,
                    py: 5,
                }}
            >
                {/* Logo no topo */}
                <Box>
                    <img
                        src="/images/logo_prismaflow_dark.webp"
                        alt="Logo PrismaFlow"
                        style={{ height: 65 }}
                    />
                </Box>

                {/* Texto de boas-vindas no centro */}
                <Box>
                    <Typography variant="h3" fontSize={40} fontWeight="bold">
                        Olá, bem-vindo ao PrismaFlow!
                    </Typography>
                    <Typography sx={{ mt: 2, fontSize: 15, lineHeight: 1.4 }}>
                        Organize sua ótica com clareza e fluidez. <br/> Faça login para acessar sua gestão integrada.
                    </Typography>
                </Box>

            </Box>

            {/* Lado Direito com formulário */}
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: 4,
                }}
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    style={{ width: "100%", maxWidth: 300 }}
                >
                    <Stack spacing={2} width="100%">
                        {/* Username */}
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
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />

                        {/* Password */}
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
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
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
                                "&:hover": {
                                    backgroundColor: "#172b3f",
                                },
                            }}
                        >
                            {isPending ? "Entrando..." : "AVANÇAR"}
                        </Button>
                    </Stack>
                </form>
            </Box>
        </Paper>
    );
}
