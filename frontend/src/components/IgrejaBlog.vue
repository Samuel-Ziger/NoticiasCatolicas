<template>
  <div class="igreja-container">
    <div class="filtros mb-6">
      <div class="flex flex-wrap gap-4">
        <select 
          v-model="filtroEra" 
          class="px-4 py-2 border rounded-lg"
        >
          <option value="">Todas as eras</option>
          <option v-for="era in eras" :key="era" :value="era">
            {{ era }}
          </option>
        </select>
        
        <select 
          v-model="filtroAutor" 
          class="px-4 py-2 border rounded-lg"
        >
          <option value="">Todos os autores</option>
          <option v-for="autor in autores" :key="autor" :value="autor">
            {{ autor }}
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
                  :to="`/igreja/${artigo.slug}`"
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
                :to="`/igreja/${artigo.slug}`"
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
          <h3 class="text-xl font-bold mb-4">Linha do Tempo</h3>
          
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
  era: string
  tags: string[]
}

interface TimelineItem {
  ano: string
  evento: string
}

const artigos = ref<Artigo[]>([])
const eras = ref<string[]>([])
const autores = ref<string[]>([])
const carregando = ref(true)
const filtroEra = ref('')
const filtroAutor = ref('')

const timeline: TimelineItem[] = [
  { ano: '33 d.C.', evento: 'Pentecostes - Nascimento da Igreja' },
  { ano: '313', evento: 'Édito de Milão - Fim das perseguições' },
  { ano: '1054', evento: 'Grande Cisma do Oriente' },
  { ano: '1517', evento: 'Reforma Protestante' },
  { ano: '1962-1965', evento: 'Concílio Vaticano II' }
]

const artigosFiltrados = computed(() => {
  let filtrados = [...artigos.value]

  if (filtroEra.value) {
    filtrados = filtrados.filter(a => a.era === filtroEra.value)
  }

  if (filtroAutor.value) {
    filtrados = filtrados.filter(a => a.autor === filtroAutor.value)
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
    const response = await axios.get(ENDPOINTS.IGREJA)
    artigos.value = response.data.artigos
    eras.value = response.data.eras
    autores.value = response.data.autores
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
.igreja-container {
  @apply container mx-auto px-4 py-8;
}
</style> 