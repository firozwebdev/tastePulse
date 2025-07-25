<template>
  <div>
    <!-- Input Mode Toggle -->
    <div class="flex justify-end items-center mb-4">
      <span class="text-sm text-gray-600 dark:text-gray-400 mr-2">Free Text</span>
      <button 
        @click="toggleInputMode" 
        class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        :class="isStructured ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'"
      >
        <span 
          class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
          :class="isStructured ? 'translate-x-6' : 'translate-x-1'"
        />
      </button>
      <span class="text-sm text-gray-600 dark:text-gray-400 ml-2">Structured</span>
    </div>

    <!-- Free Text Input -->
    <div v-if="!isStructured" class="space-y-4">
      <BaseTextarea
        v-model="tasteInput"
        id="taste-input"
        :placeholder="placeholder"
        :disabled="isLoading"
        :rows="4"
        :maxLength="500"
        :autoResize="true"
        @focus="$emit('focus')"
        @blur="$emit('blur')"
      />

      <!-- Quick Suggestions -->
      <div v-if="showSuggestions" class="bg-white dark:bg-dark-card rounded-xl shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border p-4 mt-4 mb-2">
        <div class="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-3 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Quick Suggestions
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div v-for="group in suggestionChipGroups" :key="group.label">
            <div class="flex items-center gap-2 mb-2 text-xs font-bold text-gray-700 dark:text-gray-200">
              <span v-if="group.label === 'Music'">🎵</span>
              <span v-else-if="group.label === 'Food'">🍣</span>
              <span v-else-if="group.label === 'Books'">📚</span>
              <span v-else-if="group.label === 'Travel'">✈️</span>
              <span v-else-if="group.label === 'Lifestyle'">🌟</span>
              {{ group.label }}
            </div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="chip in group.chips"
                :key="chip"
                @click.prevent="addChip(chip)"
                class="px-3 py-1 rounded-full bg-gradient-to-r from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 text-primary-700 dark:text-primary-300 text-xs font-medium hover:scale-105 hover:bg-primary-200 dark:hover:bg-primary-700 transition shadow"
                type="button"
              >
                {{ chip }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Input tip -->
      <div class="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Tell us about your favorite music, foods, books, or places! The more details you share, the more personalized your recommendations will be.
      </div>
      
      <!-- Emoji Picker -->
      <div class="flex flex-wrap gap-1 mt-2">
        <button
          v-for="emoji in emojiList"
          :key="emoji"
          @click.prevent="addEmoji(emoji)"
          class="text-xl px-2 py-1 rounded hover:bg-primary-100 dark:hover:bg-primary-900/30 transition"
          type="button"
          aria-label="Add emoji"
        >
          {{ emoji }}
        </button>
      </div>
      
      <!-- Validation Messages -->
      <div v-if="inputWarning" class="text-xs text-red-500 dark:text-red-400 mt-2">{{ inputWarning }}</div>
      <div v-if="detectedCategories.length" class="text-xs text-primary-600 dark:text-primary-400 mt-2 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        Detected: <span v-for="cat in detectedCategories" :key="cat" class="font-semibold mx-1">{{ cat }}</span>
      </div>
    </div>

    <!-- Structured Input -->
    <StructuredTasteInput 
      v-else 
      v-model="isStructured" 
      @submit="handleStructuredSubmit"
    />

    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center mt-6" v-if="!isStructured">
      <BaseButton
        type="submit"
        :disabled="isLoading || !tasteInput.trim() || tasteInput.trim().length < minInputLength"
        :loading="isLoading"
        size="lg"
        @click="submitTaste"
      >
        <template #icon-left v-if="!isLoading">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </template>
        {{ isLoading ? 'Analyzing...' : 'Discover My Taste' }}
      </BaseButton>
      
      <BaseButton
        type="button"
        variant="outline"
        :disabled="isLoading"
        size="lg"
        @click="useSampleInput"
      >
        <template #icon-left>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </template>
        Try a Sample
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useTasteStore } from '../stores/taste';
import { detectLanguage } from '../utils/helpers';
import BaseButton from './BaseButton.vue';
import BaseTextarea from './BaseTextarea.vue';
import StructuredTasteInput from './StructuredTasteInput.vue';

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Tell us what you like in music, food, books, and travel...'
  },
  showSuggestions: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['submit', 'focus', 'blur']);

const tasteStore = useTasteStore();
const isLoading = ref(false);
let exampleInterval = null;

// Sample inputs for users to try
const sampleInputs = [
  "I love lo-fi beats, Japanese ramen, Murakami novels, and exploring hidden cafes in Kyoto.",
  "আমি রবীন্দ্রসঙ্গীত, বাংলা কবিতা, ইলিশ মাছ এবং দার্জিলিং ভ্রমণ পছন্দ করি।",
  "I enjoy indie rock music, Mediterranean cuisine, science fiction books, and hiking in national parks.",
  "Me encanta la música flamenca, la paella, las novelas de Gabriel García Márquez y viajar por las playas de España."
];

// Suggestion chips
const suggestionChipGroups = [
  {
    label: 'Music',
    chips: ["Jazz music", "K-Pop", "J-Pop", "Classical", "Bollywood", "Samba"]
  },
  {
    label: 'Food',
    chips: ["Sushi", "Tacos", "Biryani", "Kimchi", "Croissant", "Burger"]
  },
  {
    label: 'Books',
    chips: ["Murakami novels", "Jane Austen novels", "Sci-fi books", "Fantasy books", "Paulo Coelho novels"]
  },
  {
    label: 'Travel',
    chips: ["Kyoto", "Paris", "Rio de Janeiro", "Cairo", "Sydney", "New York City"]
  },
  {
    label: 'Lifestyle',
    chips: ["Vegan", "Hiking", "Tech enthusiast", "History buff", "Parent"]
  }
];

// Emoji list for quick insertion
const emojiList = [
  "🎵", "🍣", "📚", "✈️", "🎤", "🍔", "🎸", "🍕", "🏖️", "🏞️", "🎬", "🎨", "🥗", "🧳", "🏛️", "🎧", "🍜", "🗼", "🕌", "🏯", "🌎"
];

// Validation
const minInputLength = 10;
const inputWarning = ref('');
const detectedCategories = ref([]);

// Computed properties from the taste store
const tasteInput = computed({
  get: () => tasteStore.tasteInput,
  set: (value) => tasteStore.tasteInput = value
});

const isStructured = computed({
  get: () => tasteStore.inputMode === 'structured',
  set: (value) => tasteStore.setInputMode(value ? 'structured' : 'freetext')
});

// Toggle between structured and free text input
function toggleInputMode() {
  tasteStore.setInputMode(isStructured.value ? 'freetext' : 'structured');
}

// Add a suggestion chip to the input
function addChip(chip) {
  if (!tasteInput.value.includes(chip)) {
    tasteInput.value = tasteInput.value.trim() + (tasteInput.value ? ', ' : '') + chip;
  }
}

// Add an emoji to the input
function addEmoji(emoji) {
  // Insert emoji at cursor position or at the end
  const input = document.getElementById('taste-input');
  if (input && typeof input.selectionStart === 'number') {
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const before = tasteInput.value.slice(0, start);
    const after = tasteInput.value.slice(end);
    tasteInput.value = before + emoji + after;
    // Move cursor after inserted emoji
    setTimeout(() => {
      input.selectionStart = input.selectionEnd = start + emoji.length;
      input.focus();
    }, 0);
  } else {
    tasteInput.value += emoji;
  }
}

// Use a random sample input
function useSampleInput() {
  const randomIndex = Math.floor(Math.random() * sampleInputs.length);
  tasteInput.value = sampleInputs[randomIndex];
}

// Submit the taste input (free text mode)
async function submitTaste() {
  if (!tasteInput.value.trim() || tasteInput.value.trim().length < minInputLength) return;
  
  isLoading.value = true;
  
  try {
    // Call the store action to process the taste input
    await tasteStore.processTasteInput(tasteInput.value);
    
    // Emit the submit event
    emit('submit');
  } catch (error) {
    console.error('Error processing taste input:', error);
  } finally {
    isLoading.value = false;
  }
}

// Handle structured input submission
function handleStructuredSubmit(structuredData) {
  emit('submit');
}

// Watch for changes in the input to provide feedback
watch(tasteInput, (val) => {
  // Input validation
  if (!val || val.trim().length < minInputLength) {
    inputWarning.value = 'Try mentioning your favorite music, food, book, or a place you love to visit!';
  } else {
    inputWarning.value = '';
  }
  
  // Live feedback: detect categories
  const cats = [];
  const lower = val.toLowerCase();
  if (/music|song|band|jazz|pop|k-pop|rock|singer|beat|opera|samba|rabindra|lo-fi|classical|hip-hop|reggae|folk|afrobeat/.test(lower)) cats.push('Music');
  if (/food|dish|cuisine|sushi|biryani|taco|pizza|ramen|kimchi|duck|burger|croissant|pasta|rice|chow|feijoada|paella|carbonara|jollof|pavlova|hilsa|fish|chicken|beef|vegan|bowl|snack|dessert/.test(lower)) cats.push('Food');
  if (/book|novel|author|read|murakami|austen|tolkien|sci-fi|fantasy|twain|coelho|hug|mo yan|magical realism|poetry|literature|story|essay|biography|gordimer|esquivel|goethe|gabo|achebe/.test(lower)) cats.push('Books');
  if (/travel|trip|visit|explore|city|country|paris|kyoto|tokyo|rio|cairo|sydney|beijing|barcelona|new york|cape town|sundarbans|hiking|tour|beach|mountain|festival|adventure|vacation|holiday|tourist|destination/.test(lower)) cats.push('Travel');
  detectedCategories.value = cats;
});

// Reset processing state when component is mounted
onMounted(() => {
  tasteStore.resetProcessingState();
});
</script>