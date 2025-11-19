<template>
  <div :class="cardClasses">
    <div v-if="$slots.header || title" class="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
      <slot name="header">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
      </slot>
    </div>
    
    <div :class="bodyClasses">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 rounded-b-xl">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  variant?: 'default' | 'bordered' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md',
  hoverable: false
})

const cardClasses = computed(() => {
  const base = 'bg-white dark:bg-gray-900 rounded-xl transition-all duration-200'
  
  const variants = {
    default: 'border border-gray-200 dark:border-gray-800',
    bordered: 'border-2 border-gray-300 dark:border-gray-700',
    elevated: 'shadow-soft'
  }
  
  const hover = props.hoverable ? 'hover:shadow-xl hover:scale-[1.02] cursor-pointer' : ''
  
  return [base, variants[props.variant], hover].join(' ')
})

const bodyClasses = computed(() => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  return paddings[props.padding]
})
</script>