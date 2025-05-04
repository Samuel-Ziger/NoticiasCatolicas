import express from 'express'
import cors from 'cors'
import noticiasRoutes from './routes/noticias'
import wallpapersRoutes from './routes/wallpapers'
import ensinamentosRoutes from './routes/ensinamentos'
import caminhoRoutes from './routes/caminho'
import igrejaRoutes from './routes/igreja'
import buscaRoutes from './routes/busca'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/noticias', noticiasRoutes)
app.use('/api/wallpapers', wallpapersRoutes)
app.use('/api/ensinamentos', ensinamentosRoutes)
app.use('/api/caminho', caminhoRoutes)
app.use('/api/igreja', igrejaRoutes)
app.use('/api/busca', buscaRoutes)

export default app 