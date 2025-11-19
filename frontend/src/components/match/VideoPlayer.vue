<template>
  <div class="relative bg-black rounded-xl overflow-hidden shadow-2xl" ref="playerContainer">
    <!-- Video Element -->
    <video
      ref="videoElement"
      class="w-full aspect-video"
      @loadedmetadata="onLoadedMetadata"
      @timeupdate="onTimeUpdate"
      @play="isPlaying = true"
      @pause="isPlaying = false"
    >
      <source :src="src" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    <!-- Tactical Overlay -->
    <TacticalOverlay
      v-if="showOverlay"
      :video-time="currentTime"
      :match-id="matchId"
    />

    <!-- Custom Controls -->
    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
      <!-- Progress Bar -->
      <div class="mb-4">
        <div
          class="relative h-1.5 bg-white/20 rounded-full cursor-pointer group"
          @click="seek"
          ref="progressBar"
        >
          <div
            class="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
            :style="{ width: `${progress}%` }"
          />
          <div
            class="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            :style="{ left: `calc(${progress}% - 8px)` }"
          />
        </div>
        
        <!-- Time Display -->
        <div class="flex items-center justify-between mt-2 text-xs text-white/80">
          <span>{{ formatTime(currentTime) }}</span>
          <span>{{ formatTime(duration) }}</span>
        </div>
      </div>

      <!-- Control Buttons -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <!-- Play/Pause -->
          <button
            @click="togglePlay"
            class="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <Play v-if="!isPlaying" :size="20" class="text-white ml-0.5" />
            <Pause v-else :size="20" class="text-white" />
          </button>

          <!-- Skip Backward -->
          <button
            @click="skip(-10)"
            class="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <SkipBack :size="18" class="text-white" />
          </button>

          <!-- Skip Forward -->
          <button
            @click="skip(10)"
            class="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <SkipForward :size="18" class="text-white" />
          </button>

          <!-- Volume -->
          <div class="flex items-center gap-2">
            <button
              @click="toggleMute"
              class="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Volume2 v-if="!isMuted && volume > 0.5" :size="18" class="text-white" />
              <Volume1 v-else-if="!isMuted && volume > 0" :size="18" class="text-white" />
              <VolumeX v-else :size="18" class="text-white" />
            </button>
            <input
              v-model.number="volume"
              type="range"
              min="0"
              max="1"
              step="0.1"
              class="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              @input="updateVolume"
            />
          </div>

          <!-- Speed -->
          <Dropdown align="left" width="auto">
            <template #trigger>
              <button class="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white text-sm font-medium">
                {{ playbackRate }}x
              </button>
            </template>
            <button
              v-for="rate in [0.5, 0.75, 1, 1.25, 1.5, 2]"
              :key="rate"
              @click="setPlaybackRate(rate)"
              class="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              :class="rate === playbackRate ? 'text-primary-600 dark:text-primary-400 font-semibold' : 'text-gray-700 dark:text-gray-300'"
            >
              {{ rate }}x
            </button>
          </Dropdown>
        </div>

        <div class="flex items-center gap-2">
          <!-- Tactical Overlay Toggle -->
          <button
            @click="showOverlay = !showOverlay"
            :class="[
              'px-3 py-1.5 rounded-lg transition-colors text-xs font-medium',
              showOverlay 
                ? 'bg-primary-500 text-white' 
                : 'bg-white/10 hover:bg-white/20 text-white'
            ]"
          >
            Tactical View
          </button>

          <!-- Fullscreen -->
          <button
            @click="toggleFullscreen"
            class="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <Maximize v-if="!isFullscreen" :size="18" class="text-white" />
            <Minimize v-else :size="18" class="text-white" />
          </button>
        </div>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-black/50">
      <div class="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Volume1,
  VolumeX,
  Maximize,
  Minimize
} from 'lucide-vue-next'
import Dropdown from '@/components/ui/Dropdown.vue'
import TacticalOverlay from './TacticalOverlay.vue'

interface Props {
  src: string
  matchId: string
  autoplay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: false
})

const videoElement = ref<HTMLVideoElement | null>(null)
const playerContainer = ref<HTMLDivElement | null>(null)
const progressBar = ref<HTMLDivElement | null>(null)

const isPlaying = ref(false)
const isLoading = ref(true)
const isMuted = ref(false)
const isFullscreen = ref(false)
const showOverlay = ref(true)

const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const playbackRate = ref(1)

const progress = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const togglePlay = () => {
  if (!videoElement.value) return
  
  if (isPlaying.value) {
    videoElement.value.pause()
  } else {
    videoElement.value.play()
  }
}

const skip = (seconds: number) => {
  if (!videoElement.value) return
  videoElement.value.currentTime += seconds
}

const seek = (event: MouseEvent) => {
  if (!progressBar.value || !videoElement.value) return
  
  const rect = progressBar.value.getBoundingClientRect()
  const pos = (event.clientX - rect.left) / rect.width
  videoElement.value.currentTime = pos * duration.value
}

const toggleMute = () => {
  if (!videoElement.value) return
  videoElement.value.muted = !videoElement.value.muted
  isMuted.value = videoElement.value.muted
}

const updateVolume = () => {
  if (!videoElement.value) return
  videoElement.value.volume = volume.value
  isMuted.value = volume.value === 0
}

const setPlaybackRate = (rate: number) => {
  if (!videoElement.value) return
  videoElement.value.playbackRate = rate
  playbackRate.value = rate
}

const toggleFullscreen = () => {
  if (!playerContainer.value) return
  
  if (!isFullscreen.value) {
    if (playerContainer.value.requestFullscreen) {
      playerContainer.value.requestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }
}

const onLoadedMetadata = () => {
  if (!videoElement.value) return
  duration.value = videoElement.value.duration
  isLoading.value = false
}

const onTimeUpdate = () => {
  if (!videoElement.value) return
  currentTime.value = videoElement.value.currentTime
}

const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

// Keyboard shortcuts
const handleKeyboard = (event: KeyboardEvent) => {
  if (!videoElement.value) return
  
  switch (event.key) {
    case ' ':
      event.preventDefault()
      togglePlay()
      break
    case 'ArrowLeft':
      event.preventDefault()
      skip(-5)
      break
    case 'ArrowRight':
      event.preventDefault()
      skip(5)
      break
    case 'f':
      event.preventDefault()
      toggleFullscreen()
      break
    case 'm':
      event.preventDefault()
      toggleMute()
      break
  }
}

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('keydown', handleKeyboard)
  
  if (props.autoplay && videoElement.value) {
    videoElement.value.play()
  }
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('keydown', handleKeyboard)
})

watch(volume, updateVolume)
</script>