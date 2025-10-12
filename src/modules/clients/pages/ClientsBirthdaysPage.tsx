import PFTable from "@/components/crud/PFTable";
import PFTopToolbar from "@/components/crud/PFTopToolbar";
import { Box } from "lucide-react";
import Container from "@mui/material/Container";
import { useState } from "react";
import BirthdayMessageModal from "../components/BirthdayMessageModal";
import { useGetBirthdays } from "../hooks/useClient";
import type { Client } from "../types/clientTypes";

export default function ClientsBirthdaysPage() {
    // =============================
    // 📦 Estados
    // =============================
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(50);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [openModal, setOpenModal] = useState(false);

    // =============================
    // 🔄 Dados
    // =============================
    const { data, isLoading, refetch } = useGetBirthdays({
        page: page + 1,
        limit,
    });
    const rows = data?.data?.content || [];
    const total = data?.data?.totalElements || 0;

    // =============================
    // 📋 Colunas da tabela
    // =============================
    const columns = [
        {
            key: "name",
            label: "Nome",
        },
        {
            key: "phone01",
            label: "Telefone",
        },
        {
            key: "bornDate",
            label: "Data de Nascimento",
            render: (row: Client) =>
                row.bornDate
                    ? new Date(row.bornDate).toLocaleDateString("pt-BR")
                    : "-",
        },
    ];

    // =============================
    // 🧠 Handlers
    // =============================
    const handleRowClick = (_id: string | number, client: Client) => {
        setSelectedClient(client);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setSelectedClient(null);
        setOpenModal(false);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            {/* ============================= */}
            {/* 🔹 Toolbar */}
            {/* ============================= */}
            <PFTopToolbar
                title="Aniversariantes do Dia"
                onRefresh={refetch}
                backUrl="/app/dashboard"
            />

            {/* ============================= */}
            {/* 🔹 Tabela */}
            {/* ============================= */}
            <Box>
                <PFTable
                    columns={columns}
                    rows={rows}
                    loading={isLoading}
                    total={total}
                    page={page}
                    pageSize={limit}
                    onPageChange={setPage}
                    onPageSizeChange={setLimit}
                    onRowClick={handleRowClick}
                    getRowId={(row: Client) => row.id}
                />
            </Box>

            {/* ============================= */}
            {/* 🔹 Modal de Mensagem */}
            {/* ============================= */}
            <BirthdayMessageModal
                open={openModal}
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
        </Container>
    );
}
