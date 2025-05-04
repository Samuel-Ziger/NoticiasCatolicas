<template>
  <div class="relative">
    <input
      type="text"
      v-model="query"
      @input="handleSearch"
      placeholder="Buscar..."
      class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-primary"
    />
    <div v-if="showResults && results.length > 0" class="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg">
      <ul class="py-2">
        <li
          v-for="result in results"
          :key="result.id"
          class="px-4 py-2 hover:bg-gray-50 cursor-pointer"
          @click="selectResult(result)"
        >
          <div class="flex items-center">
            <img
              v-if="result.imagem"
              :src="result.imagem"
              :alt="result.titulo"
              class="w-10 h-10 rounded object-cover mr-3"
            />
            <div>
              <h3 class="font-medium text-gray-900">{{ result.titulo }}</h3>
              <p class="text-sm text-gray-500">{{ result.descricao }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ENDPOINTS } from '@/config/api'

interface SearchResult {
  id: number
  titulo: string
  descricao: string
  imagem?: string
  tipo: string
}

const router = useRouter()
const query = ref('')
const results = ref<SearchResult[]>([])
const showResults = ref(false)

const handleSearch = async () => {
  if (query.value.length < 3) {
    results.value = []
    showResults.value = false
    return
  }

  try {
    const response = await axios.get(`${ENDPOINTS.BUSCA}?q=${encodeURIComponent(query.value)}`)
    results.value = response.data
    showResults.value = true
  } catch (error) {
    console.error('Erro ao buscar:', error)
    results.value = []
  }
}

const selectResult = (result: SearchResult) => {
  showResults.value = false
  query.value = ''
  
  switch (result.tipo) {
    case 'noticia':
      router.push(`/noticias/${result.id}`)
      break
    case 'wallpaper':
      router.push(`/wallpapers/${result.id}`)
      break
    case 'ensinamento':
      router.push(`/ensinamentos/${result.id}`)
      break
    case 'caminho':
      router.push(`/caminho/${result.id}`)
      break
    case 'igreja':
      router.push(`/igreja/${result.id}`)
      break
  }
}

// Fechar resultados ao clicar fora
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showResults.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script> 