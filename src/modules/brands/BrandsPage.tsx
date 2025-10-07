import { useState } from "react";
import { Paper } from "@mui/material";
import { useNotification } from "@/context/NotificationContext";
import PFConfirmDialog from "@/components/crud/PFConfirmDialog";
import PFTable, { type ColumnDef } from "@/components/crud/PFTable";
import PFTopToolbar from "@/components/crud/PFTopToolbar";
import BrandDrawer from "./BrandDrawer";
import type { ApiResponse } from "@/types/apiResponse";
import type { AxiosError } from "axios";
import type { Brand } from "./brandTypes";
import { useGetBrands, useDeleteBrand } from "./useBrand";




export default function BrandsPage() {
    // ==========================
    // 🔹 Estados locais
    // ==========================
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);
    const [search, setSearch] = useState("");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState<"create" | "edit" | "view">("view");
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const { addNotification } = useNotification();

    // ==========================
    // 🔹 Hooks de dados
    // ==========================
    const { data, isLoading, refetch } = useGetBrands({
        page: page + 1, // API é base-1
        limit,
        search,
    });

    const deleteBrand = useDeleteBrand();

    // ==========================
    // 🔹 Colunas da tabela
    // ==========================
    const columns: ColumnDef<Brand>[] = [
        { key: "id", label: "ID", width: 80 },
        { key: "name", label: "Nome" },
        {
            key: "isActive",
            label: "Ativo",
            render: (row) => (row.isActive ? "Sim" : "Não"),
        },
        {
            key: "createdBy",
            label: "Criado por",
            render: (row) => row.createdBy?.name ?? "-",
        },
    ];

    // ==========================
    // 🔹 Handlers
    // ==========================
    const handleOpenDrawer = (
        mode: "create" | "edit" | "view",
        brand?: Brand | null
    ) => {
        setDrawerMode(mode);
        setSelectedBrand(brand ?? null);
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setSelectedBrand(null);
    };

    const handleDelete = async () => {
        if (!selectedBrand) return;

        try {
            const res = await deleteBrand.mutateAsync(selectedBrand.id);
            addNotification(res.message, "success");
            setConfirmDelete(false);
            handleCloseDrawer();
            refetch();
        } catch (err) {
            const axiosErr = err as AxiosError<ApiResponse<null>>;
            const message = axiosErr.response?.data?.message ?? "Erro ao excluir marca.";
            addNotification(message, "error");
        }
    };

    // ==========================
    // 🔹 Dados de tabela
    // ==========================
    const brands = data?.data?.content ?? [];
    const total = data?.data?.totalElements ?? 0;

    // ==========================
    // 🔹 Render
    // ==========================
    return (
        <Paper
            elevation={0}
            sx={{ borderRadius: 2, borderColor: "grey.200", backgroundColor: "background.paper", p: 3 }}
        >
            {/* Top Toolbar */}
            <PFTopToolbar
                title="Marcas"
                onSearch={(value) => setSearch(value)}
                onRefresh={() => refetch()}
                onAdd={() => handleOpenDrawer("create")}
                addLabel="Nova marca"
            />

            {/* Tabela */}
            <PFTable
                columns={columns}
                rows={brands}
                total={total}
                page={page}
                pageSize={limit}
                loading={isLoading}
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newLimit) => setLimit(newLimit)}
                getRowId={(row) => row.id}
                onRowClick={(_, row) => handleOpenDrawer("view", row)}
                onEdit={(row) => handleOpenDrawer("edit", row)}
                onDelete={(row) => {
                    setSelectedBrand(row);
                    setConfirmDelete(true);
                }}
            />

            {/* Drawer de marca */}
            <BrandDrawer
                open={drawerOpen}
                mode={drawerMode}
                brand={selectedBrand}
                onClose={handleCloseDrawer}
                onEdit={() => handleOpenDrawer("edit", selectedBrand)}
                onDelete={(brand) => {
                    setSelectedBrand(brand);
                    setConfirmDelete(true);
                }}
                onCreated={(brand) => {
                    addNotification("Marca criada com sucesso!", "success");
                    handleOpenDrawer("view", brand);
                    refetch();
                }}
                onUpdated={(brand) => {
                    addNotification("Marca atualizada com sucesso!", "success");
                    handleOpenDrawer("view", brand);
                    refetch();
                }}
            />

            {/* Confirmação de exclusão */}
            <PFConfirmDialog
                open={confirmDelete}
                title="Excluir marca"
                description={`Deseja realmente excluir a marca "${selectedBrand?.name}"?`}
                onCancel={() => setConfirmDelete(false)}
                onConfirm={handleDelete}
                loading={deleteBrand.isPending}
            />
        </Paper>
    );
}
