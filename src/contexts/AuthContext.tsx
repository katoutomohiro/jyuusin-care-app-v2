/* dev stub */
import * as React from "react";
export function useAuth() {
  return {
    user: { id: "", name: "", email: "" },
    login: async (email: string, password: string) => {},
    logout: () => {},
    isAuthenticated: true,
    isLoading: false,
  };
}