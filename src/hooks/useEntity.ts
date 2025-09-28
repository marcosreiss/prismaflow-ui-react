import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { EntityService } from "@/services/entityService";
import type { ApiResponse, PaginatedResponse } from "@/types/apiResponse";

export type UseEntityOptions<T> = {
  service: EntityService<T>;
  queryKey: string;
  size?: number;
  detailId?: number | string | null;
};

export function useEntity<T>({
  service,
  queryKey,
  size: initialSize = 10,
  detailId,
}: UseEntityOptions<T>) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(initialSize);

  // 📌 Listagem
  const getAll = useQuery<ApiResponse<PaginatedResponse<T>>>({
    queryKey: [queryKey, { page, size, search }],
    queryFn: () => service.getAll({ page, size, search }),
    placeholderData: (prev) => prev,
  });

  // 📌 Detalhe
  const getById = useQuery<ApiResponse<T>>({
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
      queryClient.invalidateQueries({
        queryKey: [queryKey, "detail", vars.id],
      });
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
    // 📌 Lista
    list: {
      data: getAll.data?.data?.content ?? [],
      total: getAll.data?.data?.totalElements ?? 0,
      isLoading: getAll.isLoading, // primeiro carregamento
      isFetching: getAll.isFetching, // paginação, pesquisa, refetch
      error: getAll.error,
      page,
      setPage,
      size,
      setSize,
      search,
      setSearch,
      refetch: getAll.refetch,
    },

    // 📌 Detalhe
    detail: {
      data: getById.data?.data,
      isLoading: getById.isLoading,
      isFetching: getById.isFetching,
      error: getById.error,
      refetch: getById.refetch,
    },

    // 📌 Mutations (ApiResponse<T>)
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,

    // Estados de carregamento das mutações
    creating: createMutation.isPending,
    updating: updateMutation.isPending,
    removing: deleteMutation.isPending,
  };
}
