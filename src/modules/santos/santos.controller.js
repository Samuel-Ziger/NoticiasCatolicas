const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const fs = require('fs');

// Listar todos os santos
const getSantos = async (req, res) => {
  try {
    const santos = await prisma.santo.findMany({
      include: { wallpapers: true }
    });
    res.json(santos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar santos' });
  }
};

// Criar novo santo (nome + imagem)
const createSanto = async (req, res) => {
  try {
    const { nome } = req.body;
    let imagem = null;
    if (req.file) {
      imagem = `/uploads/santos/${req.file.filename}`;
    }
    const santo = await prisma.santo.create({
      data: { nome, imagem }
    });
    res.status(201).json(santo);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar santo' });
  }
};

// Upload de imagem para um santo existente
const uploadImagemParaSanto = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    const url = `/uploads/santos/${req.file.filename}`;
    // Cria um wallpaper vinculado ao santo
    const wallpaper = await prisma.wallpaper.create({
      data: {
        titulo: req.body.titulo || 'Imagem do Santo',
        url,
        santoId: parseInt(id)
      }
    });
    res.status(201).json(wallpaper);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar imagem ao santo' });
  }
};

// Listar imagens de um santo
const getImagensDoSanto = async (req, res) => {
  try {
    const { id } = req.params;
    const wallpapers = await prisma.wallpaper.findMany({
      where: { santoId: parseInt(id) }
    });
    res.json(wallpapers);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar imagens do santo' });
  }
};

module.exports = {
  getSantos,
  createSanto,
  uploadImagemParaSanto,
  getImagensDoSanto
}; 