<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-gray-200 dark:text-gray-800">404</h1>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-4">Page Not Found</h2>
      <p class="text-gray-600 dark:text-gray-400 mt-2 mb-8">The page you're looking for doesn't exist.</p>
      <Button @click="$router.push('/')" variant="primary">
        Go Home
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/ui/Button.vue'
</script>