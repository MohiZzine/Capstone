<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="isOpen = !isOpen"
      :class="triggerClasses"
      type="button"
    >
      <slot name="trigger">
        <span>{{ label }}</span>
        <ChevronDown :size="16" :class="{ 'rotate-180': isOpen }" class="transition-transform" />
      </slot>
    </button>
    
    <Transition name="dropdown">
      <div
        v-if="isOpen"
        :class="dropdownClasses"
      >
        <slot :close="close" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { computed } from 'vue'

interface Props {
  label?: string
  align?: 'left' | 'right'
  width?: 'auto' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  align: 'right',
  width: 'auto'
})

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const triggerClasses = computed(() => {
  return 'inline-flex items-center justify-between gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all'
})

const dropdownClasses = computed(() => {
  const base = 'absolute z-50 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1'
  
  const alignment = props.align === 'right' ? 'right-0' : 'left-0'
  
  const widths = {
    auto: 'min-w-max',
    sm: 'w-48',
    md: 'w-64',
    lg: 'w-80'
  }
  
  return [base, alignment, widths[props.width]].join(' ')
})

const close = () => {
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>