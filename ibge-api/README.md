# API IBGE - Dados de Estados e Municípios Brasileiros

## Descrição do Projeto

Esta é uma API desenvolvida em Node.js com Express que consome dados abertos do IBGE (Instituto Brasileiro de Geografia e Estatística) sobre estados e municípios brasileiros. A API realiza processamento, filtragem e transformação dos dados para fornecer respostas úteis e organizadas.

## API Escolhida

**IBGE - Localidades**
- Base URL: `https://servicodados.ibge.gov.br/api/v1/localidades`
- Documentação: [IBGE API](https://servicodados.ibge.gov.br/api/docs/localidades)
- Características: Dados abertos, sem necessidade de autenticação, respostas em JSON

## Rotas da API

### a) Listagem de Estados Brasileiros
**GET** `/api/ibge/estados`

Retorna a lista de todos os estados brasileiros com dados simplificados.

**Exemplo de Requisição:**
```http
GET http://localhost:3000/api/ibge/estados

{
  "success": true,
  "count": 27,
  "data": [
    {
      "id": 35,
      "sigla": "SP",
      "nome": "São Paulo",
      "regiao": "Sudeste"
    }
  ]
}

b) Municípios por Estado com Filtros
GET /api/ibge/estados/:uf/municipios

Retorna os municípios de um estado específico com opções de filtro.

Parâmetros:

uf (path): Sigla do estado (ex: SP, RJ, MG)

search (query): Filtro por nome do município

limit (query): Limite de resultados

Exemplo de Requisição:

http
GET http://localhost:3000/api/ibge/estados/SP/municipios?search=são&limit=5
Exemplo de Resposta:

json
{
  "success": true,
  "uf": "SP",
  "count": 5,
  "data": [
    {
      "id": 3550308,
      "nome": "São Paulo",
      "microrregiao": "São Paulo",
      "mesorregiao": "Metropolitana de São Paulo"
    }
  ]
}
c) Estatísticas por Região
GET /api/ibge/estatisticas

Retorna estatísticas processadas sobre os estados brasileiros agrupados por região.

Exemplo de Requisição:

http
GET http://localhost:3000/api/ibge/estatisticas
Exemplo de Resposta:

json
{
  "success": true,
  "estatisticas_gerais": {
    "total_estados": 27,
    "total_regioes": 5
  },
  "dados_por_regiao": [
    {
      "regiao": "Nordeste",
      "quantidade_estados": 9,
      "estados": [
        { "sigla": "MA", "nome": "Maranhão" }
      ]
    }
  ]
}
d) Resumo do Estado
GET /api/ibge/estados/:uf/resumo

Retorna um resumo informativo completo sobre um estado específico.

Exemplo de Requisição:

http
GET http://localhost:3000/api/ibge/estados/SP/resumo
Exemplo de Resposta:

json
{
  "success": true,
  "data": {
    "estado": {
      "sigla": "SP",
      "nome": "São Paulo",
      "regiao": "Sudeste"
    },
    "resumo_municipios": {
      "total": 645,
      "municipios_por_mesorregiao": {
        "Metropolitana de São Paulo": 39,
        "Campinas": 49
      }
    },
    "informacoes_adicionais": {
      "capital": "São Paulo",
      "municipios_principais": ["São Paulo", "Campinas", "Guarulhos"]
    }
  }
}
