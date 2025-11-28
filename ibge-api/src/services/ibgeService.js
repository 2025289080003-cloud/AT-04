const axios = require('axios');
const { AppError } = require('../utils/errorHandler');

const IBGE_BASE_URL = 'https://servicodados.ibge.gov.br/api/v1';

class IbgeService {
  constructor() {
    this.httpClient = axios.create({
      baseURL: IBGE_BASE_URL,
      timeout: 10000
    });
  }

  async getAllStates() {
    try {
      const response = await this.httpClient.get('/localidades/estados');
      return response.data;
    } catch (error) {
      throw new AppError('Erro ao buscar dados dos estados no IBGE', 502);
    }
  }

  async getCitiesByState(uf) {
    try {
      const response = await this.httpClient.get(`/localidades/estados/${uf}/municipios`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new AppError(`UF ${uf} não encontrada`, 404);
      }
      throw new AppError('Erro ao buscar dados dos municípios no IBGE', 502);
    }
  }

  async getStateInfo(uf) {
    try {
      const response = await this.httpClient.get(`/localidades/estados/${uf}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new AppError(`UF ${uf} não encontrada`, 404);
      }
      throw new AppError('Erro ao buscar dados do estado no IBGE', 502);
    }
  }
}

module.exports = new IbgeService();
