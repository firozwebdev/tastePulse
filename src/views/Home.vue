<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="py-12 md:py-20 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl md:text-6xl font-display font-bold gradient-text animate-scale-in">
          Discover Your Cultural Fingerprint
        </h1>
        <p class="mt-6 text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto animate-slide-in-bottom delay-200">
          TastePulse uses AI to analyze your preferences and recommend personalized cultural experiences across music, food, books, travel, and more.
        </p>
        
        <!-- Taste Input Form -->
        <div class="mt-12 bg-white dark:bg-dark-card rounded-xl shadow-card-light dark:shadow-card-dark p-6 md:p-8 max-w-2xl mx-auto border border-gray-100 dark:border-dark-border animate-slide-in-bottom delay-300 animate-pulse-glow">
          <h2 class="text-2xl font-display font-semibold mb-4 text-gray-800 dark:text-white animate-slide-in-left delay-400">
            Tell us what you love
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6 animate-slide-in-right delay-500">
            Share your interests in natural language and our AI will analyze your taste profile
          </p>
          
          <form @submit.prevent="submitTaste" class="space-y-4">
            <div class="relative">
              <BaseTextarea
                v-model="tasteInput"
                id="taste-input"
                rows="4"
                :placeholder="currentExample"
                :disabled="isLoading"
                :class="{'shadow-glow': tasteInput.length > 0}"
                @focus="rotateExamples"
                @blur="stopRotatingExamples"
              />
              <div v-if="showSuggestions" class="absolute z-10 w-full bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg shadow-lg mt-1 left-0">
                <div v-for="s in filteredSuggestions" :key="s.label" class="px-4 py-2 cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900/30 flex items-center gap-2" @mousedown.prevent="selectSuggestion(s)">
                  <span class="text-xs font-semibold text-primary-600 dark:text-primary-400">{{ s.category }}</span>
                  <span>{{ s.label }}</span>
                </div>
              </div>
            </div>
            
            <!-- Quick Suggestions Card -->
            <div class="bg-white dark:bg-dark-card rounded-xl shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border p-4 mt-4 mb-2">
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
            
            <div v-if="inputWarning" class="text-xs text-red-500 dark:text-red-400 mt-2">{{ inputWarning }}</div>
            <div v-if="detectedCategories.length" class="text-xs text-primary-600 dark:text-primary-400 mt-2 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Detected: <span v-for="cat in detectedCategories" :key="cat" class="font-semibold mx-1">{{ cat }}</span>
            </div>
            
            <BaseButton
              type="button"
              variant="outline"
              size="md"
              class="mt-2"
              @click="feelingLucky"
            >
              <template #icon-left>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </template>
              Feeling Lucky?
            </BaseButton>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <BaseButton
                type="submit"
                :disabled="isLoading || !tasteInput.trim()"
                :loading="isLoading"
                size="lg"
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
          </form>
        </div>
      </div>
    </section>
    
    <!-- Features Section -->
    <section class="py-12 px-4 bg-gray-50 dark:bg-dark-bg">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-display font-bold text-center text-gray-900 dark:text-white mb-4 animate-scale-in">
          How TastePulse Works
        </h2>
        <p class="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto animate-slide-in-bottom">
          Our AI-powered platform analyzes your preferences and connects you with personalized cultural recommendations
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="bg-white dark:bg-dark-card rounded-xl p-6 shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border hover:shadow-taste transition-all duration-300 transform hover:-translate-y-1 animate-slide-in-bottom delay-100">
            <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4 animate-pulse-glow">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Natural Language Input</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Simply tell us what you enjoy in your own words. Our AI understands your preferences in multiple languages including English, Bangla, and Spanish.
            </p>
            <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div class="flex items-center text-sm text-primary-600 dark:text-primary-400">
                <span class="font-medium">Multilingual Support</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
          
          <!-- Feature 2 -->
          <div class="bg-white dark:bg-dark-card rounded-xl p-6 shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border hover:shadow-taste transition-all duration-300 transform hover:-translate-y-1 animate-slide-in-bottom delay-200">
            <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4 animate-pulse-glow">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Taste Categorization</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Our AI analyzes your input and categorizes your preferences across music, food, books, travel, fashion, and more.
            </p>
            <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div class="flex items-center text-sm text-primary-600 dark:text-primary-400">
                <span class="font-medium">AI-Powered Analysis</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
          
          <!-- Feature 3 -->
          <div class="bg-white dark:bg-dark-card rounded-xl p-6 shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border hover:shadow-taste transition-all duration-300 transform hover:-translate-y-1 animate-slide-in-bottom delay-300">
            <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4 animate-pulse-glow">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Personalized Recommendations</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Receive tailored recommendations based on your unique taste profile, powered by Qloo's cultural intelligence platform.
            </p>
            <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div class="flex items-center text-sm text-primary-600 dark:text-primary-400">
                <span class="font-medium">Cross-Domain Discovery</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Categories Section -->
    <section class="py-12 px-4">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-display font-bold text-center text-gray-900 dark:text-white mb-4 animate-scale-in">
          Discover Across Categories
        </h2>
        <p class="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto animate-slide-in-bottom">
          TastePulse helps you explore new experiences across multiple cultural domains
        </p>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <!-- Music -->
          <div class="bg-white dark:bg-dark-card rounded-xl p-4 text-center shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border hover:shadow-taste transition-all duration-300 transform hover:-translate-y-1 animate-slide-in-bottom delay-100">
            <div class="w-12 h-12 bg-taste-music/20 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse-glow">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-taste-music" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Music</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Artists, Genres, Albums</p>
          </div>
          
          <!-- Food -->
          <div class="bg-white dark:bg-dark-card rounded-xl p-4 text-center shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border hover:shadow-taste transition-all duration-300 transform hover:-translate-y-1 animate-slide-in-bottom delay-200">
            <div class="w-12 h-12 bg-taste-food/20 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse-glow">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-taste-food" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Food</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Cuisines, Restaurants, Recipes</p>
          </div>
          
          <!-- Books -->
          <div class="bg-white dark:bg-dark-card rounded-xl p-4 text-center shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border hover:shadow-taste transition-all duration-300 transform hover:-translate-y-1 animate-slide-in-bottom delay-300">
            <div class="w-12 h-12 bg-taste-book/20 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse-glow">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-taste-book" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Books</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Authors, Genres, Series</p>
          </div>
          
          <!-- Travel -->
          <div class="bg-white dark:bg-dark-card rounded-xl p-4 text-center shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border hover:shadow-taste transition-all duration-300 transform hover:-translate-y-1 animate-slide-in-bottom delay-400">
            <div class="w-12 h-12 bg-taste-travel/20 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse-glow">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-taste-travel" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Travel</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Destinations, Experiences, Cultures</p>
          </div>
          
          <!-- Fashion -->
          <div class="bg-white dark:bg-dark-card rounded-xl p-4 text-center shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border hover:shadow-taste transition-all duration-300 transform hover:-translate-y-1 animate-slide-in-bottom delay-500">
            <div class="w-12 h-12 bg-taste-fashion/20 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse-glow">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-taste-fashion" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Fashion</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Styles, Designers, Trends</p>
          </div>
          
          <!-- Brands -->
          <div class="bg-white dark:bg-dark-card rounded-xl p-4 text-center shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border hover:shadow-taste transition-all duration-300 transform hover:-translate-y-1 animate-slide-in-bottom delay-500">
            <div class="w-12 h-12 bg-taste-brand/20 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse-glow">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-taste-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Brands</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Products, Companies, Values</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Time Machine Section -->
    <section class="py-12 px-4 bg-gradient-to-r from-primary-900 to-primary-700 text-white">
      <div class="max-w-6xl mx-auto">
        <div class="flex flex-col md:flex-row items-center gap-8">
          <div class="w-full md:w-1/2 animate-slide-in-left">
            <h2 class="text-3xl font-display font-bold mb-4">Taste Time Machine</h2>
            <p class="mb-6">
              Explore recommendations from different eras! Whether you're nostalgic for the 90s or curious about medieval tastes, our Time Machine feature lets you discover cultural experiences across time periods.
            </p>
            <div class="flex flex-wrap gap-3">
              <button class="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors">
                90s Kid
              </button>
              <button class="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors">
                80s Retro
              </button>
              <button class="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors">
                Y2K Era
              </button>
              <button class="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors">
                Classical Period
              </button>
              <button class="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors">
                Renaissance
              </button>
            </div>
          </div>
          
          <div class="w-full md:w-1/2 animate-slide-in-right">
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-semibold">Coming Soon</h3>
                  <p class="text-white/70">Time travel through cultural recommendations</p>
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-white/10 rounded-lg p-3">
                  <div class="text-sm font-medium">Music</div>
                  <div class="text-xs text-white/70">Discover era-specific artists and genres</div>
                </div>
                <div class="bg-white/10 rounded-lg p-3">
                  <div class="text-sm font-medium">Fashion</div>
                  <div class="text-xs text-white/70">Explore iconic styles from each period</div>
                </div>
                <div class="bg-white/10 rounded-lg p-3">
                  <div class="text-sm font-medium">Literature</div>
                  <div class="text-xs text-white/70">Find influential books and authors</div>
                </div>
                <div class="bg-white/10 rounded-lg p-3">
                  <div class="text-sm font-medium">Culture</div>
                  <div class="text-xs text-white/70">Learn about cultural movements</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTasteStore } from '../stores/taste';
import { detectLanguage } from '../utils/helpers';
import BaseButton from '../components/BaseButton.vue';
import BaseTextarea from '../components/BaseTextarea.vue';

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
const currentExample = ref(sampleInputs[0]);
let exampleInterval = null;

function rotateExamples() {
  let idx = sampleInputs.indexOf(currentExample.value);
  exampleInterval = setInterval(() => {
    idx = (idx + 1) % sampleInputs.length;
    currentExample.value = sampleInputs[idx];
  }, 4000);
}

function stopRotatingExamples() {
  clearInterval(exampleInterval);
}

onMounted(() => {
  rotateExamples();
});
onBeforeUnmount(() => {
  stopRotatingExamples();
});

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
function addChip(chip) {
  if (!tasteInput.value.includes(chip)) {
    tasteInput.value = tasteInput.value.trim() + (tasteInput.value ? ', ' : '') + chip;
  }
}

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
    await tasteStore.processInput(tasteInput.value);
    
    // Navigate to the results page
    router.push('/results');
  } catch (error) {
    console.error('Error processing taste input:', error);
    // Handle error (could add error state here)
  } finally {
    isLoading.value = false;
  }
}

function feelingLucky() {
  const idx = Math.floor(Math.random() * sampleInputs.length);
  tasteInput.value = sampleInputs[idx];
}

const minInputLength = 10;
const inputWarning = ref('');
const detectedCategories = ref([]);

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

const masterSuggestions = [
  { label: "Jazz", category: "Music" },
  { label: "K-Pop", category: "Music" },
  { label: "J-Pop", category: "Music" },
  { label: "Classical", category: "Music" },
  { label: "Bollywood", category: "Music" },
  { label: "Samba", category: "Music" },
  { label: "Sushi", category: "Food" },
  { label: "Tacos", category: "Food" },
  { label: "Biryani", category: "Food" },
  { label: "Kimchi", category: "Food" },
  { label: "Croissant", category: "Food" },
  { label: "Burger", category: "Food" },
  { label: "Murakami novels", category: "Books" },
  { label: "Jane Austen novels", category: "Books" },
  { label: "Sci-fi books", category: "Books" },
  { label: "Fantasy books", category: "Books" },
  { label: "Paulo Coelho novels", category: "Books" },
  { label: "Kyoto", category: "Travel" },
  { label: "Paris", category: "Travel" },
  { label: "Rio de Janeiro", category: "Travel" },
  { label: "Cairo", category: "Travel" },
  { label: "Sydney", category: "Travel" },
  { label: "New York City", category: "Travel" },
  { label: "Vegan", category: "Lifestyle" },
  { label: "Hiking", category: "Lifestyle" },
  { label: "Tech enthusiast", category: "Lifestyle" },
  { label: "History buff", category: "Lifestyle" },
  { label: "Parent", category: "Lifestyle" }
];
const showSuggestions = ref(false);
const filteredSuggestions = ref([]);
const suggestionInput = computed(() => tasteInput.value);

watch(suggestionInput, (val) => {
  if (val && val.length > 1) {
    const lower = val.toLowerCase();
    filteredSuggestions.value = masterSuggestions.filter(s =>
      s.label.toLowerCase().includes(lower)
    );
    showSuggestions.value = filteredSuggestions.value.length > 0;
  } else {
    showSuggestions.value = false;
  }
});

function selectSuggestion(suggestion) {
  addChip(suggestion.label);
  showSuggestions.value = false;
}

const emojiList = [
  "🎵", "🍣", "📚", "✈️", "🎤", "🍔", "🎸", "🍕", "🏖️", "🏞️", "🎬", "🎨", "🥗", "🧳", "🏛️", "🎧", "🍜", "🗼", "🕌", "🏯", "🌎"
];
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
</script>