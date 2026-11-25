import { createContext, useContext, type ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface AuthContextType {
  token: string;
  userName: string;
  login: (token: string, userName: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  // uso el hook de localStorage asi no se pierde al recargar
  const [token, setToken] = useLocalStorage("token", "");
  const [userName, setUserName] = useLocalStorage("user", "");

  function login(newToken: string, name: string) {
    setToken(newToken);
    setUserName(name);
  }

  function logout() {
    setToken("");
    setUserName("");
  }

  return (
    <AuthContext.Provider value={{ token, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
