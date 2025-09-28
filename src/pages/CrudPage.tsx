/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Paper } from "@mui/material";
import PFTopToolbar from "@/components/crud/PFTopToolbar";
import PFTable from "@/components/crud/PFTable";
import PFDrawerModal from "@/components/crud/PFDrawerModal";
import PFConfirmDialog from "@/components/crud/PFConfirmDialog";
import { useNotification } from "@/context/NotificationContext";
import type { ColumnDef } from "@/components/crud/PFTable";
import type { FieldDef } from "@/components/crud/PFDrawerModal";
import type { FieldValues } from "react-hook-form";

type CrudPageProps<T extends FieldValues & { id: number }> = {
    title: string;
    addLabel: string;
    columns: ColumnDef<T>[];
    fields: FieldDef<T>[];
    useCrudHook: (id: number | null) => {
        list: {
            data: T[];
            total: number;
            isLoading: boolean;
            isFetching: boolean;
            page: number;
            setPage: (page: number) => void;
            size: number;
            setSize: (size: number) => void;
            setSearch: (val: string) => void;
            refetch: () => void;
            error?: unknown;
        };
        detail: any;
        create: (data: Partial<T>) => Promise<any>;
        update: (data: { id: number; data: Partial<T> }) => Promise<any>;
        remove: (id: number) => Promise<any>;
        creating: boolean;
        updating: boolean;
        removing: boolean;
    };
    renderView?: (item: T) => React.ReactNode;
};

export function CrudPage<T extends FieldValues & { id: number }>({
    title,
    addLabel,
    columns,
    fields,
    useCrudHook,
    renderView,
}: CrudPageProps<T>) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState<"create" | "edit" | "view">("view");
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const {
        list: {
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
            error: listError,
        },
        detail,
        create,
        update,
        remove,
        creating,
        updating,
        removing,
    } = useCrudHook(selectedId);

    const { addNotification } = useNotification();

    const selectedItem: T | null =
        drawerMode === "create"
            ? null
            : detail.isLoading || (detail.data as T | undefined)?.id !== selectedId
                ? null
                : (detail.data as T | undefined) ?? null;

    const handleOpenCreate = () => {
        setDrawerMode("create");
        setSelectedId(null);
        setDrawerOpen(true);
    };
    const handleOpenView = (row: T) => {
        setDrawerMode("view");
        setSelectedId(row.id);
        setDrawerOpen(true);
    };
    const handleOpenEdit = (row: T) => {
        setDrawerMode("edit");
        setSelectedId(row.id);
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => setDrawerOpen(false);

    const handleAskDelete = (row: T) => {
        setSelectedId(row.id);
        setConfirmOpen(true);
    };

    const handleCreate = async (values: Partial<T>) => {
        try {
            const res = await create(values);
            addNotification(res?.message || `${title} criado com sucesso.`, "success");
            handleCloseDrawer();
        } catch {
            addNotification(`Erro ao criar ${title.toLowerCase()}.`, "error");
        }
    };

    const handleUpdate = async (id: number, values: Partial<T>) => {
        try {
            const res = await update({ id, data: values });
            addNotification(res?.message || `${title} atualizado com sucesso.`, "success");
            handleCloseDrawer();
        } catch {
            addNotification(`Erro ao atualizar ${title.toLowerCase()}.`, "error");
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedId) return;
        try {
            const res = await remove(selectedId);
            addNotification(res?.message || `${title} excluído com sucesso.`, "success");
            setSelectedId(null);
        } catch {
            addNotification(`Erro ao excluir ${title.toLowerCase()}.`, "error");
        } finally {
            setConfirmOpen(false);
        }
    };

    const handleSubmit = async (values: Partial<T>) => {
        if (drawerMode === "create") return handleCreate(values);
        if (drawerMode === "edit" && selectedId) return handleUpdate(selectedId, values);
    };

    useEffect(() => {
        if (listError) addNotification(`Erro ao carregar lista de ${title.toLowerCase()}.`, "error");
    }, [listError, addNotification, title]);

    return (
        <Paper sx={{ borderRadius: 2, borderColor: "grey.200", backgroundColor: "background.paper", p: 3 }}>
            <PFTopToolbar
                title={title}
                addLabel={addLabel}
                onSearch={(val) => setSearch(val)}
                onRefresh={() => refetch()}
                onAdd={handleOpenCreate}
            />

            <PFTable<T>
                columns={columns}
                rows={data}
                loading={isLoading || isFetching}
                total={total}
                page={page}
                pageSize={size}
                onPageChange={setPage}
                onPageSizeChange={setSize}
                onView={handleOpenView}
                onEdit={handleOpenEdit}
                onDelete={handleAskDelete}
            />

            <PFDrawerModal<T>
                key={`${drawerMode}-${selectedId ?? "new"}`}
                open={drawerOpen}
                mode={drawerMode}
                title={
                    drawerMode === "create"
                        ? `Novo ${title}`
                        : drawerMode === "edit"
                            ? `Editar ${title}`
                            : `Detalhes do ${title}`
                }
                data={selectedItem}
                fields={fields}
                onClose={handleCloseDrawer}
                onSubmit={handleSubmit}
                creating={creating}
                updating={updating}
                renderView={renderView}
                ModalPropsOverride={{ onExited: () => setSelectedId(null) }}
            />

            <PFConfirmDialog
                open={confirmOpen}
                title={`Excluir ${title}`}
                description={`Tem certeza que deseja excluir este ${title.toLowerCase()}?`}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleDeleteConfirm}
                loading={removing}
            />
        </Paper>
    );
}
