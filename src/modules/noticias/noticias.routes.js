const express = require('express');
const router = express.Router();
const { getNoticias } = require('./noticias.controller');

router.get('/', getNoticias);

module.exports = router; 