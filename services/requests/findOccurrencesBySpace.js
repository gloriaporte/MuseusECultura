import api from "../api";

/**
 * Busca as ocorrências (eventos) de um espaço em um intervalo de datas
 * @param {number} spaceId
 * @param {string} from
 * @param {string} to
 * @returns {Promise<any[]>}
 */
export const findOccurrencesBySpace = async (spaceId, from, to) => {
    
  try {
    const response = await api.get(
      `event/occurrences?space%3Aid=EQ%28${spaceId}%29&%40from=${from}&%40to=${to}&%40seals=&event%3A%40select=id%2Cname%2Cterms%2Cfiles.avatar%2CclassificacaoEtaria&%40order=name+ASC`
    );
    return { tipo: "sucesso", data: response.data };
  } catch (error) {
    console.error("Erro ao buscar eventos do espaço:", error);
    return [];
  }
};
