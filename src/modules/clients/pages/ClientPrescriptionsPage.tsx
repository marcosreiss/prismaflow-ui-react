import { useState } from "react";
import { useParams } from "react-router-dom";
import { Paper } from "@mui/material";

import PFTable, { type ColumnDef } from "@/components/crud/PFTable";
import PFTopToolbar from "@/components/crud/PFTopToolbar";
import PFConfirmDialog from "@/components/crud/PFConfirmDialog";
import { useNotification } from "@/context/NotificationContext";

import PrescriptionModal from "@/modules/clients/components/PrescriptionModal";
import {
    useGetPrescriptionsByClientId,
    useDeletePrescription,
} from "@/modules/clients/hooks/usePrescription";

import type { Prescription } from "@/modules/clients/types/prescriptionTypes";

export default function ClientPrescriptionsPage() {
    const { id } = useParams<{ id: string }>();
    const clientId = Number(id);

    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);
    const [selectedPrescription, setSelectedPrescription] =
        useState<Prescription | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("view");
    const [confirmDelete, setConfirmDelete] = useState(false);

    const { addNotification } = useNotification();

    const { data, isLoading, isFetching, refetch } =
        useGetPrescriptionsByClientId({
            clientId,
            page: page + 1,
            limit,
        });

    const deletePrescription = useDeletePrescription();

    const prescriptions = data?.data?.content ?? [];
    const total = data?.data?.totalElements ?? 0;

    const handleOpenModal = (
        mode: "create" | "edit" | "view",
        prescription?: Prescription | null
    ) => {
        setModalMode(mode);
        setSelectedPrescription(prescription ?? null);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedPrescription(null);
    };

    const handleDelete = async () => {
        if (!selectedPrescription) return;

        try {
            const res = await deletePrescription.mutateAsync(selectedPrescription.id);
            addNotification(res.message, "success");
            setConfirmDelete(false);
            handleCloseModal();
            refetch();
        } catch {
            addNotification("Erro ao excluir receita.", "error");
        }
    };

    const columns: ColumnDef<Prescription>[] = [
        { key: "id", label: "ID", width: 60 },
        { key: "doctorName", label: "Médico" },
        { key: "crm", label: "CRM" },
        {
            key: "frameAndRef",
            label: "Armação e Ref",
            render: (row) => row.frameAndRef || "-",
        },
        {
            key: "lensType",
            label: "Tipo de Lente",
            render: (row) => row.lensType || "-",
        },
        {
            key: "notes",
            label: "Observações",
            render: (row) => row.notes || "-",
        },
        {
            key: "addition",
            label: "Adição",
            render: (row) => row.additionLeft || "-",
        },
        {
            key: "opticalCenter",
            label: "Centro Óptico",
            render: (row) => row.opticalCenterLeft || "-",
        },
        {
            key: "createdAt",
            label: "Criado em",
            render: (row) =>
                new Date(row.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                }),
        },
    ];

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
            <PFTopToolbar
                title="Receitas do Cliente"
                onRefresh={() => refetch()}
                onAdd={() => handleOpenModal("create")}
                addLabel="Nova Receita"
            />

            <PFTable
                columns={columns}
                rows={prescriptions}
                total={total}
                page={page}
                pageSize={limit}
                loading={isLoading || isFetching}
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newLimit) => setLimit(newLimit)}
                getRowId={(row) => row.id}
                onRowClick={(_, row) => handleOpenModal("view", row)}
                onEdit={(row) => handleOpenModal("edit", row)}
                onDelete={(row) => {
                    setSelectedPrescription(row);
                    setConfirmDelete(true);
                }}
            />

            <PrescriptionModal
                open={modalOpen}
                mode={modalMode}
                clientId={clientId}
                prescription={selectedPrescription}
                onClose={handleCloseModal}
                onCreated={(prescription) => {
                    addNotification("Receita criada com sucesso!", "success");
                    handleOpenModal("view", prescription);
                    refetch();
                }}
                onUpdated={(prescription) => {
                    addNotification("Receita atualizada com sucesso!", "success");
                    handleOpenModal("view", prescription);
                    refetch();
                }}
                onEdit={() => handleOpenModal("edit", selectedPrescription)}
                onDelete={(prescription) => {
                    setSelectedPrescription(prescription);
                    setConfirmDelete(true);
                }}
                onCreateNew={() => handleOpenModal("create")}
            />

            <PFConfirmDialog
                open={confirmDelete}
                title="Excluir Receita"
                description={`Deseja realmente excluir esta receita?`}
                onCancel={() => setConfirmDelete(false)}
                onConfirm={handleDelete}
                loading={deletePrescription.isPending}
            />
        </Paper>
    );
}
