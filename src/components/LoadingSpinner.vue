<template>
  <div class="flex flex-col items-center justify-center" :class="containerClass">
    <div class="relative">
      <!-- Main spinner -->
      <div 
        class="animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"
        :class="spinnerSize"
      ></div>
      
      <!-- Inner pulse -->
      <div 
        class="absolute inset-0 flex items-center justify-center"
      >
        <div 
          class="bg-white dark:bg-dark-bg rounded-full animate-pulse"
          :class="innerSize"
        ></div>
      </div>
    </div>
    
    <!-- Loading text -->
    <div v-if="text" class="mt-4 text-center">
      <p class="text-lg font-medium text-gray-700 dark:text-gray-300">{{ text }}</p>
      <p v-if="subtext" class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ subtext }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  text: {
    type: String,
    default: ''
  },
  subtext: {
    type: String,
    default: ''
  },
  fullScreen: {
    type: Boolean,
    default: false
  }
});

const spinnerSize = computed(() => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };
  return sizes[props.size];
});

const innerSize = computed(() => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };
  return sizes[props.size];
});

const containerClass = computed(() => {
  return props.fullScreen ? 'min-h-screen py-20' : 'py-8';
});
</script>