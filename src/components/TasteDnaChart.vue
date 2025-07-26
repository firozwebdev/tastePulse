<template>
  <div class="bg-white dark:bg-dark-card rounded-xl shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border p-6">
    <div class="text-center mb-6">
      <h3 class="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">
        Your Taste DNA
      </h3>
      <p class="text-gray-600 dark:text-gray-400 text-sm">
        Visual representation of your cultural preferences
      </p>
    </div>

    <!-- DNA Helix Visualization -->
    <div class="relative h-64 mb-6">
      <svg class="w-full h-full" viewBox="0 0 400 200">
        <!-- Background -->
        <defs>
          <linearGradient id="dnaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:0.1" />
            <stop offset="50%" style="stop-color:#8B5CF6;stop-opacity:0.1" />
            <stop offset="100%" style="stop-color:#EC4899;stop-opacity:0.1" />
          </linearGradient>
        </defs>
        
        <!-- DNA Strands -->
        <path 
          :d="dnaPath1" 
          fill="none" 
          stroke="url(#dnaGradient)" 
          stroke-width="3"
          class="animate-pulse"
        />
        <path 
          :d="dnaPath2" 
          fill="none" 
          stroke="url(#dnaGradient)" 
          stroke-width="3"
          class="animate-pulse"
          style="animation-delay: 0.5s"
        />
        
        <!-- Category Nodes -->
        <g v-for="(category, index) in categoryNodes" :key="category.name">
          <circle
            :cx="category.x"
            :cy="category.y"
            :r="category.size"
            :fill="category.color"
            class="animate-bounce"
            :style="{ animationDelay: `${index * 0.2}s` }"
          />
          <text
            :x="category.x"
            :y="category.y + 25"
            text-anchor="middle"
            class="text-xs font-medium fill-gray-700 dark:fill-gray-300"
          >
            {{ category.name }}
          </text>
          <text
            :x="category.x"
            :y="category.y + 5"
            text-anchor="middle"
            class="text-xs font-bold fill-white"
          >
            {{ category.percentage }}%
          </text>
        </g>
        
        <!-- Connecting Lines -->
        <g v-for="connection in connections" :key="`${connection.from}-${connection.to}`">
          <line
            :x1="connection.x1"
            :y1="connection.y1"
            :x2="connection.x2"
            :y2="connection.y2"
            stroke="#E5E7EB"
            stroke-width="1"
            stroke-dasharray="2,2"
            class="animate-pulse"
          />
        </g>
      </svg>
    </div>

    <!-- Category Breakdown -->
    <div class="space-y-3">
      <div v-for="category in sortedCategories" :key="category.name" class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div 
            class="w-4 h-4 rounded-full"
            :style="{ backgroundColor: category.color }"
          ></div>
          <span class="font-medium text-gray-900 dark:text-white">{{ category.name }}</span>
          <span class="text-sm text-gray-500 dark:text-gray-400">{{ category.value }}</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              class="h-full rounded-full transition-all duration-1000"
              :style="{ 
                width: `${category.percentage}%`, 
                backgroundColor: category.color 
              }"
            ></div>
          </div>
          <span class="text-sm font-semibold text-gray-700 dark:text-gray-300 w-8">
            {{ category.percentage }}%
          </span>
        </div>
      </div>
    </div>

    <!-- Taste Insights -->
    <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
      <h4 class="font-semibold text-gray-900 dark:text-white mb-3">Taste Insights</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
          <div class="text-sm font-medium text-blue-800 dark:text-blue-200">Dominant Style</div>
          <div class="text-lg font-bold text-blue-900 dark:text-blue-100">{{ dominantStyle }}</div>
        </div>
        <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
          <div class="text-sm font-medium text-green-800 dark:text-green-200">Cultural Affinity</div>
          <div class="text-lg font-bold text-green-900 dark:text-green-100">{{ culturalAffinity }}</div>
        </div>
        <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
          <div class="text-sm font-medium text-purple-800 dark:text-purple-200">Mood Profile</div>
          <div class="text-lg font-bold text-purple-900 dark:text-purple-100">{{ moodProfile }}</div>
        </div>
        <div class="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
          <div class="text-sm font-medium text-orange-800 dark:text-orange-200">Exploration Level</div>
          <div class="text-lg font-bold text-orange-900 dark:text-orange-100">{{ explorationLevel }}</div>
        </div>
      </div>
    </div>

    <!-- Share DNA -->
    <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
      <BaseButton
        @click="shareTasteDNA"
        variant="secondary"
        class="w-full"
      >
        <template #icon-left>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </template>
        Share My Taste DNA
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useNotification } from '../composables/useNotification';
import BaseButton from './BaseButton.vue';

const props = defineProps({
  parsedTaste: {
    type: Object,
    default: () => ({})
  }
});

const notification = useNotification();

// Category colors
const categoryColors = {
  music: '#3B82F6',
  food: '#EF4444',
  book: '#10B981',
  travel: '#F59E0B',
  fashion: '#8B5CF6',
  brand: '#EC4899'
};

// Computed properties
const sortedCategories = computed(() => {
  const categories = Object.entries(props.parsedTaste).map(([name, value]) => {
    const percentage = Math.floor(Math.random() * 30) + 70; // Mock percentage
    return {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: Array.isArray(value) ? value.join(', ') : value,
      percentage,
      color: categoryColors[name] || '#6B7280'
    };
  });
  
  return categories.sort((a, b) => b.percentage - a.percentage);
});

const categoryNodes = computed(() => {
  return sortedCategories.value.map((category, index) => {
    const angle = (index / sortedCategories.value.length) * 2 * Math.PI;
    const radius = 60;
    const centerX = 200;
    const centerY = 100;
    
    return {
      ...category,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      size: Math.max(15, category.percentage / 5)
    };
  });
});

const connections = computed(() => {
  const nodes = categoryNodes.value;
  const connections = [];
  
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      connections.push({
        from: nodes[i].name,
        to: nodes[j].name,
        x1: nodes[i].x,
        y1: nodes[i].y,
        x2: nodes[j].x,
        y2: nodes[j].y
      });
    }
  }
  
  return connections;
});

const dnaPath1 = computed(() => {
  let path = 'M 50 100';
  for (let x = 50; x <= 350; x += 10) {
    const y = 100 + Math.sin((x - 50) / 20) * 30;
    path += ` L ${x} ${y}`;
  }
  return path;
});

const dnaPath2 = computed(() => {
  let path = 'M 50 100';
  for (let x = 50; x <= 350; x += 10) {
    const y = 100 - Math.sin((x - 50) / 20) * 30;
    path += ` L ${x} ${y}`;
  }
  return path;
});

const dominantStyle = computed(() => {
  if (sortedCategories.value.length === 0) return 'Balanced';
  const dominant = sortedCategories.value[0];
  
  const styles = {
    music: 'Audiophile',
    food: 'Foodie',
    book: 'Literary',
    travel: 'Explorer',
    fashion: 'Trendsetter',
    brand: 'Brand Conscious'
  };
  
  return styles[dominant.name.toLowerCase()] || 'Eclectic';
});

const culturalAffinity = computed(() => {
  const categories = Object.keys(props.parsedTaste);
  if (categories.some(cat => props.parsedTaste[cat]?.includes('Japanese') || props.parsedTaste[cat]?.includes('Japan'))) {
    return 'East Asian';
  } else if (categories.some(cat => props.parsedTaste[cat]?.includes('Mediterranean') || props.parsedTaste[cat]?.includes('Italian'))) {
    return 'Mediterranean';
  } else if (categories.some(cat => props.parsedTaste[cat]?.includes('Korean') || props.parsedTaste[cat]?.includes('K-'))) {
    return 'Korean Wave';
  }
  return 'Global Fusion';
});

const moodProfile = computed(() => {
  const input = Object.values(props.parsedTaste).join(' ').toLowerCase();
  if (input.includes('relax') || input.includes('chill') || input.includes('lo-fi')) {
    return 'Relaxed';
  } else if (input.includes('energy') || input.includes('upbeat') || input.includes('rock')) {
    return 'Energetic';
  } else if (input.includes('romantic') || input.includes('jazz') || input.includes('wine')) {
    return 'Romantic';
  }
  return 'Balanced';
});

const explorationLevel = computed(() => {
  const categoryCount = Object.keys(props.parsedTaste).length;
  if (categoryCount >= 4) return 'High Explorer';
  if (categoryCount >= 2) return 'Moderate Explorer';
  return 'Focused Explorer';
});

// Methods
function shareTasteDNA() {
  const shareText = `Check out my Taste DNA on TastePulse! My dominant style is ${dominantStyle.value} with ${culturalAffinity.value} cultural affinity.`;
  
  if (navigator.share) {
    navigator.share({
      title: 'My Taste DNA - TastePulse',
      text: shareText,
      url: window.location.href
    }).then(() => {
      notification.success('Shared Successfully', 'Your Taste DNA has been shared!');
    }).catch(err => {
      if (err.name !== 'AbortError') {
        copyToClipboard(shareText);
      }
    });
  } else {
    copyToClipboard(shareText);
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    notification.info('Copied to Clipboard', 'Your Taste DNA summary has been copied!');
  }).catch(err => {
    console.error('Failed to copy text: ', err);
    notification.error('Copy Failed', 'Could not copy to clipboard.');
  });
}
</script>