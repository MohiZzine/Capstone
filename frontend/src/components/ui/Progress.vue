<template>
  <div class="w-full">
    <div v-if="label" class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ label }}</span>
      <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ modelValue }}%</span>
    </div>
    
    <div :class="trackClasses">
      <div
        :class="barClasses"
        :style="{ width: `${modelValue}%` }"
      >
        <div v-if="animated" class="absolute inset-0 bg-white/20 animate-progress-shimmer" />
      </div>
    </div>
    
    <p v-if="hint" class="mt-2 text-xs text-gray-500 dark:text-gray-400">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: number
  label?: string
  hint?: string
  variant?: 'primary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  animated: false
})

const trackClasses = computed(() => {
  const base = 'relative w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'
  
  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  }
  
  return [base, sizes[props.size]].join(' ')
})

const barClasses = computed(() => {
  const base = 'relative h-full rounded-full transition-all duration-500 ease-out overflow-hidden'
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-accent-500',
    success: 'bg-gradient-to-r from-green-500 to-green-600',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    danger: 'bg-gradient-to-r from-red-500 to-red-600'
  }
  
  return [base, variants[props.variant]].join(' ')
})
</script>

<style scoped>
@keyframes progress-shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-progress-shimmer {
  animation: progress-shimmer 2s infinite;
}
</style>