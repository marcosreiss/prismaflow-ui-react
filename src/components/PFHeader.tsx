import {
    AppBar,
    Toolbar,
    IconButton,
    Menu,
    MenuItem,
    Box,
    Tooltip,
    Avatar,
    Typography,
    Divider,
    Stack,
} from "@mui/material";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@mui/material/styles";
import { User, LogOut, Menu as MenuIcon, Sun, Moon, Building2, Building } from "lucide-react";
import useThemeMode from "@/context/theme/useThemeMode";

type PFHeaderProps = {
    onToggleSidebar?: () => void;
};

export default function PFHeader({ onToggleSidebar }: PFHeaderProps) {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const { user, useLogout } = useAuth();
    const { mode, toggleMode } = useThemeMode();

    const initial = user?.name ? user.name.charAt(0).toUpperCase() : "?";

    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                bgcolor: theme.palette.background.default,
                borderColor: theme.palette.divider,
                borderRadius: 0,
                height: 60,
            }}
        >
            <Toolbar sx={{ justifyContent: "space-between", gap: 2 }}>
                {/* Botão hamburguer (mobile) */}
                <Box sx={{ display: { xs: "block", md: "none" } }}>
                    <IconButton onClick={onToggleSidebar}>
                        <MenuIcon />
                    </IconButton>
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                {/* Alternar tema */}
                <Tooltip title={mode === "light" ? "Modo escuro" : "Modo claro"}>
                    <IconButton onClick={toggleMode} sx={{ mr: 1 }}>
                        {mode === "dark" ? (
                            <Moon size={20} strokeWidth={1.8} />
                        ) : (
                            <Sun size={20} strokeWidth={1.8} />
                        )}
                    </IconButton>
                </Tooltip>

                {/* Perfil */}
                <Box>
                    <Tooltip title="Perfil do usuário">
                        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0 }}>
                            <Avatar
                                sx={{
                                    width: 32,
                                    height: 32,
                                    bgcolor: theme.palette.primary.main,
                                    fontSize: 14,
                                    fontWeight: 600,
                                }}
                            >
                                {initial}
                            </Avatar>
                        </IconButton>
                    </Tooltip>

                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={() => setAnchorEl(null)}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                        PaperProps={{
                            sx: { borderRadius: 2, minWidth: 240, p: 1 },
                        }}
                    >
                        {/* Cabeçalho do menu */}
                        <Box sx={{ px: 2, py: 1.5 }}>
                            {user?.name && (
                                <Typography variant="subtitle2" fontWeight={700}>
                                    {user.name}
                                </Typography>
                            )}

                            {user?.email && (
                                <Typography variant="body2" color="text.secondary">
                                    {user.email}
                                </Typography>
                            )}

                            {(user?.role || user?.tenantName || user?.branchName) && (
                                <>
                                    <Divider sx={{ my: 1 }} />

                                    <Stack spacing={0.3}>
                                        {user?.role && (
                                            <Typography variant="caption" color="text.secondary">
                                                <strong>Função:</strong> {user.role}
                                            </Typography>
                                        )}

                                        {user?.tenantName && (
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                display="flex"
                                                alignItems="center"
                                                gap={0.5}
                                            >
                                                <Building2 size={12} /> {user.tenantName}
                                            </Typography>
                                        )}

                                        {user?.branchName && (
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                display="flex"
                                                alignItems="center"
                                                gap={0.5}
                                            >
                                                <Building size={12} /> {user.branchName}
                                            </Typography>
                                        )}
                                    </Stack>
                                </>
                            )}
                        </Box>

                        <Divider sx={{ my: 0.5 }} />

                        {/* Ações */}
                        <MenuItem onClick={() => setAnchorEl(null)}>
                            <User size={16} style={{ marginRight: 8 }} /> Ver perfil
                        </MenuItem>
                        <MenuItem onClick={useLogout}>
                            <LogOut size={16} style={{ marginRight: 8 }} /> Sair
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
