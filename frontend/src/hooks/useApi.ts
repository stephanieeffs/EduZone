import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { ApiError, ApiResponse } from "../types/api";

export function useApi() {
  const [error, setError] = useState<ApiError | null>(null);

  const handleError = useCallback((error: unknown) => {
    if (error instanceof Error) {
      setError({
        message: error.message,
        status: 500,
      });
    } else if (typeof error === "object" && error !== null) {
      const apiError = error as ApiError;
      setError({
        message: apiError.message || "An unexpected error occurred",
        code: apiError.code,
        status: apiError.status,
      });
    } else {
      setError({
        message: "An unexpected error occurred",
        status: 500,
      });
    }
  }, []);

  const useApiQuery = <T>(
    key: string[],
    queryFn: () => Promise<ApiResponse<T>>,
    options?: Omit<
      UseQueryOptions<ApiResponse<T>, ApiError, ApiResponse<T>>,
      "queryKey" | "queryFn"
    >
  ) => {
    const query = useQuery<ApiResponse<T>, ApiError>({
      queryKey: key,
      queryFn,
      ...options,
    });

    // Handle errors after the query
    if (query.error) {
      handleError(query.error);
    }

    return query;
  };

  const useApiMutation = <T, V>(
    mutationFn: (variables: V) => Promise<ApiResponse<T>>,
    options?: Omit<
      UseMutationOptions<ApiResponse<T>, ApiError, V>,
      "mutationFn"
    >
  ) => {
    const mutation = useMutation<ApiResponse<T>, ApiError, V>({
      mutationFn,
      ...options,
    });

    // Handle errors after the mutation
    if (mutation.error) {
      handleError(mutation.error);
    }

    return mutation;
  };

  return {
    error,
    setError,
    useApiQuery,
    useApiMutation,
  };
}
