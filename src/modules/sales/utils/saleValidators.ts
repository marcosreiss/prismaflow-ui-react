// Validações do formulário de venda por step e para o submit final
import type {
  FrameDetails,
  Sale,
  SaleProductItem,
} from "@/modules/sales/types/salesTypes";
import type { Product } from "@/modules/products/types/productTypes";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Validação principal por step
export const validateSaleForm = (
  data: Sale,
  step: number,
): ValidationResult => {
  const errors: string[] = [];

  switch (step) {
    case 0:
      if (!data.clientId) errors.push("Por favor, selecione um cliente.");
      if (!data.saleDate) errors.push("Data da venda é obrigatória.");
      break;

    case 1:
      if (!data.productItems || data.productItems.length === 0) {
        errors.push("Por favor, adicione pelo menos um produto.");
      } else {
        errors.push(...validateProductItems(data.productItems));
      }
      break;

    case 3:
      errors.push(...validateReview(data));
      break;
  }

  return { isValid: errors.length === 0, errors };
};

// Validação dos itens de produto — apenas quantidade e existência do produto
export const validateProductItems = (
  productItems: Sale["productItems"],
): string[] => {
  const errors: string[] = [];

  productItems?.forEach((item: SaleProductItem) => {
    const quantity = Number(item?.quantity || 0);

    if (!item?.product) return;

    if (!quantity || quantity < 1) {
      errors.push(
        `Produto "${(item.product as Product).name}": quantidade deve ser pelo menos 1.`,
      );
    }
  });

  return errors;
};

// Validação dos detalhes da armação
export const validateFrameDetails = (
  frameDetails: FrameDetails,
  productName: string,
): string[] => {
  const errors: string[] = [];

  if (!frameDetails) {
    errors.push(
      `Armação "${productName}": detalhes da armação são obrigatórios.`,
    );
    return errors;
  }
  if (!frameDetails.material) {
    errors.push(`Armação "${productName}": tipo de material é obrigatório.`);
  }
  if (!frameDetails.color) {
    errors.push(`Armação "${productName}": cor é obrigatória.`);
  }

  return errors;
};

// Validação dos campos financeiros na revisão
export const validateReview = (data: Sale): string[] => {
  const errors: string[] = [];

  if (data.subtotal < 0) errors.push("Subtotal não pode ser negativo.");
  if (data.discount < 0) errors.push("Desconto não pode ser negativo.");
  if (data.discount > data.subtotal)
    errors.push("Desconto não pode ser maior que o subtotal.");
  if (data.total < 0) errors.push("Total não pode ser negativo.");

  const expectedTotal = data.subtotal - data.discount;
  if (Math.abs(data.total - expectedTotal) > 0.01) {
    errors.push("Inconsistência nos cálculos financeiros.");
  }

  return errors;
};

// Habilitar/desabilitar avanço de step
export const canProceedToNextStep = (
  data: Sale,
  currentStep: number,
): boolean => validateSaleForm(data, currentStep).isValid;

// Validação completa para o submit
export const canSubmitSale = (data: Sale): ValidationResult => {
  const errors: string[] = [];

  for (let step = 0; step < 4; step++) {
    errors.push(...validateSaleForm(data, step).errors);
  }

  return { isValid: errors.length === 0, errors };
};

// Validação de produto individual antes de adicionar
export const validateProductBeforeAdd = (
  _product: Product,
  quantity: number = 1,
): ValidationResult => {
  const errors: string[] = [];

  if (quantity < 1) errors.push("Quantidade deve ser pelo menos 1.");

  return { isValid: errors.length === 0, errors };
};
