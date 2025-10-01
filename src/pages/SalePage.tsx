import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PFTopToolbar from "@/components/crud/PFTopToolbar";
import PFTable from "@/components/crud/PFTable";
import { useSale } from "@/hooks/useSale";
import { Paper } from "@mui/material";
import type { Sale } from "@/types/saleTypes";
import { useNotification } from "@/context/NotificationContext";
import { saleColumns } from "@/config/sales.config";
import PFConfirmDialog from "@/components/crud/PFConfirmDialog";

export default function SalesPage() {
    const navigate = useNavigate();

    const {
        list: { data, total, isLoading, isFetching, page, setPage, size, setSize, setSearch, refetch, error: listError },
        remove,
        removing
    } = useSale();

    const { addNotification } = useNotification();

    const saleListData: Sale[] = data || [];

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

    const handleCreate = () => navigate("/sales/new");
    const handleView = (row: Sale) => navigate(`/sales/${row.id}`);
    const handleEdit = (row: Sale) => navigate(`/sales/edit/${row.id}`);

    const handleDelete = (row: Sale) => {
        setSelectedSale(row);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedSale) return;
        try {
            await remove(selectedSale.id);
            addNotification("Venda excluída com sucesso!", "success");
            refetch(); // atualiza lista
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.log(err);
            
            addNotification(err?.response.data.message || "Erro ao excluir a venda.", "error");
        } finally {
            setDeleteDialogOpen(false);
            setSelectedSale(null);
        }
    };

    useEffect(() => {
        if (listError) addNotification("Erro ao carregar a lista de vendas.", "error");
    }, [listError, addNotification]);

    return (
        <Paper
            sx={{
                borderRadius: 2,
                borderColor: "grey.200",
                backgroundColor: "background.paper",
                p: 3,
            }}
        >
            <PFTopToolbar
                title="Vendas"
                addLabel="Nova Venda"
                onSearch={(val) => setSearch(val)}
                onRefresh={() => refetch()}
                onAdd={handleCreate}
            />

            <PFTable<Sale>
                columns={saleColumns}
                rows={saleListData}
                loading={isLoading || isFetching}
                total={total}
                page={page}
                pageSize={size}
                onPageChange={setPage}
                onPageSizeChange={setSize}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Dialog de confirmação */}
            <PFConfirmDialog
                open={deleteDialogOpen}
                title="Confirmar exclusão"
                description={`Deseja realmente excluir a venda #${selectedSale?.id}?`}
                onCancel={() => setDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                loading={removing}
            />
        </Paper>
    );
}
