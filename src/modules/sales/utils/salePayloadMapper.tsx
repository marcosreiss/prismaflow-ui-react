/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Sale } from "@/types/saleTypes";
import type { ProtocolCreate, PrescriptionCreate } from "@/types/protocolTypes";

export const mapSaleToPayload = (data: Sale, isEdit: boolean = false) => {
    // Verifica se há lentes para determinar se precisa de protocolo
    const hasLenses = data.productItems?.some(item => item.product?.category === "LENS") || false;

    const payload = {
        // Dados básicos da venda
        clientId: data.client?.id,
        subtotal: data.subtotal || 0,
        discount: data.discount || 0,
        total: data.total || 0,
        notes: data.notes?.trim() || null,
        isActive: data.isActive !== false,

        // Itens de produto - ✅ CORREÇÃO: Tratamento seguro do id
        productItems: data.productItems?.map(item => ({
            id: isEdit && item.id ? item.id : undefined, // ✅ Só inclui ID se existir e for edição
            productId: item.product.id,
            quantity: item.quantity || 1,
            frameDetails: item.product?.category === "FRAME" && item.frameDetails ? {
                // ✅ CORREÇÃO: Verifica se frameDetails tem id antes de usar
                id: isEdit && 'id' in item.frameDetails ? item.frameDetails.id : undefined,
                frameMaterialType: item.frameDetails.material || "ACETATE",
                reference: item.frameDetails.reference?.trim() || null,
                color: item.frameDetails.color?.trim() || null,
            } : null
        })) || [],

        // Itens de serviço - ✅ CORREÇÃO: Tratamento seguro do id
        serviceItems: data.serviceItems?.map(item => ({
            id: isEdit && item.service.id ? item.service.id : undefined, // ✅ Só inclui ID se existir
            serviceId: item.service?.id,
        })) || [],

        // Protocolo (só envia se houver lentes) - ✅ CORREÇÃO: Tratamento seguro do id
        protocol: hasLenses && data.protocol ? mapProtocolToPayload(data.protocol, isEdit) : null
    };

    console.log("📦 PAYLOAD COMPLETO:", JSON.stringify(payload, null, 2));
    return payload;
};

/**
 * Mapeia dados do protocolo para a API - ✅ CORREÇÃO: Tratamento seguro do id
 */
const mapProtocolToPayload = (protocol: Sale['protocol'], isEdit: boolean = false): ProtocolCreate | null => {
    if (!protocol) return null;

    return {
        // ✅ CORREÇÃO: Só inclui ID se existir e for edição
        recordNumber: protocol.recordNumber?.trim() || null,
        book: protocol.book?.trim() || null,
        page: protocol.page || null,
        os: protocol.os?.trim() || null,
        prescription: protocol.prescription ? mapPrescriptionToPayload(protocol.prescription, isEdit) : null
    };
};

/**
 * Mapeia dados da prescrição para a API - ✅ CORREÇÃO: Tratamento seguro do id
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapPrescriptionToPayload = (prescription: any, _isEdit: boolean = false): PrescriptionCreate => {
    return {
        // ✅ CORREÇÃO: Só inclui ID se existir e for edição
        doctorName: prescription.doctorName?.trim() || '',
        crm: prescription.crm?.trim() || '',
        odSpherical: prescription.odSpherical?.trim() || '',
        odCylindrical: prescription.odCylindrical?.trim() || '',
        odAxis: prescription.odAxis?.trim() || '',
        odDnp: prescription.odDnp?.trim() || '',
        oeSpherical: prescription.oeSpherical?.trim() || '',
        oeCylindrical: prescription.oeCylindrical?.trim() || '',
        oeAxis: prescription.oeAxis?.trim() || '',
        oeDnp: prescription.oeDnp?.trim() || '',
        addition: prescription.addition?.trim() || '',
        opticalCenter: prescription.opticalCenter?.trim() || '',
    };
};

/**
 * Função auxiliar para limpar dados antes do envio
 */
export const sanitizeSaleData = (data: Sale): Sale => {
    return {
        ...data,
        notes: data.notes?.trim() || '',
        protocol: data.protocol ? {
            ...data.protocol,
            recordNumber: data.protocol.recordNumber?.trim() || null,
            book: data.protocol.book?.trim() || null,
            os: data.protocol.os?.trim() || null,
            prescription: data.protocol.prescription ? {
                ...data.protocol.prescription,
                doctorName: data.protocol.prescription.doctorName?.trim() || '',
                crm: data.protocol.prescription.crm?.trim() || '',
                odSpherical: data.protocol.prescription.odSpherical?.trim() || '',
                odCylindrical: data.protocol.prescription.odCylindrical?.trim() || '',
                odAxis: data.protocol.prescription.odAxis?.trim() || '',
                odDnp: data.protocol.prescription.odDnp?.trim() || '',
                oeSpherical: data.protocol.prescription.oeSpherical?.trim() || '',
                oeCylindrical: data.protocol.prescription.oeCylindrical?.trim() || '',
                oeAxis: data.protocol.prescription.oeAxis?.trim() || '',
                oeDnp: data.protocol.prescription.oeDnp?.trim() || '',
                addition: data.protocol.prescription.addition?.trim() || '',
                opticalCenter: data.protocol.prescription.opticalCenter?.trim() || '',
            } : undefined
        } : undefined
    };
};