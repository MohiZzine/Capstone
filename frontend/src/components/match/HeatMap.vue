<template>
  <div class="relative w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-2xl">
    <!-- Pitch Background -->
    <div class="relative aspect-[16/10]">
      <canvas
        ref="heatmapCanvas"
        class="absolute inset-0 w-full h-full"
      />
      
      <!-- Pitch Overlay -->
      <svg
        class="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1000 625"
        preserveAspectRatio="none"
      >
        <!-- Pitch Lines -->
        <g class="opacity-20" stroke="white" fill="none" stroke-width="2">
          <!-- Touchlines -->
          <rect x="50" y="50" width="900" height="525" />
          <!-- Center Line -->
          <line x1="500" y1="50" x2="500" y2="575" />
          <!-- Center Circle -->
          <circle cx="500" cy="312.5" r="91.5" />
          <!-- Penalty Boxes -->
          <rect x="50" y="175" width="165" height="275" />
          <rect x="785" y="175" width="165" height="275" />
          <!-- Goal Boxes -->
          <rect x="50" y="244" width="55" height="137" />
          <rect x="895" y="244" width="55" height="137" />
          <!-- Penalty Spots -->
          <circle cx="176" cy="312.5" r="3" fill="white" />
          <circle cx="824" cy="312.5" r="3" fill="white" />
        </g>
      </svg>

      <!-- Player Selection Overlay -->
      <div class="absolute top-4 left-4 right-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <Select
            v-model="selectedPlayer"
            :options="playerOptions"
            size="sm"
            class="w-48"
          />
          <Select
            v-model="selectedPeriod"
            :options="periodOptions"
            size="sm"
            class="w-32"
          />
        </div>
        
        <div class="flex items-center gap-2 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
          <button
            v-for="intensity in intensityLevels"
            :key="intensity.value"
            @click="selectedIntensity = intensity.value"
            :class="[
              'px-3 py-1.5 rounded text-xs font-medium transition-all',
              selectedIntensity === intensity.value
                ? 'bg-primary-500 text-white'
                : 'text-white/70 hover:bg-white/10'
            ]"
          >
            {{ intensity.label }}
          </button>
        </div>
      </div>

      <!-- Legend -->
      <div class="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3">
        <p class="text-xs font-medium text-white mb-2">Activity Intensity</p>
        <div class="flex items-center gap-1">
          <div
            v-for="(color, index) in gradientColors"
            :key="index"
            class="w-8 h-4 first:rounded-l last:rounded-r"
            :style="{ backgroundColor: color }"
          />
        </div>
        <div class="flex items-center justify-between mt-1">
          <span class="text-2xs text-white/60">Low</span>
          <span class="text-2xs text-white/60">High</span>
        </div>
      </div>

      <!-- Stats Card -->
      <div class="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-4 min-w-[200px]">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-lg">{{ selectedPlayerData?.number }}</span>
          </div>
          <div>
            <p class="text-white font-semibold">{{ selectedPlayerData?.name }}</p>
            <p class="text-xs text-white/60">{{ selectedPlayerData?.position }}</p>
          </div>
        </div>
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="text-white/60">Distance Covered</span>
            <span class="text-white font-semibold">{{ selectedPlayerData?.distance }}km</span>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-white/60">Top Speed</span>
            <span class="text-white font-semibold">{{ selectedPlayerData?.topSpeed }}km/h</span>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-white/60">Touches</span>
            <span class="text-white font-semibold">{{ selectedPlayerData?.touches }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import Select from '@/components/ui/Select.vue'

interface Props {
  matchId: string
}

const props = defineProps<Props>()

const heatmapCanvas = ref<HTMLCanvasElement | null>(null)
const selectedPlayer = ref('p1')
const selectedPeriod = ref('full')
const selectedIntensity = ref('high')

const playerOptions = [
  { value: 'p1', label: 'Mohammed Amine (#10)' },
  { value: 'p2', label: 'Youssef Benali (#7)' },
  { value: 'p3', label: 'Reda Slim (#4)' },
  { value: 'p4', label: 'Hamza Kaddouri (#6)' },
]

const periodOptions = [
  { value: 'full', label: 'Full Match' },
  { value: 'first', label: 'First Half' },
  { value: 'second', label: 'Second Half' },
]

const intensityLevels = [
  { value: 'all', label: 'All' },
  { value: 'high', label: 'High' },
  { value: 'sprint', label: 'Sprint' },
]

const gradientColors = [
  'rgba(59, 130, 246, 0.3)',   // Blue (low)
  'rgba(16, 185, 129, 0.5)',   // Green (medium)
  'rgba(251, 191, 36, 0.7)',   // Yellow (high)
  'rgba(239, 68, 68, 0.9)',    // Red (very high)
]

const selectedPlayerData = computed(() => {
  // Mock data - replace with real data
  const data: Record<string, any> = {
    p1: { name: 'Mohammed Amine', number: '10', position: 'CAM', distance: 11.2, topSpeed: 32.5, touches: 78 },
    p2: { name: 'Youssef Benali', number: '7', position: 'RW', distance: 10.8, topSpeed: 34.2, touches: 52 },
    p3: { name: 'Reda Slim', number: '4', position: 'CB', distance: 9.5, topSpeed: 28.1, touches: 92 },
    p4: { name: 'Hamza Kaddouri', number: '6', position: 'CDM', distance: 10.3, topSpeed: 29.7, touches: 85 },
  }
  return data[selectedPlayer.value]
})

// Generate heatmap data points
const generateHeatmapData = () => {
  const points: Array<{ x: number; y: number; intensity: number }> = []
  
  // Mock data generation - replace with actual tracking data
  for (let i = 0; i < 200; i++) {
    points.push({
      x: Math.random() * 1000,
      y: Math.random() * 625,
      intensity: Math.random()
    })
  }
  
  return points
}

const drawHeatmap = () => {
  if (!heatmapCanvas.value) return
  
  const canvas = heatmapCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  // Set canvas dimensions
  canvas.width = canvas.offsetWidth * 2 // Retina support
  canvas.height = canvas.offsetHeight * 2
  ctx.scale(2, 2)
  
  const width = canvas.offsetWidth
  const height = canvas.offsetHeight
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height)
  
  const points = generateHeatmapData()
  const radius = 50
  
  // Draw each point with gradient
  points.forEach(point => {
    const gradient = ctx.createRadialGradient(
      point.x * (width / 1000),
      point.y * (height / 625),
      0,
      point.x * (width / 1000),
      point.y * (height / 625),
      radius
    )
    
    const colorIndex = Math.floor(point.intensity * (gradientColors.length - 1))
    const color = gradientColors[colorIndex]
    
    gradient.addColorStop(0, color)
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  })
  
  // Apply blur for smoother appearance
  ctx.filter = 'blur(8px)'
  ctx.drawImage(canvas, 0, 0, width, height)
  ctx.filter = 'none'
}

watch([selectedPlayer, selectedPeriod, selectedIntensity], () => {
  nextTick(() => {
    drawHeatmap()
  })
})

onMounted(() => {
  nextTick(() => {
    drawHeatmap()
  })
})
</script>