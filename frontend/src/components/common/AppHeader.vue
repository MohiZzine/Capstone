<template>
  <header class="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 flex items-center justify-between flex-shrink-0">
    <div class="flex items-center space-x-4">
      <button
        @click="emit('toggle-sidebar')"
        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <Menu :size="20" />
      </button>

      <div class="relative hidden md:block">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" :size="18" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search matches, players..."
          class="pl-10 pr-4 py-2 w-80 rounded-lg bg-gray-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-gray-900 transition-all"
          @keyup.enter="handleSearch"
        />
      </div>
    </div>

    <div class="flex items-center space-x-3">
      <button 
        @click="$router.push('/matches/upload')"
        class="hidden sm:flex items-center px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:shadow-lg hover:shadow-primary-500/50 transition-all duration-200 font-medium"
      >
        <Upload :size="18" class="mr-2" />
        Upload Match
      </button>

      <div class="relative">
        <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
          <Bell :size="20" />
          <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>
      </div>

      <button
        @click="toggleTheme"
        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <Moon v-if="theme === 'light'" :size="20" />
        <Sun v-else :size="20" />
      </button>

      <div class="flex items-center space-x-3 pl-3 border-l border-gray-200 dark:border-gray-800">
        <div class="text-right hidden lg:block">
          <p class="text-sm font-medium text-gray-900 dark:text-white">Coach Farid</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">Raja Casablanca</p>
        </div>
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold cursor-pointer hover:shadow-lg hover:shadow-primary-500/50 transition-all">
          CF
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Menu, Search, Upload, Bell, Moon, Sun } from 'lucide-vue-next'

const router = useRouter()
const emit = defineEmits<{
  'toggle-sidebar': []
}>()

const searchQuery = ref('')
const theme = ref(localStorage.getItem('theme') || 'light')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`)
  }
}

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', theme.value)
  document.documentElement.classList.toggle('dark', theme.value === 'dark')
}
</script>