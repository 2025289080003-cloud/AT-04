const express = require('express');
const cors = require('cors');
const ibgeRoutes = require('./routes/ibgeRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/ibge', ibgeRoutes);

// Rota principal
app.get('/', (req, res) => {
  res.json({
    message: 'API IBGE - Dados de Estados e Municípios Brasileiros',
    endpoints: {
      estados: '/api/ibge/estados',
      municipios: '/api/ibge/estados/:uf/municipios',
      resumo: '/api/ibge/estados/:uf/resumo',
      estatisticas: '/api/ibge/estatisticas'
    }
  });
});

// Middleware de erro 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    message: `A rota ${req.originalUrl} não existe nesta API`
  });
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  console.error('Erro:', error);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: error.message
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});
