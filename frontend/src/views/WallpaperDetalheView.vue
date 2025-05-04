<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
    </div>

    <div v-else-if="error" class="text-center text-red-500">
      {{ error }}
    </div>

    <div v-else-if="wallpaper" class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <img
          :src="`/wallpapers/${formatImageName(wallpaper.imagem)}`"
          :alt="`São Bento - ${wallpaper.titulo}`"
          class="w-full h-auto"
        />
        <div class="p-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">São Bento - {{ wallpaper.titulo }}</h1>
          <p class="text-gray-600 mb-6">{{ wallpaper.descricao }}</p>
          <div class="flex justify-center">
            <a
              :href="`/wallpapers/${formatImageName(wallpaper.imagem)}`"
              download
              class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Download
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { ENDPOINTS } from '@/config/api'

interface Wallpaper {
  id: number
  titulo: string
  descricao: string
  imagem: string
}

const route = useRoute()
const wallpaper = ref<Wallpaper | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const formatImageName = (imageName: string): string => {
  // Se o nome já tiver extensão, retorna como está
  if (imageName.includes('.')) {
    return imageName
  }
  // Adiciona a extensão .jpg se não tiver
  return `${imageName}.jpg`
}

const fetchWallpaper = async () => {
  try {
    const response = await axios.get(`${ENDPOINTS.WALLPAPERS}/${route.params.id}`)
    wallpaper.value = response.data
  } catch (err) {
    error.value = 'Erro ao carregar wallpaper'
    console.error('Erro:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchWallpaper()
})
</script> 