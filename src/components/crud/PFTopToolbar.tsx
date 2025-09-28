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
                flexDirection: { xs: "column", sm: "row" }, // empilha só no mobile
                alignItems: { xs: "stretch", sm: "center" },
                justifyContent: "space-between",
                gap: { xs: 2, sm: 0 },
                mb: 3,
            }}
        >
            {/* Esquerda: voltar + título */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <IconButton
                    onClick={() => (backUrl ? router.push(backUrl) : router.back())}
                    sx={{ width: { xs: 40, sm: 36 }, height: { xs: 40, sm: 36 } }}
                >
                    <ArrowLeft size={20} />
                </IconButton>
                <Typography variant="h6">{title}</Typography>
            </Box>

            {/* Direita: search + refresh + add */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "stretch", sm: "center" },
                    gap: 1,
                    width: { xs: "100%", sm: "auto" },
                    mt: { xs: 2, sm: 0 },
                }}
            >
                {onSearch && (
                    <TextField
                        size="small"
                        placeholder="Pesquisar..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        fullWidth={false} // não expande no desktop
                        sx={{
                            width: { xs: "100%", sm: "auto" },
                            minWidth: { sm: 200 },
                        }}
                    />
                )}

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

                {onAdd && (
                    <Button
                        variant="contained"
                        startIcon={<Plus size={18} />}
                        onClick={onAdd}
                        sx={{
                            width: { xs: "100%", sm: "auto" },
                            whiteSpace: "nowrap",
                        }}
                    >
                        {addLabel}
                    </Button>
                )}
            </Box>
        </Box>
    );
}
