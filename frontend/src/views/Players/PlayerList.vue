<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Players</h1>
        <p class="mt-1 text-gray-600 dark:text-gray-400">Manage and track your team players</p>
      </div>
      <Button @click="$router.push('/players/enroll')" variant="primary">
        <template #icon-left>
          <UserPlus :size="18" />
        </template>
        Enroll Player
      </Button>
    </div>

    <EmptyState
      :icon="Users"
      title="No players enrolled"
      description="Start by enrolling players to track their performance"
      action-label="Enroll Player"
      :action-icon="UserPlus"
      @action="$router.push('/players/enroll')"
    />
  </div>
</template>

<script setup lang="ts">
import { Users, UserPlus } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import EmptyState from '@/components/common/EmptyState.vue'
</script>