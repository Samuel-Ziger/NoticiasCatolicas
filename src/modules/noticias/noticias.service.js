const Parser = require('rss-parser');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const parser = new Parser();

const fontesRSS = [
  {
    nome: 'Vatican News',
    url: 'https://www.vaticannews.va/pt.rss.xml',
    imagemPadrao: 'https://www.vaticannews.va/content/dam/vaticannews/agenzie/images/srv/logo-vaticannews.png'
  },
  {
    nome: 'Aleteia',
    url: 'https://pt.aleteia.org/feed/',
    imagemPadrao: 'https://pt.aleteia.org/wp-content/themes/aleteia/assets/images/aleteia-logo.png'
  },
  {
    nome: 'Canção Nova',
    url: 'https://noticias.cancaonova.com/feed/',
    imagemPadrao: 'https://img.cancaonova.com/cnimages/canais/uploads/sites/11/2017/02/formacao_cn.png'
  },
  {
    nome: 'CNBB',
    url: 'https://www.cnbb.org.br/feed/',
    imagemPadrao: 'https://www.cnbb.org.br/wp-content/uploads/sites/58/2018/08/CNBB.png'
  },
  {
    nome: 'ACI Digital',
    url: 'https://www.acidigital.com/rss/rss.php',
    imagemPadrao: 'https://www.acidigital.com/imagespp/AciDigital.jpg'
  }
];

// Função para decodificar caracteres HTML
const decodificarHTML = (texto) => {
  if (!texto) return '';
  return texto
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#8230;/g, '...')
    .replace(/&#8211;/g, '-')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"');
};

// Função para limpar texto de tags HTML e caracteres especiais
const limparTexto = (texto) => {
  if (!texto) return '';
  return decodificarHTML(
    texto
      .replace(/<[^>]*>/g, '')  // Remove tags HTML
      .replace(/\s+/g, ' ')     // Remove espaços extras
      .replace(/\[.*?\]/g, '')  // Remove conteúdo entre colchetes
      .replace(/\(.*?\)/g, '')  // Remove conteúdo entre parênteses
      .trim()                   // Remove espaços no início e fim
  );
};

const buscarNoticiasRSS = async () => {
  const noticias = [];
  console.log('Iniciando busca de notícias em todas as fontes...');
  
  for (const fonte of fontesRSS) {
    try {
      console.log(`Buscando notícias de ${fonte.nome}...`);
      const feed = await parser.parseURL(fonte.url);
      console.log(`Encontradas ${feed.items.length} notícias em ${fonte.nome}`);
      
      for (const item of feed.items) {
        try {
          const noticia = {
            titulo: limparTexto(item.title),
            link: item.link,
            descricao: limparTexto(item.content || item.description || ''),
            imagem: item.enclosure?.url || 
                   item['media:content']?.$.url || 
                   item.image?.url || 
                   fonte.imagemPadrao,
            data: new Date(item.pubDate || item.date || new Date()),
            fonte: fonte.nome
          };
          
          // Verifica se a notícia tem conteúdo mínimo válido
          if (noticia.titulo && noticia.link && noticia.descricao) {
            noticias.push(noticia);
          }
        } catch (itemError) {
          console.error(`Erro ao processar item de ${fonte.nome}:`, itemError);
        }
      }
    } catch (error) {
      console.error(`Erro ao buscar notícias de ${fonte.nome}:`, error);
    }
  }
  
  // Ordena as notícias por data mais recente
  noticias.sort((a, b) => b.data - a.data);
  
  console.log(`Total de notícias encontradas: ${noticias.length}`);
  return noticias;
};

const salvarNoticias = async (noticias) => {
  console.log('Iniciando salvamento de notícias...');
  let salvos = 0;
  let erros = 0;
  
  for (const noticia of noticias) {
    try {
      await prisma.noticia.upsert({
        where: {
          link: noticia.link
        },
        update: {
          titulo: noticia.titulo,
          descricao: noticia.descricao,
          imagem: noticia.imagem,
          data: noticia.data,
          updatedAt: new Date()
        },
        create: {
          ...noticia,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      salvos++;
    } catch (error) {
      console.error('Erro ao salvar notícia:', error);
      erros++;
    }
  }
  
  console.log(`Notícias salvas: ${salvos}, Erros: ${erros}`);
};

// Função para buscar notícias com paginação
const buscarNoticiasPaginadas = async (pagina = 1, limite = 20) => {
  const skip = (pagina - 1) * limite;
  
  const [noticias, total] = await Promise.all([
    prisma.noticia.findMany({
      skip,
      take: limite,
      orderBy: {
        data: 'desc'
      }
    }),
    prisma.noticia.count()
  ]);

  return {
    noticias,
    total,
    paginas: Math.ceil(total / limite),
    paginaAtual: pagina
  };
};

module.exports = {
  buscarNoticiasRSS,
  salvarNoticias,
  buscarNoticiasPaginadas
}; 
const atualizarNoticias = async () => {
  const noticias = await buscarNoticiasRSS();
  await salvarNoticias(noticias);
  console.log('Notícias atualizadas com sucesso!');
};

module.exports = {
  buscarNoticiasRSS,
  salvarNoticias,
  buscarNoticiasPaginadas,
  atualizarNoticias // <-- adicione aqui
};