<template>
  <div class="space-y-4">
    <div
      v-for="(match, index) in matches"
      :key="match.id"
      class="group relative bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 rounded-xl p-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-800"
      :style="{ animationDelay: `${index * 100}ms` }"
      @click="navigateToMatch(match.id)"
    >
      <!-- Processing Badge -->
      <div v-if="match.status === 'processing'" class="absolute top-2 right-2">
        <span
          class="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium"
        >
          <div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          Processing...
        </span>
      </div>

      <div class="flex items-center justify-between">
        <!-- Teams -->
        <div class="flex-1 flex items-center gap-4">
          <!-- Home Team -->
          <div class="flex items-center gap-3 flex-1">
            <div
              class="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center shadow-lg"
            >
              <span class="text-white font-bold text-lg">{{ match.homeTeam.abbr }}</span>
            </div>
            <div>
              <p class="font-semibold text-gray-900 dark:text-white">{{ match.homeTeam.name }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Home</p>
            </div>
          </div>

          <!-- Score -->
          <div class="flex flex-col items-center px-6">
            <div class="flex items-center gap-3">
              <span class="text-3xl font-bold text-gray-900 dark:text-white">{{
                match.score.home
              }}</span>
              <span class="text-2xl font-medium text-gray-400">-</span>
              <span class="text-3xl font-bold text-gray-900 dark:text-white">{{
                match.score.away
              }}</span>
            </div>
            <div class="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Calendar :size="12" />
              <span>{{ formatDate(match.date) }}</span>
            </div>
          </div>

          <!-- Away Team -->
          <div class="flex items-center gap-3 flex-1 flex-row-reverse">
            <div
              class="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg flex items-center justify-center shadow-lg"
            >
              <span class="text-white font-bold text-lg">{{ match.awayTeam.abbr }}</span>
            </div>
            <div class="text-right">
              <p class="font-semibold text-gray-900 dark:text-white">{{ match.awayTeam.name }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Away</p>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="ml-6 flex flex-col gap-2 min-w-[120px]">
          <div class="flex items-center justify-between text-xs">
            <span class="text-gray-500 dark:text-gray-400">Possession</span>
            <span class="font-semibold text-gray-900 dark:text-white"
              >{{ match.stats.possession }}%</span
            >
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-gray-500 dark:text-gray-400">xG</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ match.stats.xG }}</span>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-gray-500 dark:text-gray-400">Shots</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ match.stats.shots }}</span>
          </div>
        </div>

        <!-- Arrow -->
        <ChevronRight
          :size="20"
          class="ml-4 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all"
        />
      </div>

      <!-- Progress Bar (for processing matches) -->
      <div v-if="match.status === 'processing'" class="mt-4">
        <div class="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            class="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
            :style="{ width: `${match.processingProgress}%` }"
          />
        </div>
        <p class="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
          {{ match.processingStatus }} • {{ match.processingProgress }}% complete
        </p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="matches.length === 0" class="text-center py-12">
      <div
        class="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4"
      >
        <Video :size="32" class="text-gray-400" />
      </div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No matches yet</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-4">Upload your first match to get started</p>
      <button
        @click="$router.push('/matches/upload')"
        class="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:shadow-lg hover:shadow-primary-500/50 transition-all"
      >
        Upload Match
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronRight, Calendar, Video } from 'lucide-vue-next'
import { format } from 'date-fns'

const router = useRouter()

// Mock data - Replace with actual API call
const matches = ref([
  {
    id: '1',
    homeTeam: { name: 'Raja Casablanca', abbr: 'RCA' },
    awayTeam: { name: 'Wydad AC', abbr: 'WAC' },
    score: { home: 2, away: 1 },
    date: new Date('2024-03-15'),
    status: 'completed',
    stats: {
      possession: 58,
      xG: 1.8,
      shots: 14,
    },
  },
  {
    id: '2',
    homeTeam: { name: 'FAR Rabat', abbr: 'FAR' },
    awayTeam: { name: 'Raja Casablanca', abbr: 'RCA' },
    score: { home: 0, away: 3 },
    date: new Date('2024-03-10'),
    status: 'completed',
    stats: {
      possession: 62,
      xG: 2.3,
      shots: 18,
    },
  },
  {
    id: '3',
    homeTeam: { name: 'Raja Casablanca', abbr: 'RCA' },
    awayTeam: { name: 'FUS Rabat', abbr: 'FUS' },
    score: { home: 0, away: 0 },
    date: new Date(),
    status: 'processing',
    processingProgress: 67,
    processingStatus: 'Analyzing tactical patterns',
    stats: {
      possession: 0,
      xG: 0,
      shots: 0,
    },
  },
])

const formatDate = (date: Date) => {
  return format(date, 'MMM dd, yyyy')
}

const navigateToMatch = (id: string) => {
  router.push(`/matches/${id}`)
}
</script>
