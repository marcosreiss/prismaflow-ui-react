import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    Skeleton,
    TablePagination,
} from "@mui/material";
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
        <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => (
                                <TableCell
                                    key={String(col.key)}
                                    align={col.align || "left"}
                                    sx={{ width: col.width }}
                                >
                                    <Typography variant="body2" fontWeight={600}>
                                        {col.label}
                                    </Typography>
                                </TableCell>
                            ))}
                            {(onView || onEdit || onDelete) && (
                                <TableCell align="right">
                                    <Typography variant="body2" fontWeight={600}>
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
                                    <Box sx={{ textAlign: "center", py: 4 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Nenhum dado encontrado
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}

                        {/* Linhas de dados */}
                        {!loading &&
                            rows.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {columns.map((col) => (
                                        <TableCell key={String(col.key)} align={col.align || "left"}>
                                            {col.render
                                                ? col.render(row)
                                                : col.key in row
                                                    ? String(row[col.key as keyof T])
                                                    : ""}
                                        </TableCell>
                                    ))}
                                    {(onView || onEdit || onDelete) && (
                                        <TableCell align="right">
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

            {/* Paginação */}
            <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={(_, newPage) => onPageChange(newPage)}
                rowsPerPage={pageSize}
                onRowsPerPageChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
                rowsPerPageOptions={[5, 10, 20, 50]}
            />
        </Paper>
    );
}
