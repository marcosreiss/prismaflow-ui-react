import { brandColumns, brandFields } from "@/config/brands.config";
import { useBrand } from "@/modules/brands/useBrand";
import type { Brand } from "@/modules/brands/brandTypes";
import { Box, Typography, Chip, Divider } from "@mui/material";
import { CrudPage } from "./CrudPage";

export default function BrandsPage() {
    return (
        <CrudPage<Brand>
            title="Marca"
            addLabel="Adicionar nova marca"
            columns={brandColumns}
            fields={brandFields}
            useCrudHook={useBrand}
            renderView={(brand) => (
                <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        <Typography variant="h6">{brand.name}</Typography>
                        <Chip
                            size="small"
                            label={brand.isActive ? "Ativa" : "Inativa"}
                            color={brand.isActive ? "success" : "default"}
                            variant={brand.isActive ? "filled" : "outlined"}
                        />
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "140px 1fr",
                            rowGap: 1.5,
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            ID
                        </Typography>
                        <Typography variant="body1">{brand.id}</Typography>

                        <Typography variant="body2" color="text.secondary">
                            Nome
                        </Typography>
                        <Typography variant="body1">{brand.name}</Typography>

                        <Typography variant="body2" color="text.secondary">
                            Status
                        </Typography>
                        <Typography variant="body1">
                            {brand.isActive ? "Sim" : "Não"}
                        </Typography>
                    </Box>
                </Box>
            )}
        />
    );
}
