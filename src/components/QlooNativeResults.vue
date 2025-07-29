<template>
  <div class="qloo-native-results">
    <!-- Header -->
    <div class="results-header mb-8">
      <h2 class="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
        Your Cultural Discovery
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        Powered by Qloo's cultural intelligence platform
      </p>
    </div>

    <!-- Places Section -->
    <div v-if="recommendations.places && recommendations.places.length > 0" class="category-section mb-12">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h3 class="text-2xl font-semibold text-gray-900 dark:text-white">Places to Visit</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Restaurants, venues, and locations</p>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QlooPlaceCard 
          v-for="place in recommendations.places" 
          :key="place.id" 
          :place="place"
          @save="$emit('save-recommendation', place, 'places')"
        />
      </div>
    </div>

    <!-- Music Section -->
    <div v-if="recommendations.music && recommendations.music.length > 0" class="category-section mb-12">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <div>
          <h3 class="text-2xl font-semibold text-gray-900 dark:text-white">Music Discovery</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Artists, albums, and musical experiences</p>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QlooMusicCard 
          v-for="music in recommendations.music" 
          :key="music.id" 
          :music="music"
          @save="$emit('save-recommendation', music, 'music')"
        />
      </div>
    </div>

    <!-- Entertainment Section -->
    <div v-if="recommendations.entertainment && recommendations.entertainment.length > 0" class="category-section mb-12">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0a2 2 0 00-2 2v14a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2" />
          </svg>
        </div>
        <div>
          <h3 class="text-2xl font-semibold text-gray-900 dark:text-white">Entertainment</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Movies, shows, and media content</p>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QlooEntertainmentCard 
          v-for="item in recommendations.entertainment" 
          :key="item.id" 
          :entertainment="item"
          @save="$emit('save-recommendation', item, 'entertainment')"
        />
      </div>
    </div>

    <!-- Experiences Section -->
    <div v-if="recommendations.experiences && recommendations.experiences.length > 0" class="category-section mb-12">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 class="text-2xl font-semibold text-gray-900 dark:text-white">Experiences</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Activities and cultural experiences</p>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QlooExperienceCard 
          v-for="experience in recommendations.experiences" 
          :key="experience.id" 
          :experience="experience"
          @save="$emit('save-recommendation', experience, 'experiences')"
        />
      </div>
    </div>

    <!-- No Results Message -->
    <div v-if="recommendations.message" class="text-center py-12">
      <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{{ recommendations.message.title }}</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">{{ recommendations.message.description }}</p>
      
      <div class="flex flex-wrap justify-center gap-2">
        <span class="text-sm text-gray-500 dark:text-gray-400">Try:</span>
        <button 
          v-for="suggestion in recommendations.message.suggestions" 
          :key="suggestion"
          @click="$emit('try-suggestion', suggestion)"
          class="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors"
        >
          {{ suggestion }}
        </button>
      </div>
    </div>

    <!-- Metadata -->
    <div v-if="metadata" class="mt-12 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Discovery Insights</h4>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span class="text-gray-500 dark:text-gray-400">Total Results:</span>
          <span class="ml-1 font-medium text-gray-900 dark:text-white">{{ metadata.totalQlooResults || 0 }}</span>
        </div>
        <div>
          <span class="text-gray-500 dark:text-gray-400">Categories:</span>
          <span class="ml-1 font-medium text-gray-900 dark:text-white">{{ metadata.qlooCategories?.length || 0 }}</span>
        </div>
        <div>
          <span class="text-gray-500 dark:text-gray-400">Source:</span>
          <span class="ml-1 font-medium text-primary-600 dark:text-primary-400">Qloo API</span>
        </div>
        <div>
          <span class="text-gray-500 dark:text-gray-400">Updated:</span>
          <span class="ml-1 font-medium text-gray-900 dark:text-white">{{ formatTime(metadata.timestamp) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import QlooPlaceCard from './QlooPlaceCard.vue';
import QlooMusicCard from './QlooMusicCard.vue';
import QlooEntertainmentCard from './QlooEntertainmentCard.vue';
import QlooExperienceCard from './QlooExperienceCard.vue';

const props = defineProps({
  recommendations: {
    type: Object,
    required: true
  },
  metadata: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['save-recommendation', 'try-suggestion']);

function formatTime(timestamp) {
  if (!timestamp) return 'Unknown';
  return new Date(timestamp).toLocaleTimeString();
}
</script>

<style scoped>
.category-section {
  @apply border-b border-gray-200 dark:border-gray-700 pb-8;
}

.category-section:last-child {
  @apply border-b-0 pb-0;
}
</style>