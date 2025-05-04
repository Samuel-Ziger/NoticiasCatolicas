<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Navbar de Filtros -->
    <nav class="bg-white shadow rounded-lg mb-8">
      <ul class="flex flex-wrap gap-2 px-4 py-2">
        <li v-for="filtro in filtrosPrincipais" :key="filtro.id">
          <button
            @click="selecionarCategoria(filtro.id)"
            :class="[
              'px-4 py-2 rounded transition-colors font-medium',
              filtroSelecionado === filtro.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ filtro.nome }}
          </button>
        </li>
      </ul>
      <!-- Submenu de Santos -->
      <ul v-if="filtroSelecionado === 'santos'" class="flex flex-wrap gap-2 px-4 pb-2">
        <li v-for="santo in santosDisponiveis" :key="santo">
          <button
            @click="selecionarSanto(santo)"
            :class="[
              'px-3 py-1 rounded transition-colors text-sm',
              santoSelecionado === santo ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ santo }}
          </button>
        </li>
      </ul>
    </nav>

    <!-- Spinner de carregamento para imagens externas -->
    <div v-if="loadingExternos" class="flex justify-center mb-6">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      <span class="ml-3 text-primary font-medium">Carregando imagens externas...</span>
    </div>

    <!-- Mensagem de nenhum resultado -->
    <div v-if="!loading && !loadingExternos && wallpapersFiltrados.length === 0" class="text-center text-gray-500 py-12">
      Nenhum wallpaper encontrado.
    </div>

    <!-- Grid de Wallpapers -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="wallpaper in wallpapersFiltrados"
        :key="wallpaper.id || wallpaper.imagem"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      >
        <router-link v-if="wallpaper.id" :to="`/wallpapers/${wallpaper.id}`">
          <img
            :src="`/wallpapers/${formatImageName(wallpaper.imagem)}`"
            :alt="wallpaper.titulo"
            class="w-full h-48 object-cover"
          />
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-800">{{ wallpaper.titulo }}</h3>
            <p class="text-sm text-gray-600 mt-2">{{ wallpaper.descricao }}</p>
          </div>
        </router-link>
        <div v-else class="group cursor-pointer">
          <img
            :src="wallpaper.imagem"
            :alt="wallpaper.titulo"
            class="w-full h-48 object-cover group-hover:opacity-80 transition-opacity duration-200"
          />
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-800 flex items-center">
              {{ wallpaper.titulo }}
              <svg v-if="wallpaper.fonte" class="ml-2 w-4 h-4 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </h3>
            <p class="text-sm text-gray-600 mt-2">{{ wallpaper.descricao }}</p>
            <span class="text-xs text-gray-400">Fonte: {{ wallpaper.fonte }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { ENDPOINTS } from '@/config/api'

interface Wallpaper {
  id?: number
  titulo: string
  descricao: string
  imagem: string
  categoria: string
  santo?: string
  fonte?: string
}

const wallpapers = ref<Wallpaper[]>([])
const externos = ref<Wallpaper[]>([])
const loading = ref(true)
const loadingExternos = ref(false)
const error = ref<string | null>(null)
const filtroSelecionado = ref<string>('todos')
const santoSelecionado = ref<string>('')

const filtrosPrincipais = [
  { id: 'todos', nome: 'Todos' },
  { id: 'cristo', nome: 'Cristo' },
  { id: 'maria', nome: 'Maria' },
  { id: 'santos', nome: 'Santos' },
  { id: 'biblia', nome: 'Bíblia' },
  { id: 'natureza', nome: 'Natureza' }
]

const santosDisponiveis = computed(() => {
  const santos = wallpapers.value
    .filter(w => w.categoria === 'santos' && w.santo)
    .map(w => w.santo as string)
  return Array.from(new Set(santos)).sort()
})

const selecionarCategoria = (categoria: string) => {
  filtroSelecionado.value = categoria
  santoSelecionado.value = ''
}

const selecionarSanto = (santo: string) => {
  santoSelecionado.value = santo
}

const wallpapersFiltrados = computed(() => {
  let locais = [] as Wallpaper[]
  if (filtroSelecionado.value === 'todos') {
    locais = wallpapers.value
  } else if (filtroSelecionado.value === 'santos' && santoSelecionado.value) {
    locais = wallpapers.value.filter(
      w => w.categoria === 'santos' && w.santo === santoSelecionado.value
    )
  } else {
    locais = wallpapers.value.filter(w => w.categoria === filtroSelecionado.value)
  }
  // Junta locais e externos
  return [...locais, ...externos.value]
})

const formatImageName = (imageName: string): string => {
  if (imageName.includes('.')) {
    return imageName
  }
  return `${imageName}.jpg`
}

const fetchWallpapers = async () => {
  try {
    const response = await axios.get(ENDPOINTS.WALLPAPERS)
    wallpapers.value = response.data
  } catch (err) {
    error.value = 'Erro ao carregar wallpapers'
    console.error('Erro:', err)
  } finally {
    loading.value = false
  }
}

const fetchExternos = async () => {
  externos.value = []
  if (filtroSelecionado.value === 'todos' || filtroSelecionado.value === 'biblia') return
  loadingExternos.value = true
  let query = filtroSelecionado.value
  if (filtroSelecionado.value === 'santos' && santoSelecionado.value) {
    query = santoSelecionado.value
  }
  try {
    // Substitua 'SUA_UNSPLASH_ACCESS_KEY' pela sua chave de acesso do Unsplash
    const unsplashRes = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query,
        per_page: 8,
        orientation: 'portrait',
        client_id: 'SUA_UNSPLASH_ACCESS_KEY'
      }
    })
    externos.value = unsplashRes.data.results.map((img: any) => ({
      titulo: img.alt_description || query,
      descricao: img.description || '',
      imagem: img.urls.regular,
      categoria: filtroSelecionado.value,
      fonte: 'Unsplash'
    }))
  } catch (err) {
    console.error('Erro ao buscar imagens externas:', err)
  } finally {
    loadingExternos.value = false
  }
}

onMounted(() => {
  fetchWallpapers()
  fetchExternos()
})

watch([filtroSelecionado, santoSelecionado], () => {
  fetchExternos()
})
</script>

<style scoped>
nav {
  @apply mb-8;
}

.group:hover img {
  opacity: 0.8;
}
</style> 