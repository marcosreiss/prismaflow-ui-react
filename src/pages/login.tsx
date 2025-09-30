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
            password: "Naoesei_87#",
        },
    });

    const { mutate: login, isPending } = useLogin();

    const onSubmit = (data: UserLoginRequest) => {
        login(data, {
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
            },
        });
    };

    return (
        <Paper
            elevation={4}
            sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" }, // coluna no mobile
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
                    elevation={0} // fixa como 0 para não dar erro
                    sx={{
                        p: { xs: 3, sm: 4 },
                        borderRadius: 3,
                        width: "100%",
                        maxWidth: 320,
                        boxShadow: { xs: 3, md: "none" }, // substitui o elevation
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
                </Paper>
            </Box>
        </Paper>
    );
}
