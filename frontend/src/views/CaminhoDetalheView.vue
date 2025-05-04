<template>
  <div class="container py-8">
    <div v-if="loading" class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p class="mt-4 text-gray-600">Carregando artigo...</p>
    </div>
    
    <div v-else-if="error" class="text-center">
      <div class="text-red-600">
        <svg class="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p class="mt-4">{{ error }}</p>
      </div>
    </div>
    
    <div v-else class="max-w-4xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-4">{{ artigo.titulo }}</h1>
        <div class="flex items-center text-gray-600 mb-4">
          <span class="mr-4">{{ formatarData(artigo.data) }}</span>
          <span class="mr-4">•</span>
          <span>{{ artigo.tags.join(', ') }}</span>
        </div>
        <img v-if="artigo.imagem" :src="artigo.imagem" :alt="artigo.titulo" class="w-full h-64 object-cover rounded-lg mb-4">
      </div>
      
      <div class="rich-content" v-html="artigo.conteudo"></div>
      
      <div class="mt-8 pt-8 border-t border-gray-200">
        <router-link to="/caminho" class="btn btn-primary">
          Voltar para o Caminho
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { ENDPOINTS } from '../config/api'

interface Artigo {
  titulo: string
  data: string
  tags: string[]
  imagem?: string
  conteudo: string
}

const route = useRoute()
const artigo = ref<Artigo | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const formatarData = (data: string): string => {
  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const buscarArtigo = async () => {
  try {
    const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
    const response = await axios.get(ENDPOINTS.CAMINHO_DETALHE(slug))
    artigo.value = response.data
  } catch (err) {
    error.value = 'Erro ao carregar artigo. Por favor, tente novamente.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(buscarArtigo)
</script>

<style scoped>
.caminho-detalhe-page {
  @apply container mx-auto px-4 py-8;
}
</style> 