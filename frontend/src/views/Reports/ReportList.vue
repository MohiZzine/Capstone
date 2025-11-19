<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
        <p class="mt-1 text-gray-600 dark:text-gray-400">Generate and export match reports</p>
      </div>
      <Button variant="primary">
        <template #icon-left>
          <Plus :size="18" />
        </template>
        Create Report
      </Button>
    </div>

    <EmptyState
      :icon="FileText"
      title="No reports yet"
      description="Create your first report to export match analytics"
      action-label="Create Report"
      :action-icon="Plus"
    />
  </div>
</template>

<script setup lang="ts">
import { FileText, Plus } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import EmptyState from '@/components/common/EmptyState.vue'
</script>