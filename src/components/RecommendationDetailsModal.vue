<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="handleBackdropClick">
    <div class="bg-white dark:bg-dark-card rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
      <!-- Header -->
      <div class="relative">
        <div class="h-64 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-t-xl overflow-hidden">
          <img 
            :src="recommendation.image || getFallbackImage(recommendation.category?.toLowerCase())"
            :alt="recommendation.name"
            class="w-full h-full object-cover"
            @error="handleImageError"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          <!-- Close Button -->
          <button
            @click="$emit('close')"
            class="absolute top-4 right-4 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <!-- Match Score Badge -->
          <div class="absolute top-4 left-4">
            <div :class="getMatchBadgeClass(recommendation.match)" class="px-3 py-1 rounded-full text-white font-semibold text-sm">
              {{ recommendation.match }}% Match
            </div>
          </div>
          
          <!-- Category Badge -->
          <div class="absolute bottom-4 left-4">
            <div class="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
              {{ recommendation.category }}
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- Title and Basic Info -->
        <div class="mb-6">
          <h1 class="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
            {{ recommendation.name }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            {{ recommendation.description }}
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-3 mb-8">
          <BaseButton @click="saveRecommendation" variant="primary">
            <template #icon-left>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </template>
            Save to Profile
          </BaseButton>
          
          <BaseButton @click="shareRecommendation" variant="secondary">
            <template #icon-left>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </template>
            Share
          </BaseButton>
          
          <BaseButton @click="findSimilar" variant="outline">
            <template #icon-left>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </template>
            Find Similar
          </BaseButton>
        </div>

        <!-- Detailed Information -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Left Column -->
          <div class="space-y-6">
            <!-- Why This Matches -->
            <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h3 class="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Why This Matches Your Taste
              </h3>
              <p class="text-blue-800 dark:text-blue-200 text-sm">
                {{ getMatchReason() }}
              </p>
            </div>

            <!-- Key Features -->
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Key Features</h3>
              <div class="space-y-2">
                <div v-for="feature in getKeyFeatures()" :key="feature" class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-gray-700 dark:text-gray-300 text-sm">{{ feature }}</span>
                </div>
              </div>
            </div>

            <!-- Tags -->
            <div v-if="getTags().length > 0">
              <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Related Tags</h3>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="tag in getTags()" 
                  :key="tag"
                  class="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30 cursor-pointer transition-colors"
                  @click="searchByTag(tag)"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-6">
            <!-- Quick Stats -->
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Quick Stats</h3>
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 dark:text-gray-400 text-sm">Match Score</span>
                  <div class="flex items-center gap-2">
                    <div class="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        class="h-full rounded-full transition-all duration-1000"
                        :class="getMatchColor(recommendation.match)"
                        :style="{ width: `${recommendation.match}%` }"
                      ></div>
                    </div>
                    <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ recommendation.match }}%</span>
                  </div>
                </div>
                
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 dark:text-gray-400 text-sm">Category</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ recommendation.category }}</span>
                </div>
                
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 dark:text-gray-400 text-sm">Popularity</span>
                  <div class="flex items-center gap-1">
                    <svg v-for="star in 5" :key="star" class="h-4 w-4" :class="star <= getPopularityStars() ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Similar Recommendations Preview -->
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-3">You Might Also Like</h3>
              <div class="space-y-3">
                <div v-for="similar in getSimilarRecommendations()" :key="similar.name" class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                  <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <img :src="similar.image" :alt="similar.name" class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="font-medium text-gray-900 dark:text-white text-sm truncate">{{ similar.name }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ similar.match }}% match</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Details -->
        <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Additional Information</h3>
          <div class="prose dark:prose-invert max-w-none">
            <p class="text-gray-600 dark:text-gray-400">
              {{ getAdditionalInfo() }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useNotification } from '../composables/useNotification';
import { useTasteStore } from '../stores/taste';
import { getFallbackImage } from '../utils/helpers';
import BaseButton from './BaseButton.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  recommendation: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'save', 'share', 'find-similar']);

const notification = useNotification();
const tasteStore = useTasteStore();

// Methods
function handleBackdropClick() {
  emit('close');
}

function handleImageError(event) {
  event.target.src = getFallbackImage(props.recommendation.category?.toLowerCase());
}

function getMatchBadgeClass(match) {
  if (match >= 90) return 'bg-green-500';
  if (match >= 80) return 'bg-blue-500';
  if (match >= 70) return 'bg-yellow-500';
  return 'bg-orange-500';
}

function getMatchColor(match) {
  if (match >= 90) return 'bg-green-500';
  if (match >= 80) return 'bg-blue-500';
  if (match >= 70) return 'bg-yellow-500';
  return 'bg-orange-500';
}

function getMatchReason() {
  const category = props.recommendation.category?.toLowerCase();
  const match = props.recommendation.match;
  
  const reasons = {
    music: `This ${props.recommendation.name} aligns perfectly with your musical preferences, offering the style and energy that matches your taste profile.`,
    food: `Based on your culinary preferences, this ${props.recommendation.name} offers flavors and dining experiences that complement your taste.`,
    book: `This ${props.recommendation.name} matches your reading preferences and literary interests, offering themes and styles you'll enjoy.`,
    travel: `This ${props.recommendation.name} destination aligns with your travel style and interests, offering experiences you're likely to love.`,
    fashion: `This ${props.recommendation.name} style matches your fashion preferences and aesthetic sensibilities.`,
    brand: `This ${props.recommendation.name} brand aligns with your values and preferences based on your taste profile.`
  };
  
  return reasons[category] || `This recommendation has a ${match}% match with your taste profile based on our AI analysis.`;
}

function getKeyFeatures() {
  const category = props.recommendation.category?.toLowerCase();
  
  const features = {
    music: ['High-quality audio experience', 'Matches your preferred genre', 'Popular among similar users', 'Available on major platforms'],
    food: ['Authentic flavors', 'High-quality ingredients', 'Matches your dietary preferences', 'Highly rated by food enthusiasts'],
    book: ['Engaging storytelling', 'Matches your reading level', 'Award-winning or critically acclaimed', 'Available in multiple formats'],
    travel: ['Unique cultural experiences', 'Matches your travel style', 'Highly rated by travelers', 'Accessible and well-connected'],
    fashion: ['Trendy and stylish', 'Quality materials', 'Matches your aesthetic', 'Versatile and practical'],
    brand: ['Trusted reputation', 'Quality products/services', 'Aligns with your values', 'Positive customer reviews']
  };
  
  return features[category] || ['High quality', 'Matches your preferences', 'Highly recommended', 'Great value'];
}

function getTags() {
  const category = props.recommendation.category?.toLowerCase();
  const name = props.recommendation.name.toLowerCase();
  
  // Generate relevant tags based on category and name
  const baseTags = {
    music: ['music', 'audio', 'entertainment'],
    food: ['food', 'cuisine', 'dining'],
    book: ['books', 'reading', 'literature'],
    travel: ['travel', 'destination', 'adventure'],
    fashion: ['fashion', 'style', 'clothing'],
    brand: ['brand', 'quality', 'lifestyle']
  };
  
  const tags = baseTags[category] || ['recommendation'];
  
  // Add specific tags based on name
  if (name.includes('japanese') || name.includes('japan')) tags.push('japanese');
  if (name.includes('italian') || name.includes('italy')) tags.push('italian');
  if (name.includes('modern') || name.includes('contemporary')) tags.push('modern');
  if (name.includes('classic') || name.includes('traditional')) tags.push('classic');
  
  return tags.slice(0, 5); // Limit to 5 tags
}

function getPopularityStars() {
  // Generate popularity based on match score
  const match = props.recommendation.match;
  if (match >= 90) return 5;
  if (match >= 80) return 4;
  if (match >= 70) return 3;
  if (match >= 60) return 2;
  return 1;
}

function getSimilarRecommendations() {
  // Generate mock similar recommendations
  const category = props.recommendation.category?.toLowerCase();
  const similarNames = {
    music: ['Similar Artist 1', 'Related Album', 'Recommended Track'],
    food: ['Similar Restaurant', 'Related Cuisine', 'Recommended Dish'],
    book: ['Similar Author', 'Related Genre', 'Recommended Title'],
    travel: ['Similar Destination', 'Related Experience', 'Recommended Location'],
    fashion: ['Similar Style', 'Related Brand', 'Recommended Item'],
    brand: ['Similar Brand', 'Related Product', 'Recommended Service']
  };
  
  const names = similarNames[category] || ['Similar Item 1', 'Similar Item 2', 'Similar Item 3'];
  
  return names.map((name, index) => ({
    name,
    match: Math.floor(Math.random() * 20) + 70, // 70-90% match
    image: getFallbackImage(category)
  }));
}

function getAdditionalInfo() {
  const category = props.recommendation.category?.toLowerCase();
  
  const info = {
    music: 'This music recommendation is based on advanced audio analysis and user preference matching. It considers factors like tempo, genre, mood, and cultural context to provide the most relevant suggestions.',
    food: 'This culinary recommendation takes into account flavor profiles, dietary preferences, cultural background, and dining experiences to suggest restaurants and dishes you\'ll love.',
    book: 'This literary recommendation analyzes writing style, themes, genre preferences, and reading history to suggest books that match your intellectual and entertainment needs.',
    travel: 'This travel recommendation considers your adventure style, cultural interests, budget preferences, and past travel experiences to suggest destinations that will create memorable experiences.',
    fashion: 'This fashion recommendation analyzes your style preferences, lifestyle needs, color choices, and fashion trends to suggest items that complement your personal aesthetic.',
    brand: 'This brand recommendation evaluates your values, lifestyle, quality expectations, and brand affinity to suggest companies and products that align with your preferences.'
  };
  
  return info[category] || 'This recommendation is generated using advanced AI analysis of your taste profile and preferences.';
}

function saveRecommendation() {
  tasteStore.saveRecommendation(props.recommendation, props.recommendation.category?.toLowerCase());
  notification.success('Saved!', `${props.recommendation.name} has been saved to your profile.`);
  emit('save', props.recommendation);
}

function shareRecommendation() {
  const shareText = `Check out this ${props.recommendation.category} recommendation: ${props.recommendation.name} - ${props.recommendation.description}`;
  
  if (navigator.share) {
    navigator.share({
      title: `${props.recommendation.name} - TastePulse Recommendation`,
      text: shareText,
      url: window.location.href
    }).then(() => {
      notification.success('Shared!', 'Recommendation shared successfully.');
    }).catch(err => {
      if (err.name !== 'AbortError') {
        copyToClipboard(shareText);
      }
    });
  } else {
    copyToClipboard(shareText);
  }
  
  emit('share', props.recommendation);
}

function findSimilar() {
  notification.info('Finding Similar', `Looking for recommendations similar to ${props.recommendation.name}...`);
  emit('find-similar', props.recommendation);
  emit('close');
}

function searchByTag(tag) {
  notification.info('Searching', `Finding recommendations related to "${tag}"...`);
  emit('close');
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    notification.info('Copied!', 'Recommendation details copied to clipboard.');
  }).catch(err => {
    console.error('Failed to copy text: ', err);
    notification.error('Copy Failed', 'Could not copy to clipboard.');
  });
}
</script>

<style scoped>
.prose {
  max-width: none;
}

.prose p {
  margin-bottom: 1rem;
}
</style>