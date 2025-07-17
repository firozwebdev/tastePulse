<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 animate-fade-in">
        <LoadingSpinner 
          size="xl" 
          text="Analyzing your taste profile" 
          subtext="Our AI is processing your preferences and finding personalized recommendations..."
        />
      </div>
      
      <!-- Error State -->
      <ErrorState 
        v-else-if="error"
        title="Something went wrong"
        :message="error"
        retryText="Try Again"
        backText="Go Home"
        @retry="goBack"
        @back="router.push('/')"
      />
      
      <!-- Results Content -->
      <div v-else class="animate-fade-in">
        <!-- Taste Profile Summary -->
        <div class="bg-white dark:bg-dark-card rounded-xl shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border p-6 md:p-8 mb-8">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 class="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white">
                Your Taste Profile
              </h1>
              <p class="mt-2 text-gray-600 dark:text-gray-400">
                Based on your input: <span class="italic">{{ tasteInput }}</span>
              </p>
            </div>
            
            <div class="flex gap-3">
              <BaseButton 
                @click="saveTasteProfile" 
                variant="secondary"
                :loading="isSaving"
                :disabled="isSaving"
              >
                <template #icon-left v-if="!isSaving">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                </template>
                {{ isSaving ? 'Saving...' : 'Save Profile' }}
              </BaseButton>
              
              <BaseButton 
                @click="shareProfile" 
                variant="outline"
              >
                <template #icon-left>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </template>
                Share
              </BaseButton>
            </div>
          </div>
          
          <!-- Taste DNA Visualization -->
          <div class="mt-8 flex flex-col md:flex-row gap-8">
            <div class="w-full md:w-1/3">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Your Taste DNA</h3>
              <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 h-64 flex items-center justify-center">
                <!-- Chart will be rendered here -->
                <TasteDnaChart :taste-categories="parsedTaste" />
              </div>
            </div>
            
            <div class="w-full md:w-2/3">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Extracted Taste Categories</h3>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div 
                  v-for="(value, category) in parsedTaste" 
                  :key="category"
                  class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 flex items-center gap-3"
                >
                  <div 
                    class="w-10 h-10 rounded-full flex items-center justify-center"
                    :class="`bg-taste-${category}/20`"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="`text-taste-${category}`" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div class="font-medium text-gray-900 dark:text-white capitalize">{{ category }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">{{ value }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Recommendations Tabs -->
        <div class="mb-8 animate-slide-in-bottom delay-300">
          <div class="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
            <button 
              v-for="(_, category) in recommendations" 
              :key="category"
              @click="activeCategory = category"
              class="px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2"
              :class="[
                activeCategory === category 
                  ? `bg-taste-${category} text-white shadow-lg` 
                  : `bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700`
              ]"
            >
              <span class="w-3 h-3 rounded-full" :class="`bg-taste-${category}/80`"></span>
              {{ category.charAt(0).toUpperCase() + category.slice(1) }}
            </button>
          </div>
        </div>
        
        <!-- Recommendations Grid -->
        <div v-if="activeCategory && recommendations[activeCategory]?.length" class="animate-fade-in">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-display font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span class="w-4 h-4 rounded-full" :class="`bg-taste-${activeCategory}`"></span>
              {{ activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1) }} Recommendations
            </h2>
            
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">View:</span>
              <button 
                @click="viewMode = 'grid'"
                class="p-2 rounded-md transition-colors"
                :class="viewMode === 'grid' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button 
                @click="viewMode = 'list'"
                class="p-2 rounded-md transition-colors"
                :class="viewMode === 'list' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Grid View -->
          <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="(item, index) in recommendations[activeCategory]" 
              :key="index"
              class="bg-white dark:bg-dark-card rounded-xl overflow-hidden shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border hover:shadow-taste transition-all duration-300 transform hover:-translate-y-1 animate-slide-in-bottom"
              :style="{ animationDelay: `${index * 100}ms` }"
            >
              <div class="h-48 bg-gray-200 dark:bg-gray-700 relative">
                <img 
                  :src="item.image || `https://source.unsplash.com/random/400x300?${activeCategory},${item.name}`" 
                  :alt="item.name"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div class="absolute bottom-0 left-0 p-4">
                  <span 
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="`bg-taste-${activeCategory}/90 text-white`"
                  >
                    {{ item.match }}% Match
                  </span>
                </div>
              </div>
              
              <div class="p-4">
                <h3 class="font-semibold text-lg text-gray-900 dark:text-white">{{ item.name }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ item.description }}</p>
                
                <div class="mt-4 flex justify-between items-center">
                  <span class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">{{ item.category }}</span>
                  <div class="flex gap-2">
                    <button 
                      class="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium flex items-center gap-1"
                      @click="saveRecommendation(item)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      Save
                    </button>
                    <button 
                      class="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium flex items-center gap-1"
                      @click="shareRecommendation(item)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- List View -->
          <div v-else class="space-y-4">
            <div 
              v-for="(item, index) in recommendations[activeCategory]" 
              :key="index"
              class="bg-white dark:bg-dark-card rounded-xl overflow-hidden shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border hover:shadow-taste transition-all duration-300 flex animate-slide-in-bottom"
              :style="{ animationDelay: `${index * 100}ms` }"
            >
              <div class="w-24 sm:w-40 bg-gray-200 dark:bg-gray-700 relative">
                <img 
                  :src="item.image || `https://source.unsplash.com/random/400x300?${activeCategory},${item.name}`" 
                  :alt="item.name"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                <div class="absolute bottom-0 left-0 p-2">
                  <span 
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="`bg-taste-${activeCategory}/90 text-white`"
                  >
                    {{ item.match }}%
                  </span>
                </div>
              </div>
              
              <div class="p-4 flex-1">
                <div class="flex justify-between items-start">
                  <h3 class="font-semibold text-lg text-gray-900 dark:text-white">{{ item.name }}</h3>
                  <span class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">{{ item.category }}</span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ item.description }}</p>
                
                <div class="mt-4 flex justify-end gap-3">
                  <button 
                    class="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium flex items-center gap-1"
                    @click="saveRecommendation(item)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Save
                  </button>
                  <button 
                    class="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium flex items-center gap-1"
                    @click="shareRecommendation(item)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else-if="activeCategory" class="text-center py-12 animate-fade-in">
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No Recommendations Found</h3>
          <p class="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            We couldn't find any recommendations for this category. Try exploring other categories or updating your taste profile.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTasteStore } from '../stores/taste';
import TasteDnaChart from '../components/TasteDnaChart.vue';
import BaseButton from '../components/BaseButton.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import ErrorState from '../components/ErrorState.vue';

const router = useRouter();
const tasteStore = useTasteStore();

const isLoading = ref(false);
const error = ref(null);
const isSaving = ref(false);
const activeCategory = ref('');
const viewMode = ref('grid'); // 'grid' or 'list' view mode

// Get data from the store
const tasteInput = computed(() => tasteStore.tasteInput);
const parsedTaste = computed(() => tasteStore.parsedTaste);
const recommendations = computed(() => tasteStore.recommendations);

// Set the active category to the first available one
onMounted(() => {
  // If there's no taste input, redirect to home
  if (!tasteInput.value) {
    router.push('/');
    return;
  }
  
  // Set the first category as active
  if (Object.keys(recommendations.value).length > 0) {
    activeCategory.value = Object.keys(recommendations.value)[0];
  }
});

// Function to go back to the home page
function goBack() {
  router.push('/');
}

import { useNotification } from '../composables/useNotification';

const notification = useNotification();

// Function to save the taste profile
async function saveTasteProfile() {
  isSaving.value = true;
  
  try {
    await tasteStore.saveTasteProfile();
    notification.success('Profile Saved', 'Your taste profile has been saved successfully.');
  } catch (err) {
    error.value = 'Failed to save your taste profile. Please try again.';
    notification.error('Save Failed', 'Could not save your taste profile. Please try again.');
  } finally {
    isSaving.value = false;
  }
}

// Function to share the profile
function shareProfile() {
  // Implement sharing functionality
  // Could use Web Share API or generate a shareable link
  if (navigator.share) {
    navigator.share({
      title: 'My TastePulse Profile',
      text: `Check out my taste profile on TastePulse: ${tasteInput.value}`,
      url: window.location.href
    }).then(() => {
      notification.success('Shared Successfully', 'Your profile has been shared.');
    }).catch(err => {
      if (err.name !== 'AbortError') {
        notification.error('Share Failed', 'Could not share your profile.');
        console.error('Error sharing:', err);
      }
    });
  } else {
    // Fallback for browsers that don't support Web Share API
    // Copy a link to clipboard
    const dummyInput = document.createElement('input');
    document.body.appendChild(dummyInput);
    dummyInput.value = window.location.href;
    dummyInput.select();
    document.execCommand('copy');
    document.body.removeChild(dummyInput);
    
    notification.info('Link Copied', 'Profile link copied to clipboard!');
  }
}

// Function to save a specific recommendation
function saveRecommendation(item) {
  tasteStore.saveRecommendation(item);
  notification.success('Recommendation Saved', `"${item.name}" has been saved to your collection.`);
}

// Function to share a specific recommendation
function shareRecommendation(item) {
  const shareText = `Check out this ${activeCategory.value} recommendation from TastePulse: ${item.name} - ${item.description}`;
  const shareUrl = window.location.href;
  
  if (navigator.share) {
    navigator.share({
      title: `TastePulse ${activeCategory.value.charAt(0).toUpperCase() + activeCategory.value.slice(1)} Recommendation`,
      text: shareText,
      url: shareUrl
    }).then(() => {
      notification.success('Shared Successfully', 'Your recommendation has been shared.');
    }).catch(err => {
      if (err.name !== 'AbortError') {
        notification.error('Share Failed', 'Could not share this recommendation.');
        console.error('Error sharing:', err);
        // Fallback to clipboard if sharing fails
        copyToClipboard(shareText + ' ' + shareUrl);
      }
    });
  } else {
    // Fallback to clipboard copy
    copyToClipboard(shareText + ' ' + shareUrl);
    notification.info('Link Copied', 'Recommendation copied to clipboard!');
  }
}

// Helper function to copy text to clipboard
function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}
</script>