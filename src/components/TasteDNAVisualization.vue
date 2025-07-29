<template>
  <div class="taste-dna-container">
    <!-- Main DNA Visualization -->
    <div class="dna-visualization-wrapper">
      <div class="dna-header">
        <h3 class="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">
          Your Cultural DNA
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ tastePersonality }}
        </p>
        <div class="cultural-theme-badge">
          <span class="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium">
            {{ culturalTheme }}
          </span>
        </div>
      </div>

      <!-- Interactive Radar Chart -->
      <div class="radar-chart-container">
        <canvas ref="radarCanvas" width="400" height="400" class="radar-chart"></canvas>
        
        <!-- DNA Metrics -->
        <div class="dna-metrics">
          <div class="metric-grid">
            <div v-for="metric in dnaMetrics" :key="metric.name" class="metric-item">
              <div class="metric-icon" :style="{ backgroundColor: metric.color }">
                {{ metric.icon }}
              </div>
              <div class="metric-info">
                <div class="metric-name">{{ metric.name }}</div>
                <div class="metric-value">{{ metric.value }}%</div>
                <div class="metric-bar">
                  <div 
                    class="metric-fill" 
                    :style="{ width: metric.value + '%', backgroundColor: metric.color }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Taste Bridges Visualization -->
      <div v-if="tasteBridges.length > 0" class="taste-bridges-section">
        <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          🌉 Cultural Bridges
        </h4>
        <div class="bridges-container">
          <div 
            v-for="bridge in tasteBridges" 
            :key="bridge.id" 
            class="bridge-card"
            @click="highlightBridge(bridge)"
          >
            <div class="bridge-connection">
              <div class="bridge-item">
                <div class="bridge-category">{{ bridge.category1 }}</div>
                <div class="bridge-name">{{ bridge.item1.name }}</div>
              </div>
              <div class="bridge-arrow">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </div>
              <div class="bridge-item">
                <div class="bridge-category">{{ bridge.category2 }}</div>
                <div class="bridge-name">{{ bridge.item2.name }}</div>
              </div>
            </div>
            <div class="bridge-strength">
              <div class="strength-bar">
                <div 
                  class="strength-fill" 
                  :style="{ width: bridge.strength + '%' }"
                ></div>
              </div>
              <span class="strength-text">{{ bridge.strength }}% connection</span>
            </div>
            <p class="bridge-narrative">{{ bridge.connection }}</p>
          </div>
        </div>
      </div>

      <!-- Shareable DNA Card -->
      <div class="dna-share-section">
        <div class="share-card" ref="shareCard">
          <div class="share-header">
            <h5 class="font-bold text-lg">My TastePulse DNA</h5>
            <div class="share-metrics">
              <div v-for="metric in topMetrics" :key="metric.name" class="share-metric">
                <span class="metric-dot" :style="{ backgroundColor: metric.color }"></span>
                <span class="metric-label">{{ metric.name }}: {{ metric.value }}%</span>
              </div>
            </div>
          </div>
          <div class="share-footer">
            <span class="share-theme">{{ culturalTheme }}</span>
            <span class="share-logo">TastePulse</span>
          </div>
        </div>
        
        <div class="share-actions">
          <button @click="shareToSocial" class="share-btn primary">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path>
            </svg>
            Share DNA
          </button>
          <button @click="downloadDNA" class="share-btn secondary">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-4-4m4 4l4-4m5-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Download
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';

const props = defineProps({
  recommendations: {
    type: Object,
    default: () => ({})
  },
  tasteBridges: {
    type: Array,
    default: () => []
  },
  culturalTheme: {
    type: String,
    default: 'Cultural Explorer'
  },
  tastePersonality: {
    type: String,
    default: 'You have a sophisticated palate that appreciates cultural depth and artistic authenticity'
  }
});

const radarCanvas = ref(null);
const shareCard = ref(null);

// Calculate DNA metrics from recommendations
const dnaMetrics = computed(() => {
  const categories = Object.keys(props.recommendations);
  const metrics = [];
  
  // Adventure Level (based on travel recommendations)
  const travelItems = props.recommendations.travel || [];
  const adventureScore = travelItems.length > 0 ? 
    Math.round(travelItems.reduce((sum, item) => sum + (item.match || 80), 0) / travelItems.length) : 75;
  
  metrics.push({
    name: 'Adventure',
    value: adventureScore,
    color: '#FF6B6B',
    icon: '🗺️'
  });

  // Sophistication (based on music and books)
  const musicItems = props.recommendations.music || [];
  const bookItems = props.recommendations.books || [];
  const sophisticationScore = Math.round(
    ([...musicItems, ...bookItems].reduce((sum, item) => sum + (item.match || 80), 0) / 
    Math.max([...musicItems, ...bookItems].length, 1))
  );
  
  metrics.push({
    name: 'Sophistication',
    value: sophisticationScore,
    color: '#4ECDC4',
    icon: '🎭'
  });

  // Culinary Curiosity (based on food recommendations)
  const foodItems = props.recommendations.food || [];
  const culinaryScore = foodItems.length > 0 ? 
    Math.round(foodItems.reduce((sum, item) => sum + (item.match || 80), 0) / foodItems.length) : 75;
  
  metrics.push({
    name: 'Culinary',
    value: culinaryScore,
    color: '#45B7D1',
    icon: '🍽️'
  });

  // Cultural Depth (based on bridges)
  const bridgeScore = Math.min(95, 60 + (props.tasteBridges.length * 10));
  
  metrics.push({
    name: 'Cultural Depth',
    value: bridgeScore,
    color: '#96CEB4',
    icon: '🏛️'
  });

  // Innovation (based on variety of recommendations)
  const totalCategories = categories.length;
  const innovationScore = Math.min(95, 50 + (totalCategories * 15));
  
  metrics.push({
    name: 'Innovation',
    value: innovationScore,
    color: '#FFEAA7',
    icon: '💡'
  });

  // Authenticity (based on Qloo data quality)
  const authenticityScore = 85; // Base score, could be enhanced with real data analysis
  
  metrics.push({
    name: 'Authenticity',
    value: authenticityScore,
    color: '#DDA0DD',
    icon: '✨'
  });

  return metrics;
});

const topMetrics = computed(() => {
  return dnaMetrics.value
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);
});

// Draw radar chart
function drawRadarChart() {
  if (!radarCanvas.value) return;
  
  const canvas = radarCanvas.value;
  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 150;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw background circles
  ctx.strokeStyle = '#E5E7EB';
  ctx.lineWidth = 1;
  for (let i = 1; i <= 5; i++) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, (radius * i) / 5, 0, 2 * Math.PI);
    ctx.stroke();
  }
  
  // Draw axes
  const metrics = dnaMetrics.value;
  const angleStep = (2 * Math.PI) / metrics.length;
  
  ctx.strokeStyle = '#D1D5DB';
  ctx.lineWidth = 1;
  
  metrics.forEach((metric, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    // Draw labels
    ctx.fillStyle = '#374151';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const labelX = centerX + Math.cos(angle) * (radius + 20);
    const labelY = centerY + Math.sin(angle) * (radius + 20);
    
    ctx.fillText(metric.name, labelX, labelY);
  });
  
  // Draw data polygon
  ctx.beginPath();
  ctx.strokeStyle = '#8B5CF6';
  ctx.fillStyle = 'rgba(139, 92, 246, 0.2)';
  ctx.lineWidth = 2;
  
  metrics.forEach((metric, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const value = metric.value / 100;
    const x = centerX + Math.cos(angle) * radius * value;
    const y = centerY + Math.sin(angle) * radius * value;
    
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Draw data points
  metrics.forEach((metric, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const value = metric.value / 100;
    const x = centerX + Math.cos(angle) * radius * value;
    const y = centerY + Math.sin(angle) * radius * value;
    
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = metric.color;
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

function highlightBridge(bridge) {
  // Add visual feedback for bridge interaction
  console.log('Highlighting bridge:', bridge);
  // Could add animations or modal here
}

function shareToSocial() {
  if (navigator.share) {
    navigator.share({
      title: 'My TastePulse Cultural DNA',
      text: `I'm a ${props.culturalTheme}! Discover your cultural DNA with TastePulse.`,
      url: window.location.href
    });
  } else {
    // Fallback to copying link
    navigator.clipboard.writeText(window.location.href);
    // Show notification
  }
}

function downloadDNA() {
  // Convert share card to image and download
  if (shareCard.value) {
    // Implementation would use html2canvas or similar
    console.log('Downloading DNA card...');
  }
}

onMounted(() => {
  drawRadarChart();
});

watch(() => props.recommendations, () => {
  drawRadarChart();
}, { deep: true });
</script>

<style scoped>
.taste-dna-container {
  @apply bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 mb-8;
}

.dna-visualization-wrapper {
  @apply max-w-4xl mx-auto;
}

.dna-header {
  @apply text-center mb-8;
}

.cultural-theme-badge {
  @apply flex justify-center mb-6;
}

.radar-chart-container {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8;
}

.radar-chart {
  @apply mx-auto;
}

.dna-metrics {
  @apply space-y-4;
}

.metric-grid {
  @apply space-y-4;
}

.metric-item {
  @apply flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm;
}

.metric-icon {
  @apply w-12 h-12 rounded-full flex items-center justify-center text-white font-bold;
}

.metric-info {
  @apply flex-1;
}

.metric-name {
  @apply font-medium text-gray-900 dark:text-white;
}

.metric-value {
  @apply text-2xl font-bold text-gray-900 dark:text-white;
}

.metric-bar {
  @apply w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-2;
}

.metric-fill {
  @apply h-full rounded-full transition-all duration-1000 ease-out;
}

.taste-bridges-section {
  @apply mb-8;
}

.bridges-container {
  @apply space-y-4;
}

.bridge-card {
  @apply bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer;
}

.bridge-connection {
  @apply flex items-center justify-between mb-4;
}

.bridge-item {
  @apply text-center flex-1;
}

.bridge-category {
  @apply text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide;
}

.bridge-name {
  @apply font-semibold text-gray-900 dark:text-white mt-1;
}

.bridge-arrow {
  @apply text-purple-500 mx-4;
}

.bridge-strength {
  @apply flex items-center gap-3 mb-3;
}

.strength-bar {
  @apply flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full;
}

.strength-fill {
  @apply h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000;
}

.strength-text {
  @apply text-sm font-medium text-gray-600 dark:text-gray-400;
}

.bridge-narrative {
  @apply text-gray-700 dark:text-gray-300 text-sm leading-relaxed;
}

.dna-share-section {
  @apply border-t border-gray-200 dark:border-gray-700 pt-8;
}

.share-card {
  @apply bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-6 mb-4;
}

.share-header h5 {
  @apply mb-4;
}

.share-metrics {
  @apply space-y-2;
}

.share-metric {
  @apply flex items-center gap-2;
}

.metric-dot {
  @apply w-3 h-3 rounded-full;
}

.metric-label {
  @apply text-sm;
}

.share-footer {
  @apply flex justify-between items-center mt-4 pt-4 border-t border-white/20;
}

.share-theme {
  @apply text-sm opacity-90;
}

.share-logo {
  @apply font-bold;
}

.share-actions {
  @apply flex gap-3;
}

.share-btn {
  @apply flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200;
}

.share-btn.primary {
  @apply bg-purple-600 text-white hover:bg-purple-700;
}

.share-btn.secondary {
  @apply bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600;
}
</style>