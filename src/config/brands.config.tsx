import type { ColumnDef } from "@/components/crud/PFTable";
import type { Brand } from "@/types/brandTypes";
import type { FieldDef } from "@/components/crud/PFDrawerModal";
import { TextField } from "@mui/material";

export const brandColumns: ColumnDef<Brand>[] = [
  { key: "id", label: "ID", width: 80 },
  { key: "name", label: "Nome" },
];

export const brandFields: FieldDef<Brand>[] = [
  {
    name: "name",
    label: "Nome",
    component: ({ value, onChange }) => (
      <TextField
        fullWidth
        size="small"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    ),
  },
];
