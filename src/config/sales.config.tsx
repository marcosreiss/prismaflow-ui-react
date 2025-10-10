// import type { ColumnDef } from "@/components/crud/PFTable";
// import type { Sale } from "@/types/saleTypes";

// export const saleColumns: ColumnDef<Sale>[] = [
//     {
//         key: "id",
//         label: "ID",
//         width: 80,
//         render: (row) => row.id || "-"
//     },
//     {
//         key: "clientName",
//         label: "Cliente",
//         render: (row) => row.clientName || "-"
//     },
//     {
//         key: "total",
//         label: "Total",
//         render: (row) => `R$ ${row.total?.toFixed(2) || "0,00"}`,
//     },
//     {
//         key: "createdAt",
//         label: "Data",
//         render: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString('pt-BR') : "-",
//     },
// ];