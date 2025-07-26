<template>
  <!-- Feedback Button -->
  <div class="fixed bottom-4 right-4 z-40">
    <button
      v-if="!showFeedback"
      @click="showFeedback = true"
      class="bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
      aria-label="Give Feedback"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    </button>

    <!-- Feedback Panel -->
    <div
      v-if="showFeedback"
      class="bg-white dark:bg-dark-card rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-80 max-w-sm"
    >
      <!-- Header -->
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-center">
          <h3 class="font-semibold text-gray-900 dark:text-white">Quick Feedback</h3>
          <button
            @click="closeFeedback"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Help us improve TastePulse</p>
      </div>

      <!-- Content -->
      <div class="p-4 space-y-4">
        <!-- Rating -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            How would you rate your experience?
          </label>
          <div class="flex gap-1">
            <button
              v-for="star in 5"
              :key="star"
              @click="feedback.rating = star"
              class="text-2xl transition-colors"
              :class="star <= feedback.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'"
            >
              ★
            </button>
          </div>
        </div>

        <!-- Category -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            v-model="feedback.category"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          >
            <option value="general">General</option>
            <option value="ui_ux">UI/UX</option>
            <option value="performance">Performance</option>
            <option value="features">Features</option>
            <option value="bug">Bug Report</option>
            <option value="suggestion">Suggestion</option>
          </select>
        </div>

        <!-- Feedback Text -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your feedback (optional)
          </label>
          <textarea
            v-model="feedback.text"
            rows="3"
            placeholder="Tell us what you think..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm resize-none"
          ></textarea>
        </div>

        <!-- Anonymous Option -->
        <div class="flex items-center gap-2">
          <input
            id="anonymous"
            v-model="feedback.anonymous"
            type="checkbox"
            class="w-4 h-4 text-primary-600 border-gray-300 dark:border-gray-700 rounded focus:ring-primary-500"
          />
          <label for="anonymous" class="text-sm text-gray-600 dark:text-gray-400">
            Submit anonymously
          </label>
        </div>

        <!-- Submit Button -->
        <button
          @click="submitFeedback"
          :disabled="!feedback.rating || isSubmitting"
          class="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
        >
          <svg v-if="isSubmitting" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isSubmitting ? 'Sending...' : 'Send Feedback' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useTasteStore } from '../stores/taste';
import { useNotification } from '../composables/useNotification';
import { useAnalytics } from '../composables/useAnalytics';
import supabase from '../utils/supabase';

const tasteStore = useTasteStore();
const notification = useNotification();
const analytics = useAnalytics();

const showFeedback = ref(false);
const isSubmitting = ref(false);

const feedback = ref({
  rating: 0,
  category: 'general',
  text: '',
  anonymous: false
});

// Auto-show feedback after some time (optional)
onMounted(() => {
  // Show feedback widget after 2 minutes if user is engaged
  setTimeout(() => {
    if (!localStorage.getItem('feedback_shown') && tasteStore.isAuthenticated) {
      showFeedback.value = true;
      localStorage.setItem('feedback_shown', 'true');
    }
  }, 120000); // 2 minutes
});

async function submitFeedback() {
  if (!feedback.value.rating) {
    notification.error('Rating Required', 'Please provide a rating before submitting.');
    return;
  }

  isSubmitting.value = true;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const feedbackData = {
      user_id: feedback.value.anonymous ? null : user?.id,
      rating: feedback.value.rating,
      feedback_text: feedback.value.text || null,
      category: feedback.value.category,
      is_anonymous: feedback.value.anonymous,
      created_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('app_feedback')
      .insert([feedbackData]);

    if (error) throw error;

    // Track analytics
    analytics.trackEvent('feedback_submitted', {
      rating: feedback.value.rating,
      category: feedback.value.category,
      has_text: !!feedback.value.text,
      is_anonymous: feedback.value.anonymous
    });

    notification.success('Thank You!', 'Your feedback has been submitted successfully.');
    
    // Reset and close
    feedback.value = {
      rating: 0,
      category: 'general',
      text: '',
      anonymous: false
    };
    
    showFeedback.value = false;

  } catch (error) {
    console.error('Error submitting feedback:', error);
    notification.error('Submit Failed', 'Could not submit your feedback. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
}

function closeFeedback() {
  showFeedback.value = false;
  
  // Track that user closed feedback without submitting
  if (feedback.value.rating === 0) {
    analytics.trackEvent('feedback_dismissed', {
      had_rating: feedback.value.rating > 0,
      had_text: !!feedback.value.text
    });
  }
}
</script>