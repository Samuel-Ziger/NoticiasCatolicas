const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getWallpapers = async (req, res) => {
  try {
    const { categoria, tag } = req.query;
    
    const where = {};
    if (categoria) where.categoria = categoria;
    if (tag) where.tags = { has: tag };
    
    const wallpapers = await prisma.wallpaper.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        titulo: true,
        descricao: true,
        urlThumbnail: true,
        tamanho: true,
        formato: true,
        categoria: true,
        tags: true,
        downloads: true,
        createdAt: true
      }
    });
    
    res.json(wallpapers);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar wallpapers' });
  }
};

const getWallpaperById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const wallpaper = await prisma.wallpaper.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!wallpaper) {
      return res.status(404).json({ error: 'Wallpaper não encontrado' });
    }
    
    // Incrementa o contador de downloads
    await prisma.wallpaper.update({
      where: { id: parseInt(id) },
      data: { downloads: { increment: 1 } }
    });
    
    res.json(wallpaper);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar wallpaper' });
  }
};

const createWallpaper = async (req, res) => {
  try {
    const { titulo, descricao, url, urlThumbnail, tamanho, formato, categoria, tags } = req.body;
    
    const wallpaper = await prisma.wallpaper.create({
      data: {
        titulo,
        descricao,
        url,
        urlThumbnail,
        tamanho,
        formato,
        categoria,
        tags
      }
    });
    
    res.status(201).json(wallpaper);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar wallpaper' });
  }
};

module.exports = {
  getWallpapers,
  getWallpaperById,
  createWallpaper
}; 