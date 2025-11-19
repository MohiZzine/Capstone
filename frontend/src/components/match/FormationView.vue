<template>
  <div
    class="relative w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-2xl"
  >
    <!-- Pitch Background -->
    <div class="relative aspect-[16/10]" ref="pitchContainer">
      <!-- Pitch SVG Background -->
      <svg class="absolute inset-0 w-full h-full" viewBox="0 0 1000 625" preserveAspectRatio="none">
        <!-- Grass Pattern -->
        <defs>
          <pattern id="grass" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="50" fill="rgba(16, 185, 129, 0.05)" />
            <rect y="50" width="100" height="50" fill="rgba(16, 185, 129, 0.08)" />
          </pattern>
        </defs>
        <rect width="1000" height="625" fill="url(#grass)" />

        <!-- Pitch Lines -->
        <g class="opacity-20" stroke="white" fill="none" stroke-width="2">
          <rect x="50" y="50" width="900" height="525" />
          <line x1="500" y1="50" x2="500" y2="575" />
          <circle cx="500" cy="312.5" r="91.5" />
          <circle cx="500" cy="312.5" r="3" fill="white" />
          <rect x="50" y="175" width="165" height="275" />
          <rect x="785" y="175" width="165" height="275" />
          <rect x="50" y="244" width="55" height="137" />
          <rect x="895" y="244" width="55" height="137" />
          <path d="M 176,175 A 91.5,91.5 0 0,1 176,450" />
          <path d="M 824,175 A 91.5,91.5 0 0,0 824,450" />
          <circle cx="176" cy="312.5" r="3" fill="white" />
          <circle cx="824" cy="312.5" r="3" fill="white" />
        </g>

        <!-- Drawing Annotations -->
        <g v-for="(annotation, index) in annotations" :key="`annotation-${index}`">
          <!-- Line -->
          <line
            v-if="annotation.type === 'line'"
            :x1="annotation.start.x"
            :y1="annotation.start.y"
            :x2="annotation.end.x"
            :y2="annotation.end.y"
            :stroke="annotation.color"
            :stroke-width="annotation.width"
            stroke-linecap="round"
            :opacity="annotation.temp ? 0.6 : 1"
          />

          <!-- Arrow -->
          <g v-if="annotation.type === 'arrow'">
            <defs>
              <marker
                :id="`arrowhead-${index}`"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L0,6 L9,3 z" :fill="annotation.color" />
              </marker>
            </defs>
            <line
              :x1="annotation.start.x"
              :y1="annotation.start.y"
              :x2="annotation.end.x"
              :y2="annotation.end.y"
              :stroke="annotation.color"
              :stroke-width="annotation.width"
              stroke-linecap="round"
              :marker-end="`url(#arrowhead-${index})`"
              :opacity="annotation.temp ? 0.6 : 1"
            />
          </g>

          <!-- Rectangle -->
          <rect
            v-if="annotation.type === 'rectangle'"
            :x="Math.min(annotation.start.x, annotation.end.x)"
            :y="Math.min(annotation.start.y, annotation.end.y)"
            :width="Math.abs(annotation.end.x - annotation.start.x)"
            :height="Math.abs(annotation.end.y - annotation.start.y)"
            :stroke="annotation.color"
            :stroke-width="annotation.width"
            fill="none"
            rx="8"
            :opacity="annotation.temp ? 0.6 : 1"
          />

          <!-- Circle -->
          <circle
            v-if="annotation.type === 'circle'"
            :cx="annotation.start.x"
            :cy="annotation.start.y"
            :r="
              Math.sqrt(
                Math.pow(annotation.end.x - annotation.start.x, 2) +
                  Math.pow(annotation.end.y - annotation.start.y, 2)
              )
            "
            :stroke="annotation.color"
            :stroke-width="annotation.width"
            fill="none"
            :opacity="annotation.temp ? 0.6 : 1"
          />
        </g>

        <!-- Player Positions (in SVG for proper scaling) -->
        <!-- We use a group transform so circle + number always move together -->
        <g
          v-for="player in allPlayers"
          :key="player.id"
          :transform="`translate(${player.x}, ${player.y})`"
        >
          <circle
            cx="0"
            cy="0"
            r="20"
            :fill="player.team === 'home' ? '#10b981' : '#3b82f6'"
            stroke="white"
            stroke-width="3"
            class="cursor-move transition-all"
            :class="{ 'opacity-80 scale-110': draggingPlayer?.id === player.id }"
            @mousedown.prevent="startDragging(player, $event)"
            style="filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))"
          />
          <text
            x="0"
            y="0"
            text-anchor="middle"
            dominant-baseline="middle"
            class="text-base font-bold fill-white pointer-events-none select-none"
            style="
              font-family:
                system-ui,
                -apple-system,
                sans-serif;
            "
          >
            {{ player.number }}
          </text>
        </g>
      </svg>

      <!-- Invisible drawing surface -->
      <div
        class="absolute inset-0"
        :class="[currentTool ? 'cursor-crosshair pointer-events-auto' : 'pointer-events-none']"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
      />

      <!-- Team Toggle - Top Left -->
      <div class="absolute top-4 left-4" style="z-index: 100">
        <div class="bg-black/90 backdrop-blur-xl rounded-xl p-4 border border-white/20">
          <p class="text-xs font-semibold text-white mb-2">Show Teams</p>
          <div class="flex gap-2">
            <button
              @click="showHomeTeam = !showHomeTeam"
              :class="[
                'flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all',
                showHomeTeam
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20',
              ]"
            >
              Home
            </button>
            <button
              @click="showAwayTeam = !showAwayTeam"
              :class="[
                'flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all',
                showAwayTeam
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20',
              ]"
            >
              Away
            </button>
          </div>
        </div>
      </div>

      <!-- Drawing Tools - Top Right -->
      <div
        class="absolute top-4 right-4 bg-black/90 backdrop-blur-xl rounded-xl p-3 border border-white/20"
        style="z-index: 100"
      >
        <p class="text-xs font-semibold text-white mb-3">Drawing Tools</p>

        <div class="grid grid-cols-2 gap-2 mb-3">
          <button
            v-for="tool in drawingTools"
            :key="tool.type"
            @click="selectTool(tool.type)"
            :class="[
              'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all',
              currentTool === tool.type
                ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white',
            ]"
          >
            <component :is="tool.icon" :size="18" />
            <span class="text-2xs font-medium">{{ tool.label }}</span>
          </button>
        </div>

        <!-- Color Picker (3 colors only) -->
        <div class="flex gap-2 mb-3">
          <button
            v-for="color in colors"
            :key="color"
            @click="selectedColor = color"
            :class="[
              'w-8 h-8 rounded-full border-2 transition-all',
              selectedColor === color
                ? 'border-white scale-110 shadow-lg'
                : 'border-transparent hover:border-white/50',
            ]"
            :style="{ backgroundColor: color }"
          />
        </div>

        <!-- Actions -->
        <div class="flex gap-2">
          <button
            @click="undoAnnotation"
            class="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            :disabled="permanentAnnotations.length === 0"
          >
            <Undo2 :size="14" class="mx-auto" />
          </button>
          <button
            @click="clearAnnotations"
            class="flex-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 text-xs font-medium transition-all"
          >
            <Trash2 :size="14" class="mx-auto" />
          </button>
        </div>
      </div>

      <!-- Formations - Bottom Left Above Legend -->
      <div class="absolute bottom-24 left-4" style="z-index: 100">
        <div class="bg-black/90 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-2xl">
          <div class="flex items-center gap-2 mb-3">
            <Users :size="18" class="text-primary-400" />
            <span class="text-sm font-semibold text-white">Formations</span>
          </div>

          <div class="space-y-2">
            <!-- Home Formation -->
            <div>
              <p class="text-[11px] text-gray-300 mb-1">Home</p>
              <div class="relative" style="z-index: 110">
                <button
                  @click="showHomeFormationDropdown = !showHomeFormationDropdown"
                  class="w-full flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-primary-500/30 to-accent-500/30 hover:from-primary-500/40 hover:to-accent-500/40 border border-primary-500/50 rounded-lg text-white font-medium transition-all"
                >
                  <span>{{ selectedHomeFormation }}</span>
                  <ChevronDown
                    :size="16"
                    :class="{ 'rotate-180': showHomeFormationDropdown }"
                    class="transition-transform"
                  />
                </button>

                <Transition name="dropdown">
                  <div
                    v-if="showHomeFormationDropdown"
                    class="absolute bottom-full mb-2 w-full bg-gray-900/98 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl overflow-hidden"
                    style="z-index: 120"
                  >
                    <button
                      v-for="formation in formations"
                      :key="formation"
                      @click="selectFormation('home', formation)"
                      :class="[
                        'w-full px-4 py-2.5 text-left text-sm font-medium transition-all',
                        selectedHomeFormation === formation
                          ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                          : 'text-gray-300 hover:bg-white/10 hover:text-white',
                      ]"
                    >
                      {{ formation }}
                    </button>
                  </div>
                </Transition>
              </div>
            </div>

            <!-- Away Formation -->
            <div>
              <p class="text-[11px] text-gray-300 mb-1">Away</p>
              <div class="relative" style="z-index: 110">
                <button
                  @click="showAwayFormationDropdown = !showAwayFormationDropdown"
                  class="w-full flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-primary-500/30 to-accent-500/30 hover:from-primary-500/40 hover:to-accent-500/40 border border-primary-500/50 rounded-lg text-white font-medium transition-all"
                >
                  <span>{{ selectedAwayFormation }}</span>
                  <ChevronDown
                    :size="16"
                    :class="{ 'rotate-180': showAwayFormationDropdown }"
                    class="transition-transform"
                  />
                </button>

                <Transition name="dropdown">
                  <div
                    v-if="showAwayFormationDropdown"
                    class="absolute bottom-full mb-2 w-full bg-gray-900/98 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl overflow-hidden"
                    style="z-index: 120"
                  >
                    <button
                      v-for="formation in formations"
                      :key="formation"
                      @click="selectFormation('away', formation)"
                      :class="[
                        'w-full px-4 py-2.5 text-left text-sm font-medium transition-all',
                        selectedAwayFormation === formation
                          ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                          : 'text-gray-300 hover:bg-white/10 hover:text-white',
                      ]"
                    >
                      {{ formation }}
                    </button>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons - Bottom Right -->
      <div class="absolute bottom-4 right-4 flex gap-2" style="z-index: 100">
        <button
          @click="resetFormation"
          class="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium transition-all border border-white/10"
        >
          <RotateCcw :size="16" class="inline mr-2" />
          Reset
        </button>
        <button
          @click="saveFormation"
          class="px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 hover:shadow-lg rounded-lg text-white text-sm font-medium transition-all"
        >
          <Save :size="16" class="inline mr-2" />
          Save
        </button>
      </div>

      <!-- Legend - Bottom Left -->
      <div
        class="absolute bottom-4 left-4 bg-black/90 backdrop-blur-xl rounded-lg p-3 border border-white/20"
        style="z-index: 100"
      >
        <div class="flex items-center gap-4 text-xs text-white">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded-full bg-primary-500" />
            <span>Home Team</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded-full bg-blue-500" />
            <span>Away Team</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Users,
  ChevronDown,
  Minus,
  MoveRight,
  Square,
  Circle,
  Undo2,
  Trash2,
  RotateCcw,
  Save,
} from 'lucide-vue-next'

interface Props {
  matchId: string
  team?: 'home' | 'away' | 'both'
}

const props = withDefaults(defineProps<Props>(), {
  team: 'both',
})

const pitchContainer = ref<HTMLDivElement | null>(null)

// Two separate formations
const selectedHomeFormation = ref('4-3-3')
const selectedAwayFormation = ref('4-3-3')
const showHomeFormationDropdown = ref(false)
const showAwayFormationDropdown = ref(false)

const showHomeTeam = ref(true)
const showAwayTeam = ref(true)

const formations = ['4-3-3', '4-4-2', '3-5-2', '4-2-3-1', '3-4-3', '4-1-4-1', '5-3-2']

const currentTool = ref<string | null>(null)
const selectedColor = ref('#10b981')
const isDrawing = ref(false)
const drawStart = ref<{ x: number; y: number } | null>(null)

// Only 3 colors (no black)
const colors = ['#10b981', '#f97316', '#ef4444']

const drawingTools = [
  { type: 'line', label: 'Line', icon: Minus },
  { type: 'arrow', label: 'Arrow', icon: MoveRight },
  { type: 'rectangle', label: 'Zone', icon: Square },
  { type: 'circle', label: 'Circle', icon: Circle },
]

const permanentAnnotations = ref<any[]>([])
const tempAnnotation = ref<any>(null)

const annotations = computed(() => {
  const result = [...permanentAnnotations.value]
  if (tempAnnotation.value) {
    result.push(tempAnnotation.value)
  }
  return result
})

// Player dragging
const draggingPlayer = ref<any>(null)

// Formation coordinates (SVG coordinates 0-1000, 0-625)
const formationPositions: Record<string, Array<{ x: number; y: number }>> = {
  '4-3-3': [
    { x: 150, y: 312 }, // GK
    { x: 280, y: 150 },
    { x: 280, y: 260 },
    { x: 280, y: 365 },
    { x: 280, y: 475 }, // DEF
    { x: 450, y: 210 },
    { x: 450, y: 312 },
    { x: 450, y: 415 }, // MID
    { x: 620, y: 150 },
    { x: 620, y: 312 },
    { x: 620, y: 475 }, // FWD
  ],
  '4-4-2': [
    { x: 150, y: 312 },
    { x: 280, y: 150 },
    { x: 280, y: 260 },
    { x: 280, y: 365 },
    { x: 280, y: 475 },
    { x: 450, y: 150 },
    { x: 450, y: 260 },
    { x: 450, y: 365 },
    { x: 450, y: 475 },
    { x: 620, y: 240 },
    { x: 620, y: 385 },
  ],
  '3-5-2': [
    { x: 150, y: 312 },
    { x: 280, y: 180 },
    { x: 280, y: 312 },
    { x: 280, y: 445 },
    { x: 420, y: 130 },
    { x: 420, y: 240 },
    { x: 420, y: 312 },
    { x: 420, y: 385 },
    { x: 420, y: 495 },
    { x: 600, y: 245 },
    { x: 600, y: 380 },
  ],
  '4-2-3-1': [
    { x: 150, y: 312 },
    { x: 280, y: 150 },
    { x: 280, y: 260 },
    { x: 280, y: 365 },
    { x: 280, y: 475 },
    { x: 400, y: 230 },
    { x: 400, y: 395 },
    { x: 520, y: 150 },
    { x: 520, y: 312 },
    { x: 520, y: 475 },
    { x: 650, y: 312 },
  ],
  '3-4-3': [
    { x: 150, y: 312 },
    { x: 280, y: 180 },
    { x: 280, y: 312 },
    { x: 280, y: 445 },
    { x: 430, y: 180 },
    { x: 430, y: 270 },
    { x: 430, y: 355 },
    { x: 430, y: 445 },
    { x: 620, y: 150 },
    { x: 620, y: 312 },
    { x: 620, y: 475 },
  ],
  '4-1-4-1': [
    { x: 150, y: 312 },
    { x: 280, y: 150 },
    { x: 280, y: 260 },
    { x: 280, y: 365 },
    { x: 280, y: 475 },
    { x: 400, y: 312 },
    { x: 520, y: 150 },
    { x: 520, y: 260 },
    { x: 520, y: 365 },
    { x: 520, y: 475 },
    { x: 650, y: 312 },
  ],
  '5-3-2': [
    { x: 150, y: 312 },
    { x: 280, y: 110 },
    { x: 280, y: 210 },
    { x: 280, y: 312 },
    { x: 280, y: 415 },
    { x: 280, y: 515 },
    { x: 450, y: 195 },
    { x: 450, y: 312 },
    { x: 450, y: 430 },
    { x: 620, y: 245 },
    { x: 620, y: 380 },
  ],
}

const homeTeamPlayers = ref(
  formationPositions['4-3-3'].map((pos, idx) => ({
    id: `home-${idx}`,
    number: idx + 1,
    name: `Player ${idx + 1}`,
    position: idx === 0 ? 'GK' : idx < 5 ? 'DEF' : idx < 8 ? 'MID' : 'FWD',
    x: pos.x,
    y: pos.y,
    team: 'home',
  }))
)

const awayTeamPlayers = ref(
  formationPositions['4-3-3'].map((pos, idx) => ({
    id: `away-${idx}`,
    number: idx + 1,
    name: `Opponent ${idx + 1}`,
    position: idx === 0 ? 'GK' : idx < 5 ? 'DEF' : idx < 8 ? 'MID' : 'FWD',
    x: 1000 - pos.x,
    y: pos.y,
    team: 'away',
  }))
)

const allPlayers = computed(() => {
  const players: any[] = []
  if (showHomeTeam.value) players.push(...homeTeamPlayers.value)
  if (showAwayTeam.value) players.push(...awayTeamPlayers.value)
  return players
})

const selectFormation = (team: 'home' | 'away', formation: string) => {
  const positions = formationPositions[formation]

  if (team === 'home') {
    selectedHomeFormation.value = formation
    showHomeFormationDropdown.value = false

    homeTeamPlayers.value = positions.map((pos, idx) => ({
      ...homeTeamPlayers.value[idx],
      x: pos.x,
      y: pos.y,
    }))
  } else {
    selectedAwayFormation.value = formation
    showAwayFormationDropdown.value = false

    awayTeamPlayers.value = positions.map((pos, idx) => ({
      ...awayTeamPlayers.value[idx],
      x: 1000 - pos.x,
      y: pos.y,
    }))
  }
}

const selectTool = (tool: string) => {
  currentTool.value = currentTool.value === tool ? null : tool
}

// Convert screen coordinates to SVG coordinates
const screenToSVG = (event: MouseEvent) => {
  if (!pitchContainer.value) return { x: 0, y: 0 }

  const rect = pitchContainer.value.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 1000
  const y = ((event.clientY - rect.top) / rect.height) * 625

  return { x, y }
}

// Player dragging
const startDragging = (player: any, event: MouseEvent) => {
  if (currentTool.value) return

  draggingPlayer.value = player

  const onMove = (e: MouseEvent) => {
    if (!draggingPlayer.value) return

    const pos = screenToSVG(e)

    // Clamp to pitch rectangle (50,50) - (950,575) so they don't leave the field
    draggingPlayer.value.x = Math.max(50, Math.min(950, pos.x))
    draggingPlayer.value.y = Math.max(50, Math.min(575, pos.y))
  }

  const onUp = () => {
    draggingPlayer.value = null
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

// Drawing functions
const startDrawing = (event: MouseEvent) => {
  if (!currentTool.value) return

  const pos = screenToSVG(event)
  drawStart.value = pos
  isDrawing.value = true

  tempAnnotation.value = {
    type: currentTool.value,
    start: pos,
    end: pos,
    color: selectedColor.value,
    width: 4,
    temp: true,
  }
}

const draw = (event: MouseEvent) => {
  if (!isDrawing.value || !drawStart.value || !currentTool.value) return

  const pos = screenToSVG(event)

  if (tempAnnotation.value) {
    tempAnnotation.value.end = pos
  }
}

const stopDrawing = (event: MouseEvent) => {
  if (!isDrawing.value || !drawStart.value || !currentTool.value) return

  const pos = screenToSVG(event)

  // Only save if there's meaningful distance
  const distance = Math.sqrt(
    Math.pow(pos.x - drawStart.value.x, 2) + Math.pow(pos.y - drawStart.value.y, 2)
  )

  if (distance > 10) {
    permanentAnnotations.value.push({
      type: currentTool.value,
      start: drawStart.value,
      end: pos,
      color: selectedColor.value,
      width: 4,
      temp: false,
    })
  }

  tempAnnotation.value = null
  isDrawing.value = false
  drawStart.value = null
  // Keep currentTool active so you can chain drawings
}

const undoAnnotation = () => {
  permanentAnnotations.value.pop()
}

const clearAnnotations = () => {
  permanentAnnotations.value = []
  tempAnnotation.value = null
}

const resetFormation = () => {
  selectFormation('home', selectedHomeFormation.value)
  selectFormation('away', selectedAwayFormation.value)
  clearAnnotations()
}

const saveFormation = () => {
  ;(window as any).$toast?.addToast({
    type: 'success',
    title: 'Formation Saved!',
    message: 'Your tactical setup has been saved',
  })
}

// Close dropdowns when clicking outside
onMounted(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (pitchContainer.value && !pitchContainer.value.contains(e.target as Node)) {
      showHomeFormationDropdown.value = false
      showAwayFormationDropdown.value = false
    }
  }

  document.addEventListener('click', handleClickOutside)

  return () => {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
