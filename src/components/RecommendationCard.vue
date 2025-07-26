<template>
  <div 
    class="bg-white dark:bg-dark-card rounded-xl overflow-hidden shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border hover:shadow-taste transition-all duration-300 transform hover:-translate-y-1 group"
  >
    <!-- Enhanced Image Section -->
    <div class="h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
      <img 
        :src="recommendation.image || `https://source.unsplash.com/random/400x300?${category},${recommendation.name}`" 
        :alt="recommendation.name"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
        @error="handleImageError"
      />
      
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
      
      <!-- Quick Actions Overlay -->
      <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div class="flex gap-2">
          <button
            @click="quickView"
            class="bg-white/90 dark:bg-dark-card/90 text-gray-900 dark:text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform backdrop-blur-sm"
            title="Quick View"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            @click="toggleSaved"
            class="bg-white/90 dark:bg-dark-card/90 p-2 rounded-full shadow-lg hover:scale-110 transition-transform backdrop-blur-sm"
            :class="isSaved ? 'text-red-500' : 'text-gray-900 dark:text-white'"
            :title="isSaved ? 'Remove from saved' : 'Save recommendation'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :fill="isSaved ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Match Score Badge -->
      <div class="absolute top-3 right-3 bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
        <div class="flex items-center gap-1">
          <div 
            class="w-2 h-2 rounded-full animate-pulse"
            :class="getMatchColor(recommendation.match)"
          ></div>
          <span class="text-sm font-bold text-gray-900 dark:text-white">{{ recommendation.match }}%</span>
        </div>
      </div>
      
      <!-- Category Badge -->
      <div class="absolute bottom-3 left-3">
        <span 
          class="px-3 py-1 text-xs font-medium rounded-full backdrop-blur-sm"
          :class="`bg-taste-${category}/90 text-white shadow-lg`"
        >
          {{ recommendation.category }}
        </span>
      </div>

      <!-- Trending Badge -->
      <div v-if="recommendation.trending" class="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        Trending
      </div>
    </div>
    
    <!-- Enhanced Content Section -->
    <div class="p-5">
      <!-- Title and Rating -->
      <div class="flex justify-between items-start mb-3">
        <h3 class="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2 flex-1 pr-2">
          {{ recommendation.name }}
        </h3>
        <div class="flex items-center gap-1 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ rating }}</span>
        </div>
      </div>
      
      <!-- Description -->
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
        {{ recommendation.description }}
      </p>

      <!-- Enhanced Info Row -->
      <div class="flex items-center justify-between text-sm mb-4">
        <!-- Price/Location -->
        <div class="flex items-center gap-3">
          <div v-if="recommendation.price" class="flex items-center gap-1 text-green-600 dark:text-green-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <span class="font-medium">{{ recommendation.price }}</span>
          </div>
          <div v-if="recommendation.location" class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="truncate max-w-24">{{ recommendation.location }}</span>
          </div>
        </div>
        
        <!-- Availability Status -->
        <div v-if="recommendation.availability" class="flex items-center gap-1">
          <div 
            class="w-2 h-2 rounded-full"
            :class="recommendation.availability === 'Available' ? 'bg-green-500' : 'bg-orange-500'"
          ></div>
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ recommendation.availability }}</span>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex justify-between items-center">
        <div class="flex gap-2">
          <button 
            @click="$emit('save', recommendation)"
            class="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium flex items-center gap-1 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Save
          </button>
          <button 
            @click="$emit('share', recommendation)"
            class="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium flex items-center gap-1 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
        </div>
        
        <!-- More Actions -->
        <button 
          @click="$emit('view-details', recommendation)"
          class="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Details
        </button>
      </div>

      <!-- Tags (shown on hover) -->
      <div v-if="recommendation.tags && recommendation.tags.length" class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div class="flex flex-wrap gap-1">
          <span 
            v-for="tag in recommendation.tags.slice(0, 4)" 
            :key="tag"
            class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-md hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors cursor-pointer"
            @click="$emit('search-tag', tag)"
          >
            {{ tag }}
          </span>
          <span v-if="recommendation.tags.length > 4" class="px-2 py-1 text-gray-400 dark:text-gray-500 text-xs">
            +{{ recommendation.tags.length - 4 }}
          </span>
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