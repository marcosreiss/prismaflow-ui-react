import { Snackbar, Alert, IconButton } from "@mui/material";
import { useNotification, type Notification } from "@/context/NotificationContext";
import { X } from "lucide-react";

const typeConfig = {
    success: { severity: "success", iconColor: "#34D399" }, // verde menta
    error: { severity: "error", iconColor: "#EF4444" },     // vermelho
    info: { severity: "info", iconColor: "#4BA3F2" },       // azul claro
    warning: { severity: "warning", iconColor: "#F59E0B" }, // laranja
} as const;

export default function PFSnackbar() {
    const { notifications, removeNotification } = useNotification();

    return (
        <>
            {notifications.map(({ id, message, type }: Notification, index) => (
                <Snackbar
                    key={id}
                    open
                    autoHideDuration={4000}
                    onClose={() => removeNotification(id)}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    sx={{
                        mt: `${index * 70}px`, // deslocar quando há múltiplos
                    }}
                >
                    <Alert
                        severity={typeConfig[type]?.severity || "info"}
                        icon={false}
                        variant="filled"
                        sx={{
                            borderRadius: 2,
                            bgcolor: typeConfig[type]?.iconColor || "#4BA3F2",
                            color: "white",
                            boxShadow: `0 8px 24px rgba(0,0,0,0.08)`,
                            minWidth: 280,
                            display: "flex",
                            alignItems: "center",
                            fontWeight: 500,
                        }}
                        action={
                            <IconButton
                                size="small"
                                onClick={() => removeNotification(id)}
                                sx={{ color: "white" }}
                            >
                                <X size={16} />
                            </IconButton>
                        }
                    >
                        {message}
                    </Alert>
                </Snackbar>
            ))}
        </>
    );
}
