<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
    <!-- Sidebar -->
    <aside
      :class="[
        'bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out flex-shrink-0',
        isSidebarOpen ? 'w-64' : 'w-20',
      ]"
    >
      <!-- Logo -->
      <div
        class="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-800 px-4"
      >
        <transition name="fade" mode="out-in">
          <div v-if="isSidebarOpen" class="flex items-center space-x-2">
            <div
              class="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center"
            >
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span
              class="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent"
            >
              MouBAI
            </span>
          </div>
          <div
            v-else
            class="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center"
          >
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </transition>
      </div>

      <!-- Navigation -->
      <nav class="p-3 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
        <RouterLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.path"
          v-slot="{ isActive }"
          custom
        >
          <a
            :href="item.path"
            @click.prevent="navigateTo(item.path)"
            :class="[
              'group flex items-center px-3 py-2.5 rounded-lg transition-all duration-200',
              isActive
                ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/50'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
            ]"
            :title="item.name"
          >
            <component
              :is="item.icon"
              :size="20"
              :class="[
                'flex-shrink-0',
                isActive
                  ? 'text-white'
                  : 'text-gray-500 dark:text-gray-400 group-hover:text-primary-600',
              ]"
            />
            <transition name="fade">
              <span v-if="isSidebarOpen" class="ml-3 font-medium">{{ item.name }}</span>
            </transition>
          </a>
        </RouterLink>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header
        class="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 flex items-center justify-between flex-shrink-0"
      >
        <!-- Left Section -->
        <div class="flex items-center space-x-4">
          <button
            @click="isSidebarOpen = !isSidebarOpen"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Menu :size="20" />
          </button>

          <!-- Search -->
          <div class="relative hidden md:block">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" :size="18" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search matches, players..."
              class="pl-10 pr-4 py-2 w-80 rounded-lg bg-gray-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-gray-900 transition-all"
            />
          </div>
        </div>

        <!-- Right Section -->
        <div class="flex items-center space-x-3">
          <!-- Upload Button -->
          <button
            @click="$router.push('/matches/upload')"
            class="hidden sm:flex items-center px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:shadow-lg hover:shadow-primary-500/50 transition-all duration-200 font-medium"
          >
            <Upload :size="18" class="mr-2" />
            Upload Match
          </button>

          <!-- Notifications -->
          <div class="relative">
            <button
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
            >
              <Bell :size="20" />
              <span
                class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"
              ></span>
            </button>
          </div>

          <!-- Theme Toggle -->
          <button
            @click="toggleTheme"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Moon v-if="theme === 'light'" :size="20" />
            <Sun v-else :size="20" />
          </button>

          <!-- User Menu -->
          <div
            class="flex items-center space-x-3 pl-3 border-l border-gray-200 dark:border-gray-800"
          >
            <div class="text-right hidden lg:block">
              <p class="text-sm font-medium text-gray-900 dark:text-white">Coach Farid</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Raja Casablanca</p>
            </div>
            <div
              class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold cursor-pointer hover:shadow-lg hover:shadow-primary-500/50 transition-all"
            >
              CF
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-6">
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>

    <!-- Voice Assistant -->
    <VoiceAssistant />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Menu,
  Search,
  Upload,
  Bell,
  Moon,
  Sun,
  LayoutDashboard,
  Video,
  Users,
  Target,
  FileText,
  Settings,
} from 'lucide-vue-next'
import VoiceAssistant from '@/components/voice/VoiceAssistant.vue'

const router = useRouter()
const isSidebarOpen = ref(true)
const searchQuery = ref('')
const theme = ref(localStorage.getItem('theme') || 'light')

const navigation = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Matches', path: '/matches', icon: Video },
  { name: 'Players', path: '/players', icon: Users },
  { name: 'Tactical Lab', path: '/tactical', icon: Target },
  { name: 'Reports', path: '/reports', icon: FileText },
  { name: 'Settings', path: '/settings', icon: Settings },
]

const navigateTo = (path: string) => {
  router.push(path)
}

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', theme.value)
  document.documentElement.classList.toggle('dark', theme.value === 'dark')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
