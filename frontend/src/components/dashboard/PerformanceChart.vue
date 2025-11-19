<template>
  <div class="relative">
    <!-- Chart Controls -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <button
          v-for="metric in metrics"
          :key="metric.key"
          @click="selectedMetric = metric.key"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            selectedMetric === metric.key
              ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
          ]"
        >
          {{ metric.label }}
        </button>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-for="period in periods"
          :key="period.key"
          @click="selectedPeriod = period.key"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
            selectedPeriod === period.key
              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
          ]"
        >
          {{ period.label }}
        </button>
      </div>
    </div>

    <!-- Chart -->
    <div class="relative h-80">
      <canvas ref="chartCanvas" />

      <!-- Loading Overlay -->
      <div
        v-if="isLoading"
        class="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center rounded-lg"
      >
        <div class="text-center">
          <div
            class="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"
          />
          <p class="text-sm text-gray-600 dark:text-gray-400">Loading data...</p>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="mt-6 flex items-center justify-center gap-6">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
        <span class="text-sm text-gray-600 dark:text-gray-400">{{ currentMetricLabel }}</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
        <span class="text-sm text-gray-600 dark:text-gray-400">League Average</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const chartCanvas = ref<HTMLCanvasElement | null>(null)
const chartInstance = ref<Chart | null>(null)
const isLoading = ref(false)
const selectedMetric = ref('xG')
const selectedPeriod = ref('week')

const metrics = [
  { key: 'xG', label: 'Expected Goals' },
  { key: 'possession', label: 'Possession %' },
  { key: 'passAccuracy', label: 'Pass Accuracy' },
  { key: 'pressing', label: 'Pressing Intensity' },
]

const periods = [
  { key: 'week', label: '7D' },
  { key: 'month', label: '30D' },
  { key: 'season', label: 'Season' },
]

const currentMetricLabel = computed(() => {
  return metrics.find((m) => m.key === selectedMetric.value)?.label || ''
})

// Mock data generator
const generateChartData = () => {
  const labels =
    selectedPeriod.value === 'week'
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : selectedPeriod.value === 'month'
        ? Array.from({ length: 8 }, (_, i) => `Week ${i + 1}`)
        : ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']

  const teamData = labels.map(() => Math.random() * 3 + 1)
  const leagueAvg = labels.map(() => Math.random() * 2.5 + 1)

  return { labels, teamData, leagueAvg }
}

const createChart = () => {
  if (!chartCanvas.value) return

  const { labels, teamData, leagueAvg } = generateChartData()

  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  // Destroy existing chart
  if (chartInstance.value) {
    chartInstance.value.destroy()
  }

  // Create gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 400)
  gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)')
  gradient.addColorStop(1, 'rgba(16, 185, 129, 0)')

  chartInstance.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: currentMetricLabel.value,
          data: teamData,
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: gradient,
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: '#fff',
          pointBorderColor: 'rgb(16, 185, 129)',
          pointBorderWidth: 3,
        },
        {
          label: 'League Average',
          data: leagueAvg,
          borderColor: 'rgb(156, 163, 175)',
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#fff',
          pointBorderColor: 'rgb(156, 163, 175)',
          pointBorderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          titleColor: '#fff',
          bodyColor: '#fff',
          displayColors: true,
          boxWidth: 12,
          boxHeight: 12,
          boxPadding: 4,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(156, 163, 175, 0.1)',
            drawBorder: false,
          },
          ticks: {
            color: 'rgb(107, 114, 128)',
            font: {
              size: 12,
            },
          },
        },
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            color: 'rgb(107, 114, 128)',
            font: {
              size: 12,
            },
          },
        },
      },
    },
  })
}

watch([selectedMetric, selectedPeriod], () => {
  isLoading.value = true
  setTimeout(() => {
    createChart()
    isLoading.value = false
  }, 500)
})

onMounted(async () => {
  await nextTick()
  createChart()
})
</script>
