<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <Button @click="$router.back()" variant="ghost" size="sm">
          <template #icon-left>
            <ArrowLeft :size="18} />
          </template>
          Back
        </Button>
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ match.homeTeam }} vs {{ match.awayTeam }}
          </h1>
          <p class="mt-1 text-gray-600 dark:text-gray-400">{{ match.competition }} • {{ formatDate(match.date) }}</p>
        </div>
      </div>
      <Button @click="$router.push(`/matches/${match.id}/analysis`)" variant="primary">
        <template #icon-left>
          <BarChart3 :size="18} />
        </template>
        View Analysis
      </Button>
    </div>

    <!-- Video Player -->
    <VideoPlayer :src="match.videoUrl || ''" :match-id="match.id" />

    <!-- Match Info Tabs -->
    <Tabs v-model="activeTab" :tabs="tabs" variant="pills">
      <div v-if="activeTab === 'overview'" class="mt-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Match Statistics">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Possession</span>
                <span class="font-semibold">58% - 42%</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Shots</span>
                <span class="font-semibold">14 - 8</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Shots on Target</span>
                <span class="font-semibold">6 - 3</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Pass Accuracy</span>
                <span class="font-semibold">85% - 78%</span>
              </div>
            </div>
          </Card>

          <Card title="Score">
            <div class="flex items-center justify-center gap-8 py-6">
              <div class="text-center">
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ match.homeTeam }}</p>
                <p class="text-6xl font-bold text-gray-900 dark:text-white">{{ match.score.home }}</p>
              </div>
              <span class="text-4xl text-gray-400">-</span>
              <div class="text-center">
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ match.awayTeam }}</p>
                <p class="text-6xl font-bold text-gray-900 dark:text-white">{{ match.score.away }}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div v-if="activeTab === 'timeline'">
        <Timeline :match-id="match.id" />
      </div>

      <div v-if="activeTab === 'formation'">
        <FormationView :match-id="match.id" team="home" />
      </div>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { format } from 'date-fns'
import { ArrowLeft, BarChart3, Clock, Users, Target } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Tabs from '@/components/ui/Tabs.vue'
import VideoPlayer from '@/components/match/VideoPlayer.vue'
import Timeline from '@/components/match/Timeline.vue'
import FormationView from '@/components/match/FormationView.vue'

const route = useRoute()
const activeTab = ref('overview')

const tabs = [
  { value: 'overview', label: 'Overview', icon: BarChart3 },
  { value: 'timeline', label: 'Timeline', icon: Clock },
  { value: 'formation', label: 'Formation', icon: Users },
]

const match = ref({
  id: route.params.id as string,
  homeTeam: 'Raja Casablanca',
  awayTeam: 'Wydad AC',
  score: { home: 2, away: 1 },
  date: new Date('2024-03-15'),
  competition: 'Botola Pro',
  videoUrl: ''
})

const formatDate = (date: Date) => {
  return format(date, 'MMMM dd, yyyy')
}
</script>