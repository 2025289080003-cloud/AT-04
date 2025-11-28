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
GET http://localhost:3000/api/ibge/estados

```json
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

```


