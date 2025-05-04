<template>
  <div class="container py-8">
    <div v-if="loading" class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p class="mt-4 text-gray-600">Carregando notícia...</p>
    </div>
    
    <div v-else-if="error" class="text-center">
      <div class="text-red-600">
        <svg class="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p class="mt-4">{{ error }}</p>
      </div>
    </div>
    
    <div v-else-if="noticia" class="max-w-4xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-4">{{ noticia.titulo }}</h1>
        <div class="flex items-center text-gray-600 mb-4">
          <span class="mr-4">{{ noticia.autor }}</span>
          <span class="mr-4">•</span>
          <span>{{ new Date(noticia.data).toLocaleDateString() }}</span>
        </div>
        <img v-if="noticia.imagem" :src="noticia.imagem" :alt="noticia.titulo" class="w-full rounded-lg mb-4">
      </div>
      
      <div class="rich-content" v-html="noticia.conteudo"></div>
      
      <div class="mt-8 pt-8 border-t border-gray-200">
        <h2 class="text-2xl font-bold mb-4">Comentários</h2>
        <div v-if="noticia.comentarios && noticia.comentarios.length > 0">
          <div v-for="comentario in noticia.comentarios" :key="comentario.id" class="mb-4 p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center mb-2">
              <span class="font-semibold">{{ comentario.autor }}</span>
              <span class="text-gray-500 text-sm ml-2">{{ new Date(comentario.data).toLocaleDateString() }}</span>
            </div>
            <p>{{ comentario.texto }}</p>
          </div>
        </div>
        <p v-else class="text-gray-500">Nenhum comentário ainda.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { ENDPOINTS } from '../config/api'

interface Comentario {
  id: number
  autor: string
  texto: string
  data: string
}

interface Noticia {
  titulo: string
  autor: string
  data: string
  imagem?: string
  conteudo: string
  comentarios?: Comentario[]
}

const route = useRoute()
const noticia = ref<Noticia | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const buscarNoticia = async () => {
  try {
    const response = await axios.get(`${ENDPOINTS.NOTICIAS}/${route.params.id}`)
    noticia.value = response.data
  } catch (err) {
    error.value = 'Erro ao carregar notícia. Por favor, tente novamente.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(buscarNoticia)
</script> 