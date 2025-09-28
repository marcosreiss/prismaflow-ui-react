import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { ArrowLeft, RefreshCw, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedSearch";
import { useRouter } from "@/routes/hooks";

type PFTopToolbarProps = {
    title: string;
    onSearch?: (value: string) => void;
    onRefresh?: () => void;
    onAdd?: () => void;
    addLabel?: string; // nome customizável do botão de adicionar
    backUrl?: string;
};

export default function PFTopToolbar({
    title,
    onSearch,
    onRefresh,
    onAdd,
    addLabel = "Adicionar novo",
    backUrl,
}: PFTopToolbarProps) {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebouncedValue(search, 400);

    useEffect(() => {
        if (debouncedSearch !== undefined) {
            onSearch?.(debouncedSearch);
        }
    }, [debouncedSearch, onSearch]);

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 3,
            }}
        >
            {/* Esquerda: voltar + título */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <IconButton onClick={() => (backUrl ? router.push(backUrl) : router.back())}>
                    <ArrowLeft size={20} />
                </IconButton>
                <Typography variant="h6">{title}</Typography>
            </Box>

            {/* Direita: search + refresh + add */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {onSearch && (
                    <TextField
                        size="small"
                        placeholder="Pesquisar..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                )}

                {onRefresh && (
                    <Button variant="outlined" startIcon={<RefreshCw size={18} />} onClick={onRefresh}>
                        Atualizar
                    </Button>
                )}

                {onAdd && (
                    <Button variant="contained" startIcon={<Plus size={18} />} onClick={onAdd}>
                        {addLabel}
                    </Button>
                )}
            </Box>
        </Box>
    );
}
