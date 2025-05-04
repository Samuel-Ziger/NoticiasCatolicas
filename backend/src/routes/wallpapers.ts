import express from 'express'
import { pool } from '../db'

const router = express.Router()

// Obter todos os wallpapers
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, titulo, descricao, imagem, categoria FROM wallpapers ORDER BY id DESC'
    )
    res.json(result.rows)
  } catch (error) {
    console.error('Erro ao buscar wallpapers:', error)
    res.status(500).json({ error: 'Erro ao buscar wallpapers' })
  }
})

// Obter um wallpaper específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      'SELECT id, titulo, descricao, imagem, categoria FROM wallpapers WHERE id = $1',
      [id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Wallpaper não encontrado' })
    }
    
    res.json(result.rows[0])
  } catch (error) {
    console.error('Erro ao buscar wallpaper:', error)
    res.status(500).json({ error: 'Erro ao buscar wallpaper' })
  }
})

export default router 