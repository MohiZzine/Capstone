<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Tactical Laboratory</h1>
      <p class="mt-1 text-gray-600 dark:text-gray-400">Analyze formations and tactical patterns</p>
    </div>

    <FormationView match-id="demo" team="both" />
  </div>
</template>

<script setup lang="ts">
import FormationView from '@/components/match/FormationView.vue'
</script>