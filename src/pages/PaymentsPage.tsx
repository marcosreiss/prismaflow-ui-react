import { Paper } from "@mui/material";
import PFTopToolbar from "@/components/crud/PFTopToolbar";
import PFTable from "@/components/crud/PFTable";
import PFDrawerModal from "@/components/crud/PFDrawerModal";
import PFConfirmDialog from "@/components/crud/PFConfirmDialog";

import type { Payment } from "@/types/paymentTypes";
import { usePaymentsPage } from "@/hooks/payment/usePaymentsPage";
import PaymentView from "@/components/paymentPageCustom/PaymentView";

export default function PaymentsPage() {
    const TITLE = "Pagamento";
    const ADD_LABEL = "Adicionar novo pagamento";

    const {
        drawerOpen,
        drawerMode,
        selectedId,
        confirmOpen,
        selectedItem,
        columns,
        fields,
        openDrawer,
        closeDrawer,
        handleAskDelete,
        handleDeleteConfirm,
        handleSubmit,
        data,
        total,
        isLoading,
        isFetching,
        page,
        setPage,
        size,
        setSize,
        setSearch,
        refetch,
        creating,
        updating,
        removing,
        setConfirmOpen,
        setSelectedId,
    } = usePaymentsPage(TITLE);

    return (
        <Paper sx={{ borderRadius: 2, p: 3 }}>
            <PFTopToolbar
                title={TITLE}
                addLabel={ADD_LABEL}
                onSearch={setSearch}
                onRefresh={refetch}
            />

            <PFTable<Payment>
                columns={columns}
                rows={data}
                loading={isLoading || isFetching}
                total={total}
                page={page}
                pageSize={size}
                onPageChange={setPage}
                onPageSizeChange={setSize}
                onView={(row) => openDrawer("view", row.id)}
                onEdit={(row) => openDrawer("edit", row.id)}
                onDelete={handleAskDelete}
            />

            <PFDrawerModal<Payment>
                key={`${drawerMode}-${selectedId ?? "new"}`}
                open={drawerOpen}
                mode={drawerMode}
                title={
                    drawerMode === "create"
                        ? `Novo ${TITLE}`
                        : drawerMode === "edit"
                            ? `Editar ${TITLE}`
                            : `Detalhes do ${TITLE}`
                }
                data={selectedItem}
                fields={fields}
                onClose={closeDrawer}
                onSubmit={handleSubmit}
                creating={creating}
                updating={updating}
                renderView={(p) => <PaymentView payment={p} />}
                ModalPropsOverride={{ onExited: () => setSelectedId(null) }}
            />

            <PFConfirmDialog
                open={confirmOpen}
                title={`Excluir ${TITLE}`}
                description={`Tem certeza que deseja excluir este ${TITLE.toLowerCase()}?`}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleDeleteConfirm}
                loading={removing}
            />
        </Paper>
    );
}
