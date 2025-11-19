<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Enroll Player</h1>
      <p class="mt-1 text-gray-600 dark:text-gray-400">Add a new player to the tracking system</p>
    </div>

    <Card>
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            v-model="playerData.name"
            label="Player Name"
            placeholder="Mohammed Amine"
            required
          />
          <Input
            v-model="playerData.number"
            label="Jersey Number"
            placeholder="10"
            type="number"
            required
          />
          <Input
            v-model="playerData.position"
            label="Position"
            placeholder="CAM"
            required
          />
          <Select
            v-model="playerData.team"
            label="Team"
            :options="teamOptions"
            required
          />
        </div>

        <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
          <Button @click="$router.back()" variant="ghost">
            Cancel
          </Button>
          <Button variant="primary">
            Enroll Player
          </Button>
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

const playerData = ref({
  name: '',
  number: '',
  position: '',
  team: ''
})

const teamOptions = [
  { value: 'raja', label: 'Raja Casablanca' },
  { value: 'wydad', label: 'Wydad AC' },
]
</script>