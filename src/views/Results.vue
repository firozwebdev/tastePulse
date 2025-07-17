<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
        <div class="w-20 h-20 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <p class="mt-6 text-lg text-gray-700 dark:text-gray-300">Analyzing your taste profile...</p>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center max-w-xl mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">Something went wrong</h2>
        <p class="text-red-600 dark:text-red-300 mb-4">{{ error }}</p>
        <button 
          @click="goBack" 
          class="px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
      
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
              <button 
                @click="saveTasteProfile" 
                class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center gap-2"
                :disabled="isSaving"
              >
                <svg v-if="isSaving" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                {{ isSaving ? 'Saving...' : 'Save Profile' }}
              </button>
              
              <button 
                @click="shareProfile" 
                class="px-4 py-2 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
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
        <div class="mb-8">
          <div class="flex overflow-x-auto space-x-2 pb-2">
            <button 
              v-for="(_, category) in recommendations" 
              :key="category"
              @click="activeCategory = category"
              class="px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-colors"
              :class="[
                activeCategory === category 
                  ? `bg-taste-${category} text-white` 
                  : `bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800`
              ]"
            >
              {{ category.charAt(0).toUpperCase() + category.slice(1) }}
            </button>
          </div>
        </div>
        
        <!-- Recommendations Grid -->
        <div v-if="activeCategory && recommendations[activeCategory]?.length" class="animate-fade-in">
          <h2 class="text-2xl font-display font-semibold text-gray-900 dark:text-white mb-6">
            {{ activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1) }} Recommendations
          </h2>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="(item, index) in recommendations[activeCategory]" 
              :key="index"
              class="bg-white dark:bg-dark-card rounded-xl overflow-hidden shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border hover:shadow-taste transition-all duration-300"
            >
              <div class="h-48 bg-gray-200 dark:bg-gray-700 relative">
                <img 
                  :src="item.image || `https://source.unsplash.com/random/400x300?${activeCategory},${item.name}`" 
                  :alt="item.name"
                  class="w-full h-full object-cover"
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
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ item.category }}</span>
                  <button 
                    class="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium"
                    @click="saveRecommendation(item)"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else-if="activeCategory" class="text-center py-12">
          <p class="text-gray-600 dark:text-gray-400">No recommendations found for this category.</p>
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

const router = useRouter();
const tasteStore = useTasteStore();

const isLoading = ref(false);
const error = ref(null);
const isSaving = ref(false);
const activeCategory = ref('');

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

// Function to save the taste profile
async function saveTasteProfile() {
  isSaving.value = true;
  
  try {
    await tasteStore.saveTasteProfile();
    // Show success notification or feedback
  } catch (err) {
    error.value = 'Failed to save your taste profile. Please try again.';
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
    });
  } else {
    // Fallback for browsers that don't support Web Share API
    // Could copy a link to clipboard
    const dummyInput = document.createElement('input');
    document.body.appendChild(dummyInput);
    dummyInput.value = window.location.href;
    dummyInput.select();
    document.execCommand('copy');
    document.body.removeChild(dummyInput);
    
    alert('Link copied to clipboard!');
  }
}

// Function to save a specific recommendation
function saveRecommendation(item) {
  tasteStore.saveRecommendation(item);
  // Show success notification
}
</script>