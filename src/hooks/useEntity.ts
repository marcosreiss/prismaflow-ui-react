import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { EntityService } from "@/interfaces/entityService";
import type { ApiResponse, PaginatedResponse } from "@/types/apiResponse";

export type UseEntityOptions<T> = {
  service: EntityService<T>;
  queryKey: string;
  take?: number;
  detailId?: number | string | null;
};

export function useEntity<T>({
  service,
  queryKey,
  take: initialTake = 10,
  detailId,
}: UseEntityOptions<T>) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [take, setTake] = useState(initialTake);

  // 📌 Listagem
  const listQuery = useQuery<ApiResponse<PaginatedResponse<T>>>({
    queryKey: [queryKey, { page, take, search }],
    queryFn: () => service.getAll({ skip: page * take, take, search }),
    placeholderData: (prev) => prev,
  });

  // 📌 Detalhe (desativado se não houver id)
  const detailQuery = useQuery<ApiResponse<T>>({
    queryKey: [queryKey, "detail", detailId],
    queryFn: () => service.getById(detailId as number | string),
    enabled: !!detailId,
    placeholderData: (prev) => prev,
  });

  // 📌 Mutations
  const createMutation = useMutation({
    mutationFn: (data: Partial<T>) => service.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: Partial<T> }) =>
      service.update(id, data),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [queryKey, "detail", vars.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => service.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.removeQueries({ queryKey: [queryKey, "detail", id] });
    },
  });

  return {
    // lista
    list: {
      data: listQuery.data?.data?.content ?? [],
      total: listQuery.data?.data?.totalElements ?? 0,
      isLoading: listQuery.isLoading,
      error: listQuery.error,
      page,
      setPage,
      take,
      setTake,
      search,
      setSearch,
      refetch: listQuery.refetch,
    },

    // detalhe
    detail: {
      data: detailQuery.data?.data,
      isLoading: detailQuery.isLoading,
      error: detailQuery.error,
      refetch: detailQuery.refetch,
    },

    // mutations (retornam ApiResponse<T>)
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
  };
}
