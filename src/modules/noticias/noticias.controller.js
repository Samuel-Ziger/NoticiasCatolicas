const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getNoticias = async (req, res) => {
  try {
    console.log('Buscando notícias...');
    
    // Adiciona uma notícia de teste se não houver nenhuma
    const count = await prisma.noticia.count();
    if (count === 0) {
      await prisma.noticia.create({
        data: {
          titulo: 'Notícia de Teste',
          link: 'https://exemplo.com/noticia',
          descricao: 'Esta é uma notícia de teste',
          data: new Date(),
          fonte: 'Teste'
        }
      });
      console.log('Notícia de teste criada');
    }
    
    const noticias = await prisma.noticia.findMany({
      orderBy: {
        data: 'desc'
      }
    });
    console.log('Notícias encontradas:', noticias);
    res.json(noticias);
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    res.status(500).json({ error: 'Erro ao buscar notícias' });
  }
};

module.exports = {
  getNoticias
}; 