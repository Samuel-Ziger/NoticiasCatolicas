// URL base da API
export const API_BASE_URL = 'http://localhost:3000/api';

export const ENDPOINTS = {
  // Autenticação
  LOGIN: '/api/auth/login',
  VERIFICAR_TOKEN: '/api/auth/verificar-token',
  
  // Favoritos
  FAVORITOS: '/api/favoritos',
  
  // Notícias
  NOTICIAS: '/api/noticias',
  
  // Wallpapers
  WALLPAPERS: '/api/wallpapers',
  WALLPAPERS_CATEGORIAS: '/api/wallpapers/categorias',
  WALLPAPERS_TAGS: '/api/wallpapers/tags',
  
  // Caminho Neocatecumenal
  CAMINHO: '/api/caminho',
  CAMINHO_DETALHE: (slug: string) => `/api/caminho/${slug}`,
  
  // Igreja
  IGREJA: '/api/igreja',
  IGREJA_DETALHE: (slug: string) => `/api/igreja/${slug}`,
  
  // Rosário
  ROSARIO_DIA: '/api/rosario/dia',
  ROSARIO_TIPOS: '/api/rosario/tipos',
  
  // Ensinamentos
  VERSICULO_DIA: '/api/ensinamentos/versiculo/dia',
  MANDAMENTOS: '/api/ensinamentos/mandamentos',
  ENSINAMENTOS: '/api/ensinamentos',
  
  // Busca
  BUSCA: '/api/busca'
}; 