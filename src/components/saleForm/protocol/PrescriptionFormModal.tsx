import { useForm, Controller } from "react-hook-form";
import type { Prescription } from "@/types/prescriptionTypes";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack,
    TextField,
    Typography,
    Divider,
} from "@mui/material";
import { useEffect } from "react";

type Props = {
    open: boolean;
    onClose: () => void;
    onSave: (data: Prescription) => void;
    initialData?: Prescription | null;
};

export default function PrescriptionFormModal({ open, onClose, onSave, initialData }: Props) {
    const { control, handleSubmit, reset } = useForm<Prescription>();

    useEffect(() => {
        if (open) {
            reset(initialData || {});
        }
    }, [open, initialData, reset]);

    const handleSave = (data: Prescription) => {
        onSave(data);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Detalhes da Receita</DialogTitle>
            <form onSubmit={handleSubmit(handleSave)}>
                <DialogContent>
                    <Stack spacing={2}>
                        {/* --- Dados Médicos --- */}
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <Controller name="doctorName" control={control} render={({ field }) => <TextField {...field} label="Nome do Médico" fullWidth size="small" sx={{ flex: 2 }} />} />
                            <Controller name="crm" control={control} render={({ field }) => <TextField {...field} label="CRM" fullWidth size="small" sx={{ flex: 1 }} />} />
                        </Stack>

                        <Divider sx={{ my: 1 }}><Typography variant="overline">Olho Direito (OD)</Typography></Divider>
                        {/* --- Olho Direito --- */}
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <Controller name="odSpherical" control={control} render={({ field }) => <TextField {...field} label="Esférico" fullWidth size="small" />} />
                            <Controller name="odCylindrical" control={control} render={({ field }) => <TextField {...field} label="Cilíndrico" fullWidth size="small" />} />
                            <Controller name="odAxis" control={control} render={({ field }) => <TextField {...field} label="Eixo" fullWidth size="small" />} />
                            <Controller name="odDnp" control={control} render={({ field }) => <TextField {...field} label="DNP" fullWidth size="small" />} />
                        </Stack>

                        <Divider sx={{ my: 1 }}><Typography variant="overline">Olho Esquerdo (OE)</Typography></Divider>
                        {/* --- Olho Esquerdo --- */}
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <Controller name="oeSpherical" control={control} render={({ field }) => <TextField {...field} label="Esférico" fullWidth size="small" />} />
                            <Controller name="oeCylindrical" control={control} render={({ field }) => <TextField {...field} label="Cilíndrico" fullWidth size="small" />} />
                            <Controller name="oeAxis" control={control} render={({ field }) => <TextField {...field} label="Eixo" fullWidth size="small" />} />
                            <Controller name="oeDnp" control={control} render={({ field }) => <TextField {...field} label="DNP" fullWidth size="small" />} />
                        </Stack>

                        <Divider sx={{ my: 1 }}><Typography variant="overline">Adicionais</Typography></Divider>
                        {/* --- Adicionais --- */}
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <Controller name="addition" control={control} render={({ field }) => <TextField {...field} label="Adição" fullWidth size="small" />} />
                            <Controller name="opticalCenter" control={control} render={({ field }) => <TextField {...field} label="Centro Óptico" fullWidth size="small" />} />
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: '0 24px 16px 24px' }}>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button type="submit" variant="contained">Salvar Receita</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}