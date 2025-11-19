<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-accent-600 p-4">
    <Card class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">MouBAI Formula</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Sign in to your account</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <Input
          v-model="credentials.email"
          label="Email"
          type="email"
          placeholder="coach@rajaclub.ma"
          required
        />
        <Input
          v-model="credentials.password"
          label="Password"
          type="password"
          placeholder="••••••••"
          required
        />

        <Button type="submit" variant="primary" full-width :loading="isLoading">
          Sign In
        </Button>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Card from '@/components/ui/Card.vue'

const router = useRouter()
const isLoading = ref(false)

const credentials = ref({
  email: '',
  password: ''
})

const handleLogin = async () => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    router.push('/')
  }, 1000)
}
</script>