/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Sale } from "@/types/saleTypes";
import type { Product } from "@/types/productTypes";
type ValidatorOptions = { isEditMode?: boolean };
/**
 * Validações para o formulário de venda
 */

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

/**
 * Validação principal do formulário por etapa
 */
export const validateSaleForm = (
  data: Sale,
  step: number,
  options?: ValidatorOptions
): ValidationResult => {
  const errors: string[] = [];

  switch (step) {
    case 0: // Cliente
      if (!data.client?.id) {
        errors.push("Por favor, selecione um cliente.");
      }
      break;

    case 1: // Produtos
      if (!data.productItems || data.productItems.length === 0) {
        errors.push("Por favor, adicione pelo menos um produto.");
      } else {
        // Validações específicas dos produtos
        const productErrors = validateProductItems(data.productItems, options);
        errors.push(...productErrors);
      }
      break;

    case 2: // Protocolo
      {
        const protocolErrors = validateProtocol(data.protocol);
        errors.push(...protocolErrors);
      }
      break;

    case 3: // Revisão
      {
        const reviewErrors = validateReview(data);
        errors.push(...reviewErrors);
      }
      break;
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validações específicas dos itens de produto
 */
export const validateProductItems = (
  productItems: Sale["productItems"],
  options?: ValidatorOptions
): string[] => {
  const errors: string[] = [];

  productItems.forEach((item: any) => {
    const product = item?.product as Product;
    const quantity = Number(item?.quantity || 0);

    if (!product) return;

    // regras básicas
    if (!quantity || quantity < 1) {
      errors.push(`Produto "${product.name}": quantidade deve ser pelo menos 1.`);
      return;
    }

    // detectar se é um item existente e inalterado (edição)
    const unchanged =
      !!options?.isEditMode &&
      !!item?.saleItemId && // id do item da venda (não do produto)
      item?._original &&
      Number(item?._original?.quantity) === quantity &&
      String(item?._original?.productId) === String(product?.id);

    // só valida estoque quando NÃO for inalterado
    console.log("product esetoque:", product.stockQuantity);
    
    if (!unchanged) {
      const available = Number((product as any)?.stockQuantity ?? 0);
      if (available < quantity) {
        errors.push(
          `Produto "${product.name}": estoque insuficiente. Disponível: ${available}, Solicitado: ${quantity}.`
        );
      }
    }
  });

  return errors;
};

/**
 * Validações dos detalhes da armação
 */
// Adicione esta validação específica:
export const validateFrameDetails = (frameDetails: any, productName: string): string[] => {
    const errors: string[] = [];

    if (!frameDetails) {
        errors.push(`Armação "${productName}": detalhes da armação são obrigatórios.`);
        return errors;
    }

    // ✅ VALIDAÇÃO CRÍTICA: material não pode ser null/empty
    if (!frameDetails.material) {
        errors.push(`Armação "${productName}": tipo de material é obrigatório.`);
    }

    if (!frameDetails.color) {
        errors.push(`Armação "${productName}": cor é obrigatória.`);
    }

    return errors;
};

// Atualize a validateProductItems para incluir esta validação:


/**
 * Validações do protocolo
 */
export const validateProtocol = (protocol: Sale['protocol']): string[] => {
    const errors: string[] = [];

    if (!protocol) {
        return errors; // Protocolo é opcional
    }

    // Validações da prescrição se existir
    if (protocol.prescription) {
        const prescriptionErrors = validatePrescription(protocol.prescription);
        errors.push(...prescriptionErrors);
    }

    return errors;
};

/**
 * Validações da prescrição médica
 */
export const validatePrescription = (prescription: any): string[] => {
    const errors: string[] = [];

    if (prescription.doctorName && !prescription.crm) {
        errors.push("CRM é obrigatório quando o nome do médico é informado.");
    }

    if (prescription.crm && !prescription.doctorName) {
        errors.push("Nome do médico é obrigatório quando o CRM é informado.");
    }

    // Validação de formato do CRM
    if (prescription.crm && !/^CRM-[A-Z]{2}-?\d{6}$/i.test(prescription.crm)) {
        errors.push("Formato do CRM inválido. Use: CRM-XX-XXXXXX");
    }

    return errors;
};

/**
 * Validações finais da revisão
 */
export const validateReview = (data: Sale): string[] => {
    const errors: string[] = [];

    // Validação de valores financeiros
    if (data.subtotal < 0) {
        errors.push("Subtotal não pode ser negativo.");
    }

    if (data.discount < 0) {
        errors.push("Desconto não pode ser negativo.");
    }

    if (data.discount > data.subtotal) {
        errors.push("Desconto não pode ser maior que o subtotal.");
    }

    if (data.total < 0) {
        errors.push("Total não pode ser negativo.");
    }

    // Validação de consistência dos cálculos
    const expectedTotal = data.subtotal - data.discount;
    if (Math.abs(data.total - expectedTotal) > 0.01) { // Permite pequena diferença de arredondamento
        errors.push("Inconsistência nos cálculos financeiros.");
    }

    return errors;
};

/**
 * Validação rápida para habilitar/desabilitar botões
 */
export const canProceedToNextStep = (data: Sale, currentStep: number): boolean => {
    const validation = validateSaleForm(data, currentStep);
    return validation.isValid;
};

/**
 * Validação para submit final
 */
export const canSubmitSale = (data: Sale): ValidationResult => {
  const errors: string[] = [];

  const isEditMode = Boolean((data as any)?.id); // venda existente => edição
  

  for (let step = 0; step < 4; step++) {
    const stepValidation = validateSaleForm(data, step, { isEditMode });
    errors.push(...stepValidation.errors);
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validação de produto individual antes de adicionar
 */
export const validateProductBeforeAdd = (product: Product, quantity: number = 1): ValidationResult => {
    const errors: string[] = [];

    if (!product.isActive) {
        errors.push("Produto não está ativo.");
    }

    if (product.stockQuantity < quantity) {
        errors.push(`Estoque insuficiente. Disponível: ${product.stockQuantity}`);
    }

    if (quantity < 1) {
        errors.push("Quantidade deve ser pelo menos 1.");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};