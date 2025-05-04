<template>
  <nav class="w-full bg-[#1E3A8A] shadow-md mb-8">
    <div class="flex flex-wrap items-center justify-between w-full px-8 py-3">
      <router-link to="/igreja" class="text-2xl font-bold text-white">Igreja</router-link>
      <div class="flex flex-wrap gap-6 items-center">
        <router-link to="/noticias" class="text-white hover:text-vue transition-colors font-medium" active-class="text-destaque font-bold">Notícias</router-link>
        <router-link to="/wallpapers" class="text-white hover:text-vue transition-colors font-medium" active-class="text-destaque font-bold">Wallpapers</router-link>
        <router-link to="/ensinamentos" class="text-white hover:text-vue transition-colors font-medium" active-class="text-destaque font-bold">Ensinamentos</router-link>
        <router-link to="/caminho" class="text-white hover:text-vue transition-colors font-medium" active-class="text-destaque font-bold">Caminho</router-link>
        <router-link to="/rosario" class="text-white hover:text-vue transition-colors font-medium" active-class="text-destaque font-bold">Rosário</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
// Nenhum script necessário para navegação simples
</script>

<style scoped>
nav {
  @apply w-full;
}
</style> 