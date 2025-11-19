<template>
  <div class="space-y-6 animate-in">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, Coach! 👋</h1>
        <p class="mt-1 text-gray-600 dark:text-gray-400">
          Here's what's happening with your team today.
        </p>
      </div>
      <div class="text-right">
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ currentDate }}</p>
        <p class="text-xs text-gray-400 dark:text-gray-500">{{ currentTime }}</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        v-for="(stat, index) in stats"
        :key="stat.label"
        :label="stat.label"
        :value="stat.value"
        :change="stat.change"
        :icon="stat.icon"
        :color="stat.color"
        :style="{ animationDelay: `${index * 50}ms` }"
        class="animate-slide-up"
      />
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Matches (2/3 width) -->
      <div
        class="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl shadow-soft border border-gray-200 dark:border-gray-800 p-6 animate-slide-up"
        style="animation-delay: 200ms"
      >
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Recent Matches</h2>
          <RouterLink
            to="/matches"
            class="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center group"
          >
            View All
            <ChevronRight :size="16" class="ml-1 group-hover:translate-x-1 transition-transform" />
          </RouterLink>
        </div>
        <RecentMatches />
      </div>

      <!-- Quick Actions (1/3 width) -->
      <div
        class="bg-white dark:bg-gray-900 rounded-xl shadow-soft border border-gray-200 dark:border-gray-800 p-6 animate-slide-up"
        style="animation-delay: 250ms"
      >
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
        <QuickActions />
      </div>
    </div>

    <!-- Performance Chart -->
    <div
      class="bg-white dark:bg-gray-900 rounded-xl shadow-soft border border-gray-200 dark:border-gray-800 p-6 animate-slide-up"
      style="animation-delay: 300ms"
    >
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Team Performance Trend</h2>
      <PerformanceChart />
    </div>

    <!-- Activity Feed -->
    <div
      class="bg-white dark:bg-gray-900 rounded-xl shadow-soft border border-gray-200 dark:border-gray-800 p-6 animate-slide-up"
      style="animation-delay: 350ms"
    >
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
      <ActivityFeed />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronRight, TrendingUp, Users, Target, Clock } from 'lucide-vue-next'
import StatsCard from '@/components/dashboard/StatsCard.vue'
import RecentMatches from '@/components/dashboard/RecentMatches.vue'
import QuickActions from '@/components/dashboard/QuickActions.vue'
import PerformanceChart from '@/components/dashboard/PerformanceChart.vue'
import ActivityFeed from '@/components/dashboard/ActivityFeed.vue'

const currentDate = ref('')
const currentTime = ref('')

const updateDateTime = () => {
  const now = new Date()
  currentDate.value = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  currentTime.value = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

let interval: number

onMounted(() => {
  updateDateTime()
  interval = setInterval(updateDateTime, 60000)
})

onUnmounted(() => {
  clearInterval(interval)
})

const stats = [
  {
    label: 'Total Matches',
    value: '23',
    change: '+12% from last month',
    icon: Target,
    color: 'primary',
  },
  {
    label: 'Win Rate',
    value: '73%',
    change: '+5% from last month',
    icon: TrendingUp,
    color: 'green',
  },
  {
    label: 'Players Tracked',
    value: '28',
    change: '3 new this week',
    icon: Users,
    color: 'blue',
  },
  {
    label: 'Avg Analysis Time',
    value: '18m',
    change: '-2m improvement',
    icon: Clock,
    color: 'purple',
  },
]
</script>

<style scoped>
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.5s ease-out forwards;
  opacity: 0;
}
</style>
