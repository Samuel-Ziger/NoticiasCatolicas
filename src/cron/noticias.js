const cron = require('node-cron');
const { buscarNoticiasRSS, salvarNoticias } = require('../modules/noticias/noticias.service');

// Função para buscar e salvar notícias
const atualizarNoticias = async () => {
  console.log('Iniciando atualização de notícias...');
  try {
    const noticias = await buscarNoticiasRSS();
    console.log(`Encontradas ${noticias.length} notícias nos feeds RSS`);
    await salvarNoticias(noticias);
    console.log('Notícias atualizadas com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar notícias:', error);
  }
};

// Executa imediatamente ao iniciar o servidor
atualizarNoticias();

// Agenda a tarefa para rodar a cada 5 minutos
cron.schedule('*/5 * * * *', atualizarNoticias); 