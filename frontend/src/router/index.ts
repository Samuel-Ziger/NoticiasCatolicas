import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NoticiasView from '../views/NoticiasView.vue'
import NoticiaDetalheView from '../views/NoticiaDetalheView.vue'
import WallpapersView from '../views/WallpapersView.vue'
import WallpaperDetalheView from '../views/WallpaperDetalheView.vue'
import CaminhoView from '../views/CaminhoView.vue'
import CaminhoDetalheView from '../views/CaminhoDetalheView.vue'
import IgrejaView from '../views/IgrejaView.vue'
import IgrejaDetalheView from '../views/IgrejaDetalheView.vue'
import RosarioView from '../views/RosarioView.vue'
import EnsinamentosView from '../views/EnsinamentosView.vue'
import EnsinamentoDetalheView from '../views/EnsinamentoDetalheView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/noticias',
      name: 'noticias',
      component: NoticiasView
    },
    {
      path: '/noticias/:id',
      name: 'noticia-detalhe',
      component: NoticiaDetalheView
    },
    {
      path: '/wallpapers',
      name: 'wallpapers',
      component: WallpapersView
    },
    {
      path: '/wallpapers/:id',
      name: 'wallpaper-detalhe',
      component: WallpaperDetalheView
    },
    {
      path: '/caminho',
      name: 'caminho',
      component: CaminhoView
    },
    {
      path: '/caminho/:slug',
      name: 'caminho-detalhe',
      component: CaminhoDetalheView
    },
    {
      path: '/igreja',
      name: 'igreja',
      component: IgrejaView
    },
    {
      path: '/igreja/:slug',
      name: 'igreja-detalhe',
      component: IgrejaDetalheView
    },
    {
      path: '/rosario',
      name: 'rosario',
      component: RosarioView
    },
    {
      path: '/ensinamentos',
      name: 'ensinamentos',
      component: EnsinamentosView
    },
    {
      path: '/ensinamentos/:id',
      name: 'ensinamento-detalhe',
      component: EnsinamentoDetalheView
    }
  ]
})

export default router
