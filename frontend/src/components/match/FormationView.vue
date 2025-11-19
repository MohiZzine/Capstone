<template>
  <div class="relative bg-gradient-to-br from-primary-900 to-accent-900 rounded-xl overflow-hidden shadow-2xl p-6">
    <div class="relative aspect-[16/10]">
      <!-- Pitch SVG -->
      <svg
        viewBox="0 0 1000 625"
        class="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <!-- Grass Pattern -->
        <defs>
          <pattern id="grass" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="50" fill="rgba(16, 185, 129, 0.1)" />
            <rect y="50" width="100" height="50" fill="rgba(16, 185, 129, 0.15)" />
          </pattern>
        </defs>
        <rect width="1000" height="625" fill="url(#grass)" />

        <!-- Pitch Lines -->
        <g stroke="rgba(255, 255, 255, 0.3)" fill="none" stroke-width="2">
          <!-- Outer lines -->
          <rect x="50" y="50" width="900" height="525" />
          <!-- Center line -->
          <line x1="500" y1="50" x2="500" y2="575" />
          <!-- Center circle -->
          <circle cx="500" cy="312.5" r="91.5" />
          <!-- Center spot -->
          <circle cx="500" cy="312.5" r="3" fill="white" />
          
          <!-- Penalty boxes -->
          <rect x="50" y="175" width="165" height="275" />
          <rect x="785" y="175" width="165" height="275" />
          
          <!-- Goal boxes -->
          <rect x="50" y="244" width="55" height="137" />
          <rect x="895" y="244" width="55" height="137" />
          
          <!-- Penalty arcs -->
          <path d="M 176,175 A 91.5,91.5 0 0,1 176,450" />
          <path d="M 824,175 A 91.5,91.5 0 0,0 824,450" />
          
          <!-- Penalty spots -->
          <circle cx="176" cy="312.5" r="3" fill="white" />
          <circle cx="824" cy="312.5" r="3" fill="white" />
          
          <!-- Corner arcs -->
          <path d="M 50,65 A 15,15 0 0,0 65,50" />
          <path d="M 935,50 A 15,15 0 0,0 950,65" />
          <path d="M 950,560 A 15,15 0 0,0 935,575" />
          <path d="M 65,575 A 15,15 0 0,0 50,560" />
        </g>

        <!-- Player Positions -->
        <g v-for="player in formationPlayers" :key="player.id">
          <!-- Player Circle -->
          <circle
            :cx="player.x"
            :cy="player.y"
            r="28"
            :fill="player.team === 'home' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(59, 130, 246, 0.9)'"
            stroke="white"
            stroke-width="3"
            class="cursor-pointer hover:r-32 transition-all"
            @click="selectPlayer(player)"
          />
          
          <!-- Jersey Number -->
          <text
            :x="player.x"
            :y="player.y + 8"
            text-anchor="middle"
            class="text-2xl font-bold fill-white pointer-events-none select-none"
          >
            {{ player.number }}
          </text>
          
          <!-- Player Name (on hover) -->
          <g v-if="selectedPlayer?.id === player.id">
            <rect
              :x="player.x - 60"
              :y="player.y - 60"
              width="120"
              height="30"
              rx="15"
              fill="rgba(0, 0, 0, 0.8)"
            />
            <text
              :x="player.x"
              :y="player.y - 37"
              text-anchor="middle"
              class="text-xs font-semibold fill-white"
            >
              {{ player.name }}
            </text>
          </g>
        </g>

        <!-- Formation Lines -->
        <g v-if="showFormationLines">
          <path
            v-for="(line, index) in formationLines"
            :key="`line-${index}`"
            :d="line"
            stroke="rgba(255, 255, 255, 0.3)"
            stroke-width="1"
            stroke-dasharray="5,5"
            fill="none"
          />
        </g>
      </svg>

      <!-- Formation Selector -->
      <div class="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-3">
        <div class="flex items-center gap-2 mb-2">
          <Users :size="16" class="text-white" />
          <span class="text-sm font-medium text-white">Formation</span>
        </div>
        <select
          v-model="selectedFormation"
          class="bg-white/10 text-white text-sm rounded px-3 py-1.5 border border-white/20 focus:border-white/40 focus:outline-none"
        >
          <option value="4-3-3">4-3-3</option>
          <option value="4-4-2">4-4-2</option>
          <option value="3-5-2">3-5-2</option>
          <option value="4-2-3-1">4-2-3-1</option>
          <option value="3-4-3">3-4-3</option>
        </select>
      </div>

      <!-- Legend -->
      <div class="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3">
        <div class="flex items-center gap-4 text-xs text-white">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded-full bg-primary-500" />
            <span>Home</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded-full bg-blue-500" />
            <span>Away</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Player Info Panel -->
    <Transition name="slide">
      <div
        v-if="selectedPlayer"
        class="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
              <span class="text-white font-bold text-lg">{{ selectedPlayer.number }}</span>
            </div>
            <div>
              <p class="font-semibold text-white">{{ selectedPlayer.name }}</p>
              <p class="text-xs text-white/70">{{ selectedPlayer.position }}</p>
            </div>
          </div>
          <button @click="selectedPlayer = null" class="text-white/70 hover:text-white">
            <X :size="20" />
          </button>
        </div>
        
        <div class="grid grid-cols-3 gap-3">
          <div class="text-center">
            <p class="text-xs text-white/60">Rating</p>
            <p class="text-lg font-bold text-white">{{ selectedPlayer.rating }}</p>
          </div>
          <div class="text-center">
            <p class="text-xs text-white/60">Touches</p>
            <p class="text-lg font-bold text-white">{{ selectedPlayer.touches }}</p>
          </div>
          <div class="text-center">
            <p class="text-xs text-white/60">Passes</p>
            <p class="text-lg font-bold text-white">{{ selectedPlayer.passes }}</p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Users, X } from 'lucide-vue-next'

interface Props {
  matchId: string
  team?: 'home' | 'away' | 'both'
}

const props = withDefaults(defineProps<Props>(), {
  team: 'home'
})

const selectedFormation = ref('4-3-3')
const showFormationLines = ref(true)
const selectedPlayer = ref<any>(null)

// Formation coordinates for 4-3-3 (home team)
const formations: Record<string, Array<{ x: number; y: number }>> = {
  '4-3-3': [
    // GK
    { x: 120, y: 312 },
    // Defense
    { x: 250, y: 150 }, { x: 250, y: 260 }, { x: 250, y: 365 }, { x: 250, y: 475 },
    // Midfield
    { x: 420, y: 210 }, { x: 420, y: 312 }, { x: 420, y: 415 },
    // Attack
    { x: 590, y: 150 }, { x: 590, y: 312 }, { x: 590, y: 475 }
  ],
  '4-4-2': [
    { x: 120, y: 312 },
    { x: 250, y: 150 }, { x: 250, y: 260 }, { x: 250, y: 365 }, { x: 250, y: 475 },
    { x: 420, y: 150 }, { x: 420, y: 260 }, { x: 420, y: 365 }, { x: 420, y: 475 },
    { x: 590, y: 240 }, { x: 590, y: 385 }
  ]
}

const formationPlayers = computed(() => {
  const positions = formations[selectedFormation.value] || formations['4-3-3']
  
  return positions.map((pos, index) => ({
    id: `p${index + 1}`,
    number: index + 1,
    name: `Player ${index + 1}`,
    position: index === 0 ? 'GK' : index < 5 ? 'DEF' : index < 8 ? 'MID' : 'FWD',
    x: pos.x,
    y: pos.y,
    team: 'home',
    rating: (Math.random() * 2 + 7).toFixed(1),
    touches: Math.floor(Math.random() * 50 + 30),
    passes: Math.floor(Math.random() * 40 + 20)
  }))
})

const formationLines = computed(() => {
  const positions = formations[selectedFormation.value] || formations['4-3-3']
  const lines: string[] = []
  
  // Defense line
  const defLine = positions.slice(1, 5)
  if (defLine.length > 0) {
    lines.push(`M ${defLine[0].x},${defLine[0].y} ${defLine.map(p => `L ${p.x},${p.y}`).join(' ')}`)
  }
  
  // Midfield line
  const midLine = positions.slice(5, 8)
  if (midLine.length > 0) {
    lines.push(`M ${midLine[0].x},${midLine[0].y} ${midLine.map(p => `L ${p.x},${p.y}`).join(' ')}`)
  }
  
  return lines
})

const selectPlayer = (player: any) => {
  selectedPlayer.value = player
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>