import { Router } from 'express'
import { pool } from '../db'

const router = Router()

router.get('/', async (req, res) => {
  const { q } = req.query

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Query parameter is required' })
  }

  try {
    const searchTerm = `%${q}%`
    
    // Buscar em todas as tabelas
    const [noticias] = await pool.query(
      'SELECT id, titulo, descricao, imagem, "noticia" as tipo FROM noticias WHERE titulo LIKE ? OR descricao LIKE ?',
      [searchTerm, searchTerm]
    )

    const [wallpapers] = await pool.query(
      'SELECT id, titulo, descricao, imagem, "wallpaper" as tipo FROM wallpapers WHERE titulo LIKE ? OR descricao LIKE ?',
      [searchTerm, searchTerm]
    )

    const [ensinamentos] = await pool.query(
      'SELECT id, titulo, descricao, imagem, "ensinamento" as tipo FROM ensinamentos WHERE titulo LIKE ? OR descricao LIKE ?',
      [searchTerm, searchTerm]
    )

    const [caminho] = await pool.query(
      'SELECT id, titulo, descricao, imagem, "caminho" as tipo FROM caminho WHERE titulo LIKE ? OR descricao LIKE ?',
      [searchTerm, searchTerm]
    )

    const [igreja] = await pool.query(
      'SELECT id, titulo, descricao, imagem, "igreja" as tipo FROM igreja WHERE titulo LIKE ? OR descricao LIKE ?',
      [searchTerm, searchTerm]
    )

    // Combinar resultados
    const results = [
      ...noticias,
      ...wallpapers,
      ...ensinamentos,
      ...caminho,
      ...igreja
    ]

    res.json(results)
  } catch (error) {
    console.error('Erro na busca:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

export default router 