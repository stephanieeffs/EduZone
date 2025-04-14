export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "teacher" | "student" | "parent" | "librarian";
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
