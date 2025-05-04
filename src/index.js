const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const noticiasRoutes = require('./modules/noticias/noticias.routes');
const wallpapersRoutes = require('./modules/wallpapers/wallpapers.routes');
const caminhoRoutes = require('./modules/caminho/caminho.routes');
const igrejaRoutes = require('./modules/igreja/igreja.routes');
const rosarioRoutes = require('./modules/rosario/rosario.routes');
const ensinamentosRoutes = require('./modules/ensinamentos/ensinamentos.routes');
const { atualizarNoticias } = require('./modules/noticias/noticias.service');

const app = express();
const prisma = new PrismaClient();

// Configuração do CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rotas
app.use('/api/noticias', noticiasRoutes);
app.use('/api/wallpapers', wallpapersRoutes);
app.use('/api/caminho', caminhoRoutes);
app.use('/api/igreja', igrejaRoutes);
app.use('/api/rosario', rosarioRoutes);
app.use('/api/ensinamentos', ensinamentosRoutes);

// Rota inicial
app.get('/api', (req, res) => {
  res.json({ message: 'API da Igreja Católica' });
});

// Atualização automática de notícias a cada 5 minutos
setInterval(atualizarNoticias, 5 * 60 * 1000);

// Primeira atualização ao iniciar o servidor
atualizarNoticias();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 