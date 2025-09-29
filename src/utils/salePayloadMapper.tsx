import type { Sale } from "@/types/saleTypes";
import type { FrameDetails } from "@/types/frameDetailsTypes";
import type { ProtocolCreate, PrescriptionCreate } from "@/types/protocolTypes";

// Tipo para FrameDetails temporário (sem id e itemProduct)
type TemporaryFrameDetails = Omit<FrameDetails, 'id' | 'itemProduct'>;

export const mapSaleToPayload = (data: Sale) => {
    return {
        clientId: data.client?.id,
        subtotal: data.subtotal,
        discount: data.discount,
        total: data.total,
        notes: data.notes,
        productItems: data.productItems.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            frameDetails: item.frameDetails ? {
                material: item.frameDetails.material,
                reference: item.frameDetails.reference,
                color: item.frameDetails.color,
            } as TemporaryFrameDetails : null,
        })),
        serviceItems: data.serviceItems?.map(item => ({
            serviceId: item.service.id,
        })) || [],
        protocol: data.protocol ? {
            recordNumber: data.protocol.recordNumber || null,
            book: data.protocol.book || null,
            page: data.protocol.page || null,
            os: data.protocol.os || null,
            prescription: data.protocol.prescription ? {
                doctorName: data.protocol.prescription.doctorName,
                crm: data.protocol.prescription.crm,
                odSpherical: data.protocol.prescription.odSpherical,
                odCylindrical: data.protocol.prescription.odCylindrical,
                odAxis: data.protocol.prescription.odAxis,
                odDnp: data.protocol.prescription.odDnp,
                oeSpherical: data.protocol.prescription.oeSpherical,
                oeCylindrical: data.protocol.prescription.oeCylindrical,
                oeAxis: data.protocol.prescription.oeAxis,
                oeDnp: data.protocol.prescription.oeDnp,
                addition: data.protocol.prescription.addition,
                opticalCenter: data.protocol.prescription.opticalCenter,
            } as PrescriptionCreate : null
        } as ProtocolCreate : null
    };
};

export const validateSaleForm = (data: Sale, step: number): string | null => {
    if (step === 0 && !data.client?.id) {
        return "Por favor, selecione um cliente.";
    }

    if (step === 1 && data.productItems.length === 0) {
        return "Por favor, adicione pelo menos um produto.";
    }

    return null;
};