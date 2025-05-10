<template>
  <div class="max-w-3xl mx-auto py-10">
    <h1 class="text-2xl font-bold mb-6">Administração de Santos (Wallpapers)</h1>

    <!-- Adicionar novo santo -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">Adicionar Novo Santo</h2>
      <form @submit.prevent="adicionarSanto" class="space-y-4">
        <div>
          <label class="block font-medium mb-1">Nome do Santo</label>
          <input v-model="novoSanto.nome" type="text" class="form-input" required />
        </div>
        <div>
          <label class="block font-medium mb-1">Imagem do Santo</label>
          <input type="file" @change="onNovoSantoImagem" accept="image/*" class="form-input" required />
        </div>
        <button type="submit" class="btn btn-primary">Adicionar Santo</button>
      </form>
    </div>

    <!-- Selecionar santo existente -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">Gerenciar Imagens de um Santo</h2>
      <div class="mb-4">
        <label class="block font-medium mb-1">Selecione um Santo</label>
        <select v-model="santoSelecionado" class="form-input">
          <option value="">Selecione...</option>
          <option v-for="santo in santos" :key="santo.id" :value="santo.id">{{ santo.nome }}</option>
        </select>
      </div>
      <div v-if="santoSelecionado">
        <h3 class="font-semibold mb-2">Imagens deste Santo</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <img v-for="img in imagensDoSanto" :key="img.id" :src="getImagemUrl(img.url)" class="w-full h-32 object-cover rounded shadow" />
        </div>
        <form @submit.prevent="uploadImagemParaSanto" class="space-y-2">
          <label class="block font-medium mb-1">Adicionar nova imagem</label>
          <input type="file" @change="onNovaImagemSanto" accept="image/*" class="form-input" required />
          <button type="submit" class="btn btn-secondary">Enviar Imagem</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import axios from 'axios'

const API = 'http://localhost:3000/api/santos'

const santos = ref<any[]>([])
const novoSanto = ref<{ nome: string; imagem: File | null }>({ nome: '', imagem: null })
const santoSelecionado = ref('')
const novaImagemSanto = ref<File | null>(null)
const imagensDoSanto = ref<any[]>([])

async function fetchSantos() {
  const { data } = await axios.get(API)
  santos.value = data
}

async function adicionarSanto() {
  const form = new FormData()
  form.append('nome', novoSanto.value.nome)
  if (novoSanto.value.imagem) {
    form.append('imagem', novoSanto.value.imagem as File)
  }
  await axios.post(API, form)
  novoSanto.value.nome = ''
  novoSanto.value.imagem = null
  await fetchSantos()
}

function onNovoSantoImagem(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files && files[0]) {
    novoSanto.value.imagem = files[0]
  }
}

function onNovaImagemSanto(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files && files[0]) {
    novaImagemSanto.value = files[0]
  }
}

async function fetchImagensDoSanto() {
  if (!santoSelecionado.value) return imagensDoSanto.value = []
  const { data } = await axios.get(`${API}/${santoSelecionado.value}/imagens`)
  imagensDoSanto.value = data
}

async function uploadImagemParaSanto() {
  if (!santoSelecionado.value || !novaImagemSanto.value) return
  const form = new FormData()
  form.append('imagem', novaImagemSanto.value as File)
  await axios.post(`${API}/${santoSelecionado.value}/imagens`, form)
  novaImagemSanto.value = null
  await fetchImagensDoSanto()
}

function getImagemUrl(url: string) {
  if (url.startsWith('/uploads/')) return `http://localhost:3000${url}`
  return url
}

watch(santoSelecionado, fetchImagensDoSanto)

fetchSantos()
</script>

<style scoped>
.form-input {
  @apply block w-full rounded border border-gray-300 px-3 py-2 mb-2;
}
.btn {
  @apply px-4 py-2 rounded font-medium transition-colors duration-200;
}
.btn-primary {
  @apply bg-primary text-white hover:bg-primary-dark;
}
.btn-secondary {
  @apply bg-secondary text-white hover:bg-secondary-dark;
}
</style> 