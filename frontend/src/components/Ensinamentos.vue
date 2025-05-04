<template>
  <div class="ensinamentos-container">
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Versículo do Dia</h2>
      <div class="bg-white rounded-lg shadow-md p-6">
        <blockquote class="text-xl italic text-gray-700 mb-4">
          "{{ versiculoDoDia.texto }}"
        </blockquote>
        <p class="text-right text-gray-600">
          {{ versiculoDoDia.referencia }}
        </p>
      </div>
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Dez Mandamentos</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="mandamento in mandamentos" 
          :key="mandamento.numero"
          class="bg-white rounded-lg shadow-md p-6"
        >
          <h3 class="text-xl font-semibold mb-4">
            {{ mandamento.numero }}º Mandamento
          </h3>
          <p class="text-gray-600 mb-4">{{ mandamento.texto }}</p>
          <div class="prose max-w-none" v-html="mandamento.explicacao"></div>
        </div>
      </div>
    </div>

    <div>
      <h2 class="text-2xl font-bold mb-4">Ensinamentos</h2>
      <div class="filtros mb-6">
        <div class="flex flex-wrap gap-4">
          <select 
            v-model="filtroAutor" 
            class="px-4 py-2 border rounded-lg"
          >
            <option value="">Todos os autores</option>
            <option v-for="autor in autores" :key="autor" :value="autor">
              {{ autor }}
            </option>
          </select>
          
          <select 
            v-model="filtroTema" 
            class="px-4 py-2 border rounded-lg"
          >
            <option value="">Todos os temas</option>
            <option v-for="tema in temas" :key="tema" :value="tema">
              {{ tema }}
            </option>
          </select>
        </div>
      </div>

      <div class="space-y-6">
        <div 
          v-for="ensinamento in ensinamentosFiltrados" 
          :key="ensinamento.id"
          class="bg-white rounded-lg shadow-md p-6"
        >
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm text-gray-500">
              {{ formatarData(ensinamento.data) }}
            </span>
            <span class="text-sm font-medium text-primary">
              {{ ensinamento.autor }}
            </span>
          </div>
          
          <blockquote class="text-lg italic text-gray-700 mb-4">
            "{{ ensinamento.texto }}"
          </blockquote>
          
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="tema in ensinamento.temas" 
              :key="tema"
              class="px-2 py-1 text-xs bg-gray-100 rounded-full"
            >
              {{ tema }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ENDPOINTS } from '@/config/api'

interface Versiculo {
  texto: string
  referencia: string
}

interface Mandamento {
  numero: number
  texto: string
  explicacao: string
}

interface Ensinamento {
  id: number
  texto: string
  autor: string
  data: string
  temas: string[]
}

const versiculoDoDia = ref<Versiculo>({
  texto: '',
  referencia: ''
})

const mandamentos = ref<Mandamento[]>([])
const ensinamentos = ref<Ensinamento[]>([])
const autores = ref<string[]>([])
const temas = ref<string[]>([])
const filtroAutor = ref('')
const filtroTema = ref('')

const ensinamentosFiltrados = computed(() => {
  let filtrados = [...ensinamentos.value]

  if (filtroAutor.value) {
    filtrados = filtrados.filter(e => e.autor === filtroAutor.value)
  }

  if (filtroTema.value) {
    filtrados = filtrados.filter(e => e.temas.includes(filtroTema.value))
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

const buscarVersiculo = async () => {
  try {
    const response = await axios.get(ENDPOINTS.VERSICULO_DIA)
    versiculoDoDia.value = response.data
  } catch (error) {
    console.error('Erro ao buscar versículo do dia:', error)
  }
}

const buscarMandamentos = async () => {
  try {
    const response = await axios.get(ENDPOINTS.MANDAMENTOS)
    mandamentos.value = response.data
  } catch (error) {
    console.error('Erro ao buscar mandamentos:', error)
  }
}

const buscarEnsinamentos = async () => {
  try {
    const response = await axios.get(ENDPOINTS.ENSINAMENTOS)
    ensinamentos.value = response.data.ensinamentos
    autores.value = response.data.autores
    temas.value = response.data.temas
  } catch (error) {
    console.error('Erro ao buscar ensinamentos:', error)
  }
}

onMounted(() => {
  buscarVersiculo()
  buscarMandamentos()
  buscarEnsinamentos()
})
</script>

<style scoped>
.ensinamentos-container {
  @apply container mx-auto px-4 py-8;
}
</style> 