<template>
  <div class="space-y-3">
    <button
      v-for="(action, index) in actions"
      :key="action.label"
      @click="action.action()"
      :style="{ animationDelay: `${index * 50}ms` }"
      class="w-full group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 animate-slide-up"
    >
      <!-- Animated background -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-accent-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      <div class="relative flex items-center">
        <div
          :class="[
            'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110',
            action.color,
          ]"
        >
          <component :is="action.icon" :size="24" class="text-white" />
        </div>

        <div class="ml-4 flex-1 text-left">
          <p
            class="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
          >
            {{ action.label }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {{ action.description }}
          </p>
        </div>

        <ArrowRight
          :size="18"
          class="text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all"
        />
      </div>

      <!-- Bottom accent line -->
      <div
        class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Upload, UserPlus, Target, FileText, ArrowRight } from 'lucide-vue-next'

const router = useRouter()

const actions = [
  {
    label: 'Upload Match',
    description: 'Analyze new game footage',
    icon: Upload,
    color: 'bg-gradient-to-br from-primary-500 to-primary-600',
    action: () => router.push('/matches/upload'),
  },
  {
    label: 'Enroll Player',
    description: 'Add to tracking system',
    icon: UserPlus,
    color: 'bg-gradient-to-br from-blue-500 to-blue-600',
    action: () => router.push('/players/enroll'),
  },
  {
    label: 'Tactical Lab',
    description: 'Create formations & patterns',
    icon: Target,
    color: 'bg-gradient-to-br from-purple-500 to-purple-600',
    action: () => router.push('/tactical'),
  },
  {
    label: 'Generate Report',
    description: 'Export match analytics',
    icon: FileText,
    color: 'bg-gradient-to-br from-orange-500 to-orange-600',
    action: () => router.push('/reports'),
  },
]
</script>
