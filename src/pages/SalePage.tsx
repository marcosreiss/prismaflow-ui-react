import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PFTopToolbar from "@/components/crud/PFTopToolbar";
import PFTable from "@/components/crud/PFTable";
import { useSale } from "@/hooks/useSale";
import { Paper } from "@mui/material";
import type { Sale } from "@/types/saleTypes";
import { useNotification } from "@/context/NotificationContext";
import { saleColumns } from "@/config/sales.config";

export default function SalesPage() {
    const navigate = useNavigate();

    const {
        list: { data, total, isLoading, isFetching, page, setPage, size, setSize, setSearch, refetch, error: listError },
    } = useSale();

    const { addNotification } = useNotification();

    // Usar o array direto de vendas
    const saleListData: Sale[] = data || [];

    const handleCreate = () => {
        navigate("/sales/new");
    };

    const handleView = (row: Sale) => {
        navigate(`/sales/${row.id}`); // ← Assim vai funcionar
    };

    const handleEdit = (row: Sale) => {
        navigate(`/sales/edit/${row.id}`); // ← Assim vai funcionar`);
    };

    const handleDelete = (row: Sale) => {
        // Implementar lógica de delete se necessário
        console.log("Delete sale:", row.id);
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
        </Paper>
    );
}