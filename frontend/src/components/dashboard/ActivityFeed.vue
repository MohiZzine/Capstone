<template>
  <div class="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
    <TransitionGroup name="list">
      <div
        v-for="(activity, index) in activities"
        :key="activity.id"
        :style="{ animationDelay: `${index * 50}ms` }"
        class="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group cursor-pointer animate-slide-up"
      >
        <!-- Icon -->
        <div
          :class="[
            'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110',
            activity.iconBg,
          ]"
        >
          <component :is="activity.icon" :size="20" class="text-white" />
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">
            {{ activity.title }}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {{ activity.description }}
          </p>
          <div class="flex items-center gap-3 mt-2">
            <span class="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
              <Clock :size="12" />
              {{ formatTime(activity.timestamp) }}
            </span>
            <span
              v-if="activity.category"
              :class="['text-xs px-2 py-0.5 rounded-full', getCategoryClass(activity.category)]"
            >
              {{ activity.category }}
            </span>
          </div>
        </div>

        <!-- Action Button -->
        <button
          v-if="activity.action"
          @click="activity.action()"
          class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ExternalLink :size="16" class="text-gray-400 hover:text-primary-500" />
        </button>
      </div>
    </TransitionGroup>

    <!-- Load More -->
    <button
      v-if="hasMore"
      @click="loadMore"
      class="w-full py-3 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
    >
      Load more activities
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { formatDistanceToNow } from 'date-fns'
import {
  Upload,
  UserPlus,
  FileText,
  Target,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-vue-next'

const router = useRouter()
const hasMore = ref(true)

const activities = ref([
  {
    id: '1',
    title: 'Match analysis completed',
    description: 'Raja vs Wydad - Tactical patterns identified',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    icon: CheckCircle2,
    iconBg: 'bg-gradient-to-br from-green-500 to-green-600',
    category: 'Analysis',
    action: () => router.push('/matches/1/analysis'),
  },
  {
    id: '2',
    title: 'New player enrolled',
    description: 'Mohammed Amine added to tracking system',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    icon: UserPlus,
    iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    category: 'Players',
    action: () => router.push('/players/5'),
  },
  {
    id: '3',
    title: 'Match uploaded',
    description: 'FAR vs Raja - Processing started',
    timestamp: new Date(Date.now() - 1000 * 60 * 90),
    icon: Upload,
    iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
    category: 'Matches',
    action: () => router.push('/matches/3'),
  },
  {
    id: '4',
    title: 'Weekly report generated',
    description: 'Team performance summary ready',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    icon: FileText,
    iconBg: 'bg-gradient-to-br from-orange-500 to-orange-600',
    category: 'Reports',
    action: () => router.push('/reports'),
  },
  {
    id: '5',
    title: 'Formation analysis updated',
    description: '4-3-3 vs 4-4-2 comparison available',
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
    icon: Target,
    iconBg: 'bg-gradient-to-br from-pink-500 to-pink-600',
    category: 'Tactical',
    action: () => router.push('/tactical'),
  },
])

const formatTime = (date: Date) => {
  return formatDistanceToNow(date, { addSuffix: true })
}

const getCategoryClass = (category: string) => {
  const classes = {
    Analysis: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    Players: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    Matches: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    Reports: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    Tactical: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400',
  }
  return (
    classes[category as keyof typeof classes] ||
    'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
  )
}

const loadMore = () => {
  // Simulate loading more
  console.log('Loading more activities...')
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
