// import {
//     Drawer,
//     Box,
//     Typography,
//     IconButton,
//     Button,
//     Divider,
//     CircularProgress,
//     TextField,
// } from "@mui/material";
// import { X } from "lucide-react";
// import { useForm, Controller } from "react-hook-form";
// import { useEffect } from "react";
// import type { Payment } from "@/types/paymentTypes";
// import {
//     PaymentMethodLabels,
//     PaymentStatusLabels,
// } from "@/types/paymentTypes";
// import MenuItem from "@mui/material/MenuItem";
// import CurrencyInput from "../imask/CurrencyInput";

// type PaymentEditDrawerProps = {
//     open: boolean;
//     title?: string;
//     data?: Payment | null;
//     updating?: boolean;
//     onClose: () => void;
//     onSubmit: (values: Partial<Payment>) => Promise<void> | void;
// };

// // componente helper para reduzir repetição
// function LabeledField({
//     label,
//     children,
// }: {
//     label: string;
//     children: React.ReactNode;
// }) {
//     return (
//         <Box>
//             <Typography variant="body2" fontWeight="500" mb={0.5}>
//                 {label}
//             </Typography>
//             {children}
//         </Box>
//     );
// }

// export default function PaymentEditDrawer({
//     open,
//     title = "Editar Pagamento",
//     data,
//     updating,
//     onClose,
//     onSubmit,
// }: PaymentEditDrawerProps) {
//     const { control, handleSubmit, watch, setValue, reset } =
//         useForm<Partial<Payment>>({
//             defaultValues: data ?? {
//                 method: "PIX",
//                 status: "PENDING",
//                 total: 0,
//                 discount: 0,
//                 downPayment: 0,
//                 paidAmount: 0,
//             },
//         });

//     // assistir campos
//     const total = watch("total") || 0;
//     const discount = watch("discount") || 0;
//     const downPayment = watch("downPayment") || 0;
//     const paidAmount = watch("paidAmount") || 0;

//     // recalcular total líquido (total - desconto) e atualizar campo total
//     useEffect(() => {
//         const netTotal = (data?.total ?? 0) - discount;
//         if (total !== netTotal) {
//             setValue("total", netTotal, {
//                 shouldValidate: true,
//                 shouldDirty: true,
//             });
//         }
//     }, [discount, data?.total, total, setValue]);

//     // atualizar paidAmount sempre que entrada mudar
//     useEffect(() => {
//         const newPaid = (data?.paidAmount ?? 0) + downPayment;
//         if (paidAmount !== newPaid) {
//             setValue("paidAmount", newPaid, {
//                 shouldValidate: true,
//                 shouldDirty: true,
//             });
//         }
//     }, [downPayment, data?.paidAmount, paidAmount, setValue]);

//     // resetar form ao abrir com dados
//     useEffect(() => {
//         if (open && data) reset(data);
//     }, [open, data, reset]);

//     const submitHandler = handleSubmit(async (values) => {
//         await onSubmit(values);
//         onClose();
//     });

//     return (
//         <Drawer
//             anchor="right"
//             open={open}
//             onClose={onClose}
//             PaperProps={{
//                 sx: { width: { xs: "100%", sm: 480, md: 560 }, p: 3 },
//             }}
//         >
//             {/* Header */}
//             <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
//                 <Typography variant="h6" fontWeight="bold">
//                     {title}
//                 </Typography>
//                 <IconButton onClick={onClose}>
//                     <X size={20} />
//                 </IconButton>
//             </Box>

//             <Divider sx={{ mb: 2 }} />

//             <form onSubmit={submitHandler}>
//                 <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//                     {/* Método */}
//                     <Controller
//                         name="method"
//                         control={control}
//                         render={({ field }) => (
//                             <LabeledField label="Método de Pagamento">
//                                 <TextField {...field} select fullWidth size="small">
//                                     {Object.entries(PaymentMethodLabels).map(([key, label]) => (
//                                         <MenuItem key={key} value={key}>
//                                             {label}
//                                         </MenuItem>
//                                     ))}
//                                 </TextField>
//                             </LabeledField>
//                         )}
//                     />

//                     {/* Status */}
//                     <Controller
//                         name="status"
//                         control={control}
//                         render={({ field }) => (
//                             <LabeledField label="Status">
//                                 <TextField {...field} select fullWidth size="small">
//                                     {Object.entries(PaymentStatusLabels).map(([key, label]) => (
//                                         <MenuItem key={key} value={key}>
//                                             {label}
//                                         </MenuItem>
//                                     ))}
//                                 </TextField>
//                             </LabeledField>
//                         )}
//                     />

//                     {/* Total (já líquido) */}
//                     <Controller
//                         name="total"
//                         control={control}
//                         render={({ field }) => (
//                             <LabeledField label="Valor Total">
//                                 <CurrencyInput
//                                     fullWidth
//                                     size="small"
//                                     disabled
//                                     value={field.value ?? 0}
//                                     onChange={(v) => field.onChange(v)}
//                                 />
//                             </LabeledField>
//                         )}
//                     />

//                     {/* Desconto */}
//                     <Controller
//                         name="discount"
//                         control={control}
//                         render={({ field }) => (
//                             <LabeledField label="Desconto">
//                                 <CurrencyInput
//                                     fullWidth
//                                     size="small"
//                                     value={field.value ?? 0}
//                                     onChange={(v) => field.onChange(v)}
//                                 />
//                             </LabeledField>
//                         )}
//                     />

//                     {/* Entrada */}
//                     <Controller
//                         name="downPayment"
//                         control={control}
//                         render={({ field }) => (
//                             <LabeledField label="Entrada">
//                                 <CurrencyInput
//                                     fullWidth
//                                     size="small"
//                                     value={field.value ?? 0}
//                                     onChange={(v) => field.onChange(v)}
//                                 />
//                             </LabeledField>
//                         )}
//                     />

//                     {/* Pago (calculado) */}
//                     <Controller
//                         name="paidAmount"
//                         control={control}
//                         render={({ field }) => (
//                             <LabeledField label="Total Pago">
//                                 <CurrencyInput
//                                     fullWidth
//                                     size="small"
//                                     disabled
//                                     value={field.value ?? 0}
//                                     onChange={(v) => field.onChange(v)}
//                                 />
//                             </LabeledField>
//                         )}
//                     />
//                 </Box>

//                 {/* Footer */}
//                 <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
//                     <Button
//                         type="submit"
//                         variant="contained"
//                         disabled={updating}
//                         startIcon={updating ? <CircularProgress size={18} /> : undefined}
//                     >
//                         {updating ? "Salvando..." : "Salvar"}
//                     </Button>
//                 </Box>
//             </form>
//         </Drawer>
//     );
// }
