<template>
  <div class="qloo-music-card bg-white dark:bg-dark-card rounded-xl shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
    <!-- Image -->
    <div class="relative h-48 overflow-hidden">
      <img 
        :src="music.image" 
        :alt="music.name"
        class="w-full h-full object-cover"
        @error="handleImageError"
      />
      <div class="absolute top-3 right-3">
        <div class="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold text-gray-900 dark:text-white">
          {{ music.match }}% match
        </div>
      </div>
      
      <!-- Music type indicator -->
      <div class="absolute bottom-3 left-3">
        <div class="bg-purple-600/80 text-white rounded-lg px-2 py-1 text-xs flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          {{ musicType }}
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
            {{ music.name }}
          </h3>
          <p class="text-sm text-purple-600 dark:text-purple-400 font-medium">
            {{ music.category }}
          </p>
        </div>
      </div>

      <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
        {{ music.description }}
      </p>

      <!-- Music-specific details -->
      <div class="space-y-2 mb-4">
        <!-- Release info -->
        <div v-if="releaseInfo" class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{{ releaseInfo }}</span>
        </div>
        
        <!-- Duration -->
        <div v-if="duration" class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ duration }}</span>
        </div>
      </div>

      <!-- Genre tags -->
      <div v-if="genres.length > 0" class="flex flex-wrap gap-1 mb-4">
        <span 
          v-for="genre in genres.slice(0, 3)" 
          :key="genre"
          class="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs"
        >
          {{ genre }}
        </span>
      </div>

      <!-- External links -->
      <div v-if="externalLinks.length > 0" class="flex gap-2 mb-4">
        <button
          v-for="link in externalLinks.slice(0, 3)"
          :key="link.platform"
          @click="openExternalLink(link.url)"
          class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {{ link.platform }}
        </button>
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <button
          @click="$emit('save')"
          class="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Save Music
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  music: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['save']);

const properties = computed(() => props.music.qlooData?.properties || {});
const tags = computed(() => props.music.qlooData?.tags || []);
const types = computed(() => props.music.qlooData?.types || []);

const musicType = computed(() => {
  if (types.value.some(type => type.includes('artist'))) return 'Artist';
  if (types.value.some(type => type.includes('album'))) return 'Album';
  return 'Music';
});

const releaseInfo = computed(() => {
  const releaseDate = properties.value.release_date;
  if (releaseDate) {
    return new Date(releaseDate).getFullYear().toString();
  }
  return null;
});

const duration = computed(() => {
  const albumDuration = properties.value.duration?.album;
  if (albumDuration) {
    const minutes = Math.floor(albumDuration / 60);
    return `${minutes} min`;
  }
  return null;
});

const genres = computed(() => {
  return tags.value
    .filter(tag => tag.type && tag.type.includes('genre'))
    .map(tag => tag.name)
    .filter(name => name && !name.includes('urn:'))
    .slice(0, 5);
});

const externalLinks = computed(() => {
  const external = properties.value.external || {};
  const links = [];
  
  if (external.spotify) links.push({ platform: 'Spotify', url: `https://open.spotify.com/artist/${external.spotify.id}` });
  if (external.lastfm) links.push({ platform: 'Last.fm', url: `https://last.fm/music/${encodeURIComponent(props.music.name)}` });
  if (external.musicbrainz) links.push({ platform: 'MusicBrainz', url: `https://musicbrainz.org/artist/${external.musicbrainz.id}` });
  
  return links;
});

function handleImageError(event) {
  event.target.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&auto=format&fit=crop';
}

function openExternalLink(url) {
  window.open(url, '_blank');
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