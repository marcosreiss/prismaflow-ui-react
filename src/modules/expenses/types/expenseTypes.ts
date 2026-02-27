import type { ApiResponse, PaginatedResponse } from "@/utils/apiResponse";

// ===========================
// 🔹 ENUM / CATEGORIAS
// ===========================
export type ExpenseStatus = "SCHEDULED" | "PAID";

export const ExpenseStatusLabels: Record<ExpenseStatus, string> = {
  SCHEDULED: "Agendada",
  PAID: "Paga",
};

export type PaymentMethod = "PIX" | "MONEY" | "DEBIT" | "CREDIT";

export const PaymentMethodLabels: Record<PaymentMethod, string> = {
  PIX: "PIX",
  MONEY: "Dinheiro",
  DEBIT: "Débito",
  CREDIT: "Crédito",
};

// ==============================
// 🔹 ENTIDADE: EXPENSE
// ==============================
export type Expense = {
  id: number;
  description: string;
  amount: number;
  dueDate: string;
  status: ExpenseStatus;
  paymentDate: string | null;
  paymentMethod: PaymentMethod | null;
  tenantId: string;
  branchId: string;
  createdById: string | null;
  updatedById: string | null;
  createdAt: string;
  updatedAt: string;
};

// ==============================
// 📨 PAYLOADS (REQUEST)
// ==============================
export type CreateExpensePayload = {
  description: string;
  amount: number;
  dueDate: string;
  status?: ExpenseStatus;
  paymentDate?: string | null;
  paymentMethod?: PaymentMethod | null;
};


export type UpdateExpensePayload = Partial<CreateExpensePayload> & {
  status?: ExpenseStatus;
};

// ==============================
// 📦 RESPONSE TYPES
// ==============================
export type ExpensesResponse = ApiResponse<PaginatedResponse<Expense>>;
export type ExpenseResponse = ApiResponse<Expense>;
