const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categorias = [
  'Jesus Cristo',
  'Nossa Senhora',
  'Santos',
  'Crucifixos',
  'Igrejas',
  'Arte Sacra'
];

const getCategorias = () => {
  return categorias;
};

const getTagsSugeridas = () => {
  return [
    'paz',
    'amor',
    'fé',
    'esperança',
    'oração',
    'santidade',
    'milagre',
    'graça',
    'misericórdia',
    'redenção'
  ];
};

module.exports = {
  getCategorias,
  getTagsSugeridas
}; 