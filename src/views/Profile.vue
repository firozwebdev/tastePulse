<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 animate-fade-in">
        <LoadingSpinner 
          size="xl" 
          text="Loading your profiles" 
          subtext="Retrieving your saved taste profiles and recommendations..."
        />
      </div>
      
      <!-- No Profiles State -->
      <div v-else-if="!profiles.length" class="bg-white dark:bg-dark-card rounded-xl shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border p-8 text-center max-w-xl mx-auto animate-scale-in">
        <div class="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="text-2xl font-display font-semibold text-gray-800 dark:text-gray-200 mb-3">No Saved Profiles</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-8">You haven't saved any taste profiles yet. Create your first profile to see it here.</p>
        <BaseButton
          @click="router.push('/')"
          size="lg"
        >
          <template #icon-left>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </template>
          Create a Profile
        </BaseButton>
      </div>
      
      <!-- Profiles List -->
      <div v-else class="animate-fade-in">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white animate-slide-in-left">
            Your Taste Profiles
          </h1>
          
          <BaseButton 
            @click="router.push('/')" 
            variant="secondary"
            class="animate-slide-in-right"
          >
            <template #icon-left>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </template>
            Create New Profile
          </BaseButton>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            v-for="(profile, index) in profiles" 
            :key="index"
            class="bg-white dark:bg-dark-card rounded-xl shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border overflow-hidden hover:shadow-taste transition-all duration-300 transform hover:-translate-y-1 animate-slide-in-bottom"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <div class="bg-gradient-to-r from-primary-600 to-primary-800 h-2"></div>
            <div class="p-6">
              <div class="flex justify-between items-start mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
                    {{ index + 1 }}
                  </div>
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                    Profile #{{ index + 1 }}
                  </h2>
                </div>
                <span class="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                  {{ formatDate(profile.createdAt) }}
                </span>
              </div>
              
              <p class="text-gray-700 dark:text-gray-300 mb-4 italic bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border-l-4 border-primary-500">
                "{{ profile.tasteInput }}"
              </p>
              
              <div class="flex flex-wrap gap-2 mb-4">
                <span 
                  v-for="(value, category) in profile.parsedTaste" 
                  :key="category"
                  class="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                  :class="`bg-taste-${category}/20 text-taste-${category}`"
                >
                  <span class="w-2 h-2 rounded-full" :class="`bg-taste-${category}`"></span>
                  {{ category }}: {{ value }}
                </span>
              </div>
              
              <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                <BaseButton 
                  @click="viewProfile(profile)"
                  variant="secondary"
                >
                  <template #icon-left>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </template>
                  View Details
                </BaseButton>
                
                <div class="flex gap-2">
                  <BaseButton 
                    @click="shareProfile(profile)"
                    variant="ghost"
                    size="sm"
                    class="p-2"
                    title="Share Profile"
                  >
                    <template #icon-left>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </template>
                  </BaseButton>
                  
                  <BaseButton 
                    @click="deleteProfile(profile.id)"
                    variant="danger"
                    size="sm"
                    class="p-2"
                    title="Delete Profile"
                  >
                    <template #icon-left>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </template>
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Similar Profiles Section -->
        <div class="mt-12 animate-slide-in-bottom delay-500">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-display font-semibold text-gray-900 dark:text-white">
              People With Similar Tastes
            </h2>
            
            <BaseButton
              variant="ghost"
              size="sm"
              class="text-primary-600 dark:text-primary-400"
            >
              <span>Find More</span>
              <template #icon-right>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </template>
            </BaseButton>
          </div>
          
          <div class="bg-white dark:bg-dark-card rounded-xl shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border p-6 overflow-hidden">
            <div v-if="similarProfiles.length" class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                v-for="(profile, index) in similarProfiles" 
                :key="index"
                class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:shadow-taste transition-all duration-300 transform hover:-translate-y-1 animate-slide-in-bottom"
                :style="{ animationDelay: `${(index + 5) * 100}ms` }"
              >
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-medium">
                    {{ profile.userId.substring(0, 2).toUpperCase() }}
                  </div>
                  <div>
                    <div class="font-medium text-gray-900 dark:text-white">User {{ profile.userId.substring(0, 8) }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {{ profile.location || 'Unknown location' }}
                    </div>
                  </div>
                </div>
                
                <div class="flex flex-wrap gap-1 mb-3">
                  <span 
                    v-for="(interest, i) in profile.topInterests" 
                    :key="i"
                    class="px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs rounded-md"
                  >
                    {{ interest }}
                  </span>
                </div>
                
                <div class="flex justify-between items-center mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    <span class="font-medium">Match:</span> 
                    <span class="text-primary-600 dark:text-primary-400">{{ profile.matchPercentage }}%</span>
                  </div>
                  
                  <BaseButton 
                    variant="ghost" 
                    size="sm"
                    class="px-2 py-1"
                  >
                    Connect
                  </BaseButton>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-12 animate-fade-in">
              <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No Similar Profiles Yet</h3>
              <p class="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                As more people use TastePulse, we'll find matches for you! Save more taste profiles to improve matching.
              </p>
              <BaseButton 
                variant="secondary"
                class="mt-6"
              >
                Find People
              </BaseButton>
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
import { useNotification } from '../composables/useNotification';
import BaseButton from '../components/BaseButton.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';

const router = useRouter();
const tasteStore = useTasteStore();
const notification = useNotification();

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
      notification.success('Profile Deleted', 'Your taste profile has been deleted successfully.');
    } catch (error) {
      console.error('Error deleting profile:', error);
      notification.error('Delete Failed', 'Could not delete your taste profile. Please try again.');
    }
  }
}

// Function to share a profile
function shareProfile(profile) {
  // Create a shareable URL
  const shareUrl = `${window.location.origin}/shared-profile?id=${profile.id}`;
  
  // Use Web Share API if available
  if (navigator.share) {
    navigator.share({
      title: 'My TastePulse Profile',
      text: `Check out my taste profile on TastePulse: ${profile.tasteInput.substring(0, 50)}${profile.tasteInput.length > 50 ? '...' : ''}`,
      url: shareUrl
    }).then(() => {
      notification.success('Shared Successfully', 'Your profile has been shared.');
    }).catch(err => {
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err);
        notification.warning('Share Failed', 'Falling back to clipboard copy.');
        copyToClipboard(shareUrl);
      }
    });
  } else {
    // Fallback to clipboard copy
    copyToClipboard(shareUrl);
    notification.info('Link Copied', 'Profile link copied to clipboard!');
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