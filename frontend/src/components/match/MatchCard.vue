<template>
  <div
    class="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
    @click="$router.push(`/matches/${match.id}`)"
  >
    <!-- Thumbnail -->
    <div class="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
      <img
        v-if="match.thumbnail"
        :src="match.thumbnail"
        :alt="matchTitle"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div v-else class="absolute inset-0 flex items-center justify-center">
        <Video :size="48" class="text-gray-600" />
      </div>
      
      <!-- Status Badge -->
      <div class="absolute top-3 left-3">
        <Badge
          :variant="getStatusVariant(match.status)"
          size="sm"
        >
          {{ getStatusLabel(match.status) }}
        </Badge>
      </div>
      
      <!-- Duration -->
      <div class="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs text-white font-medium">
        {{ match.duration }}
      </div>
      
      <!-- Processing Progress -->
      <div v-if="match.status === 'processing'" class="absolute bottom-0 left-0 right-0">
        <div class="h-1 bg-white/20">
          <div
            class="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500"
            :style="{ width: `${match.processingProgress}%` }"
          />
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {{ matchTitle }}
        </h3>
        <ChevronRight :size="20" class="text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
      </div>

      <!-- Score -->
      <div class="flex items-center justify-center gap-4 mb-4">
        <div class="text-center flex-1">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{{ match.homeTeam }}</p>
          <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ match.score.home }}</p>
        </div>
        <div class="text-2xl font-medium text-gray-400">-</div>
        <div class="text-center flex-1">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{{ match.awayTeam }}</p>
          <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ match.score.away }}</p>
        </div>
      </div>

      <!-- Meta Info -->
      <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-gray-800">
        <div class="flex items-center gap-1">
          <Calendar :size="14" />
          <span>{{ formatDate(match.date) }}</span>
        </div>
        <div class="flex items-center gap-1">
          <Clock :size="14" />
          <span>{{ match.competition }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { format } from 'date-fns'
import { Video, Calendar, Clock, ChevronRight } from 'lucide-vue-next'
import Badge from '@/components/ui/Badge.vue'

interface Match {
  id: string
  homeTeam: string
  awayTeam: string
  score: { home: number; away: number }
  date: Date
  competition: string
  duration: string
  thumbnail?: string
  status: 'completed' | 'processing' | 'failed'
  processingProgress?: number
}

interface Props {
  match: Match
}

const props = defineProps<Props>()

const matchTitle = computed(() => {
  return `${props.match.homeTeam} vs ${props.match.awayTeam}`
})

const formatDate = (date: Date) => {
  return format(date, 'MMM dd, yyyy')
}

const getStatusVariant = (status: Match['status']) => {
  const variants = {
    completed: 'success',
    processing: 'info',
    failed: 'danger'
  }
  return variants[status] as any
}

const getStatusLabel = (status: Match['status']) => {
  const labels = {
    completed: 'Analyzed',
    processing: 'Processing',
    failed: 'Failed'
  }
  return labels[status]
}
</script>