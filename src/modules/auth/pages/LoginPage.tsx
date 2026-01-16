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
import { Controller } from "react-hook-form";
import { useLoginPageController } from "../hooks/useLoginPageController";

export default function LoginPage() {
    const {
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
    } = useLoginPageController();

    return (
        <>
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
                    backgroundImage: "none",
                }}
            >
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
                            backgroundImage: "none",
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
                                            inputProps={{
                                                style: { fontSize: 16 }
                                            }}
                                            InputLabelProps={{
                                                style: { fontSize: 16 }
                                            }}
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
                                            inputProps={{
                                                style: { fontSize: 16 }
                                            }}
                                            InputLabelProps={{
                                                style: { fontSize: 16 }
                                            }}
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
