<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="closeModal"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        
        <!-- Modal -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div
            :class="modalClasses"
            @click.stop
          >
            <!-- Header -->
            <div v-if="$slots.header || title" class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <slot name="header">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
              </slot>
              <button
                v-if="showClose"
                @click="closeModal"
                class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X :size="20" />
              </button>
            </div>
            
            <!-- Body -->
            <div :class="bodyClasses">
              <slot />
            </div>
            
            <!-- Footer -->
            <div v-if="$slots.footer" class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 rounded-b-xl">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { X } from 'lucide-vue-next'

interface Props {
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showClose?: boolean
  closeOnBackdrop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showClose: true,
  closeOnBackdrop: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const modalClasses = computed(() => {
  const base = 'relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full transform transition-all'
  
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-7xl mx-4'
  }
  
  return [base, sizes[props.size]].join(' ')
})

const bodyClasses = computed(() => {
  return 'px-6 py-4'
})

const closeModal = () => {
  if (props.closeOnBackdrop) {
    emit('update:modelValue', false)
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95) translateY(-20px);
}
</style>