import type { EntityService } from "@/interfaces/entityService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type UseEntityOptions<T> = {
  service: EntityService<T>;
  queryKey: string; // base
  take?: number;
};

export function useEntity<T>({
  service,
  queryKey,
  take = 10,
}: UseEntityOptions<T>) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [queryKey, { page, take, search }],
    queryFn: () =>
      service.list({
        skip: page * take,
        take,
        search,
      }),
    placeholderData: (prev) => prev, // substitui keepPreviousData
  });

  const createMutation = useMutation({
    mutationFn: service.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: Partial<T> }) =>
      service.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => service.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey] }),
  });

  return {
    data: data?.items ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
    page,
    setPage,
    take,
    search,
    setSearch,
    refetch,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
  };
}
