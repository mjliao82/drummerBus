import { create } from "zustand";
import axios from "axios";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "client";
  subRole?: "Student" | "Parent";
  createdAt: Date;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem("auth_user") || "null"), // Load from storage

  setUser: (user) => {
    set({ user });
    if (user) {
      localStorage.setItem("auth_user", JSON.stringify(user)); // Persist in localStorage
    } else {
      localStorage.removeItem("auth_user"); // Clear on logout
    }
  },

  checkAuth: async () => {
    try {
      const res = await axios.get("http://localhost:5001/auth/check", { withCredentials: true });
      set({ user: res.data.user });
      localStorage.setItem("auth_user", JSON.stringify(res.data.user)); // Ensure persistence
    } catch {
      set({ user: null });
      localStorage.removeItem("auth_user");
    }
  },

  logout: () => {
    axios.post("http://localhost:5001/auth/logout", {}, { withCredentials: true })
      .then(() => {
        set({ user: null });
        localStorage.removeItem("auth_user");
      })
      .catch((err) => console.error("Logout error:", err));
  },
}));
