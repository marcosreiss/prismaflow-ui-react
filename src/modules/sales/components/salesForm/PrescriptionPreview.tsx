// Exibição dos dados de uma receita — usado no select e no resumo da venda
import { Box, Typography, Divider, Stack } from "@mui/material";
import dayjs from "dayjs";
import type { Prescription } from "@/modules/clients/types/prescriptionTypes";

interface PrescriptionPreviewProps {
    prescription: Prescription;
}

type EyeRow = {
    label: string;
    od: string | null | undefined;
    oe: string | null | undefined;
};

const val = (v?: string | null) => v?.trim() || "—";

const EyeTable = ({ rows }: { rows: EyeRow[] }) => (
    <Box>
        {/* cabeçalho */}
        <Box sx={{ display: "flex", mb: 0.5 }}>
            <Box sx={{ flex: 2 }} />
            <Box sx={{ flex: 2 }}>
                <Typography variant="caption" fontWeight={700} color="primary.main">OD</Typography>
            </Box>
            <Box sx={{ flex: 2 }}>
                <Typography variant="caption" fontWeight={700} color="secondary.main">OE</Typography>
            </Box>
        </Box>
        {rows.map((row) => (
            <Box key={row.label} sx={{ display: "flex", py: 0.25 }}>
                <Box sx={{ flex: 2 }}>
                    <Typography variant="caption" color="text.secondary">{row.label}</Typography>
                </Box>
                <Box sx={{ flex: 2 }}>
                    <Typography variant="caption">{val(row.od)}</Typography>
                </Box>
                <Box sx={{ flex: 2 }}>
                    <Typography variant="caption">{val(row.oe)}</Typography>
                </Box>
            </Box>
        ))}
    </Box>
);

export default function PrescriptionPreview({ prescription: p }: PrescriptionPreviewProps) {
    const farRows: EyeRow[] = [
        { label: "Esférico", od: p.odSphericalFar, oe: p.oeSphericalFar },
        { label: "Cilíndrico", od: p.odCylindricalFar, oe: p.oeCylindricalFar },
        { label: "Eixo", od: p.odAxisFar, oe: p.oeAxisFar },
        { label: "DNP", od: p.odDnpFar, oe: p.oeDnpFar },
        { label: "Película", od: p.odPellicleFar, oe: p.oePellicleFar },
    ];

    const nearRows: EyeRow[] = [
        { label: "Esférico", od: p.odSphericalNear, oe: p.oeSphericalNear },
        { label: "Cilíndrico", od: p.odCylindricalNear, oe: p.oeCylindricalNear },
        { label: "Eixo", od: p.odAxisNear, oe: p.oeAxisNear },
        { label: "DNP", od: p.odDnpNear, oe: p.oeDnpNear },
        { label: "Película", od: p.odPellicleNear, oe: p.oePellicleNear },
    ];

    return (
        <Box sx={{ pt: 1 }}>
            {/* Cabeçalho */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Stack>
                    <Typography variant="body2" fontWeight={600}>
                        {p.doctorName || "Médico não informado"}
                    </Typography>
                    {p.crm && (
                        <Typography variant="caption" color="text.secondary">CRM: {p.crm}</Typography>
                    )}
                </Stack>
                <Typography variant="caption" color="text.secondary">
                    {dayjs(p.prescriptionDate).format("DD/MM/YYYY")}
                </Typography>
            </Stack>

            <Divider sx={{ mb: 1.5 }} />

            {/* Longe */}
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
                LONGE
            </Typography>
            <EyeTable rows={farRows} />

            <Divider sx={{ my: 1.5 }} />

            {/* Perto */}
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
                PERTO
            </Typography>
            <EyeTable rows={nearRows} />

            {/* Campos gerais */}
            {(p.additionRight || p.additionLeft || p.lensType || p.frameAndRef || p.notes) && (
                <>
                    <Divider sx={{ my: 1.5 }} />
                    <Stack spacing={0.5}>
                        {p.lensType && (
                            <Typography variant="caption">Tipo de lente: <strong>{p.lensType}</strong></Typography>
                        )}
                        {p.additionRight && (
                            <Typography variant="caption">Adição OD: <strong>{p.additionRight}</strong></Typography>
                        )}
                        {p.additionLeft && (
                            <Typography variant="caption">Adição OE: <strong>{p.additionLeft}</strong></Typography>
                        )}
                        {p.frameAndRef && (
                            <Typography variant="caption">Armação/Ref: <strong>{p.frameAndRef}</strong></Typography>
                        )}
                        {p.notes && (
                            <Typography variant="caption" color="text.secondary">Obs: {p.notes}</Typography>
                        )}
                    </Stack>
                </>
            )}
        </Box>
    );
}
