import api from "../api";

/**
 * Busca todos os espaços culturais que são type Museus
 * @returns {Promise<{ tipo: 'sucesso' | 'erro', data?: any, msg?: string }>}
 */
export const findAll = async () => {
  try {
    const response = await api.get(
      "space/find?type=IN(60,61)&@select=id,type,name,terms,files,En_Municipio,En_Estado,horario,location,singleUrl"
    );

    return response.data;

  } catch (error) {
    console.error("Erro ao buscar os museus:", error);
    return {
      tipo: "erro",
      msg: "Erro ao tentar listar os museus.",
      data: error?.response?.data || error.message,
    };
  }
};
