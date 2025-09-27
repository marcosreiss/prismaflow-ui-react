import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { EntityService } from "@/interfaces/entityService";


export type UseEntityOptions<T> = {
  service: EntityService<T>;
  queryKey: string;
  take?: number;
  detailId?: number | string | null;
};

export function useEntity<T>({
  service,
  queryKey,
  take = 10,
  detailId,
}: UseEntityOptions<T>) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  // 📌 Listagem
  const listQuery = useQuery<{ items: T[]; total: number }>({
    queryKey: [queryKey, { page, take, search }],
    queryFn: () => service.list({ skip: page * take, take, search }),
    placeholderData: (prev) => prev,
  });

  // 📌 Detalhe (desativado se não houver id)
  const detailQuery = useQuery<T>({
    queryKey: [queryKey, "detail", detailId],
    queryFn: () => service.get(detailId as number | string),
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
    mutationFn: (id: number | string) => service.remove(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.removeQueries({ queryKey: [queryKey, "detail", id] });
    },
  });

  return {
    // lista
    list: {
      data: listQuery.data?.items ?? [],
      total: listQuery.data?.total ?? 0,
      isLoading: listQuery.isLoading,
      error: listQuery.error,
      page,
      setPage,
      take,
      search,
      setSearch,
      refetch: listQuery.refetch,
    },

    // detalhe
    detail: {
      data: detailQuery.data,
      isLoading: detailQuery.isLoading,
      error: detailQuery.error,
      refetch: detailQuery.refetch,
    },

    // mutations
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
  };
}
