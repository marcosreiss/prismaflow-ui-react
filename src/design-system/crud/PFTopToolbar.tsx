import { Box, Button, IconButton, TextField, Tooltip } from "@mui/material";
import { ArrowLeft, RefreshCw, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedSearch";

type PFTopToolbarProps = {
    title?: string;
    onBack?: () => void;
    onSearch?: (value: string) => void;
    onRefresh?: () => void;
    onAdd?: () => void;
};

export default function PFTopToolbar({
    title,
    onBack,
    onSearch,
    onRefresh,
    onAdd,
}: PFTopToolbarProps) {
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
                mb: 2,
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {onBack && (
                    <IconButton onClick={onBack}>
                        <ArrowLeft size={18} />
                    </IconButton>
                )}
                {title && <strong>{title}</strong>}
            </Box>

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
                    <Tooltip title="Atualizar">
                        <IconButton onClick={onRefresh}>
                            <RefreshCw size={18} />
                        </IconButton>
                    </Tooltip>
                )}
                {onAdd && (
                    <Button
                        variant="contained"
                        startIcon={<Plus size={16} />}
                        onClick={onAdd}
                    >
                        Adicionar
                    </Button>
                )}
            </Box>
        </Box>
    );
}
