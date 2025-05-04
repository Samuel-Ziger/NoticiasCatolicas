<template>
  <div class="rosario-container">
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Rosário do Dia</h2>
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-semibold mb-4">{{ mistériosDoDia.tipo }}</h3>
        <p class="text-gray-600 mb-6">{{ mistériosDoDia.descricao }}</p>
        
        <div class="space-y-6">
          <div 
            v-for="(misterio, index) in mistériosDoDia.misterios" 
            :key="index"
            class="border-l-4 border-primary pl-4"
          >
            <h4 class="text-lg font-medium mb-2">
              {{ index + 1 }}º Mistério: {{ misterio.titulo }}
            </h4>
            <p class="text-gray-600 mb-2">{{ misterio.descricao }}</p>
            <p class="text-sm text-gray-500">{{ misterio.referencia }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Todos os Rosários</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="tipo in tiposRosario" 
          :key="tipo.nome"
          class="bg-white rounded-lg shadow-md p-6"
        >
          <h3 class="text-xl font-semibold mb-4">{{ tipo.nome }}</h3>
          <p class="text-gray-600 mb-4">{{ tipo.descricao }}</p>
          
          <div class="space-y-4">
            <div 
              v-for="(misterio, index) in tipo.misterios" 
              :key="index"
              class="border-l-2 border-gray-200 pl-4"
            >
              <h4 class="font-medium">{{ misterio.titulo }}</h4>
              <p class="text-sm text-gray-500">{{ misterio.referencia }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h2 class="text-2xl font-bold mb-4">Reze com a gente</h2>
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="prose max-w-none">
          <h3 class="text-xl font-semibold mb-4">Como rezar o Rosário</h3>
          <ol class="list-decimal pl-6 space-y-4">
            <li>Fazer o Sinal da Cruz</li>
            <li>Rezar o Credo</li>
            <li>Rezar um Pai Nosso</li>
            <li>Rezar três Ave Marias</li>
            <li>Rezar um Glória ao Pai</li>
            <li>Anunciar o primeiro mistério</li>
            <li>Rezar um Pai Nosso</li>
            <li>Rezar dez Ave Marias</li>
            <li>Rezar um Glória ao Pai</li>
            <li>Repetir os passos 6 a 9 para cada mistério</li>
            <li>Rezar a Salve Rainha</li>
            <li>Fazer o Sinal da Cruz</li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ENDPOINTS } from '@/config/api'

interface Misterio {
  titulo: string
  descricao: string
  referencia: string
}

interface TipoRosario {
  nome: string
  descricao: string
  misterios: Misterio[]
}

const mistériosDoDia = ref<TipoRosario>({
  nome: '',
  descricao: '',
  misterios: []
})

const tiposRosario = ref<TipoRosario[]>([])

const buscarRosario = async () => {
  try {
    const response = await axios.get(ENDPOINTS.ROSARIO_DIA)
    mistériosDoDia.value = response.data
  } catch (error) {
    console.error('Erro ao buscar rosário do dia:', error)
  }
}

const buscarTiposRosario = async () => {
  try {
    const response = await axios.get(ENDPOINTS.ROSARIO_TIPOS)
    tiposRosario.value = response.data
  } catch (error) {
    console.error('Erro ao buscar tipos de rosário:', error)
  }
}

onMounted(() => {
  buscarRosario()
  buscarTiposRosario()
})
</script>

<style scoped>
.rosario-container {
  @apply container mx-auto px-4 py-8;
}
</style> 