<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="py-12 md:py-20 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl md:text-6xl font-display font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent animate-fade-in">
          Discover Your Cultural Fingerprint
        </h1>
        <p class="mt-6 text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto animate-slide-up">
          TastePulse uses AI to analyze your preferences and recommend personalized cultural experiences across music, food, books, travel, and more.
        </p>
        
        <!-- Taste Input Form -->
        <div class="mt-12 bg-white dark:bg-dark-card rounded-xl shadow-card-light dark:shadow-card-dark p-6 md:p-8 max-w-2xl mx-auto border border-gray-100 dark:border-dark-border animate-fade-in">
          <h2 class="text-2xl font-display font-semibold mb-4 text-gray-800 dark:text-white">
            Tell us what you love
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Share your interests in natural language and our AI will analyze your taste profile
          </p>
          
          <form @submit.prevent="submitTaste" class="space-y-4">
            <div>
              <label for="taste-input" class="sr-only">Your taste preferences</label>
              <textarea
                id="taste-input"
                v-model="tasteInput"
                rows="4"
                placeholder="Example: I love lo-fi beats, Japanese ramen, Murakami novels, and exploring hidden cafes in Kyoto..."
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                :disabled="isLoading"
              ></textarea>
            </div>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="submit"
                class="px-6 py-3 bg-gradient-taste text-white font-medium rounded-lg shadow-taste hover:shadow-taste-hover transition-all duration-300 flex items-center justify-center"
                :disabled="isLoading || !tasteInput.trim()"
              >
                <span v-if="isLoading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </span>
                <span v-else>Discover My Taste</span>
              </button>
              
              <button
                type="button"
                @click="useSampleInput"
                class="px-6 py-3 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 font-medium rounded-lg hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors duration-300"
                :disabled="isLoading"
              >
                Try a Sample
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
    
    <!-- Features Section -->
    <section class="py-12 px-4 bg-gray-50 dark:bg-dark-bg">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-display font-bold text-center text-gray-900 dark:text-white mb-12">
          How TastePulse Works
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="bg-white dark:bg-dark-card rounded-xl p-6 shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border">
            <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Natural Language Input</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Simply tell us what you enjoy in your own words. Our AI understands your preferences in multiple languages including English, Bangla, and Spanish.
            </p>
          </div>
          
          <!-- Feature 2 -->
          <div class="bg-white dark:bg-dark-card rounded-xl p-6 shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border">
            <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Taste Categorization</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Our AI analyzes your input and categorizes your preferences across music, food, books, travel, fashion, and more.
            </p>
          </div>
          
          <!-- Feature 3 -->
          <div class="bg-white dark:bg-dark-card rounded-xl p-6 shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border">
            <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Personalized Recommendations</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Receive tailored recommendations based on your unique taste profile, powered by Qloo's cultural intelligence platform.
            </p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Categories Section -->
    <section class="py-12 px-4">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-display font-bold text-center text-gray-900 dark:text-white mb-4">
          Discover Across Categories
        </h2>
        <p class="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
          TastePulse helps you explore new experiences across multiple cultural domains
        </p>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <!-- Music -->
          <div class="bg-white dark:bg-dark-card rounded-xl p-4 text-center shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border hover:shadow-taste transition-shadow duration-300">
            <div class="w-12 h-12 bg-taste-music/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-taste-music" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Music</h3>
          </div>
          
          <!-- Food -->
          <div class="bg-white dark:bg-dark-card rounded-xl p-4 text-center shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border hover:shadow-taste transition-shadow duration-300">
            <div class="w-12 h-12 bg-taste-food/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-taste-food" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Food</h3>
          </div>
          
          <!-- Books -->
          <div class="bg-white dark:bg-dark-card rounded-xl p-4 text-center shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border hover:shadow-taste transition-shadow duration-300">
            <div class="w-12 h-12 bg-taste-book/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-taste-book" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Books</h3>
          </div>
          
          <!-- Travel -->
          <div class="bg-white dark:bg-dark-card rounded-xl p-4 text-center shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border hover:shadow-taste transition-shadow duration-300">
            <div class="w-12 h-12 bg-taste-travel/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-taste-travel" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Travel</h3>
          </div>
          
          <!-- Fashion -->
          <div class="bg-white dark:bg-dark-card rounded-xl p-4 text-center shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border hover:shadow-taste transition-shadow duration-300">
            <div class="w-12 h-12 bg-taste-fashion/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-taste-fashion" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Fashion</h3>
          </div>
          
          <!-- Brands -->
          <div class="bg-white dark:bg-dark-card rounded-xl p-4 text-center shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border hover:shadow-taste transition-shadow duration-300">
            <div class="w-12 h-12 bg-taste-brand/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-taste-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Brands</h3>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useTasteStore } from '../stores/taste';

const router = useRouter();
const tasteStore = useTasteStore();
const tasteInput = ref('');
const isLoading = ref(false);

// Sample inputs for users to try
const sampleInputs = [
  "I love lo-fi beats, Japanese ramen, Murakami novels, and exploring hidden cafes in Kyoto.",
  "আমি রবীন্দ্রসঙ্গীত, বাংলা কবিতা, ইলিশ মাছ এবং দার্জিলিং ভ্রমণ পছন্দ করি।",
  "I enjoy indie rock music, Mediterranean cuisine, science fiction books, and hiking in national parks.",
  "Me encanta la música flamenca, la paella, las novelas de Gabriel García Márquez y viajar por las playas de España."
];

// Function to use a random sample input
function useSampleInput() {
  const randomIndex = Math.floor(Math.random() * sampleInputs.length);
  tasteInput.value = sampleInputs[randomIndex];
}

// Function to submit the taste input
async function submitTaste() {
  if (!tasteInput.value.trim()) return;
  
  isLoading.value = true;
  
  try {
    // Call the store action to process the taste input
    await tasteStore.processTasteInput(tasteInput.value);
    
    // Navigate to the results page
    router.push('/results');
  } catch (error) {
    console.error('Error processing taste input:', error);
    // Handle error (could add error state here)
  } finally {
    isLoading.value = false;
  }
}
</script>