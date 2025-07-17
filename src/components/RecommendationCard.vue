<template>
  <div 
    class="bg-white dark:bg-dark-card rounded-xl overflow-hidden shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border hover:shadow-taste transition-all duration-300"
  >
    <div class="h-48 bg-gray-200 dark:bg-gray-700 relative">
      <img 
        :src="recommendation.image || `https://source.unsplash.com/random/400x300?${category},${recommendation.name}`" 
        :alt="recommendation.name"
        class="w-full h-full object-cover"
        @error="handleImageError"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div class="absolute bottom-0 left-0 p-4">
        <span 
          class="px-2 py-1 text-xs font-medium rounded-full"
          :class="`bg-taste-${category}/90 text-white`"
        >
          {{ recommendation.match }}% Match
        </span>
      </div>
    </div>
    
    <div class="p-4">
      <h3 class="font-semibold text-lg text-gray-900 dark:text-white">{{ recommendation.name }}</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ recommendation.description }}</p>
      
      <div class="mt-4 flex justify-between items-center">
        <span class="text-xs text-gray-500 dark:text-gray-400">{{ recommendation.category }}</span>
        <div class="flex space-x-2">
          <button 
            @click="$emit('save', recommendation)"
            class="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium"
          >
            Save
          </button>
          <button 
            @click="$emit('share', recommendation)"
            class="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  recommendation: {
    type: Object,
    required: true
  },
  category: {
    type: String,
    required: true
  }
});

defineEmits(['save', 'share']);

// Handle image loading errors
function handleImageError(e) {
  // Set a fallback image
  e.target.src = `https://source.unsplash.com/random/400x300?${props.category}`;
}
</script>