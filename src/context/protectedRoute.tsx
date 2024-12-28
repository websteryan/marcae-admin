"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/auth-context";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const { currentUser } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      // Redireciona para a página de login caso o usuário não esteja autenticado
      router.push("/login");
    }
  }, [currentUser, router]);

  // Retorna null enquanto verifica o estado de autenticação
  if (!currentUser) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
