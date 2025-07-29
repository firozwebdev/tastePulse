<template>
  <div class="time-travel-container">
    <!-- Time Travel Header -->
    <div class="time-travel-header">
      <div class="header-content">
        <h3 class="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
          ⏰ Time Travel Your Taste
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Discover what your cultural preferences would have been in different eras
        </p>
        
        <div class="era-selector">
          <div class="era-buttons">
            <button 
              v-for="era in availableEras" 
              :key="era.id"
              @click="selectEra(era.id)"
              :class="[
                'era-button',
                selectedEra === era.id ? 'active' : 'inactive'
              ]"
            >
              <span class="era-icon">{{ era.icon }}</span>
              <span class="era-name">{{ era.name }}</span>
              <span class="era-period">{{ era.period }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-animation">
        <div class="time-machine">
          <div class="spinning-clock">⏰</div>
          <div class="time-waves"></div>
        </div>
        <p class="loading-text">Traveling through time...</p>
      </div>
    </div>

    <!-- Time Travel Results -->
    <div v-else-if="timeTravelData" class="time-travel-results">
      <!-- Era Overview -->
      <div class="era-overview">
        <div class="era-card">
          <div class="era-header">
            <h4 class="era-title">
              {{ currentEraData.name }}
              <span class="era-icon-large">{{ getCurrentEraIcon() }}</span>
            </h4>
            <p class="era-description">{{ currentEraData.description }}</p>
          </div>
          
          <!-- Cultural Highlights -->
          <div class="cultural-highlights">
            <div 
              v-for="(highlight, category) in currentEraData.cultural_highlights" 
              :key="category"
              class="highlight-item"
            >
              <div class="highlight-icon">{{ highlight.icon }}</div>
              <div class="highlight-content">
                <div class="highlight-category">{{ category }}</div>
                <div class="highlight-style">{{ highlight.style }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Historical Recommendations -->
      <div class="historical-recommendations">
        <div class="recommendations-grid">
          <div 
            v-for="(items, category) in currentEraRecommendations" 
            :key="category"
            class="category-section"
          >
            <h5 class="category-title">
              {{ getCategoryIcon(category) }} {{ category.charAt(0).toUpperCase() + category.slice(1) }}
            </h5>
            
            <div class="historical-items">
              <div 
                v-for="item in items.slice(0, 2)" 
                :key="item.id"
                class="historical-item"
              >
                <div class="item-image">
                  <img :src="item.image" :alt="item.name" class="item-img" />
                  <div class="era-badge">{{ selectedEra }}</div>
                </div>
                
                <div class="item-content">
                  <h6 class="item-name">{{ item.name }}</h6>
                  <p class="item-description">{{ item.description }}</p>
                  
                  <!-- Time Travel Note -->
                  <div class="time-travel-note">
                    <div class="note-icon">💭</div>
                    <p class="note-text">{{ item.time_travel_note }}</p>
                  </div>
                  
                  <!-- Era Context -->
                  <div class="era-context">
                    <span class="context-label">Era Context:</span>
                    <span class="context-text">{{ item.era_context }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Time Travel Insights -->
      <div v-if="insights.length > 0" class="insights-section">
        <h4 class="insights-title">🔮 Time Travel Insights</h4>
        
        <div class="insights-grid">
          <div 
            v-for="insight in insights" 
            :key="insight.type"
            class="insight-card"
          >
            <div v-if="insight.type === 'best_era_match'" class="best-era-insight">
              <div class="insight-header">
                <h5 class="insight-title">🏆 Your Perfect Era</h5>
              </div>
              <div class="insight-content">
                <div class="era-match">{{ insight.message }}</div>
                <p class="era-reason">{{ insight.reason }}</p>
              </div>
            </div>
            
            <div v-else-if="insight.type === 'category_evolution'" class="evolution-insight">
              <div class="insight-header">
                <h5 class="insight-title">📈 {{ insight.category }} Evolution</h5>
              </div>
              <div class="evolution-timeline">
                <div 
                  v-for="evolution in insight.evolution" 
                  :key="evolution.era"
                  class="evolution-item"
                >
                  <div class="evolution-era">{{ evolution.era }}</div>
                  <div class="evolution-icon">{{ evolution.icon }}</div>
                  <div class="evolution-description">{{ evolution.description }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Era Comparison -->
      <div class="era-comparison">
        <h4 class="comparison-title">🔄 Compare Across Eras</h4>
        <div class="comparison-grid">
          <button 
            v-for="era in availableEras" 
            :key="era.id"
            @click="selectEra(era.id)"
            :class="[
              'comparison-era-button',
              selectedEra === era.id ? 'active' : 'inactive'
            ]"
          >
            <div class="comparison-era-icon">{{ era.icon }}</div>
            <div class="comparison-era-name">{{ era.name }}</div>
            <div class="comparison-era-count">
              {{ getEraRecommendationCount(era.id) }} items
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <button @click="generateTimeTravel" :disabled="isLoading" class="generate-btn">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        {{ isLoading ? 'Time Traveling...' : 'Start Time Travel' }}
      </button>
      
      <button v-if="timeTravelData" @click="shareTimeTravel" class="share-btn">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path>
        </svg>
        Share My Time Travel
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  recommendations: {
    type: Object,
    default: () => ({})
  }
});

const isLoading = ref(false);
const timeTravelData = ref(null);
const insights = ref([]);
const selectedEra = ref('1980s');

const availableEras = ref([
  {
    id: '1920s',
    name: 'Roaring Twenties',
    period: '1920-1929',
    icon: '🎷',
    description: 'Jazz Age, Art Deco, and cultural revolution'
  },
  {
    id: '1950s',
    name: 'Golden Fifties',
    period: '1950-1959',
    icon: '🎸',
    description: 'Post-war optimism, suburban culture, and rock\'n\'roll'
  },
  {
    id: '1960s',
    name: 'Swinging Sixties',
    period: '1960-1969',
    icon: '☮️',
    description: 'Cultural revolution, counterculture, and social change'
  },
  {
    id: '1980s',
    name: 'Electric Eighties',
    period: '1980-1989',
    icon: '🎹',
    description: 'Neon lights, synthesizers, and pop culture explosion'
  },
  {
    id: '1990s',
    name: 'Alternative Nineties',
    period: '1990-1999',
    icon: '🎤',
    description: 'Grunge, indie culture, and the dawn of the internet'
  }
]);

const currentEraData = computed(() => {
  if (!timeTravelData.value) return {};
  return timeTravelData.value.era_descriptions[selectedEra.value] || {};
});

const currentEraRecommendations = computed(() => {
  if (!timeTravelData.value) return {};
  return timeTravelData.value.time_travel_results[selectedEra.value] || {};
});

function selectEra(eraId) {
  selectedEra.value = eraId;
}

function getCurrentEraIcon() {
  const era = availableEras.value.find(e => e.id === selectedEra.value);
  return era?.icon || '🎭';
}

function getCategoryIcon(category) {
  const icons = {
    music: '🎵',
    food: '🍽️',
    books: '📚',
    travel: '✈️'
  };
  return icons[category] || '🎭';
}

function getEraRecommendationCount(eraId) {
  if (!timeTravelData.value) return 0;
  const eraData = timeTravelData.value.time_travel_results[eraId] || {};
  return Object.values(eraData).reduce((total, items) => {
    return total + (Array.isArray(items) ? items.length : 0);
  }, 0);
}

async function generateTimeTravel() {
  if (Object.keys(props.recommendations).length === 0) {
    console.log('No recommendations available for time travel');
    return;
  }

  isLoading.value = true;
  
  try {
    console.log('🕰️ Generating time travel mappings...');
    
    const response = await fetch('/.netlify/functions/time-travel-taste', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recommendations: props.recommendations,
        selectedEras: availableEras.value.map(era => era.id)
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    timeTravelData.value = data;
    insights.value = data.insights || [];
    
    console.log(`✨ Generated time travel data for ${Object.keys(data.time_travel_results).length} eras`);
  } catch (error) {
    console.error('Error generating time travel data:', error);
  } finally {
    isLoading.value = false;
  }
}

function shareTimeTravel() {
  if (!timeTravelData.value) return;
  
  const shareText = `🕰️ I just discovered my taste through time! In the ${currentEraData.value.name}, my preferences would have been: ${currentEraData.value.description}`;
  
  if (navigator.share) {
    navigator.share({
      title: 'My Time Travel Taste Profile',
      text: shareText,
      url: window.location.href
    });
  } else {
    // Fallback to clipboard
    navigator.clipboard.writeText(shareText);
    // You could add a toast notification here
  }
}

onMounted(() => {
  // Auto-generate time travel data if recommendations are available
  if (Object.keys(props.recommendations).length > 0) {
    setTimeout(() => {
      generateTimeTravel();
    }, 500);
  }
});
</script>

<style scoped>
.time-travel-container {
  @apply max-w-6xl mx-auto p-6;
}

.time-travel-header {
  @apply text-center mb-8;
}

.header-content {
  @apply max-w-4xl mx-auto;
}

.era-selector {
  @apply mt-6;
}

.era-buttons {
  @apply flex flex-wrap justify-center gap-4;
}

.era-button {
  @apply flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer min-w-[120px];
}

.era-button.active {
  @apply border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300;
}

.era-button.inactive {
  @apply border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-purple-300 hover:bg-purple-50;
}

.era-icon {
  @apply text-2xl mb-2;
}

.era-name {
  @apply font-semibold text-sm;
}

.era-period {
  @apply text-xs opacity-75;
}

.loading-state {
  @apply flex flex-col items-center justify-center py-16;
}

.loading-animation {
  @apply text-center;
}

.time-machine {
  @apply relative mb-6;
}

.spinning-clock {
  @apply text-6xl animate-spin;
}

.time-waves {
  @apply absolute inset-0 rounded-full border-4 border-purple-300 animate-ping;
}

.loading-text {
  @apply text-lg text-gray-600 dark:text-gray-400 animate-pulse;
}

.time-travel-results {
  @apply space-y-8;
}

.era-overview {
  @apply mb-8;
}

.era-card {
  @apply bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-8;
}

.era-header {
  @apply text-center mb-6;
}

.era-title {
  @apply text-3xl font-display font-bold text-gray-900 dark:text-white mb-3 flex items-center justify-center gap-3;
}

.era-icon-large {
  @apply text-4xl;
}

.era-description {
  @apply text-lg text-gray-600 dark:text-gray-400;
}

.cultural-highlights {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4;
}

.highlight-item {
  @apply flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg;
}

.highlight-icon {
  @apply text-2xl;
}

.highlight-category {
  @apply font-semibold text-gray-900 dark:text-white capitalize;
}

.highlight-style {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

.historical-recommendations {
  @apply mb-8;
}

.recommendations-grid {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-8;
}

.category-section {
  @apply space-y-4;
}

.category-title {
  @apply text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2;
}

.historical-items {
  @apply space-y-4;
}

.historical-item {
  @apply bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700;
}

.item-image {
  @apply relative mb-4;
}

.item-img {
  @apply w-full h-32 object-cover rounded-lg;
}

.era-badge {
  @apply absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full;
}

.item-content {
  @apply space-y-3;
}

.item-name {
  @apply font-semibold text-gray-900 dark:text-white;
}

.item-description {
  @apply text-sm text-gray-600 dark:text-gray-400 line-clamp-2;
}

.time-travel-note {
  @apply flex gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg;
}

.note-icon {
  @apply text-amber-600 dark:text-amber-400;
}

.note-text {
  @apply text-sm text-amber-700 dark:text-amber-300 italic;
}

.era-context {
  @apply text-xs text-gray-500 dark:text-gray-400;
}

.context-label {
  @apply font-medium;
}

.insights-section {
  @apply mb-8;
}

.insights-title {
  @apply text-2xl font-display font-bold text-gray-900 dark:text-white mb-6 text-center;
}

.insights-grid {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-6;
}

.insight-card {
  @apply bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700;
}

.insight-header {
  @apply mb-4;
}

.insight-title {
  @apply text-lg font-semibold text-gray-900 dark:text-white;
}

.best-era-insight .era-match {
  @apply text-xl font-bold text-purple-600 dark:text-purple-400 mb-2;
}

.era-reason {
  @apply text-gray-600 dark:text-gray-400;
}

.evolution-timeline {
  @apply space-y-3;
}

.evolution-item {
  @apply flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg;
}

.evolution-era {
  @apply font-semibold text-sm text-gray-900 dark:text-white min-w-[60px];
}

.evolution-icon {
  @apply text-lg;
}

.evolution-description {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

.era-comparison {
  @apply mb-8;
}

.comparison-title {
  @apply text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center;
}

.comparison-grid {
  @apply grid grid-cols-2 md:grid-cols-5 gap-3;
}

.comparison-era-button {
  @apply flex flex-col items-center p-3 rounded-lg border transition-all duration-200 cursor-pointer;
}

.comparison-era-button.active {
  @apply border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300;
}

.comparison-era-button.inactive {
  @apply border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-purple-300;
}

.comparison-era-icon {
  @apply text-xl mb-1;
}

.comparison-era-name {
  @apply text-xs font-medium text-center;
}

.comparison-era-count {
  @apply text-xs opacity-75;
}

.action-buttons {
  @apply flex justify-center gap-4 mt-8;
}

.generate-btn {
  @apply flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
}

.share-btn {
  @apply flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>