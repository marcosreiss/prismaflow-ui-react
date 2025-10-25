import {
    Stack,
    Button,
    Divider,
    Typography,
    Box,
} from "@mui/material";
import { Pencil, Trash2 } from "lucide-react";
import type { Prescription } from "../../types/prescriptionTypes";

type PrescriptionViewProps = {
    prescription: Prescription;
    onEdit?: () => void;
    onDelete?: (prescription: Prescription) => void;
    onCreateNew?: () => void;
};

export default function PrescriptionView({
    prescription,
    onEdit,
    onDelete,
    onCreateNew,
}: PrescriptionViewProps) {
    return (
        <Stack spacing={2}>
            {/* Botões de Ação */}
            {(onEdit || onDelete) && (
                <Stack direction="row" spacing={1} mb={1}>
                    {onEdit && (
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Pencil size={14} />}
                            onClick={onEdit}
                        >
                            Editar
                        </Button>
                    )}
                    {onDelete && (
                        <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<Trash2 size={14} />}
                            onClick={() => onDelete(prescription)}
                        >
                            Remover
                        </Button>
                    )}
                </Stack>
            )}

            <Divider sx={{ my: 1 }} />

            {/* Informações Básicas */}
            <Row label="Médico" value={prescription.doctorName} />
            <Row label="CRM" value={prescription.crm} />
            <Row
                label="Data da Receita"
                value={
                    prescription.prescriptionDate
                        ? new Date(prescription.prescriptionDate).toLocaleDateString("pt-BR")
                        : "-"
                }
            />

            {/* Informações Gerais */}
            <Divider sx={{ my: 2 }} />
            <Typography fontWeight={600} fontSize={14}>
                Informações Gerais
            </Typography>
            <GridBlock>
                <Row label="Armação e Ref" value={prescription.frameAndRef} />
                <Row label="Tipo de Lente" value={prescription.lensType} />
                <Row label="Observações" value={prescription.notes} />
            </GridBlock>

            {/* Grau de Longe */}
            <Divider sx={{ my: 2 }} />
            <Typography fontWeight={600} fontSize={15}>
                Grau de Longe
            </Typography>

            <Typography fontWeight={500} fontSize={14} mt={1}>
                Olho Direito (OD)
            </Typography>
            <GridBlock>
                <Row label="Esférico" value={prescription.odSphericalFar} />
                <Row label="Cilíndrico" value={prescription.odCylindricalFar} />
                <Row label="Eixo" value={prescription.odAxisFar} />
                <Row label="DNP" value={prescription.odDnpFar} />
                <Row label="Película" value={prescription.odPellicleFar} />
            </GridBlock>

            <Typography fontWeight={500} fontSize={14} mt={1}>
                Olho Esquerdo (OE)
            </Typography>
            <GridBlock>
                <Row label="Esférico" value={prescription.oeSphericalFar} />
                <Row label="Cilíndrico" value={prescription.oeCylindricalFar} />
                <Row label="Eixo" value={prescription.oeAxisFar} />
                <Row label="DNP" value={prescription.oeDnpFar} />
                <Row label="Película" value={prescription.oePellicleFar} />
            </GridBlock>

            {/* Grau de Perto */}
            <Divider sx={{ my: 2 }} />
            <Typography fontWeight={600} fontSize={15}>
                Grau de Perto
            </Typography>

            <Typography fontWeight={500} fontSize={14} mt={1}>
                Olho Direito (OD)
            </Typography>
            <GridBlock>
                <Row label="Esférico" value={prescription.odSphericalNear} />
                <Row label="Cilíndrico" value={prescription.odCylindricalNear} />
                <Row label="Eixo" value={prescription.odAxisNear} />
                <Row label="DNP" value={prescription.odDnpNear} />
                <Row label="Película" value={prescription.odPellicleNear} />
                <Row label="Adição" value={prescription.additionRight} />
                <Row label="Centro Óptico" value={prescription.opticalCenterRight} />
            </GridBlock>

            <Typography fontWeight={500} fontSize={14} mt={1}>
                Olho Esquerdo (OE)
            </Typography>
            <GridBlock>
                <Row label="Esférico" value={prescription.oeSphericalNear} />
                <Row label="Cilíndrico" value={prescription.oeCylindricalNear} />
                <Row label="Eixo" value={prescription.oeAxisNear} />
                <Row label="DNP" value={prescription.oeDnpNear} />
                <Row label="Película" value={prescription.oePellicleNear} />
                <Row label="Adição" value={prescription.additionLeft} />
                <Row label="Centro Óptico" value={prescription.opticalCenterLeft} />
            </GridBlock>

            {/* Botão Nova Receita */}
            {onCreateNew && (
                <>
                    <Divider sx={{ my: 3 }} />
                    <Button fullWidth variant="contained" onClick={onCreateNew}>
                        Nova Receita
                    </Button>
                </>
            )}
        </Stack>
    );
}

// Componentes auxiliares (podem ficar no mesmo arquivo)
function GridBlock({ children }: { children: React.ReactNode }) {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                gap: 2,
            }}
        >
            {children}
        </Box>
    );
}

function Row({
    label,
    value,
}: {
    label: string;
    value: string | number | null | undefined;
}) {
    if (!value && value !== 0) return null;
    return (
        <Box sx={{ display: "flex", gap: 1 }}>
            <Typography variant="body2" fontWeight={600}>
                {label}:
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {value}
            </Typography>
        </Box>
    );
}
