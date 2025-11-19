<template>
  <div id="app" class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'

onMounted(() => {
  // Initialize theme from localStorage
  const theme = localStorage.getItem('theme') || 'light'
  document.documentElement.classList.toggle('dark', theme === 'dark')
})
</script>