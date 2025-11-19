<template>
  <RouterView />
  <Toast ref="toastRef" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Toast from '@/components/common/Toast.vue'

const toastRef = ref<InstanceType<typeof Toast> | null>(null)

onMounted(() => {
  // Initialize theme
  const theme = localStorage.getItem('theme') || 'light'
  document.documentElement.classList.toggle('dark', theme === 'dark')

  // Make toast available globally
  if (toastRef.value) {
    window.$toast = toastRef.value
  }
})
</script>

<style>
@import './styles/main.css';
</style>
