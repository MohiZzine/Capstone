<template>
  <div class="space-y-6">
    <Button @click="$router.back()" variant="ghost" size="sm">
      <template #icon-left>
        <ArrowLeft :size="18" />
      </template>
      Back
    </Button>

    <Card>
      <div class="text-center py-12">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Player Details</h2>
        <p class="text-gray-500 dark:text-gray-400 mt-2">Coming soon...</p>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
</script> 