<template>
  <div class="flex flex-col items-center justify-center p-12 text-center">
    <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
      <component :is="icon" :size="40" class="text-gray-400 dark:text-gray-600" />
    </div>
    
    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
      {{ title }}
    </h3>
    
    <p class="text-gray-500 dark:text-gray-400 max-w-md mb-6">
      {{ description }}
    </p>
    
    <Button
      v-if="actionLabel"
      @click="emit('action')"
      variant="primary"
    >
      <template #icon-left>
        <component :is="actionIcon" :size="18" />
      </template>
      {{ actionLabel }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { Inbox } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'

interface Props {
  icon?: Component
  title: string
  description: string
  actionLabel?: string
  actionIcon?: Component
}

const props = withDefaults(defineProps<Props>(), {
  icon: Inbox as any
})

const emit = defineEmits<{
  action: []
}>()
</script>