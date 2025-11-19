<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Match Timeline</h3>
        <div class="flex items-center gap-2">
          <button
            v-for="filter in eventFilters"
            :key="filter.type"
            @click="toggleFilter(filter.type)"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5',
              activeFilters.includes(filter.type)
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            ]"
          >
            <component :is="filter.icon" :size="14" />
            {{ filter.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Timeline Container -->
    <div class="relative">
      <!-- Time Ruler -->
      <div class="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-3">
        <div class="relative h-8">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300"
                :style="{ width: `${currentProgress}%` }"
              />
            </div>
          </div>
          
          <!-- Time Markers -->
          <div class="absolute inset-0 flex items-center justify-between px-2">
            <span
              v-for="minute in [0, 15, 30, 45, 60, 75, 90]"
              :key="minute"
              class="text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {{ minute }}'
            </span>
          </div>
        </div>
        
        <div class="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>First Half</span>
          <span class="font-medium">45:00</span>
          <span>Second Half</span>
        </div>
      </div>

      <!-- Events List -->
      <div class="px-6 py-4 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
        <TransitionGroup name="timeline">
          <div
            v-for="(event, index) in filteredEvents"
            :key="event.id"
            :style="{ animationDelay: `${index * 50}ms` }"
            class="flex items-start gap-4 animate-slide-up"
          >
            <!-- Time -->
            <div class="flex-shrink-0 w-16 text-right">
              <span class="text-sm font-bold text-gray-900 dark:text-white">
                {{ event.minute }}'
              </span>
              <span v-if="event.additionalTime" class="text-xs text-gray-500">
                +{{ event.additionalTime }}
              </span>
            </div>

            <!-- Event Line -->
            <div class="flex flex-col items-center flex-shrink-0">
              <div :class="[
                'w-10 h-10 rounded-full flex items-center justify-center shadow-lg',
                getEventColorClass(event.type)
              ]">
                <component :is="getEventIcon(event.type)" :size="18" class="text-white" />
              </div>
              <div v-if="index < filteredEvents.length - 1" class="w-0.5 h-full min-h-[40px] bg-gray-200 dark:bg-gray-700 mt-2" />
            </div>

            <!-- Event Details -->
            <div class="flex-1 pb-8">
              <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div class="flex items-start justify-between mb-2">
                  <div>
                    <h4 class="font-semibold text-gray-900 dark:text-white">{{ event.title }}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ event.description }}</p>
                  </div>
                  <Badge :variant="getEventBadgeVariant(event.type)" size="sm">
                    {{ event.type }}
                  </Badge>
                </div>

                <!-- Player Info -->
                <div v-if="event.player" class="flex items-center gap-2 mt-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-xs font-bold">{{ event.player.number }}</span>
                  </div>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ event.player.name }}</span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ event.player.position }}</span>
                </div>

                <!-- Additional Data -->
                <div v-if="event.metadata" class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div class="grid grid-cols-3 gap-3">
                    <div v-for="(value, key) in event.metadata" :key="key" class="text-center">
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ key }}</p>
                      <p class="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{{ value }}</p>
                    </div>
                  </div>
                </div>

                <!-- Video Clip Button -->
                <button
                  v-if="event.hasClip"
                  @click="playClip(event.id)"
                  class="mt-3 flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                >
                  <Play :size="14" />
                  Watch Clip
                </button>
              </div>
            </div>
          </div>
        </TransitionGroup>

        <!-- Empty State -->
        <div v-if="filteredEvents.length === 0" class="text-center py-12">
          <Filter :size="48} class="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p class="text-gray-500 dark:text-gray-400">No events match your filters</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Target,
  AlertCircle,
  Flag,
  Users2,
  Play,
  Filter,
  TrendingUp,
  Shield
} from 'lucide-vue-next'
import Badge from '@/components/ui/Badge.vue'

interface Props {
  matchId: string
  currentTime?: number
}

const props = withDefaults(defineProps<Props>(), {
  currentTime: 0
})

const emit = defineEmits<{
  seekTo: [time: number]
}>()

const activeFilters = ref<string[]>(['Goal', 'Foul', 'Corner', 'Substitution'])

const eventFilters = [
  { type: 'Goal', label: 'Goals', icon: Target },
  { type: 'Foul', label: 'Fouls', icon: AlertCircle },
  { type: 'Corner', label: 'Corners', icon: Flag },
  { type: 'Substitution', label: 'Subs', icon: Users2 },
]

// Mock events data
const events = ref([
  {
    id: '1',
    minute: 3,
    type: 'Goal',
    title: 'Goal! Raja Casablanca',
    description: 'Great team play leads to opening goal',
    player: { name: 'Mohammed Amine', number: '10', position: 'CAM' },
    hasClip: true,
    metadata: { xG: '0.82', Distance: '16m', Assist: 'Benali' }
  },
  {
    id: '2',
    minute: 18,
    type: 'Foul',
    title: 'Yellow Card',
    description: 'Tactical foul stops counter-attack',
    player: { name: 'Reda Slim', number: '4', position: 'CB' },
    hasClip: true,
    metadata: null
  },
  {
    id: '3',
    minute: 27,
    type: 'Corner',
    title: 'Corner Kick',
    description: 'Dangerous cross cleared by defense',
    player: null,
    hasClip: false,
    metadata: null
  },
  {
    id: '4',
    minute: 35,
    additionalTime: 2,
    type: 'Goal',
    title: 'Goal! Raja Casablanca',
    description: 'Clinical finish from outside the box',
    player: { name: 'Youssef Benali', number: '7', position: 'RW' },
    hasClip: true,
    metadata: { xG: '0.15', Distance: '22m', Speed: '112 km/h' }
  },
  {
    id: '5',
    minute: 46,
    type: 'Substitution',
    title: 'Substitution',
    description: 'Tactical change at halftime',
    player: { name: 'Ahmed Zaki', number: '14', position: 'ST' },
    hasClip: false,
    metadata: { Out: 'Hassan (#9)', In: 'Zaki (#14)' }
  },
  {
    id: '6',
    minute: 67,
    type: 'Goal',
    title: 'Goal! Wydad AC',
    description: 'Quick response from the visitors',
    player: { name: 'Opponent Player', number: '11', position: 'ST' },
    hasClip: true,
    metadata: { xG: '0.68', Distance: '12m' }
  },
  {
    id: '7',
    minute: 82,
    type: 'Corner',
    title: 'Corner Kick',
    description: 'Last-minute pressure from Raja',
    player: null,
    hasClip: false,
    metadata: null
  },
])

const currentProgress = computed(() => {
  return (props.currentTime / 90) * 100
})

const filteredEvents = computed(() => {
  if (activeFilters.value.length === 0) return events.value
  return events.value.filter(event => activeFilters.value.includes(event.type))
})

const toggleFilter = (type: string) => {
  const index = activeFilters.value.indexOf(type)
  if (index > -1) {
    activeFilters.value.splice(index, 1)
  } else {
    activeFilters.value.push(type)
  }
}

const getEventIcon = (type: string) => {
  const icons: Record<string, any> = {
    Goal: Target,
    Foul: AlertCircle,
    Corner: Flag,
    Substitution: Users2,
    Shot: TrendingUp,
    Save: Shield
  }
  return icons[type] || Target
}

const getEventColorClass = (type: string) => {
  const classes: Record<string, string> = {
    Goal: 'bg-gradient-to-br from-green-500 to-green-600',
    Foul: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
    Corner: 'bg-gradient-to-br from-blue-500 to-blue-600',
    Substitution: 'bg-gradient-to-br from-purple-500 to-purple-600',
    Shot: 'bg-gradient-to-br from-orange-500 to-orange-600',
    Save: 'bg-gradient-to-br from-cyan-500 to-cyan-600'
  }
  return classes[type] || 'bg-gradient-to-br from-gray-500 to-gray-600'
}

const getEventBadgeVariant = (type: string) => {
  const variants: Record<string, any> = {
    Goal: 'success',
    Foul: 'warning',
    Corner: 'info',
    Substitution: 'default'
  }
  return variants[type] || 'default'
}

const playClip = (eventId: string) => {
  const event = events.value.find(e => e.id === eventId)
  if (event) {
    emit('seekTo', event.minute * 60)
  }
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

.timeline-enter-active,
.timeline-leave-active {
  transition: all 0.3s ease;
}

.timeline-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.timeline-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>