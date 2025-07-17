<template>
  <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center max-w-xl mx-auto animate-scale-in">
    <div class="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h2 class="text-2xl font-display font-semibold text-red-700 dark:text-red-400 mb-2">{{ title || 'Something went wrong' }}</h2>
    <p class="text-red-600 dark:text-red-300 mb-6">{{ message || 'An error occurred while processing your request. Please try again.' }}</p>
    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <BaseButton 
        @click="$emit('retry')" 
        variant="danger"
      >
        <template #icon-left>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </template>
        {{ retryText || 'Try Again' }}
      </BaseButton>
      
      <BaseButton 
        v-if="showBackButton"
        @click="$emit('back')" 
        variant="outline"
      >
        <template #icon-left>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </template>
        {{ backText || 'Go Back' }}
      </BaseButton>
    </div>
    
    <!-- Additional details for debugging (only shown in development) -->
    <div v-if="details && isDevelopment" class="mt-6 p-4 bg-red-100 dark:bg-red-900/40 rounded-lg text-left overflow-auto max-h-40">
      <p class="text-xs font-mono text-red-800 dark:text-red-200">{{ details }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import BaseButton from './BaseButton.vue';
import { DEBUG } from '../config/env';

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  details: {
    type: String,
    default: ''
  },
  retryText: {
    type: String,
    default: ''
  },
  backText: {
    type: String,
    default: ''
  },
  showBackButton: {
    type: Boolean,
    default: true
  }
});

defineEmits(['retry', 'back']);

// Check if we're in development mode
const isDevelopment = computed(() => DEBUG);
</script>