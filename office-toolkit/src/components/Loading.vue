<template>
  <div class="loading-container" :class="{ 'loading-fullscreen': fullscreen }">
    <div class="flex flex-col items-center justify-center">
      <div class="loading-spinner" :class="sizeClasses"></div>
      <p v-if="text" class="mt-4 text-gray-600">{{ text }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: '加载中...'
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  fullscreen: {
    type: Boolean,
    default: false
  }
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  }
  return sizes[props.size] || sizes.md
})
</script>

<style scoped>
.loading-container {
  @apply py-8;
}

.loading-fullscreen {
  @apply fixed inset-0 bg-white/80 z-50 flex items-center justify-center;
}
</style>
