import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "./api";
import { AuthContextType, User } from "./auth-constants";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("eduzone-token");
        if (token) {
          const response = await api.get<{ data: User }>("/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Check if the response has an error with status 401
          if (response.error && response.error.status === 401) {
            // 401 is expected when not logged in, just clear the token
            localStorage.removeItem("eduzone-token");
            setUser(null);
          } else if (response.data && response.data.data) {
            setUser(response.data.data);
          } else {
            localStorage.removeItem("eduzone-token");
            setUser(null);
          }
        }
      } catch (err) {
        console.error("Auth check error:", err);
        setError("Authentication failed");
        localStorage.removeItem("eduzone-token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post<{ data: { user: User; token: string } }>(
        "/auth/login",
        {
          email,
          password,
        }
      );

      if (response.data && response.data.data) {
        const { user, token } = response.data.data;
        localStorage.setItem("eduzone-token", token);
        setUser(user);
      } else {
        throw new Error(response.error?.message || "Login failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("eduzone-token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
