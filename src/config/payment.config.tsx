import type { FieldDef } from "@/components/crud/PFDrawerModal";
import type { ColumnDef } from "@/components/crud/PFTable";
import type { Payment, PaymentMethod, PaymentStatus } from "@/types/paymentTypes";
import { PaymentMethodLabels, PaymentStatusLabels } from "@/types/paymentTypes";
import { MenuItem, TextField } from "@mui/material";
import CurrencyInput from "@/components/imask/CurrencyInput";

// ----------------------
// Tabela
// ----------------------
export const paymentColumns: ColumnDef<Payment>[] = [
  { key: "id", label: "ID", width: 80 },
  { key: "clientName", label: "Nome do Cliente" },
  { key: "status", label: "Status", render: (row) => PaymentStatusLabels[row.status] },
  { key: "total", label: "Total", render: (row) => row.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) },
  { key: "paidAmount", label: "Pago", render: (row) => row.paidAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) },
];

// ----------------------
// Formulário
// ----------------------
export const paymentFields: FieldDef<Payment>[] = [
  {
    name: "method",
    label: "Método de Pagamento",
    component: ({ value, onChange }) => (
      <TextField
        select
        fullWidth
        size="small"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value as PaymentMethod)}
      >
        {Object.entries(PaymentMethodLabels).map(([key, label]) => (
          <MenuItem key={key} value={key}>
            {label}
          </MenuItem>
        ))}
      </TextField>
    ),
  },
  {
    name: "status",
    label: "Status",
    component: ({ value, onChange }) => (
      <TextField
        select
        fullWidth
        size="small"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value as PaymentStatus)}
      >
        {Object.entries(PaymentStatusLabels).map(([key, label]) => (
          <MenuItem key={key} value={key}>
            {label}
          </MenuItem>
        ))}
      </TextField>
    ),
  },
  {
    name: "total",
    label: "Valor Total",
    component: ({ value, onChange }) => (
      <CurrencyInput
        fullWidth
        size="small"
        label=""
        value={typeof value === "number" ? value : 0}
        onChange={(val) => onChange(val)}
      />
    ),
  },
  {
    name: "discount",
    label: "Desconto",
    component: ({ value, onChange }) => (
      <CurrencyInput
        fullWidth
        size="small"
        label=""
        value={typeof value === "number" ? value : 0}
        onChange={(val) => onChange(val)}
      />
    ),
  },
  {
    name: "downPayment",
    label: "Entrada",
    component: ({ value, onChange }) => (
      <CurrencyInput
        fullWidth
        size="small"
        label=""
        value={typeof value === "number" ? value : 0}
        onChange={(val) => onChange(val)}
      />
    ),
  },
  {
    name: "installmentsTotal",
    label: "Qtd Parcelas",
    component: ({ value, onChange }) => (
      <TextField
        type="number"
        fullWidth
        size="small"
        value={value ?? ""}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
      />
    ),
  },
  {
    name: "firstDueDate",
    label: "Data 1ª Parcela",
    component: ({ value, onChange }) => (
      <TextField
        fullWidth
        size="small"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    ),
  },
];
