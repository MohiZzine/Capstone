<template>
  <div class="w-full">
    <!-- Tab Headers -->
    <div :class="tabListClasses">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="selectTab(tab.value)"
        :class="getTabClasses(tab.value)"
        :disabled="tab.disabled"
      >
        <component v-if="tab.icon" :is="tab.icon" :size="18" />
        <span>{{ tab.label }}</span>
        <Badge v-if="tab.badge" variant="primary" size="sm">{{ tab.badge }}</Badge>
      </button>
    </div>
    
    <!-- Tab Content -->
    <div class="mt-4">
      <slot :current-tab="modelValue" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import Badge from './Badge.vue'

interface Tab {
  value: string
  label: string
  icon?: Component
  badge?: string | number
  disabled?: boolean
}

interface Props {
  modelValue: string
  tabs: Tab[]
  variant?: 'default' | 'pills' | 'underline'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const tabListClasses = computed(() => {
  const base = 'flex gap-2'
  
  const variants = {
    default: 'border-b border-gray-200 dark:border-gray-800',
    pills: 'bg-gray-100 dark:bg-gray-800 p-1 rounded-lg',
    underline: 'gap-6'
  }
  
  return [base, variants[props.variant]].join(' ')
})

const getTabClasses = (value: string) => {
  const base = 'flex items-center gap-2 px-4 py-2.5 font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  const isActive = value === props.modelValue
  
  const variants = {
    default: isActive
      ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400 -mb-px'
      : 'border-b-2 border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600',
    pills: isActive
      ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 rounded-md shadow-sm'
      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-md',
    underline: isActive
      ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
      : 'border-b-2 border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
  }
  
  return [base, variants[props.variant]].join(' ')
}

const selectTab = (value: string) => {
  emit('update:modelValue', value)
}
</script>