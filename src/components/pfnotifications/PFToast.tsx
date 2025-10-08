import { useNotification, type Notification } from "@/context/NotificationContext";
import { X, CheckCircle, Info, AlertTriangle, XCircle } from "lucide-react";
import { Box, IconButton, Typography, alpha, useTheme } from "@mui/material";

const iconMap = {
    success: <CheckCircle size={18} />,
    error: <XCircle size={18} />,
    info: <Info size={18} />,
    warning: <AlertTriangle size={18} />,
} as const;

export default function PFToast() {
    const { notifications, removeNotification } = useNotification();
    const theme = useTheme();

    return (
        <Box
            sx={{
                position: "fixed",
                top: 16,
                right: 16,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                zIndex: 1400,
            }}
        >
            {notifications.map(({ id, message, type }: Notification) => {
                const mainColor =
                    type === "success"
                        ? theme.palette.success.main
                        : type === "error"
                            ? theme.palette.error.main
                            : type === "warning"
                                ? theme.palette.warning.main
                                : theme.palette.primary.main;

                return (
                    <Box
                        key={id}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            px: 2,
                            py: 1.5,
                            borderRadius: 2,
                            minWidth: 280,
                            boxShadow: `0 8px 24px ${alpha(mainColor, 0.25)}`,
                            bgcolor: theme.palette.background.paper,
                            borderLeft: `4px solid ${mainColor}`,
                            animation: "fadeIn 0.3s ease-out",
                        }}
                    >
                        <Box sx={{ color: mainColor }}>{iconMap[type] || iconMap.info}</Box>
                        <Typography
                            variant="body2"
                            sx={{ flex: 1, fontWeight: 500, color: theme.palette.text.primary }}
                        >
                            {message}
                        </Typography>
                        <IconButton
                            onClick={() => removeNotification(id)}
                            size="small"
                            sx={{ color: theme.palette.text.secondary }}
                        >
                            <X size={14} />
                        </IconButton>
                    </Box>
                );
            })}
        </Box>
    );
}
