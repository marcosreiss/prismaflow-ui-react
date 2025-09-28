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
} from "@mui/material";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { User, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import useThemeMode from "@/context/theme/useThemeMode";

export default function PFHeader() {
    const theme = useTheme();
    const { mode, toggleMode } = useThemeMode();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const { username, useLogout, role } = useAuth();

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => setAnchorEl(null);
    const handleLogout = () => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useLogout();
        handleCloseMenu();
    };

    // Inicial maiúscula caso não tenha foto/avatar real
    const initial = username ? username.charAt(0).toUpperCase() : "?";

    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                bgcolor: theme.palette.background.default,
                borderBottom: "1px solid",
                borderColor: theme.palette.divider,
                borderRadius: 0,
                height: 60,
            }}
        >
            <Toolbar sx={{ justifyContent: "space-between" }}>
                {/* Botão de alternância de tema */}
                <Tooltip
                    title={mode === "light" ? "Ativar tema escuro" : "Ativar tema claro"}
                >
                    <IconButton onClick={toggleMode} sx={{ ml: 1 }}>
                        {mode === "light" ? <Moon size={18} /> : <Sun size={18} />}
                    </IconButton>
                </Tooltip>

                {/* Usuário */}
                <Box>
                    <Tooltip title="Perfil">
                        <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
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
                        onClose={handleCloseMenu}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                        PaperProps={{
                            sx: { borderRadius: 2, minWidth: 200 },
                        }}
                    >
                        <Box sx={{ px: 2, py: 1 }}>
                            <Typography variant="body2" fontWeight={600}>
                                {username}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {role ?? "Usuário"}
                            </Typography>
                        </Box>
                        <Divider />
                        <MenuItem onClick={handleCloseMenu}>
                            <User size={16} style={{ marginRight: 8 }} /> Perfil
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <LogOut size={16} style={{ marginRight: 8 }} /> Logout
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
