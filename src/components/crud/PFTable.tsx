import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Box,
    Skeleton,
    TablePagination,
    Paper,
    Card,
    CardContent,
    Divider,
} from "@mui/material";
import { Inbox } from "lucide-react";
import PFRowActionsMenu from "./PFRowActionsMenu";

export type ColumnDef<T extends object> = {
    key: keyof T | string;
    label: string;
    width?: number | string;
    align?: "left" | "right" | "center";
    render?: (row: T) => React.ReactNode;
};

type PFTableProps<T extends object> = {
    columns: ColumnDef<T>[];
    rows: T[];
    loading?: boolean;
    total: number;
    page: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    onView?: (row: T) => void;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
};

export default function PFTable<T extends object>({
    columns,
    rows,
    loading = false,
    total,
    page,
    pageSize,
    onPageChange,
    onPageSizeChange,
    onView,
    onEdit,
    onDelete,
}: PFTableProps<T>) {
    return (
        <Paper
            elevation={0}
            sx={{
                borderColor: "grey.200",
                overflow: "hidden",
                p: { xs: 1, sm: 0 },
            }}
        >
            {/* === Tabela (desktop/tablet) === */}
            <TableContainer
                sx={{
                    width: "100%",
                    overflowX: "auto",
                    display: { xs: "none", sm: "block" }, // esconde no mobile
                }}
            >
                <Table
                    size="small"
                    sx={{
                        minWidth: 600,
                        "& th, & td": {
                            whiteSpace: "nowrap",
                            px: { xs: 1, sm: 2 },
                        },
                    }}
                >
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "grey.100" }}>
                            {columns.map((col) => (
                                <TableCell
                                    key={String(col.key)}
                                    align={col.align || "left"}
                                    sx={{ width: col.width, py: 1 }}
                                >
                                    <Typography
                                        variant="caption"
                                        fontWeight={600}
                                        color="text.secondary"
                                        sx={{ textTransform: "uppercase" }}
                                    >
                                        {col.label}
                                    </Typography>
                                </TableCell>
                            ))}
                            {(onView || onEdit || onDelete) && (
                                <TableCell align="right" sx={{ py: 1 }}>
                                    <Typography
                                        variant="caption"
                                        fontWeight={600}
                                        color="text.secondary"
                                        sx={{ textTransform: "uppercase" }}
                                    >
                                        Ações
                                    </Typography>
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {/* Estado de loading */}
                        {loading &&
                            Array.from({ length: pageSize }).map((_, i) => (
                                <TableRow key={`skeleton-${i}`}>
                                    {columns.map((col) => (
                                        <TableCell key={String(col.key)}>
                                            <Skeleton variant="text" />
                                        </TableCell>
                                    ))}
                                    {(onView || onEdit || onDelete) && (
                                        <TableCell>
                                            <Skeleton variant="circular" width={24} height={24} />
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}

                        {/* Estado vazio */}
                        {!loading && rows.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1}>
                                    <Box
                                        sx={{
                                            textAlign: "center",
                                            py: 6,
                                            color: "text.secondary",
                                        }}
                                    >
                                        <Inbox size={32} style={{ marginBottom: 8 }} />
                                        <Typography variant="body2">Nenhum dado encontrado</Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}

                        {/* Linhas de dados */}
                        {!loading &&
                            rows.map((row, rowIndex) => (
                                <TableRow
                                    key={rowIndex}
                                    hover
                                    sx={{
                                        "&:last-child td": { borderBottom: 0 },
                                    }}
                                >
                                    {columns.map((col) => (
                                        <TableCell
                                            key={String(col.key)}
                                            align={col.align || "left"}
                                            sx={{ py: 1.5 }}
                                        >
                                            {col.render
                                                ? col.render(row)
                                                : col.key in row
                                                    ? String(row[col.key as keyof T])
                                                    : ""}
                                        </TableCell>
                                    ))}
                                    {(onView || onEdit || onDelete) && (
                                        <TableCell align="right" sx={{ py: 1.5 }}>
                                            <PFRowActionsMenu
                                                onView={onView ? () => onView(row) : undefined}
                                                onEdit={onEdit ? () => onEdit(row) : undefined}
                                                onDelete={onDelete ? () => onDelete(row) : undefined}
                                            />
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* === Cards (mobile) === */}
            <Box
                sx={{
                    display: { xs: "flex", sm: "none" },
                    flexDirection: "column",
                    gap: 1,
                }}
            >
                {loading &&
                    Array.from({ length: pageSize }).map((_, i) => (
                        <Card key={`skeleton-card-${i}`} variant="outlined">
                            <CardContent>
                                {columns.map((col) => (
                                    <Skeleton key={String(col.key)} variant="text" width="80%" />
                                ))}
                            </CardContent>
                        </Card>
                    ))}

                {!loading && rows.length === 0 && (
                    <Card variant="outlined">
                        <CardContent sx={{ textAlign: "center", color: "text.secondary" }}>
                            <Inbox size={32} style={{ marginBottom: 8 }} />
                            <Typography variant="body2">Nenhum dado encontrado</Typography>
                        </CardContent>
                    </Card>
                )}

                {!loading &&
                    rows.map((row, rowIndex) => (
                        <Card key={`card-${rowIndex}`} variant="outlined">
                            <CardContent>
                                {columns.map((col, j) => (
                                    <Box key={j} sx={{ mb: 1 }}>
                                        <Typography
                                            variant="caption"
                                            fontWeight={600}
                                            color="text.secondary"
                                        >
                                            {col.label}
                                        </Typography>
                                        <Typography variant="body2">
                                            {col.render
                                                ? col.render(row)
                                                : col.key in row
                                                    ? String(row[col.key as keyof T])
                                                    : ""}
                                        </Typography>
                                    </Box>
                                ))}
                                {(onView || onEdit || onDelete) && (
                                    <>
                                        <Divider sx={{ my: 1 }} />
                                        <Box textAlign="right">
                                            <PFRowActionsMenu
                                                onView={onView ? () => onView(row) : undefined}
                                                onEdit={onEdit ? () => onEdit(row) : undefined}
                                                onDelete={onDelete ? () => onDelete(row) : undefined}
                                            />
                                        </Box>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    ))}
            </Box>

            {/* Paginação */}
            <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={(_, newPage) => onPageChange(newPage)}
                rowsPerPage={pageSize}
                onRowsPerPageChange={(e) =>
                    onPageSizeChange(parseInt(e.target.value, 10))
                }
                rowsPerPageOptions={[5, 10, 20, 50]}
                sx={{
                    borderTop: "1px solid",
                    borderColor: "grey.200",
                    px: { xs: 1, sm: 2 },
                    ".MuiTablePagination-toolbar": {
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "flex-start", sm: "center" },
                        gap: { xs: 1, sm: 0 },
                    },
                }}
            />
        </Paper>
    );
}
