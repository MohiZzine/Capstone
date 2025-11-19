<template>
  <div class="group bg-white dark:bg-gray-900 rounded-xl shadow-soft border border-gray-200 dark:border-gray-800 p-6 hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 cursor-pointer overflow-hidden relative">
    <!-- Animated background gradient -->
    <div :class="[
      'absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300',
      `bg-gradient-to-br from-${color}-400 to-${color}-600`
    ]" />
    
    <div class="relative flex items-center justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          {{ label }}
        </p>
        <p class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {{ value }}
        </p>
        <div class="flex items-center text-sm">
          <TrendingUp v-if="change.includes('+')" :size="14" class="text-green-500 mr-1" />
          <TrendingDown v-else :size="14" class="text-red-500 mr-1" />
          <span :class="change.includes('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
            {{ change }}
          </span>
        </div>
      </div>
      <div :class="[
        'w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110',
        `bg-${color}-100 dark:bg-${color}-900/20`
      ]">
        <component :is="icon" :class="`text-${color}-600 dark:text-${color}-400`" :size="28" />
      </div>
    </div>

    <!-- Sparkline effect on hover -->
    <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </div>
</template>

<script setup lang="ts">
import { TrendingUp, TrendingDown } from 'lucide-vue-next'
import type { Component } from 'vue'

defineProps<{
  label: string
  value: string
  change: string
  icon: Component
  color: string
}>()
</script>