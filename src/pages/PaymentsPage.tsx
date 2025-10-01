import { Paper } from "@mui/material";
import PFTopToolbar from "@/components/crud/PFTopToolbar";
import PFTable from "@/components/crud/PFTable";
import PFConfirmDialog from "@/components/crud/PFConfirmDialog";

import type { Payment } from "@/types/paymentTypes";
import { usePaymentsPage } from "@/hooks/payment/usePaymentsPage";
import PaymentEditDrawer from "@/components/paymentPageCustom/PaymentEditDrawer";
import PaymentViewDrawer from "@/components/paymentPageCustom/PaymentViewDrawer";

export default function PaymentsPage() {
  const TITLE = "Pagamento";

  const {
    drawerOpen,
    drawerMode,
    confirmOpen,
    selectedItem,
    columns,
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
    updating,
    removing,
    setConfirmOpen,
  } = usePaymentsPage(TITLE);

  return (
    <Paper sx={{ borderRadius: 2, p: 3 }}>
      <PFTopToolbar
        title={TITLE}
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

      {/* Drawer de Visualização */}
      {drawerMode === "view" && (
        <PaymentViewDrawer
          open={drawerOpen}
          onClose={closeDrawer}
          data={selectedItem ?? undefined}
        />
      )}

      {/* Drawer de Edição */}
      {drawerMode === "edit" && (
        <PaymentEditDrawer
          open={drawerOpen}
          onClose={closeDrawer}
          data={selectedItem ?? undefined}
          updating={updating}
          onSubmit={handleSubmit}
        />
      )}

      {/* Confirmação de exclusão */}
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
