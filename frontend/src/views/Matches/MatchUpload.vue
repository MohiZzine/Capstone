<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Upload Match</h1>
      <p class="mt-1 text-gray-600 dark:text-gray-400">Upload your match video for AI-powered analysis</p>
    </div>

    <Card>
      <div class="space-y-6">
        <!-- File Upload -->
        <div
          @dragover.prevent
          @drop.prevent="handleDrop"
          :class="[
            'relative border-2 border-dashed rounded-xl p-12 text-center transition-colors',
            isDragging ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 dark:border-gray-700'
          ]"
          @dragenter="isDragging = true"
          @dragleave="isDragging = false"
        >
          <input
            ref="fileInput"
            type="file"
            accept="video/*"
            class="hidden"
            @change="handleFileSelect"
          />

          <div v-if="!selectedFile">
            <Upload :size="48" class="mx-auto text-gray-400 mb-4" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Drop your video here or click to browse
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Supports MP4, MOV, AVI up to 4GB
            </p>
            <Button @click="fileInput?.click()" variant="primary">
              Select File
            </Button>
          </div>

          <div v-else class="space-y-4">
            <div class="flex items-center justify-center gap-3">
              <Video :size="32" class="text-primary-500" />
              <div class="text-left">
                <p class="font-semibold text-gray-900 dark:text-white">{{ selectedFile.name }}</p>
                <p class="text-sm text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
              </div>
            </div>
            <Button @click="clearFile" variant="outline" size="sm">
              Change File
            </Button>
          </div>
        </div>

        <!-- Match Details Form -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            v-model="matchData.homeTeam"
            label="Home Team"
            placeholder="Raja Casablanca"
            required
          />
          <Input
            v-model="matchData.awayTeam"
            label="Away Team"
            placeholder="Wydad AC"
            required
          />
          <Input
            v-model="matchData.date"
            label="Match Date"
            type="date"
            required
          />
          <Input
            v-model="matchData.competition"
            label="Competition"
            placeholder="Botola Pro"
            required
          />
        </div>

        <!-- Upload Button -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
          <Button @click="$router.back()" variant="ghost">
            Cancel
          </Button>
          <Button
            @click="uploadMatch"
            variant="primary"
            :disabled="!canUpload"
            :loading="isUploading"
          >
            <template #icon-left>
              <Upload :size="18} />
            </template>
            Upload & Analyze
          </Button>
        </div>
      </div>
    </Card>

    <!-- Upload Progress -->
    <Card v-if="isUploading">
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold text-gray-900 dark:text-white">Uploading...</h3>
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ uploadProgress }}%</span>
        </div>
        <Progress :model-value="uploadProgress" variant="primary" animated />
        <p class="text-sm text-gray-500 dark:text-gray-400">
          This may take a few minutes depending on file size
        </p>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Upload, Video } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Card from '@/components/ui/Card.vue'
import Progress from '@/components/ui/Progress.vue'

const router = useRouter()
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const isDragging = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)

const matchData = ref({
  homeTeam: '',
  awayTeam: '',
  date: '',
  competition: ''
})

const canUpload = computed(() => {
  return selectedFile.value &&
    matchData.value.homeTeam &&
    matchData.value.awayTeam &&
    matchData.value.date &&
    matchData.value.competition
})

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    selectedFile.value = event.dataTransfer.files[0]
  }
}

const clearFile = () => {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const uploadMatch = async () => {
  if (!canUpload.value) return

  isUploading.value = true
  
  // Simulate upload progress
  const interval = setInterval(() => {
    uploadProgress.value += 10
    if (uploadProgress.value >= 100) {
      clearInterval(interval)
      setTimeout(() => {
        router.push('/matches')
        window.$toast?.addToast({
          type: 'success',
          title: 'Upload Complete!',
          message: 'Match analysis has started'
        })
      }, 500)
    }
  }, 300)
}
</script>