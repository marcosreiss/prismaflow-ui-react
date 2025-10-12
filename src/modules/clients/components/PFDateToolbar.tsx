import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useRouter } from "@/routes/hooks";
import { useState } from "react";

type PFDateToolbarProps = {
    title: string;
    onRefresh?: () => void;
    onDateChange?: (date: string) => void;
    backUrl?: string;
    defaultDate?: string;
};

export default function PFDateToolbar({
    title,
    onRefresh,
    onDateChange,
    backUrl,
    defaultDate,
}: PFDateToolbarProps) {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState(
        defaultDate || new Date().toISOString().split("T")[0]
    );

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const date = new Date(value);
        date.setDate(date.getDate() + 1); 
        const adjusted = date.toISOString().split("T")[0];

        setSelectedDate(value);  
        onDateChange?.(adjusted);
    };


    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "stretch", sm: "center" },
                justifyContent: "space-between",
                gap: { xs: 2, sm: 0 },
                mb: 3,
            }}
        >
            {/* 🔙 Esquerda: voltar + título */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <IconButton
                    onClick={() => (backUrl ? router.push(backUrl) : router.back())}
                    sx={{ width: 40, height: 40 }}
                >
                    <ArrowLeft size={20} />
                </IconButton>
                <Typography variant="h6">{title}</Typography>
            </Box>

            {/* 📅 Direita: seletor de data + refresh */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "stretch", sm: "center" },
                    gap: 1,
                }}
            >
                <TextField
                    type="date"
                    size="small"
                    label="Data"
                    value={selectedDate}
                    onChange={handleDateChange}
                    sx={{
                        width: { xs: "100%", sm: "auto" },
                        minWidth: { sm: 160 },
                    }}
                />

                {onRefresh && (
                    <Button
                        variant="outlined"
                        startIcon={<RefreshCw size={18} />}
                        onClick={onRefresh}
                        sx={{
                            width: { xs: "100%", sm: "auto" },
                            whiteSpace: "nowrap",
                        }}
                    >
                        Atualizar
                    </Button>
                )}
            </Box>
        </Box>
    );
}
