const express = require('express');
const router = express.Router();
const { getWallpapers, getWallpaperById, createWallpaper } = require('./wallpapers.controller');
const { getCategorias, getTagsSugeridas } = require('./wallpapers.service');

// Rotas públicas
router.get('/', getWallpapers);
router.get('/:id', getWallpaperById);
router.get('/categorias', (req, res) => {
  res.json(getCategorias());
});
router.get('/tags', (req, res) => {
  res.json(getTagsSugeridas());
});

// Rotas protegidas (futuramente com autenticação)
router.post('/', createWallpaper);

module.exports = router; 