import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "./api";
import { AuthContextType, User } from "./auth-constants";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Demo users for development when backend is unavailable
const DEMO_USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@eduzone.com",
    role: "admin",
  },
  {
    id: "2",
    name: "John Smith",
    email: "john.smith@eduzone.com",
    role: "teacher",
  },
  {
    id: "3",
    name: "Sarah Johnson",
    email: "sarah.johnson@eduzone.com",
    role: "parent",
  },
  {
    id: "4",
    name: "Librarian User",
    email: "librarian@eduzone.com",
    role: "librarian",
  },
];

// Use demo mode when we're in development
const USE_DEMO_AUTH = true;

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
          // Check for demo token
          if (token.startsWith("demo_")) {
            const demoEmail = token.split("_")[1];
            const demoUser = DEMO_USERS.find((u) => u.email === demoEmail);

            if (demoUser) {
              console.log("Using demo user from token:", demoUser);
              setUser(demoUser as User);
              setLoading(false);
              return;
            }
          }

          // Normal auth check
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

      // Log the login attempt for debugging
      console.log(`Attempting to login with email: ${email}`);

      // DEMO AUTH MODE - use this when backend is not available
      if (USE_DEMO_AUTH && password === "password123") {
        const demoUser = DEMO_USERS.find((u) => u.email === email);

        if (demoUser) {
          console.log("DEMO MODE: Login successful with", demoUser);
          // Store a special demo token
          const demoToken = `demo_${email}`;
          localStorage.setItem("eduzone-token", demoToken);
          setUser(demoUser as User); // Type assertion to fix the error
          return;
        }
      }

      // Normal login flow - try API
      const response = await api.post<any>("/auth/login", {
        email,
        password,
      });

      // Log the response for debugging
      console.log("Login response:", response);

      // Check for errors in the response
      if (response.error) {
        console.error("Login error:", response.error);
        throw new Error(response.error.message || "Login failed");
      }

      // Handle different response structures
      // The backend might return: { data: { token, user } } or { data: { data: { token, user } } }
      let userData = null;
      let token = null;

      if (response.data) {
        if (response.data.data) {
          // Handle nested data structure
          if (response.data.data.token && response.data.data.user) {
            userData = response.data.data.user;
            token = response.data.data.token;
          } else if (response.data.data.data && response.data.data.data.token) {
            // Handle deeper nesting if needed
            userData = response.data.data.data.user;
            token = response.data.data.data.token;
          }
        } else if (response.data.token && response.data.user) {
          // Handle direct data structure
          userData = response.data.user;
          token = response.data.token;
        }
      }

      if (userData && token) {
        console.log("Login successful:", userData);
        localStorage.setItem("eduzone-token", token);
        setUser(userData);
      } else {
        console.error("Login failed: Invalid response format", response);
        throw new Error("Login failed: Invalid response format");
      }
    } catch (err) {
      console.error("Login error:", err);
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
