import api from "../api";

export const findOne = async (id) => {
  try {
    const encodedId = encodeURIComponent(`EQ(${id})`);
    const response = await api.get(`space/findOne?id=${encodedId}&@select=*`);
    return response.data;

  } catch (error) {
    console.error("Erro ao buscar o museu:", error);
    return {
      tipo: "erro",
      msg: "Erro ao tentar listar o museu.",
      data: error?.response?.data || error.message,
    };
  }
};
