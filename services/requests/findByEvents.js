import api from "../api";

/**
 * Busca eventos de um mês específico
 */
export const findByEvents = async (month, year) => {
  try {
    const from = `${year}-${String(month).padStart(2, "0")}-01`;
    const lastDay = new Date(year, month, 0).getDate(); // <-- magia aqui 😄
    const to = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

    const response = await api.get(
      `space/findByEvents?%40from=${from}&%40to=${to}&%40seals=&%40select=id%2Ctype%2Cname%2Clocation%2Cendereco%2CsingleUrl&location=%21EQ%28%5B0%2C0%5D%29`
    );

    return { tipo: "sucesso", data: response.data };
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    return {
      tipo: "erro",
      msg: "Erro ao tentar listar os eventos.",
      data: error?.response?.data || error.message,
    };
  }
};
