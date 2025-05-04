<template>
  <div class="caminho-container">
    <div class="filtros mb-6">
      <div class="flex flex-wrap gap-4">
        <select 
          v-model="filtroTag" 
          class="px-4 py-2 border rounded-lg"
        >
          <option value="">Todas as tags</option>
          <option v-for="tag in tags" :key="tag" :value="tag">
            {{ tag }}
          </option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="space-y-6">
          <article 
            v-for="artigo in artigosFiltrados" 
            :key="artigo.id"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div v-if="artigo.imagem" class="aspect-w-16 aspect-h-9">
              <img 
                :src="artigo.imagem" 
                :alt="artigo.titulo"
                class="w-full h-48 object-cover"
              />
            </div>
            
            <div class="p-6">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-500">
                  {{ formatarData(artigo.data) }}
                </span>
                <span class="text-sm font-medium text-primary">
                  {{ artigo.autor }}
                </span>
              </div>
              
              <h2 class="text-2xl font-bold mb-4">
                <router-link 
                  :to="`/caminho/${artigo.slug}`"
                  class="hover:text-primary"
                >
                  {{ artigo.titulo }}
                </router-link>
              </h2>
              
              <div class="flex flex-wrap gap-2 mb-4">
                <span 
                  v-for="tag in artigo.tags" 
                  :key="tag"
                  class="px-2 py-1 text-xs bg-gray-100 rounded-full"
                >
                  {{ tag }}
                </span>
              </div>
              
              <div class="prose max-w-none" v-html="artigo.resumo"></div>
              
              <router-link 
                :to="`/caminho/${artigo.slug}`"
                class="inline-block mt-4 text-primary hover:text-primary/80 font-medium"
              >
                Ler mais
              </router-link>
            </div>
          </article>
        </div>
      </div>

      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-xl font-bold mb-4">Sobre o Caminho</h3>
          <p class="text-gray-600 mb-4">
            O Caminho Neocatecumenal é um itinerário de formação católica, válido para a sociedade e para os tempos de hoje.
          </p>
          
          <div class="space-y-4">
            <div v-for="(item, index) in timeline" :key="index">
              <h4 class="font-semibold">{{ item.ano }}</h4>
              <p class="text-sm text-gray-600">{{ item.evento }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="carregando" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
    </div>

    <div v-if="!carregando && artigosFiltrados.length === 0" class="text-center py-8">
      <p class="text-gray-500">Nenhum artigo encontrado</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ENDPOINTS } from '@/config/api'

interface Artigo {
  id: number
  titulo: string
  slug: string
  conteudo: string
  resumo: string
  imagem?: string
  data: string
  autor: string
  tags: string[]
}

interface TimelineItem {
  ano: string
  evento: string
}

const artigos = ref<Artigo[]>([])
const tags = ref<string[]>([])
const carregando = ref(true)
const filtroTag = ref('')

const timeline: TimelineItem[] = [
  { ano: '1964', evento: 'Início do Caminho em Madrid, Espanha' },
  { ano: '1974', evento: 'Primeira comunidade no Brasil' },
  { ano: '1990', evento: 'Reconhecimento oficial pelo Vaticano' },
  { ano: '2008', evento: 'Aprovação dos Estatutos pelo Vaticano' }
]

const artigosFiltrados = computed(() => {
  let filtrados = [...artigos.value]

  if (filtroTag.value) {
    filtrados = filtrados.filter(a => a.tags.includes(filtroTag.value))
  }

  return filtrados.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
})

const formatarData = (data: string) => {
  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const buscarArtigos = async () => {
  try {
    carregando.value = true
    const response = await axios.get(ENDPOINTS.CAMINHO)
    artigos.value = response.data.artigos
    tags.value = response.data.tags
  } catch (error) {
    console.error('Erro ao buscar artigos:', error)
  } finally {
    carregando.value = false
  }
}

onMounted(() => {
  buscarArtigos()
})
</script>

<style scoped>
.caminho-container {
  @apply container mx-auto px-4 py-8;
}
</style> 