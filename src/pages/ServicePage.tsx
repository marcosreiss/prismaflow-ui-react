// src/pages/services/ServicesPage.tsx

import { serviceColumns, serviceFields } from "@/config/service.config";
import { useService } from "@/hooks/useService";
import type { Service } from "@/types/serviceTypes";
import { Box, Typography, Chip, Divider } from "@mui/material";
import { CrudPage } from "./CrudPage";

export default function ServicesPage() {
    return (
        <CrudPage<Service>
            title="Serviços"
            addLabel="Adicionar novo serviço"
            columns={serviceColumns}
            fields={serviceFields}
            useCrudHook={useService}
            renderView={(service) => (
                <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        <Typography variant="h6">{service.name}</Typography>
                        <Chip
                            size="small"
                            label={service.isActive ? "Ativo" : "Inativo"}
                            color={service.isActive ? "success" : "default"}
                            variant={service.isActive ? "filled" : "outlined"}
                        />
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: "grid", gridTemplateColumns: "140px 1fr", rowGap: 1.5 }}>
                        <Typography variant="body2" color="text.secondary">ID</Typography>
                        <Typography variant="body1">{service.id}</Typography>

                        <Typography variant="body2" color="text.secondary">Nome</Typography>
                        <Typography variant="body1">{service.name}</Typography>

                        <Typography variant="body2" color="text.secondary">Descrição</Typography>
                        <Typography variant="body1">{service.description || "-"}</Typography>

                        <Typography variant="body2" color="text.secondary">Preço</Typography>
                        <Typography variant="body1">{service.price}</Typography>
                    </Box>
                </Box>
            )}
        />
    );
}