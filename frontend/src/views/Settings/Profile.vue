<template>
  <div class="max-w-4xl space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
      <p class="mt-1 text-gray-600 dark:text-gray-400">Manage your account and preferences</p>
    </div>

    <Card title="Profile Information">
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input v-model="profile.name" label="Full Name" placeholder="Coach Farid" />
          <Input
            v-model="profile.email"
            label="Email"
            type="email"
            placeholder="coach@rajaclub.ma"
          />
          <Input v-model="profile.team" label="Team" placeholder="Raja Casablanca" />
          <Select v-model="profile.role" label="Role" :options="roleOptions" />
        </div>

        <div class="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-800">
          <Button variant="primary">Save Changes</Button>
        </div>
      </div>
    </Card>

    <Card title="Preferences">
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium text-gray-900 dark:text-white">Email Notifications</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Receive updates about match analysis
            </p>
          </div>
          <input type="checkbox" class="toggle" checked />
        </div>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium text-gray-900 dark:text-white">Dark Mode</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Use dark theme</p>
          </div>
          <input type="checkbox" class="toggle" />
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import Card from '@/components/ui/Card.vue'

const profile = ref({
  name: 'Coach Farid',
  email: 'coach@rajaclub.ma',
  team: 'Raja Casablanca',
  role: 'coach',
})

const roleOptions = [
  { value: 'coach', label: 'Coach' },
  { value: 'analyst', label: 'Analyst' },
  { value: 'admin', label: 'Admin' },
]
</script>
