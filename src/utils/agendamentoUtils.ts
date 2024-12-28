import { Timestamp } from "firebase/firestore";

// Função para formatar a data no formato "dd/mm/aaaa"
export const formatDate = (timestamp: Timestamp) => {
  const date = timestamp.toDate();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Meses começam do zero
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Função para formatar o horário no formato "HH:MM"
export const formatTime = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};


// Função para formatar um intervalo de tempo (por exemplo: "08:00 - 09:00")
export const formatTimeRange = (dataInicio: Timestamp, duracao: number) => {
  const dataInicioDate = dataInicio.toDate();
  const dataFim = new Date(dataInicioDate.getTime() + duracao * 60000); // Soma da duração (em minutos)
console.log(`Duração do serviço: ${duracao} minutos`);
  const inicio = formatTime(dataInicioDate);
  const fim = formatTime(dataFim);
  console.log(`Horário de início: ${inicio}`);
  console.log(`Horário de término: ${fim}`);
  return `${inicio} - ${fim}`;
};
