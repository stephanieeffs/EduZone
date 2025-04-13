import { ApiResponse, RequestOptions } from "../types/api";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

class ApiErrorImpl extends Error {
  constructor(message: string, public status?: number, public code?: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(
  url: string,
  options: RequestOptions = {}
): Promise<Response> {
  const { retries = 3, retryDelay = 1000, ...fetchOptions } = options;
  let lastError: Error | null = null;

  // Get auth token from localStorage
  const token = localStorage.getItem("eduzone-token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...fetchOptions.headers,
  };

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        credentials: "include",
      });

      // For 401 errors, return the response without throwing
      // This allows the caller to handle it appropriately
      if (response.status === 401) {
        return response;
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new ApiErrorImpl(
          error.message || "An error occurred",
          response.status,
          error.code
        );
      }

      return response;
    } catch (error) {
      lastError = error as Error;
      if (i < retries - 1) {
        await delay(retryDelay * Math.pow(2, i));
      }
    }
  }

  throw lastError;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetchWithRetry(url, options);

    // Handle 401 responses specially
    if (response.status === 401) {
      return {
        data: null as T,
        error: {
          message: "Unauthorized",
          status: 401,
        },
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    if (error instanceof ApiErrorImpl) {
      return {
        data: null as T,
        error: {
          message: error.message,
          status: error.status,
          code: error.code,
        },
      };
    }
    return {
      data: null as T,
      error: {
        message: "An unexpected error occurred",
        status: 500,
      },
    };
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, data: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: <T>(endpoint: string, data: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
};

// Gallery API functions - Commented out until backend API is implemented

export const getGalleryItems = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/gallery`);
    if (!response.ok) {
      throw new Error('Failed to fetch gallery items');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    throw error;
  }
};

export const addGalleryItem = async (formData: FormData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/gallery`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Failed to add gallery item');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding gallery item:', error);
    throw error;
  }
};

export const deleteGalleryItem = async (id: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete gallery item');
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    throw error;
  }
};

