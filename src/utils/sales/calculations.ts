import type { Sale } from "@/types/saleTypes";
import type { Product } from "@/types/productTypes";

/**
 * Cálculos financeiros e utilitários para vendas
 */

export interface CalculationResult {
    subtotal: number;
    discount: number;
    total: number;
    itemsCount: number;
    productsCount: number;
    servicesCount: number;
}

/**
 * Calcula totais da venda baseado nos itens e desconto
 */
export const calculateSaleTotals = (
    productItems: Sale['productItems'],
    discount: number = 0
): CalculationResult => {
    const subtotal = calculateSubtotal(productItems);
    const total = Math.max(0, subtotal - discount);

    return {
        subtotal,
        discount,
        total,
        itemsCount: productItems.length,
        productsCount: productItems.length,
        servicesCount: 0, // Implementar quando tiver serviços
    };
};

/**
 * Calcula apenas o subtotal dos produtos
 */
export const calculateSubtotal = (productItems: Sale['productItems']): number => {
    return productItems.reduce((acc, item) => {
        const product = (item as any).product as Product;
        const quantity = (item as any).quantity || 0;
        const price = product?.salePrice || 0;

        return acc + (price * quantity);
    }, 0);
};

/**
 * Calcula o valor total de desconto aplicado
 */
export const calculateDiscountValue = (subtotal: number, discount: number): number => {
    return Math.min(discount, subtotal); // Não permite desconto maior que subtotal
};

/**
 * Calcula porcentagem de desconto baseado no valor
 */
export const calculateDiscountPercentage = (subtotal: number, discount: number): number => {
    if (subtotal === 0) return 0;
    return (discount / subtotal) * 100;
};

/**
 * Aplica desconto percentual e retorna valor absoluto
 */
export const applyPercentageDiscount = (subtotal: number, percentage: number): number => {
    return subtotal * (percentage / 100);
};

/**
 * Calcula preço com markup aplicado
 */
export const calculateSalePriceWithMarkup = (costPrice: number, markup: number): number => {
    return costPrice * (1 + markup / 100);
};

/**
 * Calcula lucro esperado da venda
 */
export const calculateExpectedProfit = (productItems: Sale['productItems']): number => {
    return productItems.reduce((acc, item) => {
        const product = (item as any).product as Product;
        const quantity = (item as any).quantity || 0;
        const cost = product?.costPrice || 0;
        const salePrice = product?.salePrice || 0;

        return acc + ((salePrice - cost) * quantity);
    }, 0);
};

/**
 * Calcula margem de lucro percentual
 */
export const calculateProfitMargin = (productItems: Sale['productItems']): number => {
    const subtotal = calculateSubtotal(productItems);
    const costTotal = productItems.reduce((acc, item) => {
        const product = (item as any).product as Product;
        const quantity = (item as any).quantity || 0;
        const cost = product?.costPrice || 0;

        return acc + (cost * quantity);
    }, 0);

    if (costTotal === 0) return 0;

    return ((subtotal - costTotal) / costTotal) * 100;
};

/**
 * Valida se quantidade está dentro dos limites de estoque
 */
export const validateStockQuantity = (product: Product, quantity: number): { isValid: boolean; message?: string } => {
    if (quantity < 1) {
        return { isValid: false, message: "Quantidade deve ser pelo menos 1" };
    }

    if (quantity > product.stockQuantity) {
        return {
            isValid: false,
            message: `Quantidade excede estoque. Disponível: ${product.stockQuantity}`
        };
    }

    if (product.stockQuantity - quantity < product.minimumStock) {
        return {
            isValid: true,
            message: `Atenção: Estoque ficará abaixo do mínimo (${product.minimumStock}) após a venda`
        };
    }

    return { isValid: true };
};

/**
 * Agrupa produtos por categoria para relatórios
 */
export const groupProductsByCategory = (productItems: Sale['productItems']) => {
    const groups: Record<string, { count: number; total: number; items: any[] }> = {};

    productItems.forEach(item => {
        const product = (item as any).product as Product;
        const quantity = (item as any).quantity || 0;
        const category = product.category;

        if (!groups[category]) {
            groups[category] = { count: 0, total: 0, items: [] };
        }

        groups[category].count += quantity;
        groups[category].total += (product.salePrice * quantity);
        groups[category].items.push(item);
    });

    return groups;
};

/**
 * Calcula estatísticas da venda
 */
export const calculateSaleStatistics = (productItems: Sale['productItems']) => {
    const subtotal = calculateSubtotal(productItems);
    const productCount = productItems.length;
    const totalQuantity = productItems.reduce((acc, item) => acc + ((item as any).quantity || 0), 0);
    const averagePrice = productCount > 0 ? subtotal / totalQuantity : 0;

    const categories = groupProductsByCategory(productItems);
    const mostExpensiveItem = productItems.reduce<{ product: Product | null; price: number }>((max, item) => {
        const product = (item as any).product as Product;
        if (product && product.salePrice > max.price) {
            return { product, price: product.salePrice };
        }
        return max;
    }, { product: null, price: 0 });

    return {
        subtotal,
        productCount,
        totalQuantity,
        averagePrice,
        categories,
        mostExpensiveItem: mostExpensiveItem.product,
        categoryCount: Object.keys(categories).length
    };
};

/**
 * Formata valores monetários
 */
export const formatCurrency = (value: number, currency: string = 'BRL', locale: string = 'pt-BR'): string => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(value);
};

/**
 * Formata porcentagem
 */
export const formatPercentage = (value: number, decimals: number = 2): string => {
    return `${value.toFixed(decimals)}%`;
};

/**
 * Cálculos para exibição no resumo
 */
export const getSummaryCalculations = (productItems: Sale['productItems'], discount: number) => {
    const calculations = calculateSaleTotals(productItems, discount);
    const discountPercentage = calculateDiscountPercentage(calculations.subtotal, discount);
    const profit = calculateExpectedProfit(productItems);
    const profitMargin = calculateProfitMargin(productItems);

    return {
        ...calculations,
        discountPercentage,
        profit,
        profitMargin,
        formattedSubtotal: formatCurrency(calculations.subtotal),
        formattedDiscount: formatCurrency(calculations.discount),
        formattedTotal: formatCurrency(calculations.total),
        formattedProfit: formatCurrency(profit),
        formattedProfitMargin: formatPercentage(profitMargin),
    };
};