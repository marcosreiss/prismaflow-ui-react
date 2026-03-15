import { useState } from "react";
import { Paper, Button, Stack } from "@mui/material";
import PFTable, { type ColumnDef } from "@/components/crud/PFTable";
import formatDateBR from "@/utils/format-date";
import PFDateToolbar from "../components/PFDateToolbar";

import ExpiringPrescriptionMessageModal from "../components/ExpiringPrescriptionMessageModal";
import PrescriptionModal from "../components/prescriptionModal/PrescriptionModal";

import type {
    ExpiringPrescription,
    Prescription,
} from "../types/prescriptionTypes";
import { useGetExpiringPrescriptions } from "../hooks/usePrescription";

// ==============================
// 👓 Página de Receitas Vencidas (Atualizada)
// ==============================
export default function ExpiringPrescriptionsPage() {
    // ==============================
    // 🔹 Estados
    // ==============================
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(50);
    const [selectedPrescription, setSelectedPrescription] =
        useState<ExpiringPrescription | null>(null);
    const [messageModalOpen, setMessageModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [date, setDate] = useState(() => {
        const now = new Date();
        return now.toISOString().split("T")[0];
    });

    // ==============================
    // 🔹 Dados
    // ==============================
    const { data, isLoading, isFetching, refetch } = useGetExpiringPrescriptions({
        page: page + 1,
        limit,
        date,
    });

    const prescriptions = data?.data?.content || [];
    const total = data?.data?.totalElements || 0;

    // ==============================
    // 🔹 Colunas da tabela (mantidas simples)
    // ==============================
    const columns: ColumnDef<ExpiringPrescription>[] = [
        { key: "clientName", label: "Cliente" },
        { key: "phone01", label: "Telefone", render: (row) => row.phone01 ?? "-" },
        {
            key: "prescriptionDate",
            label: "Data da Receita",
            render: (row) => formatDateBR(row.prescriptionDate),
        },
        {
            key: "doctorName",
            label: "Médico",
            render: (row) => row.doctorName ?? "-",
        },
        {
            key: "actions",
            label: "Ações",
            render: (row) => (
                <Stack direction="row" spacing={1}>
                    <Button size="small" variant="outlined" onClick={() => handleView(row)}>
                        Ver Detalhes
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => handleSendMessage(row)}
                    >
                        Mandar Mensagem
                    </Button>
                </Stack>
            ),
        },
    ];

    // ==============================
    // 🔹 Handlers
    // ==============================
    const handleSendMessage = (prescription: ExpiringPrescription) => {
        setSelectedPrescription(prescription);
        setMessageModalOpen(true);
    };

    const handleView = (prescription: ExpiringPrescription) => {
        setSelectedPrescription(prescription);
        setViewModalOpen(true);
    };

    const handleCloseMessageModal = () => {
        setMessageModalOpen(false);
        setSelectedPrescription(null);
    };

    const handleCloseViewModal = () => {
        setViewModalOpen(false);
        setSelectedPrescription(null);
    };

    // ==============================
    // 🔹 Conversão para novo modelo Prescription
    // ==============================
    const viewPrescription: Prescription | undefined = selectedPrescription
        ? {
            id: selectedPrescription.id,
            clientId: selectedPrescription.clientId,
            prescriptionDate: selectedPrescription.prescriptionDate,
            doctorName: selectedPrescription.doctorName ?? null,
            crm: selectedPrescription.crm ?? null,

            // OD - Longe
            odSphericalFar: selectedPrescription.odSphericalFar ?? null,
            odCylindricalFar: selectedPrescription.odCylindricalFar ?? null,
            odAxisFar: selectedPrescription.odAxisFar ?? null,
            odDnpFar: selectedPrescription.odDnpFar ?? null,

            // OD - Perto
            odSphericalNear: selectedPrescription.odSphericalNear ?? null,
            odCylindricalNear: selectedPrescription.odCylindricalNear ?? null,
            odAxisNear: selectedPrescription.odAxisNear ?? null,
            odDnpNear: selectedPrescription.odDnpNear ?? null,

            // OE - Longe
            oeSphericalFar: selectedPrescription.oeSphericalFar ?? null,
            oeCylindricalFar: selectedPrescription.oeCylindricalFar ?? null,
            oeAxisFar: selectedPrescription.oeAxisFar ?? null,
            oeDnpFar: selectedPrescription.oeDnpFar ?? null,

            // OE - Perto
            oeSphericalNear: selectedPrescription.oeSphericalNear ?? null,
            oeCylindricalNear: selectedPrescription.oeCylindricalNear ?? null,
            oeAxisNear: selectedPrescription.oeAxisNear ?? null,
            oeDnpNear: selectedPrescription.oeDnpNear ?? null,

            // Películas
            odPellicleFar: selectedPrescription.odPellicleFar ?? null,
            odPellicleNear: selectedPrescription.odPellicleNear ?? null,
            oePellicleFar: selectedPrescription.oePellicleFar ?? null,
            oePellicleNear: selectedPrescription.oePellicleNear ?? null,

            // Gerais
            frameAndRef: selectedPrescription.frameAndRef ?? null,
            lensType: selectedPrescription.lensType ?? null,
            notes: selectedPrescription.notes ?? null,
            additionRight: selectedPrescription.additionRight ?? null,
            additionLeft: selectedPrescription.additionLeft ?? null,
            opticalCenterRight: selectedPrescription.opticalCenterRight ?? null,
            opticalCenterLeft: selectedPrescription.opticalCenterLeft ?? null,
            isActive: selectedPrescription.isActive,
            // required multi-tenant/audit fields
            tenantId: selectedPrescription.tenantId,
            branchId: selectedPrescription.branchId,
            createdAt: selectedPrescription.createdAt,
            updatedAt: selectedPrescription.updatedAt,
        }
        : undefined;

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
                title="Receitas Vencidas"
                onDateChange={(newDate) => {
                    setDate(newDate);
                    setPage(0);
                }}
                onRefresh={() => refetch()}
            />

            {/* 🔹 Tabela */}
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
            />

            {/* 🔹 Modal de mensagem */}
            <ExpiringPrescriptionMessageModal
                open={messageModalOpen}
                onClose={handleCloseMessageModal}
                client={
                    selectedPrescription
                        ? {
                            name: selectedPrescription.clientName,
                            phone01: selectedPrescription.phone01 ?? "",
                            prescriptionDate: selectedPrescription.prescriptionDate,
                        }
                        : null
                }
            />

            {/* 🔹 Modal de visualização */}
            <PrescriptionModal
                open={viewModalOpen}
                mode="view"
                clientId={selectedPrescription?.clientId ?? null}
                prescription={viewPrescription ?? undefined}
                onClose={handleCloseViewModal}
            />
        </Paper>
    );
}
