// PFHeader.tsx
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
import { useTheme } from "@mui/material/styles";
import { User, LogOut, Menu as MenuIcon, Sun, Moon } from "lucide-react";
import useThemeMode from "@/context/theme/useThemeMode";

type PFHeaderProps = {
    onToggleSidebar?: () => void;
};

export default function PFHeader({ onToggleSidebar }: PFHeaderProps) {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const { username, useLogout, role } = useAuth();
    const initial = username ? username.charAt(0).toUpperCase() : "?";

    const { mode, toggleMode } = useThemeMode(); // modo atual + função de toggle

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
                {/* Botão hamburguer só no mobile/tablet */}
                <Box sx={{ display: { xs: "block", md: "none" } }}>
                    <IconButton onClick={onToggleSidebar}>
                        <MenuIcon />
                    </IconButton>
                </Box>

                {/* Espaço flexível para empurrar à direita */}
                <Box sx={{ flexGrow: 1 }} />

                {/* Botão de alternar tema */}
                <Tooltip title={mode === "light" ? "Modo escuro" : "Modo claro"}>
                    <IconButton onClick={toggleMode} sx={{ mr: 1 }}>
                        {mode === "light" ? (
                            <Moon size={20} strokeWidth={1.8} />
                        ) : (
                            <Sun size={20} strokeWidth={1.8} />
                        )}
                    </IconButton>
                </Tooltip>

                {/* Usuário */}
                <Box>
                    <Tooltip title="Perfil">
                        <IconButton
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                            sx={{ p: 0 }}
                        >
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
                        PaperProps={{ sx: { borderRadius: 2, minWidth: 200 } }}
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
                        <MenuItem onClick={() => setAnchorEl(null)}>
                            <User size={16} style={{ marginRight: 8 }} /> Perfil
                        </MenuItem>
                        <MenuItem onClick={useLogout}>
                            <LogOut size={16} style={{ marginRight: 8 }} /> Logout
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
