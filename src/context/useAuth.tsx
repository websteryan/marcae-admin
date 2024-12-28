import { useContext } from "react";
import { AuthContext } from "@/context/auth-context"; // Altere o caminho conforme sua estrutura

// Hook customizado para consumir o AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
