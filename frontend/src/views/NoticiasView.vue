<template>
  <div class="w-full h-full p-8">
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Notícias da Igreja</h1>
      <p class="mt-2 text-gray-600">
        Fique por dentro das últimas notícias do Vaticano e da Igreja Católica
      </p>
    </header>

    <NoticiasList />
  </div>
</template>

<script setup lang="ts">
import NoticiasList from '@/components/NoticiasList.vue'
</script> 