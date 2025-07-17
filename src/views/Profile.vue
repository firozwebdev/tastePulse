<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
        <div class="w-20 h-20 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <p class="mt-6 text-lg text-gray-700 dark:text-gray-300">Loading your profiles...</p>
      </div>
      
      <!-- No Profiles State -->
      <div v-else-if="!profiles.length" class="bg-white dark:bg-dark-card rounded-xl shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border p-8 text-center max-w-xl mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No Saved Profiles</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">You haven't saved any taste profiles yet. Create your first profile to see it here.</p>
        <router-link 
          to="/" 
          class="px-6 py-3 bg-gradient-taste text-white font-medium rounded-lg shadow-taste hover:shadow-taste-hover transition-all duration-300 inline-block"
        >
          Create a Profile
        </router-link>
      </div>
      
      <!-- Profiles List -->
      <div v-else>
        <h1 class="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-8">
          Your Taste Profiles
        </h1>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            v-for="(profile, index) in profiles" 
            :key="index"
            class="bg-white dark:bg-dark-card rounded-xl shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border overflow-hidden hover:shadow-taste transition-all duration-300"
          >
            <div class="p-6">
              <div class="flex justify-between items-start mb-4">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                  Profile #{{ index + 1 }}
                </h2>
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(profile.createdAt) }}
                </span>
              </div>
              
              <p class="text-gray-700 dark:text-gray-300 mb-4 italic">
                "{{ profile.tasteInput }}"
              </p>
              
              <div class="flex flex-wrap gap-2 mb-4">
                <span 
                  v-for="(value, category) in profile.parsedTaste" 
                  :key="category"
                  class="px-3 py-1 rounded-full text-sm font-medium"
                  :class="`bg-taste-${category}/20 text-taste-${category}`"
                >
                  {{ category }}: {{ value }}
                </span>
              </div>
              
              <div class="flex justify-between items-center mt-4">
                <button 
                  @click="viewProfile(profile)"
                  class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  View Details
                </button>
                
                <button 
                  @click="deleteProfile(profile.id)"
                  class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Similar Profiles Section -->
        <div class="mt-12">
          <h2 class="text-2xl font-display font-semibold text-gray-900 dark:text-white mb-6">
            People With Similar Tastes
          </h2>
          
          <div class="bg-white dark:bg-dark-card rounded-xl shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border p-6">
            <div v-if="similarProfiles.length" class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                v-for="(profile, index) in similarProfiles" 
                :key="index"
                class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
              >
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <div class="font-medium text-gray-900 dark:text-white">User {{ profile.userId.substring(0, 8) }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">{{ profile.location || 'Unknown location' }}</div>
                  </div>
                </div>
                
                <div class="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  <span class="font-medium">Top interests:</span> 
                  {{ profile.topInterests.join(', ') }}
                </div>
                
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  <span class="font-medium">Match:</span> 
                  <span class="text-primary-600 dark:text-primary-400">{{ profile.matchPercentage }}%</span>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-6">
              <p class="text-gray-600 dark:text-gray-400">No similar profiles found yet. As more people use TastePulse, we'll find matches for you!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTasteStore } from '../stores/taste';

const router = useRouter();
const tasteStore = useTasteStore();

const isLoading = ref(true);
const profiles = ref([]);
const similarProfiles = ref([]);

// Load profiles on component mount
onMounted(async () => {
  try {
    await loadProfiles();
    await loadSimilarProfiles();
  } catch (error) {
    console.error('Error loading profiles:', error);
  } finally {
    isLoading.value = false;
  }
});

// Function to load user profiles
async function loadProfiles() {
  profiles.value = await tasteStore.getUserProfiles();
}

// Function to load similar profiles
async function loadSimilarProfiles() {
  // This would be implemented with Supabase in a real app
  // For now, we'll use mock data
  similarProfiles.value = [
    {
      userId: '8f7d3e2a1b9c',
      location: 'Dhaka, Bangladesh',
      topInterests: ['Indie music', 'Bengali cuisine', 'Travel photography'],
      matchPercentage: 87
    },
    {
      userId: '5a4b3c2d1e',
      location: 'Tokyo, Japan',
      topInterests: ['Lo-fi beats', 'Ramen', 'Murakami novels'],
      matchPercentage: 82
    },
    {
      userId: '2c3d4e5f6g',
      location: 'Barcelona, Spain',
      topInterests: ['Jazz', 'Mediterranean food', 'Architecture'],
      matchPercentage: 75
    }
  ];
}

// Function to view a specific profile
function viewProfile(profile) {
  // Load the profile data into the store
  tasteStore.loadProfile(profile);
  // Navigate to the results page
  router.push('/results');
}

// Function to delete a profile
async function deleteProfile(profileId) {
  if (confirm('Are you sure you want to delete this profile?')) {
    try {
      await tasteStore.deleteProfile(profileId);
      // Refresh the profiles list
      await loadProfiles();
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  }
}

// Helper function to format dates
function formatDate(timestamp) {
  if (!timestamp) return 'Unknown date';
  
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}
</script>