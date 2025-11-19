<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Matches</h1>
        <p class="mt-1 text-gray-600 dark:text-gray-400">View and analyze all your matches</p>
      </div>
      <Button @click="$router.push('/matches/upload')" variant="primary">
        <template #icon-left>
          <Upload :size="18" />
        </template>
        Upload Match
      </Button>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-3">
      <Select
        v-model="selectedFilter"
        :options="filterOptions"
        placeholder="Filter by status"
        class="w-48"
      />
      <Input
        v-model="searchQuery"
        placeholder="Search matches..."
        class="flex-1 max-w-md"
      >
        <template #prefix>
          <Search :size="18" />
        </template>
      </Input>
    </div>

    <!-- Matches Grid -->
    <div v-if="matches.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <MatchCard
        v-for="match in filteredMatches"
        :key="match.id"
        :match="match"
      />
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else
      :icon="Video"
      title="No matches yet"
      description="Upload your first match to get started with AI-powered analysis"
      action-label="Upload Match"
      :action-icon="Upload"
      @action="$router.push('/matches/upload')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Upload, Search, Video } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Select from '@/components/ui/Select.vue'
import Input from '@/components/ui/Input.vue'
import MatchCard from '@/components/match/MatchCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const searchQuery = ref('')
const selectedFilter = ref('all')

const filterOptions = [
  { value: 'all', label: 'All Matches' },
  { value: 'completed', label: 'Analyzed' },
  { value: 'processing', label: 'Processing' },
]

const matches = ref([
  {
    id: '1',
    homeTeam: 'Raja Casablanca',
    awayTeam: 'Wydad AC',
    score: { home: 2, away: 1 },
    date: new Date('2024-03-15'),
    competition: 'Botola Pro',
    duration: '90:00',
    thumbnail: '',
    status: 'completed' as const,
  },
  {
    id: '2',
    homeTeam: 'FAR Rabat',
    awayTeam: 'Raja Casablanca',
    score: { home: 0, away: 3 },
    date: new Date('2024-03-10'),
    competition: 'Botola Pro',
    duration: '90:00',
    thumbnail: '',
    status: 'completed' as const,
  },
  {
    id: '3',
    homeTeam: 'Raja Casablanca',
    awayTeam: 'FUS Rabat',
    score: { home: 0, away: 0 },
    date: new Date(),
    competition: 'Botola Pro',
    duration: '45:00',
    thumbnail: '',
    status: 'processing' as const,
    processingProgress: 67,
  }
])

const filteredMatches = computed(() => {
  let filtered = matches.value

  if (selectedFilter.value !== 'all') {
    filtered = filtered.filter(m => m.status === selectedFilter.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(m =>
      m.homeTeam.toLowerCase().includes(query) ||
      m.awayTeam.toLowerCase().includes(query)
    )
  }

  return filtered
})
</script>