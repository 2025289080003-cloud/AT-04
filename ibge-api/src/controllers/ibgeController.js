const ibgeService = require('../services/ibgeService');
const { AppError, handleError } = require('../utils/errorHandler');

class IbgeController {
  // a) Rota de listagem de dados externos com tratamento mínimo
  async getStates(req, res) {
    try {
      const states = await ibgeService.getAllStates();
      
      // Tratamento mínimo: remoção de campos desnecessários e renomeação
      const simplifiedStates = states.map(state => ({
        id: state.id,
        sigla: state.sigla,
        nome: state.nome,
        regiao: state.regiao?.nome || 'N/A'
      }));

      res.json({
        success: true,
        count: simplifiedStates.length,
        data: simplifiedStates
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  // b) Rota com parâmetro e filtro
  async getCitiesByState(req, res) {
    try {
      const { uf } = req.params;
      const { search, limit } = req.query;

      if (!uf) {
        throw new AppError('Parâmetro UF é obrigatório', 400);
      }

      const ufUpperCase = uf.toUpperCase();
      if (ufUpperCase.length !== 2) {
        throw new AppError('UF deve ter 2 caracteres', 400);
      }

      let cities = await ibgeService.getCitiesByState(ufUpperCase);

      // Filtro por nome da cidade (case insensitive)
      if (search) {
        cities = cities.filter(city => 
          city.nome.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Limite de resultados
      if (limit && !isNaN(limit)) {
        cities = cities.slice(0, parseInt(limit));
      }

      // Transformação dos dados
      const simplifiedCities = cities.map(city => ({
        id: city.id,
        nome: city.nome,
        microrregiao: city.microrregiao?.nome || 'N/A',
        mesorregiao: city.microrregiao?.mesorregiao?.nome || 'N/A'
      }));

      res.json({
        success: true,
        uf: ufUpperCase,
        count: simplifiedCities.length,
        data: simplifiedCities
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  // c) Rota com processamento ou agregação
  async getStatistics(req, res) {
    try {
      const states = await ibgeService.getAllStates();
      
      // Processamento: estatísticas por região
      const statsByRegion = states.reduce((acc, state) => {
        const region = state.regiao.nome;
        
        if (!acc[region]) {
          acc[region] = {
            quantidade_estados: 0,
            estados: []
          };
        }
        
        acc[region].quantidade_estados++;
        acc[region].estados.push({
          sigla: state.sigla,
          nome: state.nome
        });
        
        return acc;
      }, {});

      // Ordenação por quantidade de estados (decrescente)
      const sortedStats = Object.entries(statsByRegion)
        .map(([regiao, dados]) => ({
          regiao,
          ...dados
        }))
        .sort((a, b) => b.quantidade_estados - a.quantidade_estados);

      // Estatísticas gerais
      const totalStates = states.length;
      const regionsCount = Object.keys(statsByRegion).length;

      res.json({
        success: true,
        estatisticas_gerais: {
          total_estados: totalStates,
          total_regioes: regionsCount
        },
        dados_por_regiao: sortedStats
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  // d) Rota com transformação ou resumo informativo
  async getStateSummary(req, res) {
    try {
      const { uf } = req.params;

      if (!uf) {
        throw new AppError('Parâmetro UF é obrigatório', 400);
      }

      const ufUpperCase = uf.toUpperCase();
      
      // Buscar dados do estado
      const stateInfo = await ibgeService.getStateInfo(ufUpperCase);
      
      // Buscar municípios do estado
      const cities = await ibgeService.getCitiesByState(ufUpperCase);

      // Criar resumo informativo
      const summary = {
        estado: {
          sigla: stateInfo.sigla,
          nome: stateInfo.nome,
          regiao: stateInfo.regiao.nome
        },
        resumo_municipios: {
          total: cities.length,
          municipios_por_mesorregiao: cities.reduce((acc, city) => {
            const mesorregiao = city.microrregiao.mesorregiao.nome;
            acc[mesorregiao] = (acc[mesorregiao] || 0) + 1;
            return acc;
          }, {}),
          municipios_por_microrregiao: cities.reduce((acc, city) => {
            const microrregiao = city.microrregiao.nome;
            acc[microrregiao] = (acc[microrregiao] || 0) + 1;
            return acc;
          }, {})
        },
        informacoes_adicionais: {
          capital: cities.find(city => 
            city.nome.toLowerCase() === getCapitalByState(ufUpperCase)
          )?.nome || 'Não identificada',
          municipios_principais: cities
            .filter(city => isMajorCity(city.nome))
            .map(city => city.nome)
            .slice(0, 5)
        }
      };

      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      handleError(error, res);
    }
  }
}

// Funções auxiliares para o resumo
function getCapitalByState(uf) {
  const capitals = {
    'AC': 'rio branco', 'AL': 'maceió', 'AP': 'macapá', 'AM': 'manaus',
    'BA': 'salvador', 'CE': 'fortaleza', 'DF': 'brasília', 'ES': 'vitória',
    'GO': 'goiânia', 'MA': 'são luís', 'MT': 'cuiabá', 'MS': 'campo grande',
    'MG': 'belo horizonte', 'PA': 'belém', 'PB': 'joão pessoa', 'PR': 'curitiba',
    'PE': 'recife', 'PI': 'teresina', 'RJ': 'rio de janeiro', 'RN': 'natal',
    'RS': 'porto alegre', 'RO': 'porto velho', 'RR': 'boa vista', 'SC': 'florianópolis',
    'SP': 'são paulo', 'SE': 'aracaju', 'TO': 'palmas'
  };
  return capitals[uf] || '';
}

function isMajorCity(cityName) {
  const majorCities = [
    'são paulo', 'rio de janeiro', 'brasília', 'salvador', 'fortaleza',
    'belo horizonte', 'manaus', 'curitiba', 'recife', 'goiânia',
    'porto alegre', 'belém', 'guarulhos', 'campinas', 'são luís'
  ];
  return majorCities.includes(cityName.toLowerCase());
}

module.exports = new IbgeController();
