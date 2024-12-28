/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useContext, useEffect, useState } from "react";
import { fetchAgendamentos } from "@/utils/fetchAgendamentos"; // Importe a função de busca
import { AuthContext } from "@/context/auth-context";
import { doc, getDoc, getFirestore, onSnapshot, collection } from "firebase/firestore"; // Importar onSnapshot
import React from "react";
import { db } from "@/firebase/firebase";
import { formatTimeRange } from "@/utils/agendamentoUtils";

interface Agendamento {
  id: string;
  nome: string;
  preco: number;
  data: any;
  status: string;
  duracao: number;
  servicoId: string;
}

const TableThree = () => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { currentUser, fetchEstabelecimentoId } = useContext(AuthContext);
  const [error, setError] = useState<string | null>(null);
  const [servicosDuracao, setServicosDuracao] = useState<{
    [key: string]: { duracao: number; nome: string; preco: number };
  }>({});
  const [estabelecimentoId, setEstabelecimentoId] = useState<string | null>(null);

  const fetchDuracaoENomePrecoServico = async (
    estabelecimentoId: string | null,
    servicoId: string
  ) => {
    if (!estabelecimentoId) {
      console.error("Estabelecimento ID não fornecido.");
      return { duracao: 0, nome: "Serviço não encontrado", preco: 0 };
    }

    try {
      const servicoRef = doc(db, `estabelecimentos/${estabelecimentoId}/servicos`, servicoId);
      const servicoDoc = await getDoc(servicoRef);

      if (servicoDoc.exists()) {
        const servicoData = servicoDoc.data();
        console.log("Serviço encontrado:", servicoData);

        return {
          duracao: servicoData?.duracao || 0,
          nome: servicoData?.nome || "Serviço sem nome",
          preco: servicoData?.preco || 0,
        };
      } else {
        console.warn("Serviço não encontrado para o ID:", servicoId);
        return { duracao: 0, nome: "Serviço não encontrado", preco: 0 };
      }
    } catch (error) {
      console.error("Erro ao buscar informações do serviço:", error);
      return { duracao: 0, nome: "Erro ao carregar serviço", preco: 0 };
    }
  };

  useEffect(() => {
    const loadAgendamentos = async () => {
      try {
        if (currentUser) {
          const id = await fetchEstabelecimentoId(currentUser);
          setEstabelecimentoId(id);

          // Escuta em tempo real para os agendamentos
          const agendamentosRef = collection(db, `estabelecimentos/${id}/agendamentos`);
          const unsubscribe = onSnapshot(agendamentosRef, async (snapshot) => {
            const agendamentosData: Agendamento[] = snapshot.docs.map((doc) => {
              const data = doc.data();
              return { id: doc.id, ...data } as Agendamento;
            });

            // Ordenar os agendamentos pela data, do mais próximo para o mais distante
            agendamentosData.sort((a, b) => a.data.toDate() - b.data.toDate());

            setAgendamentos(agendamentosData);

            const servicosInfo: { [key: string]: { duracao: number; nome: string; preco: number } } = {};
            for (const agendamento of agendamentosData) {
              const { duracao, nome, preco } = await fetchDuracaoENomePrecoServico(id, agendamento.servicoId);
              servicosInfo[agendamento.servicoId] = { duracao, nome, preco };
            }
            setServicosDuracao(servicosInfo);
          });

          return () => unsubscribe(); // Limpar a escuta quando o componente for desmontado
        } else {
          console.error("Estabelecimento ID não encontrado.");
          setError("Estabelecimento ID não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao carregar os agendamentos:", error);
        setError("Erro ao carregar os agendamentos.");
      } finally {
        setLoading(false);
      }
    };

    loadAgendamentos();
  }, [currentUser, fetchEstabelecimentoId]);

  if (loading) {
    return <p>Carregando agendamentos...</p>;
  }

  if (agendamentos.length === 0) {
    return <p>Nenhum agendamento encontrado.</p>;
  }

  // Função para formatar data do tipo Timestamp
  const formatDate = (timestamp: any) => {
    const date = timestamp.toDate();
    const day = date.toLocaleString("pt-BR", { weekday: "short" });
    const dayNumber = date.toLocaleString("pt-BR", { day: "numeric" });
    const month = date.toLocaleString("pt-BR", { month: "long" });
    const year = date.toLocaleString("pt-BR", { year: "numeric" });

    return (
      <span className="flex  items-left space-x-1">
        <div className="flex flex-col items-center space-x-1 space-y-1 font-semibold text-2xl">
          <span className="text-[#E3400A]">{day}</span>
          <span className="text-[#E3400A]">{dayNumber}</span>
        </div>
      </span>
    );
  };

  // Agrupar agendamentos por mês
  const groupByMonth = (agendamentos: Agendamento[]) => {
    return agendamentos.reduce((groups, agendamento) => {
      const date = agendamento.data.toDate();
      const month = date.toLocaleString("pt-BR", { month: "long" });
      if (!groups[month]) {
        groups[month] = [];
      }
      groups[month].push(agendamento);
      return groups;
    }, {} as Record<string, Agendamento[]>);
  };

  const agendamentosPorMes = groupByMonth(agendamentos);

  return (
    <div className="rounded-lg border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-fixed rounded-2xl">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Data
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Horário
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Cliente
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Serviço
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Preço
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(agendamentosPorMes).map((month) => (
              <React.Fragment key={month}>
                {/* Título do mês */}
                <tr>
                  <td colSpan={5} className=" py-5 ">
                    <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300">{month}</h3>
                  </td>
                </tr>
                {/* Agendamentos do mês */}
                {agendamentosPorMes[month].map((agendamento, key) => (
                  <tr
                    key={key}
                    className="h-10 border border-[#eee] dark:border-strokedark rounded-3xl"
                  >
                    <td className="px-4 py-5 rounded-3xl">
                      <p className="text-black dark:text-white">{formatDate(agendamento.data)}</p>
                    </td>
                    <td className="px-4 py-5 rounded-3xl">
                      <p className="text-black dark:text-white font-medium">
                        {formatTimeRange(agendamento.data, Number(servicosDuracao[agendamento.servicoId]?.duracao || 0))}
                      </p>
                    </td>
                    <td className="px-4 py-5 rounded-3xl">
                      <h5 className="font-medium text-black dark:text-white">{agendamento.nome}</h5>
                    </td>
                    <td className="px-4 py-5 rounded-3xl">
                      <h5 className="font-medium text-black dark:text-white">
                        {servicosDuracao[agendamento.servicoId]?.nome || "Serviço não encontrado"}
                      </h5>
                    </td>
                    <td className="px-4 py-5 rounded-3xl">
                      <h5 className="font-medium text-black dark:text-white">
                        {servicosDuracao[agendamento.servicoId]?.preco
                          ? `R$ ${servicosDuracao[agendamento.servicoId].preco.toFixed(2)}`
                          : "R$ 0,00"}
                      </h5>
                    </td>
                    <td className="px-4 py-5 rounded-3xl">
                      <h5 className="font-medium text-black dark:text-white">{agendamento.status}</h5>
                    </td>
                    <td className="px-4 py-5 rounded-lg">
                      <button
                        type="button"
                        className="rounded-md bg-primary p-2 text-[#ddd]"
                      >
                        Ação
                      </button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableThree;
