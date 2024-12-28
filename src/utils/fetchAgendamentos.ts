import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { User } from "firebase/auth";

// Função assíncrona para buscar o estabelecimentoId do usuário
const fetchEstabelecimentoId = async (user: User | null) => {
  if (!user || !user.uid) {
    throw new Error("Usuário não encontrado");
  }

  try {
    // Referência ao documento do usuário na coleção "usuarios"
    const userRef = doc(db, "usuarios", user.uid);
    
    // Busca o documento do usuário
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // Pega o estabelecimentoId do documento do usuário
      const estabelecimentoId = userDoc.data()?.estabelecimentoId;
      if (!estabelecimentoId) {
        throw new Error("Estabelecimento ID não encontrado no documento do usuário");
      }
      return estabelecimentoId;
    } else {
      throw new Error("Documento de usuário não encontrado");
    }
  } catch (error) {
    console.error("Erro ao buscar o estabelecimentoId do usuário:", error);
    throw error;
  }
};

// Função assíncrona para buscar os agendamentos
export const fetchAgendamentos = async (user: User | null) => {
  try {
    // Primeiro, busca o estabelecimentoId do usuário
    const estabelecimentoId = await fetchEstabelecimentoId(user);

    // Referência à subcoleção de agendamentos dentro do estabelecimento
    const agendamentosRef = collection(db, `estabelecimentos/${estabelecimentoId}/agendamentos`);

    // Busca os documentos na subcoleção de agendamentos
    const querySnapshot = await getDocs(agendamentosRef);

    // Mapeia os documentos para um array de objetos
    const agendamentos = querySnapshot.docs.map((doc) => ({
      id: doc.id, // ID do documento
      nome: doc.data().nome,
      preco: doc.data().preco,
      data: doc.data().data,
      status: doc.data().status,
      duracao: doc.data().duracao,
      servicoId: doc.data().servicoId,
    }));

    return agendamentos;
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    throw error;
  }
};

