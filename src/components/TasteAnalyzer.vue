<template>
  <div class="bg-white dark:bg-dark-card rounded-xl shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border p-6 md:p-8">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="w-16 h-16 bg-gradient-taste rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 animate-pulse-glow">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <h2 class="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">
        AI Taste Analyzer
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        Share your preferences and get personalized cultural recommendations
      </p>
    </div>

    <!-- Input Methods Toggle -->
    <div class="flex justify-center mb-6">
      <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex">
        <button
          @click="inputMode = 'text'"
          :class="[
            'px-4 py-2 rounded-md text-sm font-medium transition-all',
            inputMode === 'text' 
              ? 'bg-white dark:bg-dark-card text-primary-600 dark:text-primary-400 shadow-sm' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          ]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Free Text
        </button>
        <button
          @click="inputMode = 'guided'"
          :class="[
            'px-4 py-2 rounded-md text-sm font-medium transition-all',
            inputMode === 'guided' 
              ? 'bg-white dark:bg-dark-card text-primary-600 dark:text-primary-400 shadow-sm' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          ]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Guided
        </button>
        <button
          @click="inputMode = 'voice'"
          :class="[
            'px-4 py-2 rounded-md text-sm font-medium transition-all',
            inputMode === 'voice' 
              ? 'bg-white dark:bg-dark-card text-primary-600 dark:text-primary-400 shadow-sm' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          ]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          Voice
        </button>
      </div>
    </div>

    <!-- Free Text Input -->
    <div v-if="inputMode === 'text'" class="space-y-4">
      <div class="relative">
        <BaseTextarea
          v-model="textInput"
          :placeholder="currentPlaceholder"
          rows="4"
          class="w-full"
          :disabled="isProcessing"
          @input="handleTextInput"
        />
        
        <!-- Smart Suggestions -->
        <div v-if="smartSuggestions.length > 0" class="absolute z-10 w-full bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg shadow-lg mt-1">
          <div class="p-2 border-b border-gray-100 dark:border-gray-700">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Smart Suggestions</span>
          </div>
          <div class="max-h-40 overflow-y-auto">
            <button
              v-for="suggestion in smartSuggestions"
              :key="suggestion.text"
              @click="applySuggestion(suggestion)"
              class="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
            >
              <span class="text-xs px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                {{ suggestion.category }}
              </span>
              <span class="text-sm">{{ suggestion.text }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Add Chips -->
      <div class="space-y-3">
        <div class="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Add:</div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div v-for="category in quickAddCategories" :key="category.name" class="space-y-2">
            <div class="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <span>{{ category.icon }}</span>
              {{ category.name }}
            </div>
            <div class="flex flex-wrap gap-1">
              <button
                v-for="item in category.items"
                :key="item"
                @click="addQuickItem(item)"
                class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-md transition-colors"
              >
                {{ item }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Guided Input -->
    <div v-else-if="inputMode === 'guided'" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="category in guidedCategories" :key="category.name" class="space-y-3">
          <div class="flex items-center gap-2">
            <span class="text-lg">{{ category.icon }}</span>
            <h3 class="font-semibold text-gray-900 dark:text-white">{{ category.name }}</h3>
          </div>
          <div class="space-y-2">
            <BaseInput
              v-model="guidedInput[category.key]"
              :placeholder="category.placeholder"
              class="w-full"
            />
            <div class="flex flex-wrap gap-1">
              <button
                v-for="option in category.options"
                :key="option"
                @click="guidedInput[category.key] = option"
                class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-md transition-colors"
              >
                {{ option }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Voice Input -->
    <div v-else-if="inputMode === 'voice'" class="text-center space-y-6">
      <div class="relative">
        <button
          @click="toggleVoiceRecording"
          :class="[
            'w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto transition-all transform',
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse scale-110' 
              : 'bg-primary-600 hover:bg-primary-700 hover:scale-105'
          ]"
          :disabled="!isVoiceSupported"
        >
          <svg v-if="!isRecording" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
        </button>
        
        <!-- Recording Animation -->
        <div v-if="isRecording" class="absolute inset-0 rounded-full border-4 border-red-500 animate-ping"></div>
      </div>
      
      <div>
        <p class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {{ isRecording ? 'Listening...' : 'Tap to speak' }}
        </p>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ isRecording ? 'Tell us about your favorite music, food, books, or places' : 'Share your preferences using your voice' }}
        </p>
      </div>

      <!-- Voice Transcript -->
      <div v-if="voiceTranscript" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
        <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Transcript:</div>
        <div class="text-gray-900 dark:text-white">{{ voiceTranscript }}</div>
      </div>

      <!-- Voice Not Supported -->
      <div v-if="!isVoiceSupported" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div class="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span class="text-sm font-medium">Voice input not supported in this browser</span>
        </div>
      </div>
    </div>

    <!-- Analysis Progress -->
    <div v-if="isProcessing" class="mt-6 space-y-4">
      <div class="flex items-center justify-center gap-3">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ processingStage }}</span>
      </div>
      
      <!-- Progress Bar -->
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          class="bg-gradient-to-r from-primary-600 to-primary-800 h-2 rounded-full transition-all duration-500"
          :style="{ width: `${processingProgress}%` }"
        ></div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="mt-8 flex flex-col sm:flex-row gap-3">
      <BaseButton
        @click="analyzePreferences"
        :disabled="!canAnalyze || isProcessing"
        class="flex-1"
        size="lg"
      >
        <template #icon-left>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </template>
        {{ isProcessing ? processingStage : 'Analyze My Taste' }}
      </BaseButton>
      
      <BaseButton
        @click="clearInput"
        variant="secondary"
        :disabled="isProcessing"
      >
        <template #icon-left>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </template>
        Clear
      </BaseButton>
    </div>

    <!-- Input Tips -->
    <div class="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <div class="flex items-start gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div class="text-sm text-blue-800 dark:text-blue-200">
          <div class="font-medium mb-1">Tips for better recommendations:</div>
          <ul class="space-y-1 text-xs">
            <li>• Be specific about what you like (e.g., "Japanese lo-fi hip-hop" vs "music")</li>
            <li>• Mention your mood or context (e.g., "relaxing music for studying")</li>
            <li>• Include multiple categories (music, food, books, travel)</li>
            <li>• Share your cultural background or interests</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useTasteStore } from '../stores/taste';
import { useNotification } from '../composables/useNotification';
import BaseTextarea from './BaseTextarea.vue';
import BaseInput from './BaseInput.vue';
import BaseButton from './BaseButton.vue';

const tasteStore = useTasteStore();
const notification = useNotification();

// Input modes
const inputMode = ref('text');
const textInput = ref('');
const guidedInput = ref({});
const voiceTranscript = ref('');

// Voice recognition
const isVoiceSupported = ref(false);
const isRecording = ref(false);
const recognition = ref(null);

// Processing state
const isProcessing = ref(false);
const processingStage = ref('Ready to analyze');
const processingProgress = ref(0);

// Smart suggestions
const smartSuggestions = ref([]);

// Placeholders that rotate
const placeholders = [
  "I love lo-fi hip-hop while studying, enjoy Japanese ramen and Korean BBQ, read sci-fi novels like Dune, and dream of visiting Kyoto's temples...",
  "My taste includes indie folk music, Mediterranean cuisine, mystery novels, and European countryside travel...",
  "I'm into K-pop, spicy Korean food, manhwa comics, and want to explore Seoul's nightlife...",
  "Jazz music relaxes me, I love Italian pasta, enjoy classic literature, and prefer mountain retreats...",
  "Electronic music energizes me, I'm vegan, love graphic novels, and enjoy urban exploration..."
];

const currentPlaceholder = ref(placeholders[0]);
let placeholderInterval = null;

// Quick add categories
const quickAddCategories = [
  {
    name: 'Music',
    icon: '🎵',
    items: ['Jazz', 'Lo-fi', 'K-pop', 'Rock', 'Classical', 'Hip-hop', 'Indie', 'Electronic']
  },
  {
    name: 'Food',
    icon: '🍜',
    items: ['Japanese', 'Italian', 'Korean', 'Mexican', 'Indian', 'Thai', 'Mediterranean', 'Vegan']
  },
  {
    name: 'Books',
    icon: '📚',
    items: ['Sci-fi', 'Fantasy', 'Mystery', 'Romance', 'Biography', 'Poetry', 'Philosophy', 'History']
  },
  {
    name: 'Travel',
    icon: '✈️',
    items: ['Japan', 'Europe', 'Mountains', 'Beaches', 'Cities', 'Nature', 'Adventure', 'Culture']
  }
];

// Guided categories
const guidedCategories = [
  {
    name: 'Music',
    icon: '🎵',
    key: 'music',
    placeholder: 'What music do you love?',
    options: ['Jazz', 'Pop', 'Rock', 'Classical', 'Hip-hop', 'Electronic', 'Folk', 'R&B']
  },
  {
    name: 'Food',
    icon: '🍜',
    key: 'food',
    placeholder: 'Favorite cuisines or dishes?',
    options: ['Japanese', 'Italian', 'Mexican', 'Indian', 'Thai', 'French', 'Korean', 'Mediterranean']
  },
  {
    name: 'Books',
    icon: '📚',
    key: 'books',
    placeholder: 'What do you like to read?',
    options: ['Fiction', 'Non-fiction', 'Sci-fi', 'Fantasy', 'Mystery', 'Biography', 'Poetry', 'History']
  },
  {
    name: 'Travel',
    icon: '✈️',
    key: 'travel',
    placeholder: 'Dream destinations?',
    options: ['Japan', 'Europe', 'Asia', 'Americas', 'Beach', 'Mountains', 'Cities', 'Nature']
  }
];

// Computed
const canAnalyze = computed(() => {
  if (inputMode.value === 'text') {
    return textInput.value.trim().length > 10;
  } else if (inputMode.value === 'guided') {
    return Object.values(guidedInput.value).some(val => val && val.trim().length > 0);
  } else if (inputMode.value === 'voice') {
    return voiceTranscript.value.trim().length > 10;
  }
  return false;
});

// Methods
function handleTextInput() {
  // Generate smart suggestions based on input
  generateSmartSuggestions();
}

function generateSmartSuggestions() {
  const input = textInput.value.toLowerCase();
  const suggestions = [];
  
  // Music suggestions
  if (input.includes('music') || input.includes('song') || input.includes('listen')) {
    suggestions.push(
      { category: 'Music', text: 'lo-fi hip-hop for studying' },
      { category: 'Music', text: 'jazz for relaxation' },
      { category: 'Music', text: 'indie pop for daily listening' }
    );
  }
  
  // Food suggestions
  if (input.includes('food') || input.includes('eat') || input.includes('cuisine')) {
    suggestions.push(
      { category: 'Food', text: 'authentic Japanese ramen' },
      { category: 'Food', text: 'spicy Korean BBQ' },
      { category: 'Food', text: 'fresh Mediterranean salads' }
    );
  }
  
  smartSuggestions.value = suggestions.slice(0, 5);
}

function applySuggestion(suggestion) {
  textInput.value += (textInput.value ? ', ' : '') + suggestion.text;
  smartSuggestions.value = [];
}

function addQuickItem(item) {
  textInput.value += (textInput.value ? ', ' : '') + item;
}

async function analyzePreferences() {
  isProcessing.value = true;
  processingProgress.value = 0;
  
  try {
    // Prepare input based on mode
    let input = '';
    if (inputMode.value === 'text') {
      input = textInput.value;
    } else if (inputMode.value === 'guided') {
      input = Object.entries(guidedInput.value)
        .filter(([_, value]) => value && value.trim())
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
    } else if (inputMode.value === 'voice') {
      input = voiceTranscript.value;
    }
    
    // Simulate processing stages
    processingStage.value = 'Analyzing your preferences...';
    processingProgress.value = 25;
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    processingStage.value = 'Parsing with AI...';
    processingProgress.value = 50;
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    processingStage.value = 'Getting recommendations...';
    processingProgress.value = 75;
    
    // Process with taste store
    await tasteStore.processInput(input);
    
    processingStage.value = 'Complete!';
    processingProgress.value = 100;
    
    notification.success('Analysis Complete!', 'Your taste profile has been analyzed successfully.');
    
    // Emit success event
    emit('analysis-complete');
    
  } catch (error) {
    console.error('Analysis error:', error);
    notification.error('Analysis Failed', 'Could not analyze your preferences. Please try again.');
  } finally {
    isProcessing.value = false;
    processingStage.value = 'Ready to analyze';
    processingProgress.value = 0;
  }
}

function clearInput() {
  textInput.value = '';
  guidedInput.value = {};
  voiceTranscript.value = '';
  smartSuggestions.value = [];
}

// Voice recognition methods
function initVoiceRecognition() {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    isVoiceSupported.value = true;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition.value = new SpeechRecognition();
    
    recognition.value.continuous = true;
    recognition.value.interimResults = true;
    recognition.value.lang = 'en-US';
    
    recognition.value.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      voiceTranscript.value = transcript;
    };
    
    recognition.value.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      notification.error('Voice Recognition Error', 'Could not process your voice input.');
      isRecording.value = false;
    };
    
    recognition.value.onend = () => {
      isRecording.value = false;
    };
  }
}

function toggleVoiceRecording() {
  if (!isVoiceSupported.value || !recognition.value) return;
  
  if (isRecording.value) {
    recognition.value.stop();
    isRecording.value = false;
  } else {
    recognition.value.start();
    isRecording.value = true;
    voiceTranscript.value = '';
  }
}

// Placeholder rotation
function startPlaceholderRotation() {
  let index = 0;
  placeholderInterval = setInterval(() => {
    index = (index + 1) % placeholders.length;
    currentPlaceholder.value = placeholders[index];
  }, 3000);
}

function stopPlaceholderRotation() {
  if (placeholderInterval) {
    clearInterval(placeholderInterval);
    placeholderInterval = null;
  }
}

// Lifecycle
onMounted(() => {
  initVoiceRecognition();
  startPlaceholderRotation();
});

// Watch for input mode changes
watch(inputMode, () => {
  smartSuggestions.value = [];
});

// Emit events
const emit = defineEmits(['analysis-complete']);
</script>