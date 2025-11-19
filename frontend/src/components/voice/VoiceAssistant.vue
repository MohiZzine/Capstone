<template>
  <div>
    <!-- Main Assistant Window -->
    <Transition name="scale">
      <div
        v-if="isOpen"
        class="fixed bottom-24 right-6 w-96 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50"
      >
        <!-- Header -->
        <div class="bg-gradient-to-r from-primary-500 to-accent-500 p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2 text-white">
              <div class="relative">
                <Mic :size="20" />
                <span
                  v-if="isListening"
                  class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"
                />
              </div>
              <span class="font-semibold">Voice Assistant</span>
              <span class="text-xs bg-white/20 px-2 py-0.5 rounded-full">Darija</span>
            </div>
            <button
              @click="isOpen = false"
              class="hover:bg-white/20 p-1.5 rounded-lg transition-colors"
            >
              <X :size="18" />
            </button>
          </div>
        </div>

        <!-- Messages -->
        <div class="p-4 max-h-96 overflow-y-auto space-y-3 bg-gray-50 dark:bg-gray-950/50">
          <TransitionGroup name="message">
            <div
              v-for="message in messages"
              :key="message.id"
              :class="[
                'p-3 rounded-xl max-w-[85%] shadow-sm',
                message.type === 'user'
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white ml-auto'
                  : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800',
              ]"
            >
              <p class="text-sm leading-relaxed">{{ message.text }}</p>
              <span class="text-xs opacity-70 mt-1.5 block">{{ message.time }}</span>
            </div>
          </TransitionGroup>

          <!-- Listening Animation -->
          <div v-if="isListening" class="flex items-center justify-center space-x-2 p-6">
            <div
              v-for="i in 5"
              :key="i"
              class="w-1 bg-gradient-to-t from-primary-500 to-accent-500 rounded-full animate-pulse"
              :style="{
                height: `${20 + Math.random() * 40}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.6s',
              }"
            />
          </div>

          <!-- Typing Indicator -->
          <div
            v-if="isTyping"
            class="flex items-center space-x-2 p-3 bg-white dark:bg-gray-900 rounded-xl w-16 border border-gray-200 dark:border-gray-800"
          >
            <div
              v-for="i in 3"
              :key="i"
              class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              :style="{ animationDelay: `${i * 0.15}s` }"
            />
          </div>
        </div>

        <!-- Quick Suggestions -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Quick commands:</p>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="suggestion in suggestions"
              :key="suggestion.ar"
              @click="handleSuggestion(suggestion)"
              class="text-left text-xs p-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700"
            >
              <p class="font-medium">{{ suggestion.ar }}</p>
              <p class="text-gray-500 dark:text-gray-400">{{ suggestion.en }}</p>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Floating Action Button -->
    <button
      @click="toggleVoice"
      :class="[
        'fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 z-50',
        isListening
          ? 'bg-red-500 hover:bg-red-600 scale-110 shadow-red-500/50'
          : 'bg-gradient-to-r from-primary-500 to-accent-500 hover:shadow-primary-500/50 hover:scale-110',
      ]"
    >
      <Mic v-if="!isListening" :size="28" class="text-white" />
      <div v-else class="relative">
        <MicOff :size="28" class="text-white" />
        <span class="absolute -top-2 -right-2 flex h-4 w-4">
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
          ></span>
          <span class="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
        </span>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Mic, MicOff, X } from 'lucide-vue-next'

const isOpen = ref(false)
const isListening = ref(false)
const isTyping = ref(false)

const messages = ref([
  {
    id: '1',
    type: 'assistant',
    text: 'مرحبا! أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟',
    time: '10:30',
  },
])

const suggestions = [
  { ar: 'شوف الهجمات', en: 'Show attacks' },
  { ar: 'وش كان التكتيك؟', en: 'What was the tactic?' },
  { ar: 'اللاعب جرى كم؟', en: 'Player distance' },
  { ar: 'احسن لاعب', en: 'Best player' },
]

const toggleVoice = () => {
  if (!isOpen.value) {
    isOpen.value = true
  } else {
    isListening.value = !isListening.value

    if (isListening.value) {
      // Simulate listening
      setTimeout(() => {
        isListening.value = false
        addMessage('user', 'شوف الهجمات')

        isTyping.value = true
        setTimeout(() => {
          isTyping.value = false
          addMessage(
            'assistant',
            'تمام! جاري تحليل الهجمات من المباراة الأخيرة... وجدت 23 هجمة ناجحة بنسبة نجاح 67%'
          )
        }, 1500)
      }, 3000)
    }
  }
}

const handleSuggestion = (suggestion: any) => {
  addMessage('user', suggestion.ar)

  isTyping.value = true
  setTimeout(() => {
    isTyping.value = false
    addMessage('assistant', 'جاري المعالجة...')
  }, 1000)
}

const addMessage = (type: string, text: string) => {
  messages.value.push({
    id: Date.now().toString(),
    type,
    text,
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  })
}
</script>

<style scoped>
.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
}

.message-enter-active,
.message-leave-active {
  transition: all 0.3s ease;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.message-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
