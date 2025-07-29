<template>
  <div class="qloo-entertainment-card bg-white dark:bg-dark-card rounded-xl shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
    <!-- Image -->
    <div class="relative h-48 overflow-hidden">
      <img 
        :src="entertainment.image" 
        :alt="entertainment.name"
        class="w-full h-full object-cover"
        @error="handleImageError"
      />
      <div class="absolute top-3 right-3">
        <div class="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold text-gray-900 dark:text-white">
          {{ entertainment.match }}% match
        </div>
      </div>
      
      <!-- Content rating -->
      <div v-if="contentRating" class="absolute bottom-3 left-3">
        <div class="bg-blue-600/80 text-white rounded-lg px-2 py-1 text-xs">
          {{ contentRating }}
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
            {{ entertainment.name }}
          </h3>
          <p class="text-sm text-blue-600 dark:text-blue-400 font-medium">
            {{ entertainment.category }}
          </p>
        </div>
        
        <!-- Rating if available -->
        <div v-if="imdbRating" class="flex items-center gap-1 ml-3">
          <span class="text-xs text-gray-500 dark:text-gray-400">IMDb</span>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ imdbRating }}</span>
        </div>
      </div>

      <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
        {{ entertainment.description }}
      </p>

      <!-- Entertainment-specific details -->
      <div class="space-y-2 mb-4">
        <!-- Release year -->
        <div v-if="releaseYear" class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{{ releaseYear }}</span>
        </div>
        
        <!-- Production company -->
        <div v-if="productionCompany" class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span class="line-clamp-1">{{ productionCompany }}</span>
        </div>
      </div>

      <!-- Genre tags -->
      <div v-if="genres.length > 0" class="flex flex-wrap gap-1 mb-4">
        <span 
          v-for="genre in genres.slice(0, 3)" 
          :key="genre"
          class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs"
        >
          {{ genre }}
        </span>
      </div>

      <!-- Streaming services -->
      <div v-if="streamingServices.length > 0" class="flex flex-wrap gap-1 mb-4">
        <span 
          v-for="service in streamingServices.slice(0, 4)" 
          :key="service"
          class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
        >
          {{ service }}
        </span>
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <button
          @click="$emit('save')"
          class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Save Show
        </button>
        
        <button
          v-if="imdbLink"
          @click="openImdb"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          IMDb
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  entertainment: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['save']);

const properties = computed(() => props.entertainment.qlooData?.properties || {});
const tags = computed(() => props.entertainment.qlooData?.tags || []);

const contentRating = computed(() => properties.value.content_rating);
const releaseYear = computed(() => properties.value.release_year);
const productionCompany = computed(() => properties.value.production_company);

const imdbRating = computed(() => {
  const external = properties.value.external;
  return external?.imdb?.user_rating;
});

const imdbLink = computed(() => {
  const external = properties.value.external;
  return external?.imdb?.id;
});

const genres = computed(() => {
  return tags.value
    .filter(tag => tag.type && tag.type.includes('genre'))
    .map(tag => tag.name)
    .filter(name => name && !name.includes('urn:'))
    .slice(0, 5);
});

const streamingServices = computed(() => {
  return tags.value
    .filter(tag => tag.type && tag.type.includes('streaming_service'))
    .map(tag => tag.name)
    .filter(name => name && !name.includes('urn:'))
    .slice(0, 6);
});

function handleImageError(event) {
  event.target.src = 'https://images.unsplash.com/photo-1489599735734-79b4fc81f6c8?w=400&h=300&auto=format&fit=crop';
}

function openImdb() {
  if (imdbLink.value) {
    window.open(`https://www.imdb.com/title/${imdbLink.value}`, '_blank');
  }
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>