<template>
  <div class="absolute inset-0 pointer-events-none">
    <svg
      ref="svgCanvas"
      class="w-full h-full"
      :viewBox="`0 0 ${width} ${height}`"
      preserveAspectRatio="xMidYMid meet"
    >
      <!-- Pitch Lines (if enabled) -->
      <g v-if="showPitch" class="opacity-30">
        <!-- Center Circle -->
        <circle
          :cx="width / 2"
          :cy="height / 2"
          :r="height * 0.15"
          fill="none"
          stroke="white"
          stroke-width="2"
        />
        <!-- Center Line -->
        <line
          :x1="width / 2"
          y1="0"
          :x2="width / 2"
          :y2="height"
          stroke="white"
          stroke-width="2"
        />
        <!-- Penalty Boxes -->
        <rect
          :x="width * 0.2"
          :y="height * 0.25"
          :width="width * 0.1"
          :height="height * 0.5"
          fill="none"
          stroke="white"
          stroke-width="2"
        />
        <rect
          :x="width * 0.7"
          :y="height * 0.25"
          :width="width * 0.1"
          :height="height * 0.5"
          fill="none"
          stroke="white"
          stroke-width="2"
        />
      </g>

      <!-- Player Positions -->
      <g v-for="player in players" :key="player.id">
        <!-- Player Circle -->
        <circle
          :cx="player.x"
          :cy="player.y"
          :r="12"
          :fill="player.team === 'home' ? '#10b981' : '#3b82f6'"
          :stroke="player.hasBall ? '#fbbf24' : 'white'"
          :stroke-width="player.hasBall ? 3 : 1.5"
          class="transition-all duration-300"
        />
        
        <!-- Jersey Number -->
        <text
          :x="player.x"
          :y="player.y + 5"
          text-anchor="middle"
          class="text-xs font-bold fill-white pointer-events-none"
        >
          {{ player.number }}
        </text>
        
        <!-- Movement Arrow -->
        <g v-if="player.velocity && showMovement">
          <defs>
            <marker
              :id="`arrow-${player.id}`"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L0,6 L9,3 z" fill="white" />
            </marker>
          </defs>
          <line
            :x1="player.x"
            :y1="player.y"
            :x2="player.x + player.velocity.x * 20"
            :y2="player.y + player.velocity.y * 20"
            stroke="white"
            stroke-width="2"
            :marker-end="`url(#arrow-${player.id})`"
            class="opacity-70"
          />
        </g>
      </g>

      <!-- Ball Position -->
      <g v-if="ball">
        <circle
          :cx="ball.x"
          :cy="ball.y"
          r="8"
          fill="#fbbf24"
          stroke="white"
          stroke-width="2"
          class="animate-pulse"
        />
      </g>

      <!-- Formation Lines -->
      <g v-if="showFormation && formation">
        <path
          v-for="(line, index) in formation.lines"
          :key="`line-${index}`"
          :d="line"
          stroke="#10b981"
          stroke-width="2"
          fill="none"
          stroke-dasharray="5,5"
          class="opacity-50"
        />
      </g>

      <!-- Passing Lines -->
      <g v-if="showPasses && passes.length > 0">
        <line
          v-for="(pass, index) in passes"
          :key="`pass-${index}`"
          :x1="pass.from.x"
          :y1="pass.from.y"
          :x2="pass.to.x"
          :y2="pass.to.y"
          :stroke="pass.successful ? '#10b981' : '#ef4444'"
          stroke-width="2"
          :stroke-dasharray="pass.successful ? '0' : '5,5'"
          class="opacity-60 animate-draw-line"
          :style="{ animationDelay: `${index * 100}ms` }"
        />
      </g>

      <!-- Zone Highlights -->
      <g v-if="zones.length > 0">
        <rect
          v-for="zone in zones"
          :key="zone.id"
          :x="zone.x"
          :y="zone.y"
          :width="zone.width"
          :height="zone.height"
          :fill="zone.color"
          :opacity="zone.opacity || 0.3"
          :rx="8"
          class="transition-all duration-300"
        />
      </g>

      <!-- Event Markers -->
      <g v-for="event in events" :key="event.id">
        <circle
          :cx="event.x"
          :cy="event.y"
          r="20"
          :fill="getEventColor(event.type)"
          class="opacity-20 animate-ping"
        />
        <circle
          :cx="event.x"
          :cy="event.y"
          r="16"
          :fill="getEventColor(event.type)"
          class="opacity-80"
        />
        <text
          :x="event.x"
          :y="event.y + 5"
          text-anchor="middle"
          class="text-xs font-bold fill-white pointer-events-none"
        >
          {{ getEventIcon(event.type) }}
        </text>
      </g>
    </svg>

    <!-- Control Panel -->
    <div class="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 pointer-events-auto">
      <div class="flex flex-col gap-2">
        <button
          @click="showPitch = !showPitch"
          :class="buttonClass(showPitch)"
        >
          <Grid3x3 :size="16" />
          <span class="text-xs">Pitch</span>
        </button>
        <button
          @click="showFormation = !showFormation"
          :class="buttonClass(showFormation)"
        >
          <Users :size="16" />
          <span class="text-xs">Formation</span>
        </button>
        <button
          @click="showMovement = !showMovement"
          :class="buttonClass(showMovement)"
        >
          <MoveRight :size="16" />
          <span class="text-xs">Movement</span>
        </button>
        <button
          @click="showPasses = !showPasses"
          :class="buttonClass(showPasses)"
        >
          <GitBranch :size="16" />
          <span class="text-xs">Passes</span>
        </button>
      </div>
    </div>

    <!-- Legend -->
    <div class="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 pointer-events-auto">
      <div class="flex items-center gap-4 text-xs text-white">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-primary-500" />
          <span>Home Team</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-blue-500" />
          <span>Away Team</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-yellow-400" />
          <span>Ball</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Grid3x3, Users, MoveRight, GitBranch } from 'lucide-vue-next'

interface Props {
  videoTime: number
  matchId: string
}

const props = defineProps<Props>()

const svgCanvas = ref<SVGSVGElement | null>(null)
const width = ref(1280)
const height = ref(720)

const showPitch = ref(true)
const showFormation = ref(true)
const showMovement = ref(true)
const showPasses = ref(false)

// Mock data - Replace with real-time tracking data
const players = ref([
  { id: '1', number: '1', x: 150, y: 360, team: 'home', hasBall: false, velocity: { x: 0.5, y: 0.2 } },
  { id: '2', number: '3', x: 280, y: 200, team: 'home', hasBall: false, velocity: { x: 0.3, y: -0.1 } },
  { id: '3', number: '4', x: 280, y: 520, team: 'home', hasBall: false, velocity: { x: 0.2, y: 0.3 } },
  { id: '4', number: '6', x: 400, y: 360, team: 'home', hasBall: false, velocity: { x: 0.4, y: 0 } },
  { id: '5', number: '8', x: 520, y: 280, team: 'home', hasBall: true, velocity: { x: 0.6, y: -0.2 } },
  { id: '6', number: '10', x: 640, y: 360, team: 'home', hasBall: false, velocity: { x: 0.5, y: 0.1 } },
  
  { id: '11', number: '1', x: 1130, y: 360, team: 'away', hasBall: false, velocity: { x: -0.3, y: 0 } },
  { id: '12', number: '5', x: 1000, y: 200, team: 'away', hasBall: false, velocity: { x: -0.2, y: 0.1 } },
  { id: '13', number: '4', x: 1000, y: 520, team: 'away', hasBall: false, velocity: { x: -0.2, y: -0.1 } },
  { id: '14', number: '8', x: 880, y: 360, team: 'away', hasBall: false, velocity: { x: -0.4, y: 0 } },
  { id: '15', number: '10', x: 760, y: 280, team: 'away', hasBall: false, velocity: { x: -0.5, y: 0.2 } },
])

const ball = ref({ x: 520, y: 280 })

const formation = computed(() => {
  if (!showFormation.value) return null
  
  return {
    lines: [
      `M 150,360 L 280,200 L 280,520 Z`, // Defense line
      `M 400,360 L 520,280 L 640,360 L 520,440 Z`, // Midfield diamond
    ]
  }
})

const passes = ref([
  { from: { x: 400, y: 360 }, to: { x: 520, y: 280 }, successful: true },
  { from: { x: 520, y: 280 }, to: { x: 640, y: 360 }, successful: true },
])

const zones = ref([
  { id: 'attacking-third', x: 853, y: 0, width: 427, height: 720, color: '#ef4444', opacity: 0.1 },
  { id: 'defensive-third', x: 0, y: 0, width: 427, height: 720, color: '#10b981', opacity: 0.1 },
])

const events = ref([
  { id: 'goal', x: 1100, y: 360, type: 'goal' },
  { id: 'foul', x: 640, y: 480, type: 'foul' },
])

const buttonClass = (active: boolean) => {
  return [
    'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all',
    active
      ? 'bg-primary-500 text-white'
      : 'text-white/70 hover:bg-white/10 hover:text-white'
  ].join(' ')
}

const getEventColor = (type: string) => {
  const colors: Record<string, string> = {
    goal: '#10b981',
    foul: '#ef4444',
    corner: '#f59e0b',
    substitution: '#3b82f6'
  }
  return colors[type] || '#6b7280'
}

const getEventIcon = (type: string) => {
  const icons: Record<string, string> = {
    goal: '⚽',
    foul: '🟨',
    corner: '🚩',
    substitution: '🔄'
  }
  return icons[type] || '•'
}

// Update player positions based on video time
watch(() => props.videoTime, (time) => {
  // Here you would fetch real tracking data based on video timestamp
  // For now, we'll simulate subtle movement
  players.value.forEach(player => {
    if (player.velocity) {
      player.x += player.velocity.x * 2
      player.y += player.velocity.y * 2
      
      // Keep within bounds
      player.x = Math.max(50, Math.min(width.value - 50, player.x))
      player.y = Math.max(50, Math.min(height.value - 50, player.y))
    }
  })
  
  // Update ball position
  const playerWithBall = players.value.find(p => p.hasBall)
  if (playerWithBall) {
    ball.value.x = playerWithBall.x
    ball.value.y = playerWithBall.y
  }
})

onMounted(() => {
  // Initialize canvas dimensions
  if (svgCanvas.value) {
    const rect = svgCanvas.value.getBoundingClientRect()
    width.value = rect.width
    height.value = rect.height
  }
})
</script>

<style scoped>
@keyframes draw-line {
  from {
    stroke-dashoffset: 1000;
  }
  to {
    stroke-dashoffset: 0;
  }
}

.animate-draw-line {
  stroke-dasharray: 1000;
  animation: draw-line 1s ease-out forwards;
}
</style>