"use client";

import { User, signInWithEmailAndPassword } from "firebase/auth";
import { db, SignOutUser, userStateListener } from "../firebase/firebase";
import { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/firebase"; // Importe o auth configurado no seu projeto Firebase
import { doc, getDoc } from "firebase/firestore";

interface Props {
  children?: ReactNode;
}

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: (_user: User) => void;
  signOut: () => void;
  loginUser: (_email: string, _password: string) => void;
  fetchEstabelecimentoId: (user: User | null) => Promise<string>;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  setCurrentUser: () => {},
  signOut: () => {},
  loginUser: async () => {},
  fetchEstabelecimentoId: async () => "", // Placeholder para evitar erro de tipagem
});

export const AuthProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useRouter();
  
  useEffect(() => {
    const unsubscribe = userStateListener((user) => {
      if (user) {
        setCurrentUser(user);
      }
    });
    return unsubscribe;
  }, [setCurrentUser]);

  // Função para fazer o login do usuário
  const loginUser = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser(userCredential.user); // Atualiza o estado com o usuário autenticado
      navigate.push("/"); // Redireciona para a página principal ou dashboard após o login
    } catch (error) {
      console.error("Erro ao fazer login: ", error);
      // Tratar o erro de login (ex: mostrar uma mensagem de erro)
    }
  };

  // Função de logout
  const signOut = () => {
    SignOutUser();
    setCurrentUser(null);
    navigate.push("/login"); // Redireciona para a página de login após logout
  };

  const fetchEstabelecimentoId = async (user: User | null): Promise<string> => {
    if (!user || !user.uid) {
      throw new Error("Usuário não encontrado");
    }
  
    try {
      const userRef = doc(db, "usuarios", user.uid);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const estabelecimentoId = userDoc.data()?.estabelecimentoId;
        if (!estabelecimentoId) {
          throw new Error("Estabelecimento ID não encontrado no documento do usuário");
        }
        return estabelecimentoId; // Retorna a string corretamente
      } else {
        throw new Error("Documento de usuário não encontrado");
      }
    } catch (error) {
      console.error("Erro ao buscar o estabelecimentoId do usuário:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    currentUser,
    setCurrentUser,
    signOut,
    loginUser, // Expondo a função de login no contexto
    fetchEstabelecimentoId,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
