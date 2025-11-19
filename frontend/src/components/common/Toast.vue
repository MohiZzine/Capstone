<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'flex items-start gap-3 min-w-[320px] max-w-md p-4 rounded-lg shadow-xl backdrop-blur-sm border',
            getToastClasses(toast.type)
          ]"
        >
          <component :is="getToastIcon(toast.type)" :size="20" class="flex-shrink-0 mt-0.5" />
          
          <div class="flex-1 min-w-0">
            <p v-if="toast.title" class="font-semibold mb-1">{{ toast.title }}</p>
            <p class="text-sm">{{ toast.message }}</p>
          </div>
          
          <button
            @click="removeToast(toast.id)"
            class="flex-shrink-0 p-1 rounded hover:bg-black/10 transition-colors"
          >
            <X :size="16" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-vue-next'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title?: string
  message: string
  duration?: number
}

const toasts = ref<Toast[]>([])

const addToast = (toast: Omit<Toast, 'id'>) => {
  const id = Math.random().toString(36).substr(2, 9)
  const newToast = { ...toast, id }
  toasts.value.push(newToast)
  
  if (toast.duration !== 0) {
    setTimeout(() => {
      removeToast(id)
    }, toast.duration || 5000)
  }
}

const removeToast = (id: string) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

const getToastClasses = (type: Toast['type']) => {
  const classes = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100'
  }
  return classes[type]
}

const getToastIcon = (type: Toast['type']) => {
  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle
  }
  return icons[type]
}

defineExpose({ addToast, removeToast })
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}
</style>