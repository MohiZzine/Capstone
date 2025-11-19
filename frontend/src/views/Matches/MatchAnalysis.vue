<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <Button @click="$router.back()" variant="ghost" size="sm">
          <template #icon-left>
            <ArrowLeft :size="18" />
          </template>
          Back
        </Button>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Match Analysis</h1>
      </div>
      <Button variant="primary">
        <template #icon-left>
          <Download :size="18" />
        </template>
        Export Report
      </Button>
    </div>

    <!-- Analysis Tabs -->
    <Tabs v-model="activeTab" :tabs="tabs">
      <div v-if="activeTab === 'heatmap'" class="mt-6">
        <HeatMap :match-id="matchId" />
      </div>

      <div v-if="activeTab === 'tactics'" class="mt-6">
        <Card title="Tactical Analysis">
          <div class="prose dark:prose-invert max-w-none">
            <p>Detailed tactical analysis will be displayed here.</p>
          </div>
        </Card>
      </div>

      <div v-if="activeTab === 'players'" class="mt-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card v-for="i in 6" :key="i">
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-white text-xl font-bold">{{ i }}</span>
              </div>
              <h3 class="font-semibold text-gray-900 dark:text-white">Player {{ i }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Position</p>
              <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div class="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p class="text-gray-500">Rating</p>
                    <p class="font-bold">7.8</p>
                  </div>
                  <div>
                    <p class="text-gray-500">Distance</p>
                    <p class="font-bold">10km</p>
                  </div>
                  <div>
                    <p class="text-gray-500">Touches</p>
                    <p class="font-bold">65</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, Download, Flame, Target, Users } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Tabs from '@/components/ui/Tabs.vue'
import HeatMap from '@/components/match/HeatMap.vue'

const route = useRoute()
const matchId = route.params.id as string
const activeTab = ref('heatmap')

const tabs = [
  { value: 'heatmap', label: 'Heat Map', icon: Flame },
  { value: 'tactics', label: 'Tactics', icon: Target },
  { value: 'players', label: 'Players', icon: Users },
]
</script>