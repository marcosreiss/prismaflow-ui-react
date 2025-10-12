import { useState } from "react";
import { Paper } from "@mui/material";
import PFTable, { type ColumnDef } from "@/components/crud/PFTable";
import BirthdayMessageModal from "../components/BirthdayMessageModal";
import type { Client } from "../types/clientTypes";
import { useGetBirthdays } from "../hooks/useClient";
import PFDateToolbar from "../components/PFDateToolbar";

// ==============================
// 🎂 Página de Aniversariantes
// ==============================
export default function ClientsBirthdaysPage() {
    // ==============================
    // 🔹 Estados
    // ==============================
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(50);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [date, setDate] = useState(() => {
        const now = new Date();
        now.setDate(now.getDate() + 1);
        return now.toISOString().split("T")[0];
    });


    // ==============================
    // 🔹 Dados
    // ==============================
    const { data, isLoading, isFetching, refetch } = useGetBirthdays({
        page: page + 1,
        limit,
        date, // ← data selecionada
    });

    const clients = data?.data?.content || [];
    const total = data?.data?.totalElements || 0;

    // ==============================
    // 🔹 Colunas da tabela
    // ==============================
    const columns: ColumnDef<Client>[] = [
        { key: "name", label: "Nome" },
        {
            key: "phone01",
            label: "Telefone",
            render: (row) => row.phone01 ?? "-",
        },
        {
            key: "bornDate",
            label: "Data de Nascimento",
            render: (row) =>
                row.bornDate
                    ? new Date(row.bornDate).toLocaleDateString("pt-BR")
                    : "-",
        },
    ];

    // ==============================
    // 🔹 Handlers
    // ==============================
    const handleRowClick = (_id: string | number, client: Client) => {
        setSelectedClient(client);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedClient(null);
        setModalOpen(false);
    };

    // ==============================
    // 🔹 Render
    // ==============================
    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 2,
                borderColor: "grey.200",
                backgroundColor: "background.paper",
                p: 3,
            }}
        >
            {/* 🔹 Toolbar com seletor de data */}
            <PFDateToolbar
                title="Aniversariantes"
                onDateChange={(newDate) => {
                    setDate(newDate);
                    setPage(0);
                }}
                onRefresh={() => refetch()}
            />

            {/* 🔹 Tabela */}
            <PFTable
                columns={columns}
                rows={clients}
                total={total}
                page={page}
                pageSize={limit}
                loading={isLoading || isFetching}
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newLimit) => setLimit(newLimit)}
                getRowId={(row) => row.id}
                onRowClick={(_, row) => handleRowClick(row.id, row)}
            />

            {/* 🔹 Modal de mensagem */}
            <BirthdayMessageModal
                open={modalOpen}
                onClose={handleCloseModal}
                client={
                    selectedClient
                        ? {
                            name: selectedClient.name,
                            phone01: selectedClient.phone01 ?? "",
                        }
                        : null
                }
            />
        </Paper>
    );
}
