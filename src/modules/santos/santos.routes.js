const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getSantos, createSanto, uploadImagemParaSanto, getImagensDoSanto } = require('./santos.controller');

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/santos'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Rotas
router.get('/', getSantos);
router.post('/', upload.single('imagem'), createSanto);
router.post('/:id/imagens', upload.single('imagem'), uploadImagemParaSanto);
router.get('/:id/imagens', getImagensDoSanto);

module.exports = router; 