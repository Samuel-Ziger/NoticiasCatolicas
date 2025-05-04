const express = require('express');
const router = express.Router();

// Rota de teste
router.get('/', (req, res) => {
  res.json({ message: 'Rota funcionando!' });
});

module.exports = router;