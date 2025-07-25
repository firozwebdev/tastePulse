<template>
  <div class="bg-white dark:bg-dark-card rounded-xl shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border p-6 animate-slide-in-bottom delay-300">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Taste Input</h3>
      <div class="flex items-center">
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
    </div>

    <!-- Free Text Input -->
    <div v-if="!isStructured" class="space-y-4">
      <BaseTextarea
        v-model="tasteInput"
        label="Describe your taste"
        placeholder="Tell us what you like in music, food, books, and travel..."
        :rows="5"
        :maxLength="500"
        :autoResize="true"
      />
    </div>

    <!-- Structured Input Form -->
    <div v-else class="space-y-4">
      <p class="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
        Search and select your preferences in each category
      </p>
      
      <div v-for="category in categories" :key="category.id" class="space-y-2">
        <div class="flex items-center">
          <span v-if="category.id === 'music'">🎵</span>
          <span v-else-if="category.id === 'food'">🍣</span>
          <span v-else-if="category.id === 'book'">📚</span>
          <span v-else-if="category.id === 'travel'">✈️</span>
          <span class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">{{ category.label }}</span>
        </div>
        
        <div class="relative">
          <BaseInput
            v-model="category.value"
            :placeholder="`Search for ${category.label.toLowerCase()}...`"
            @input="searchEntities(category.id, category.value)"
            @focus="activeCategory = category.id"
            @blur="setTimeout(() => { activeCategory = null }, 200)"
          >
            <template #leftIcon>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </template>
            <template #rightIcon v-if="isSearchLoading[category.id]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
                <path d="M12 2a10 10 0 0110 10" />
              </svg>
            </template>
          </BaseInput>
          
          <!-- Search Results Dropdown -->
          <div 
            v-if="activeCategory === category.id && searchResults[category.id] && searchResults[category.id].length > 0" 
            class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto"
          >
            <div 
              v-for="result in searchResults[category.id]" 
              :key="result.id"
              @mousedown="selectEntity(category.id, result)"
              class="px-4 py-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 cursor-pointer flex items-center"
            >
              <div class="flex-shrink-0 mr-3" v-if="result.image">
                <img :src="result.image" :alt="result.name" class="h-10 w-10 object-cover rounded" />
              </div>
              <div class="flex-1">
                <div class="font-medium text-gray-900 dark:text-white">{{ result.name }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ result.description }}</div>
              </div>
              <div v-if="result.match" class="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 px-2 py-1 rounded">
                {{ result.match }}% match
              </div>
            </div>
          </div>
        </div>
        
        <!-- Selected Entities -->
        <div v-if="structuredData[category.id] && structuredData[category.id].length > 0" class="flex flex-wrap gap-2 mt-2">
          <div 
            v-for="entity in structuredData[category.id]" 
            :key="entity.id"
            class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200"
          >
            {{ entity.name }}
            <button 
              @click="removeEntity(category.id, entity.id)" 
              class="ml-1.5 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Empty state -->
        <div v-else class="text-center py-3 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-md">
          No {{ category.label.toLowerCase() }} selected yet
        </div>
      </div>
      
      <BaseButton 
        @click="submitStructured" 
        variant="primary" 
        class="w-full mt-4"
        :disabled="isSubmitting || !hasSelectedEntities || isProcessing"
        :loading="isSubmitting || isProcessing"
      >
        <span v-if="isProcessing">{{ processingStage || 'Processing...' }}</span>
        <span v-else>Analyze Structured Preferences</span>
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import BaseInput from './BaseInput.vue';
import BaseButton from './BaseButton.vue';
import BaseTextarea from './BaseTextarea.vue';
import { useTasteStore } from '../stores/taste';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'submit']);

const tasteStore = useTasteStore();
const isStructured = ref(props.modelValue);
const isSubmitting = ref(false);
const activeCategory = ref(null);

// Categories for structured input
const categories = ref([
  { id: 'music', label: 'Music', value: '' },
  { id: 'food', label: 'Food', value: '' },
  { id: 'book', label: 'Books', value: '' },
  { id: 'travel', label: 'Travel', value: '' }
]);

// Computed properties from the taste store
const tasteInput = computed({
  get: () => tasteStore.tasteInput,
  set: (value) => tasteStore.tasteInput = value
});

const inputMode = computed({
  get: () => tasteStore.inputMode,
  set: (value) => tasteStore.setInputMode(value)
});

const searchResults = computed(() => tasteStore.entitySearchResults);
const isSearchLoading = computed(() => tasteStore.entitySearchLoading);
const structuredData = computed(() => tasteStore.structuredInput);
const processingStage = computed(() => tasteStore.processingStage);
const isProcessing = computed(() => tasteStore.isProcessing);

// Local state for debouncing search
const debounceTimers = ref({
  music: null,
  food: null,
  book: null,
  travel: null
});

// Computed property to check if any entities are selected
const hasSelectedEntities = computed(() => {
  return Object.values(structuredData.value).some(entities => entities && entities.length > 0);
});

// Watch for changes in the modelValue prop
watch(() => props.modelValue, (newValue) => {
  isStructured.value = newValue;
  // Update the taste store input mode
  tasteStore.setInputMode(newValue ? 'structured' : 'free');
});

// Watch for changes in isStructured and emit update event
watch(isStructured, (newValue) => {
  emit('update:modelValue', newValue);
  // Update the taste store input mode
  tasteStore.setInputMode(newValue ? 'structured' : 'free');
});

// Watch for changes in the taste store input mode
watch(() => tasteStore.inputMode, (newMode) => {
  isStructured.value = newMode === 'structured';
});

// Toggle between structured and free text input
function toggleInputMode() {
  isStructured.value = !isStructured.value;
  tasteStore.setInputMode(isStructured.value ? 'structured' : 'free');
}

// Search for entities with debounce
function searchEntities(category, query) {
  // Clear any existing timer
  if (debounceTimers.value[category]) {
    clearTimeout(debounceTimers.value[category]);
  }
  
  // Set a new timer
  debounceTimers.value[category] = setTimeout(async () => {
    if (!query || query.length < 2) {
      tasteStore.entitySearchResults[category] = [];
      return;
    }
    
    try {
      // Call the store method to search for entities
      await tasteStore.searchQlooEntities(category, query);
    } catch (error) {
      console.error('Error searching entities:', error);
      tasteStore.entitySearchResults[category] = [];
    }
  }, 300);
}

// Select an entity from the search results
function selectEntity(category, entity) {
  // Check if entity is already selected
  const categoryEntities = structuredData.value[category] || [];
  const isDuplicate = categoryEntities.some(e => e.id === entity.id);
  
  if (!isDuplicate) {
    // Create the category array if it doesn't exist
    if (!structuredData.value[category]) {
      tasteStore.structuredInput[category] = [];
    }
    
    // Add the entity
    tasteStore.structuredInput[category].push(entity);
  }
  
  // Clear the search input and results
  const categoryObj = categories.value.find(c => c.id === category);
  if (categoryObj) {
    categoryObj.value = '';
  }
  tasteStore.entitySearchResults[category] = [];
}

// Remove a selected entity
function removeEntity(category, entityId) {
  if (structuredData.value[category]) {
    tasteStore.structuredInput[category] = structuredData.value[category].filter(e => e.id !== entityId);
  }
}

// Submit the structured input
async function submitStructured() {
  if (!hasSelectedEntities.value) return;
  
  isSubmitting.value = true;
  
  try {
    // Process the structured input using the taste store
    await tasteStore.processStructuredInput();
    
    // Emit the submit event
    emit('submit', structuredData.value);
  } catch (error) {
    console.error('Error processing structured input:', error);
  } finally {
    isSubmitting.value = false;
  }
}

// Initialize the component
onMounted(() => {
  // Reset search results
  categories.value.forEach(category => {
    tasteStore.entitySearchResults[category.id] = [];
  });
  
  // Sync the input mode with the taste store
  isStructured.value = tasteStore.inputMode === 'structured';
});

</script>