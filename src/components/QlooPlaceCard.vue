<template>
  <div class="qloo-place-card bg-white dark:bg-dark-card rounded-xl shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
    <!-- Image -->
    <div class="relative h-48 overflow-hidden">
      <img 
        :src="place.image" 
        :alt="place.name"
        class="w-full h-full object-cover"
        @error="handleImageError"
      />
      <div class="absolute top-3 right-3">
        <div class="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold text-gray-900 dark:text-white">
          {{ place.match }}% match
        </div>
      </div>
      
      <!-- Location indicator if available -->
      <div v-if="locationInfo" class="absolute bottom-3 left-3">
        <div class="bg-black/70 text-white rounded-lg px-2 py-1 text-xs flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          {{ locationInfo }}
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
            {{ place.name }}
          </h3>
          <p class="text-sm text-primary-600 dark:text-primary-400 font-medium">
            {{ place.category }}
          </p>
        </div>
        
        <!-- Rating if available -->
        <div v-if="rating" class="flex items-center gap-1 ml-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ rating }}</span>
        </div>
      </div>

      <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
        {{ place.description }}
      </p>

      <!-- Place-specific details -->
      <div class="space-y-2 mb-4">
        <!-- Address -->
        <div v-if="address" class="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span class="line-clamp-1">{{ address }}</span>
        </div>
        
        <!-- Phone -->
        <div v-if="phone" class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>{{ phone }}</span>
        </div>

        <!-- Hours -->
        <div v-if="isOpen !== null" class="flex items-center gap-2 text-xs">
          <div :class="isOpen ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span :class="isOpen ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
            {{ isOpen ? 'Open now' : 'Closed' }}
          </span>
        </div>
      </div>

      <!-- Tags -->
      <div v-if="topTags.length > 0" class="flex flex-wrap gap-1 mb-4">
        <span 
          v-for="tag in topTags.slice(0, 3)" 
          :key="tag"
          class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <button
          @click="$emit('save')"
          class="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Save Place
        </button>
        
        <button
          v-if="hasLocation"
          @click="openInMaps"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  place: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['save']);

// Extract place-specific data from Qloo response
const properties = computed(() => props.place.qlooData?.properties || {});
const location = computed(() => props.place.qlooData?.location || {});
const tags = computed(() => props.place.qlooData?.tags || []);

const address = computed(() => properties.value.address);
const phone = computed(() => properties.value.phone);
const rating = computed(() => properties.value.business_rating);

const locationInfo = computed(() => {
  const geocode = properties.value.geocode;
  if (geocode) {
    return geocode.city || geocode.name || null;
  }
  return null;
});

const hasLocation = computed(() => location.value.lat && location.value.lon);

const isOpen = computed(() => {
  if (properties.value.is_closed === true) return false;
  if (properties.value.is_closed === false) return true;
  return null;
});

const topTags = computed(() => {
  return tags.value
    .filter(tag => tag.name && !tag.name.includes('urn:'))
    .map(tag => tag.name)
    .slice(0, 5);
});

function handleImageError(event) {
  event.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&auto=format&fit=crop';
}

function openInMaps() {
  if (hasLocation.value) {
    const { lat, lon } = location.value;
    const url = `https://www.google.com/maps?q=${lat},${lon}`;
    window.open(url, '_blank');
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