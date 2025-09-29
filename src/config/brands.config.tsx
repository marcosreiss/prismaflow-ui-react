import type { ColumnDef } from "@/components/crud/PFTable";
import type { Brand } from "@/types/brandTypes";
import type { FieldDef } from "@/components/crud/PFDrawerModal";
import { TextField, Switch, FormControlLabel } from "@mui/material";

export const brandColumns: ColumnDef<Brand>[] = [
  { key: "id", label: "ID", width: 80 },
  { key: "name", label: "Nome" },
  {
    key: "isActive",
    label: "Ativo",
    render: (row) => (row.isActive ? "Sim" : "Não"),
  },
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
  // {
  //   name: "isActive",
  //   label: "Ativo",
  //   component: ({ value, onChange }) => (
  //     <FormControlLabel
  //       control={
  //         <Switch
  //           checked={Boolean(value)}
  //           onChange={(e) => onChange(e.target.checked)}
  //         />
  //       }
  //       label="Ativo"
  //     />
  //   ),
  // },
];
