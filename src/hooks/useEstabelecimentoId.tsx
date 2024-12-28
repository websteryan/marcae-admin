import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/auth-context"; // Certifique-se de ajustar o caminho se necessário
import { User } from "firebase/auth";

const useEstabelecimentoId = () => {
  const { currentUser, fetchEstabelecimentoId } = useContext(AuthContext);
  const [estabelecimentoId, setEstabelecimentoId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchId = async () => {
      if (currentUser) {
        try {
          const id = await fetchEstabelecimentoId(currentUser);
          setEstabelecimentoId(id);
        } catch (err) {
          setError("Erro ao buscar o Estabelecimento ID");
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    if (currentUser) {
      fetchId();
    } else {
      setLoading(false);
    }
  }, [currentUser, fetchEstabelecimentoId]);

  return { estabelecimentoId, loading, error };
};

export default useEstabelecimentoId;
