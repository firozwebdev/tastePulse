<template>
  <div class="qloo-experience-card bg-white dark:bg-dark-card rounded-xl shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
    <!-- Image -->
    <div class="relative h-48 overflow-hidden">
      <img 
        :src="experience.image" 
        :alt="experience.name"
        class="w-full h-full object-cover"
        @error="handleImageError"
      />
      <div class="absolute top-3 right-3">
        <div class="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold text-gray-900 dark:text-white">
          {{ experience.match }}% match
        </div>
      </div>
      
      <!-- Experience type indicator -->
      <div class="absolute bottom-3 left-3">
        <div class="bg-green-600/80 text-white rounded-lg px-2 py-1 text-xs flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Experience
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
            {{ experience.name }}
          </h3>
          <p class="text-sm text-green-600 dark:text-green-400 font-medium">
            {{ experience.category }}
          </p>
        </div>
      </div>

      <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
        {{ experience.description }}
      </p>

      <!-- Experience-specific details -->
      <div class="space-y-2 mb-4">
        <!-- Popularity indicator -->
        <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>{{ popularityText }}</span>
        </div>
      </div>

      <!-- Tags -->
      <div v-if="topTags.length > 0" class="flex flex-wrap gap-1 mb-4">
        <span 
          v-for="tag in topTags.slice(0, 3)" 
          :key="tag"
          class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <button
          @click="$emit('save')"
          class="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Save Experience
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  experience: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['save']);

const properties = computed(() => props.experience.qlooData?.properties || {});
const tags = computed(() => props.experience.qlooData?.tags || []);

const popularityText = computed(() => {
  const popularity = props.experience.qlooData?.popularity || 0;
  if (popularity > 0.9) return 'Very Popular';
  if (popularity > 0.7) return 'Popular';
  if (popularity > 0.5) return 'Moderately Popular';
  return 'Niche Interest';
});

const topTags = computed(() => {
  return tags.value
    .filter(tag => tag.name && !tag.name.includes('urn:'))
    .map(tag => tag.name)
    .slice(0, 5);
});

function handleImageError(event) {
  event.target.src = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&auto=format&fit=crop';
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