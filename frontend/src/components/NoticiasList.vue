<template>
  <div class="noticias-container w-full h-full px-2 md:px-8 py-8">
    <div class="filtros mb-6">
      <div class="flex flex-wrap gap-4">
        <select 
          v-model="filtroFonte" 
          class="px-4 py-2 border rounded-lg"
        >
          <option value="">Todas as fontes</option>
          <option v-for="fonte in fontes" :key="fonte" :value="fonte">
            {{ fonte }}
          </option>
        </select>
        
        <select 
          v-model="filtroData" 
          class="px-4 py-2 border rounded-lg"
        >
          <option value="">Todas as datas</option>
          <option value="hoje">Hoje</option>
          <option value="semana">Última semana</option>
          <option value="mes">Último mês</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div 
        v-for="noticia in noticiasFiltradas" 
        :key="noticia.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
      >
        <div class="aspect-w-16 aspect-h-9">
          <img 
            :src="noticia.imagem" 
            :alt="noticia.titulo"
            class="w-full h-48 object-cover"
            @error="(e) => { e.target.onerror = null; e.target.src = imagensPadrao[noticia.fonte] || '/placeholder.jpg' }"
          />
        </div>
        
        <div class="p-4 flex-1 flex flex-col">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-500">{{ formatarData(noticia.data) }}</span>
            <span class="text-sm font-medium text-primary">{{ noticia.fonte }}</span>
          </div>
          
          <h3 class="text-lg font-semibold mb-2 line-clamp-2">
            {{ noticia.titulo }}
          </h3>
          
          <p class="text-gray-600 mb-4 line-clamp-3 flex-1">
            {{ noticia.resumo }}
          </p>
          
          <a 
            :href="noticia.link" 
            target="_blank"
            class="text-primary hover:text-primary/80 font-medium mt-auto"
          >
            Ler mais
          </a>
        </div>
      </div>
    </div>

    <div v-if="carregando" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
    </div>

    <div v-if="!carregando && noticiasFiltradas.length === 0" class="text-center py-8">
      <p class="text-gray-500">Nenhuma notícia encontrada</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ENDPOINTS } from '@/config/api'

interface Noticia {
  id: number
  titulo: string
  link: string
  imagem: string
  resumo: string
  data: string
  fonte: string
}

const noticias = ref<Noticia[]>([])
const carregando = ref(true)
const filtroFonte = ref('')
const filtroData = ref('')

const fontes = computed(() => {
  return [...new Set(noticias.value.map(n => n.fonte))]
})

const noticiasFiltradas = computed(() => {
  let filtradas = [...noticias.value]

  if (filtroFonte.value) {
    filtradas = filtradas.filter(n => n.fonte === filtroFonte.value)
  }

  if (filtroData.value) {
    const hoje = new Date()
    const umaSemana = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000)
    const umMes = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000)

    filtradas = filtradas.filter(n => {
      const dataNoticia = new Date(n.data)
      switch (filtroData.value) {
        case 'hoje':
          return dataNoticia.toDateString() === hoje.toDateString()
        case 'semana':
          return dataNoticia >= umaSemana
        case 'mes':
          return dataNoticia >= umMes
        default:
          return true
      }
    })
  }

  return filtradas.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
})

const formatarData = (data: string) => {
  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const imagensPadrao = {
  'ACI Digital': 'https://www.acidigital.com/imagespp/AciDigital.jpg',
  'CNBB': 'https://www.cnbb.org.br/wp-content/uploads/sites/58/2018/08/CNBB.png',
  'Canção Nova': 'https://img.cancaonova.com/cnimages/canais/uploads/sites/11/2017/02/formacao_cn.png',
  'Aleteia': 'https://pt.aleteia.org/wp-content/themes/aleteia/assets/images/aleteia-logo.png',
  'Vatican News': 'https://www.vaticannews.va/content/dam/vaticannews/agenzie/images/srv/logo-vaticannews.png'
}

const buscarNoticias = async () => {
  try {
    carregando.value = true
    const response = await axios.get(ENDPOINTS.NOTICIAS)
    noticias.value = response.data
  } catch (error) {
    console.error('Erro ao buscar notícias:', error)
  } finally {
    carregando.value = false
  }
}

onMounted(() => {
  buscarNoticias()
})
</script>

<style scoped>
.noticias-container {
  @apply w-full h-full;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 