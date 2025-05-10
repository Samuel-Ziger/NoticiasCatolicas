<template>
  <div class="w-full h-full px-2 md:px-8 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Últimas Notícias</h1>
    
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="error" class="bg-red-50 p-4 rounded-lg">
      <p class="text-red-700">{{ error }}</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <article v-for="noticia in noticias" :key="noticia.id" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
        <img :src="noticia.imagem || '/placeholder-news.jpg'" :alt="noticia.titulo" class="w-full h-48 object-cover" />
        <div class="p-4 flex-1 flex flex-col">
          <div class="flex items-center text-sm text-gray-500 mb-2">
            <span>{{ new Date(noticia.data).toLocaleDateString('pt-BR') }}</span>
            <span class="mx-2">•</span>
            <span>{{ noticia.fonte }}</span>
          </div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ noticia.titulo }}</h2>
          <p class="text-gray-600 mb-4 line-clamp-3 flex-1">{{ noticia.descricao }}</p>
          <a :href="noticia.link" target="_blank" class="text-primary hover:text-primary/90 font-medium mt-auto">Ler mais</a>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Noticia {
  id: number
  titulo: string
  descricao: string
  imagem: string
  link: string
  data: string
  fonte: string
}

const noticias = ref<Noticia[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const fetchNoticias = async () => {
  try {
    const response = await fetch('/api/noticias')
    if (!response.ok) throw new Error('Erro ao carregar notícias')
    const data = await response.json()
    noticias.value = data
  } catch (e) {
    error.value = 'Não foi possível carregar as notícias. Tente novamente mais tarde.'
    console.error('Erro:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchNoticias()
})
</script>
