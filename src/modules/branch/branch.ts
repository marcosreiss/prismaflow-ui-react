// =============================
// 🔹 INTERFACES
// =============================
export interface BranchSelect {
  id: string;
  name: string;
}

export interface BranchSelectResponse {
  success: boolean;
  message: string;
  data: BranchSelect[];
}


