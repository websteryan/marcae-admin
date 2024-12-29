
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase";

const login = async (email: string, password: string, clientId: string) => {
  try {
    // Realiza o login do usuário
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Loga o usuário no console
    console.log("Usuário autenticado:", userCredential.user);
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
};

export default login;
