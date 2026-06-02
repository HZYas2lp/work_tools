<template>
  <div
    class="error-message"
    :class="[
      `error-${variant}`,
      { 'error-dismissible': dismissible }
    ]"
  >
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <svg v-if="variant === 'error'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <svg v-else-if="variant === 'warning'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <svg v-else-if="variant === 'success'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
      </div>
      <p class="ml-3 flex-1">{{ message }}</p>
      <button
        v-if="dismissible"
        @click="$emit('dismiss')"
        class="ml-3 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: 'error',
    validator: (value) => ['error', 'warning', 'success', 'info'].includes(value)
  },
  dismissible: {
    type: Boolean,
    default: false
  }
})

defineEmits(['dismiss'])
</script>

<style scoped>
.error-message {
  @apply p-4 rounded-lg border flex items-start;
}

.error-error {
  @apply bg-red-50 border-red-200 text-red-700;
}

.error-warning {
  @apply bg-yellow-50 border-yellow-200 text-yellow-700;
}

.error-success {
  @apply bg-green-50 border-green-200 text-green-700;
}

.error-info {
  @apply bg-blue-50 border-blue-200 text-blue-700;
}
</style>
