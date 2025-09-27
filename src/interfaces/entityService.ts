export interface EntityService<T> {
  list: (params: {
    skip: number;
    take: number;
    search?: string;
  }) => Promise<{ items: T[]; total: number }>;
  get: (id: number | string) => Promise<T>;
  create: (data: Partial<T>) => Promise<T>;
  update: (id: number | string, data: Partial<T>) => Promise<T>;
  remove: (id: number | string) => Promise<void>;
}
