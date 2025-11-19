<template>
  <div :class="containerClass">
    <div :class="spinnerClass" />
    <p v-if="text" :class="textClass">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  fullscreen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  fullscreen: false
})

const containerClass = computed(() => {
  return props.fullscreen
    ? 'fixed inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50'
    : 'flex flex-col items-center justify-center p-8'
})

const spinnerClass = computed(() => {
  const base = 'border-4 border-primary-200 dark:border-primary-900 border-t-primary-500 rounded-full animate-spin'
  
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }
  
  return [base, sizes[props.size]].join(' ')
})

const textClass = computed(() => {
  const base = 'mt-4 font-medium text-gray-600 dark:text-gray-400'
  
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }
  
  return [base, sizes[props.size]].join(' ')
})
</script>