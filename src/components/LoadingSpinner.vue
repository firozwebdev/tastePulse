<template>
  <div class="flex flex-col items-center justify-center">
    <!-- Spinner -->
    <div 
      :class="[
        'animate-spin rounded-full border-solid border-t-transparent',
        sizeClasses,
        colorClasses
      ]"
    ></div>
    
    <!-- Text -->
    <div v-if="text" class="mt-4 text-center">
      <p :class="textSizeClasses" class="font-medium text-gray-900 dark:text-white">
        {{ text }}
      </p>
      <p v-if="subtext" class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        {{ subtext }}
      </p>
    </div>
    
    <!-- Progress Bar (optional) -->
    <div v-if="showProgress && progress !== null" class="mt-4 w-full max-w-xs">
      <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
        <span>Progress</span>
        <span>{{ Math.round(progress) }}%</span>
      </div>
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          class="bg-primary-600 h-2 rounded-full transition-all duration-300 ease-out"
          :style="{ width: `${Math.min(100, Math.max(0, progress))}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'white', 'gray'].includes(value)
  },
  text: {
    type: String,
    default: ''
  },
  subtext: {
    type: String,
    default: ''
  },
  showProgress: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: null,
    validator: (value) => value === null || (value >= 0 && value <= 100)
  }
});

const sizeClasses = computed(() => {
  const sizes = {
    xs: 'w-4 h-4 border-2',
    sm: 'w-6 h-6 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4'
  };
  return sizes[props.size];
});

const colorClasses = computed(() => {
  const colors = {
    primary: 'border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400',
    secondary: 'border-gray-200 dark:border-gray-700 border-t-gray-600 dark:border-t-gray-400',
    white: 'border-white/30 border-t-white',
    gray: 'border-gray-300 dark:border-gray-600 border-t-gray-700 dark:border-t-gray-300'
  };
  return colors[props.color];
});

const textSizeClasses = computed(() => {
  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };
  return textSizes[props.size];
});
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Custom border width classes */
.border-3 {
  border-width: 3px;
}
</style>