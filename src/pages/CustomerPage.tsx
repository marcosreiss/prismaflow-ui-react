// src/pages/customers/CustomersPage.tsx

import { customerColumns, customerFields } from "@/config/customer.config";
import { useCustomer } from "@/hooks/useCustomer";
import type { Customer } from "@/types/customerTypes";
import { Box, Typography, Chip, Divider } from "@mui/material";
import { CrudPage } from "./CrudPage";

export default function CustomersPage() {
    return (
        <CrudPage<Customer>
            title="Clientes"
            addLabel="Adicionar novo cliente"
            columns={customerColumns}
            fields={customerFields}
            useCrudHook={useCustomer}
            renderView={(customer) => (
                <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        <Typography variant="h6">{customer.name}</Typography>
                        <Chip
                            size="small"
                            label={customer.isActive ? "Ativo" : "Inativo"}
                            color={customer.isActive ? "success" : "default"}
                        />
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: "grid", gridTemplateColumns: "140px 1fr", rowGap: 1.5 }}>
                        <Typography variant="body2" color="text.secondary">CPF</Typography>
                        <Typography variant="body1">{customer.cpf || "-"}</Typography>

                        <Typography variant="body2" color="text.secondary">E-mail</Typography>
                        <Typography variant="body1">{customer.email || "-"}</Typography>

                        <Typography variant="body2" color="text.secondary">Telefone</Typography>
                        <Typography variant="body1">{customer.phone01 || "-"}</Typography>

                        <Typography variant="body2" color="text.secondary">Endereço</Typography>
                        <Typography variant="body1">{`${customer.street || ""}, ${customer.number || ""}`}</Typography>
                    </Box>
                </Box>
            )}
        />
    );
}