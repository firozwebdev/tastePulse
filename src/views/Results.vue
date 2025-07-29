<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 animate-fade-in">
        <LoadingSpinner size="xl" text="Analyzing your taste profile"
          subtext="Our AI is processing your preferences and finding personalized recommendations..." />
      </div>

      <!-- Error State -->
      <ErrorState v-else-if="error" title="Something went wrong" :message="error" retryText="Try Again"
        backText="Go Home" @retry="goBack" @back="router.push('/')" />

      <!-- Results Content -->
      <div v-else class="animate-fade-in">
        <!-- Taste Profile Summary -->
        <div
          class="bg-white dark:bg-dark-card rounded-xl shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border p-6 md:p-8 mb-8">
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
              <BaseButton @click="saveTasteProfile" variant="secondary" :loading="isSaving" :disabled="isSaving">
                <template #icon-left v-if="!isSaving">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                </template>
                {{ isSaving ? 'Saving...' : 'Save Profile' }}
              </BaseButton>

              <BaseButton @click="shareProfile" variant="outline">
                <template #icon-left>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </template>
                Share
              </BaseButton>
            </div>
          </div>

          <!-- Enhanced Taste DNA Visualization -->
          <div class="mt-8">
            <div class="text-center mb-8">
              <h3 class="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">
                Your Cultural DNA
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                Visual representation of your unique taste profile
              </p>
            </div>

            <!-- Main Visualization Area -->
            <div
              class="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 mb-8">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <!-- DNA Helix Visualization -->
                <div class="relative">
                  <div class="aspect-square max-w-md mx-auto">
                    <svg class="w-full h-full" viewBox="0 0 300 300">
                      <!-- Background Circle -->
                      <circle cx="150" cy="150" r="140" fill="none" stroke="currentColor" stroke-width="1"
                        class="text-gray-200 dark:text-gray-700" stroke-dasharray="5,5" />

                      <!-- Category Arcs -->
                      <g v-for="(category, index) in visualCategories" :key="category.name">
                        <path :d="category.arcPath" fill="none" :stroke="category.color" stroke-width="8"
                          stroke-linecap="round" class="animate-draw" :style="{ animationDelay: `${index * 0.3}s` }" />

                        <!-- Category Icon -->
                        <g :transform="`translate(${category.iconX}, ${category.iconY})`">
                          <circle r="20" :fill="category.color" class="animate-bounce"
                            :style="{ animationDelay: `${index * 0.2}s` }" />
                          <text text-anchor="middle" dy="6" class="text-sm font-bold fill-white">
                            {{ category.icon }}
                          </text>
                        </g>

                        <!-- Percentage Label -->
                        <text :x="category.labelX" :y="category.labelY" text-anchor="middle"
                          class="text-xs font-semibold fill-gray-700 dark:fill-gray-300">
                          {{ category.percentage }}%
                        </text>
                      </g>

                      <!-- Center Logo/Icon -->
                      <circle cx="150" cy="150" r="30" fill="url(#centerGradient)" class="animate-pulse" />
                      <text x="150" y="155" text-anchor="middle" class="text-lg font-bold fill-white">DNA</text>

                      <!-- Gradient Definitions -->
                      <defs>
                        <linearGradient id="centerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style="stop-color:#3B82F6" />
                          <stop offset="100%" style="stop-color:#8B5CF6" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>

                <!-- Category Breakdown -->
                <div class="space-y-4">
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Taste Breakdown</h4>

                  <div v-for="category in visualCategories" :key="category.name" class="group">
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          :style="{ backgroundColor: category.color }">
                          {{ category.icon }}
                        </div>
                        <div>
                          <div class="font-medium text-gray-900 dark:text-white">{{ category.name }}</div>
                          <div class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {{ category.summary }}
                          </div>
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="text-lg font-bold text-gray-900 dark:text-white">{{ category.percentage }}%</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">influence</div>
                      </div>
                    </div>

                    <!-- Progress Bar -->
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                      <div class="h-2 rounded-full transition-all duration-1000 ease-out" :style="{
                        width: `${category.percentage}%`,
                        backgroundColor: category.color
                      }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Taste Insights Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div
                class="bg-white dark:bg-dark-card rounded-xl p-4 shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9z" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-600 dark:text-gray-400">Dominant Style</div>
                    <div class="text-lg font-bold text-gray-900 dark:text-white">{{ dominantStyle }}</div>
                  </div>
                </div>
              </div>

              <div
                class="bg-white dark:bg-dark-card rounded-xl p-4 shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600 dark:text-green-400"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-600 dark:text-gray-400">Cultural Affinity</div>
                    <div class="text-lg font-bold text-gray-900 dark:text-white">{{ culturalAffinity }}</div>
                  </div>
                </div>
              </div>

              <div
                class="bg-white dark:bg-dark-card rounded-xl p-4 shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border">
                <div class="flex items-center gap-3 mb-2">
                  <div
                    class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600 dark:text-purple-400"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-600 dark:text-gray-400">Mood Profile</div>
                    <div class="text-lg font-bold text-gray-900 dark:text-white">{{ moodProfile }}</div>
                  </div>
                </div>
              </div>

              <div
                class="bg-white dark:bg-dark-card rounded-xl p-4 shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border">
                <div class="flex items-center gap-3 mb-2">
                  <div
                    class="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-orange-600 dark:text-orange-400"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-600 dark:text-gray-400">Exploration Level</div>
                    <div class="text-lg font-bold text-gray-900 dark:text-white">{{ explorationLevel }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Add this just before the Recommendations Tabs -->
        <div class="flex justify-end mb-4">
          <BaseButton variant="secondary" size="md" @click="getSurprise" :loading="isSurpriseLoading"
            class="surprise-btn">
            <template #icon-left>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </template>
            Surprise Me!
          </BaseButton>
        </div>

        <!-- Recommendations Tabs -->
        <div class="mb-8 animate-slide-in-bottom delay-300">
          <div class="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
            <button v-for="(_, category) in recommendations" :key="category" @click="activeCategory = category"
              class="px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2"
              :class="[
                activeCategory === category
                  ? getCategoryActiveClass(category)
                  : `bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700`
              ]">
              <span class="w-3 h-3 rounded-full" :class="getCategoryDotClass(category)"></span>
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
              <button @click="viewMode = 'grid'" class="p-2 rounded-md transition-colors"
                :class="viewMode === 'grid' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button @click="viewMode = 'list'" class="p-2 rounded-md transition-colors"
                :class="viewMode === 'list' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Grid View -->
          <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="(item, index) in recommendations[activeCategory]" :key="index"
              class="bg-white dark:bg-dark-card rounded-xl overflow-hidden shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border hover:shadow-taste transition-all duration-300 transform hover:-translate-y-1 animate-slide-in-bottom"
              :style="{ animationDelay: `${index * 100}ms` }">
              <div class="h-48 bg-gray-200 dark:bg-gray-700 relative">
                <img :src="item.image || getFallbackImage(activeCategory)" :alt="item.name"
                  class="w-full h-full object-cover" loading="lazy" @error="handleImageError($event, activeCategory)" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div class="absolute bottom-0 left-0 p-4">
                  <span class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="`bg-taste-${activeCategory}/90 text-white`">
                    {{ item.match }}% Match
                  </span>
                </div>
              </div>

              <div class="p-4">
                <h3
                  class="font-semibold text-lg text-gray-900 dark:text-white cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  @click="showDetails(item)">{{ item.name }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ item.description }}</p>

                <div class="mt-4 flex justify-between items-center">
                  <span
                    class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">{{
                      item.category }}</span>
                  <div class="flex gap-2">
                    <button
                      class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1"
                      @click="showDetails(item)" title="View Details">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Details
                    </button>
                    <button
                      class="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium flex items-center gap-1"
                      @click="saveRecommendation(item)">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      Save
                    </button>
                    <button
                      class="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium flex items-center gap-1"
                      @click="shareRecommendation(item)">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- List View -->
          <div v-else class="space-y-4">
            <div v-for="(item, index) in recommendations[activeCategory]" :key="index"
              class="bg-white dark:bg-dark-card rounded-xl overflow-hidden shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border hover:shadow-taste transition-all duration-300 flex animate-slide-in-bottom"
              :style="{ animationDelay: `${index * 100}ms` }">
              <div class="w-24 sm:w-40 bg-gray-200 dark:bg-gray-700 relative">
                <img :src="item.image || getFallbackImage(activeCategory)" :alt="item.name"
                  class="w-full h-full object-cover" loading="lazy" @error="handleImageError($event, activeCategory)" />
                <div class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                <div class="absolute bottom-0 left-0 p-2">
                  <span class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="`bg-taste-${activeCategory}/90 text-white`">
                    {{ item.match }}%
                  </span>
                </div>
              </div>

              <div class="p-4 flex-1">
                <div class="flex justify-between items-start">
                  <h3 class="font-semibold text-lg text-gray-900 dark:text-white">{{ item.name }}</h3>
                  <span
                    class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">{{
                      item.category }}</span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ item.description }}</p>

                <div class="mt-4 flex justify-end gap-3">
                  <button
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1"
                    @click="showDetails(item)" title="View Details">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Details
                  </button>
                  <button
                    class="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium flex items-center gap-1"
                    @click="saveRecommendation(item)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Save
                  </button>
                  <button
                    class="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium flex items-center gap-1"
                    @click="shareRecommendation(item)" :disabled="isSharing">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="activeCategory" class="text-center py-12 animate-fade-in">
          <div
            class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No Recommendations Found</h3>
          <p class="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            We couldn't find any recommendations for this category. Try exploring other categories or updating your
            taste
            profile.
          </p>
        </div>

        <transition name="fade" mode="out-in">
          <div v-if="surpriseResults && isSurpriseVisible" class="mb-8 mt-8 animate-fade-in">
            <div
              class="bg-white dark:bg-dark-card rounded-xl shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border p-6 md:p-8 relative">
              <button @click="closeSurprise"
                class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 class="text-2xl font-display font-semibold text-gray-900 dark:text-white mb-4">Surprise
                Recommendations</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div v-for="(item, category) in surpriseResults" :key="category"
                  class="flex flex-col items-center text-center">
                  <img :src="item.image || getFallbackImage(category)" :alt="item.name"
                    class="w-32 h-32 object-cover rounded-lg mb-3 shadow" @error="handleImageError($event, category)" />
                  <div class="font-bold text-lg text-gray-900 dark:text-white capitalize">{{ item.name }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">{{ item.description }}</div>
                  <div class="text-xs text-primary-600 dark:text-primary-400 font-medium mb-1">{{ item.category }}</div>
                  <div v-if="item.funFact" class="text-xs italic text-gray-500 dark:text-gray-400">💡 {{ item.funFact }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- Revolutionary Features Section -->
      <div v-if="Object.keys(recommendations).length > 0" class="mt-12 space-y-12">

        <!-- AI Taste Personality Section -->
        <div
          class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8">
          <div class="text-center mb-8">
            <h3 class="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
              🎭 Your Cultural Personality
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Discover your unique cultural personality type - like Myers-Briggs for culture
            </p>
          </div>

          <div v-if="tastePersonality" class="max-w-4xl mx-auto">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 text-center">
              <div class="text-6xl mb-4">{{ tastePersonality.personality_type.icon }}</div>
              <h4 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {{ tastePersonality.personality_type.name }}
              </h4>
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                {{ tastePersonality.personality_type.description }}
              </p>
              <div class="flex flex-wrap justify-center gap-2">
                <span v-for="trait in tastePersonality.personality_type.traits" :key="trait"
                  class="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                  {{ trait }}
                </span>
              </div>
            </div>

            <!-- Personality Insights -->
            <div v-if="tastePersonality.insights.primary_insights.length > 0"
              class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="insight in tastePersonality.insights.primary_insights" :key="insight.type"
                class="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div class="font-semibold text-gray-900 dark:text-white mb-2">
                  {{ insight.message }}
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div class="bg-purple-600 h-2 rounded-full transition-all duration-1000"
                    :style="{ width: insight.strength + '%' }"></div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center">
            <button @click="discoverPersonality" :disabled="isDiscoveringPersonality"
              class="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50">
              {{ isDiscoveringPersonality ? 'Analyzing...' : '🎭 Discover My Cultural Personality' }}
            </button>
          </div>
        </div>

        <!-- Global Cultural Heatmap Section -->
        <div class="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-2xl p-8">
          <div class="text-center mb-8">
            <h3 class="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
              🌍 Global Cultural Trends
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              See what's trending culturally around the world right now
            </p>
          </div>

          <div v-if="culturalHeatmap" class="max-w-6xl mx-auto">
            <!-- Most Active Region -->
            <div v-if="culturalHeatmap.insights.length > 0" class="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6">
              <div class="text-center">
                <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  🔥 {{ culturalHeatmap.insights[0].message }}
                </h4>
                <p class="text-gray-600 dark:text-gray-400">
                  Cultural Temperature: {{ culturalHeatmap.insights[0].data?.cultural_temperature || 'High' }}°
                </p>
              </div>
            </div>

            <!-- Regional Trends Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="(regionData, regionId) in Object.entries(culturalHeatmap.global_trends).slice(0, 6)"
                :key="regionId" class="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h5 class="font-bold text-gray-900 dark:text-white mb-2">
                  {{ regionData[1].region_info.name }}
                </h5>
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Temperature: {{ regionData[1].cultural_temperature }}°
                </div>
                <div class="space-y-1">
                  <div v-for="item in regionData[1].trending_now.slice(0, 2)" :key="item.name"
                    class="text-xs bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">
                    {{ item.category }}: {{ item.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center">
            <button @click="loadCulturalHeatmap" :disabled="isLoadingHeatmap"
              class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50">
              {{ isLoadingHeatmap ? 'Loading...' : '🌍 View Global Cultural Trends' }}
            </button>
          </div>
        </div>

        <!-- AI Taste Curator Section -->
        <div
          class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8">
          <div class="text-center mb-8">
            <h3 class="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
              🤖 Your AI Taste Curator
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Chat with your personal cultural assistant for personalized recommendations
            </p>
          </div>

          <div class="max-w-4xl mx-auto">
            <!-- Curator Chat Interface -->
            <div v-if="curatorResponse" class="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6">
              <div class="flex items-start gap-4 mb-4">
                <div class="text-3xl">{{ curatorResponse.curator_personality.emoji }}</div>
                <div class="flex-1">
                  <h4 class="font-bold text-gray-900 dark:text-white mb-1">
                    {{ curatorResponse.curator_personality.name }}
                  </h4>
                  <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {{ curatorResponse.curator_response.greeting }}
                  </p>
                  <p class="text-gray-800 dark:text-gray-200">
                    {{ curatorResponse.curator_response.main_message }}
                  </p>
                </div>
              </div>

              <!-- Curator Recommendations -->
              <div v-if="curatorResponse.recommendations.primary.length > 0" class="space-y-3">
                <h5 class="font-semibold text-gray-900 dark:text-white">Curator's Recommendations:</h5>
                <div v-for="rec in curatorResponse.recommendations.primary.slice(0, 2)" :key="rec.name"
                  class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h6 class="font-medium text-gray-900 dark:text-white">{{ rec.name }}</h6>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ rec.description }}</p>
                  <p class="text-xs text-green-600 dark:text-green-400 italic">{{ rec.reasoning }}</p>
                </div>
              </div>
            </div>

            <!-- Chat Input -->
            <div class="bg-white dark:bg-gray-800 rounded-xl p-4">
              <div class="flex gap-3">
                <input v-model="curatorInput" @keyup.enter="chatWithCurator"
                  placeholder="Ask your curator anything about culture..."
                  class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <button @click="chatWithCurator" :disabled="isChatting || !curatorInput.trim()"
                  class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
                  {{ isChatting ? 'Thinking...' : 'Ask' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Generative Taste Art Section -->
        <div class="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-2xl p-8">
          <div class="text-center mb-8">
            <h3 class="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
              🎨 Your Taste Art
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              AI-generated visual art representing your unique cultural DNA
            </p>
          </div>

          <div v-if="generatedArt" class="max-w-4xl mx-auto">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6">
              <div class="text-center mb-4">
                <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {{ generatedArt.art_data.algorithm.name }}
                </h4>
                <p class="text-gray-600 dark:text-gray-400 text-sm">
                  {{ generatedArt.art_data.algorithm.description }}
                </p>
              </div>

              <!-- SVG Art Display -->
              <div class="flex justify-center mb-4">
                <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                  v-html="generatedArt.svg_code"></div>
              </div>

              <!-- Art Interpretation -->
              <div v-if="generatedArt.art_interpretation" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h5 class="font-semibold text-gray-900 dark:text-white mb-2">Art Interpretation:</h5>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {{ generatedArt.art_interpretation.overall_meaning }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-500">
                  {{ generatedArt.art_interpretation.color_meaning }}
                </p>
              </div>

              <!-- Share Art -->
              <div class="text-center mt-4">
                <button @click="shareArt"
                  class="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Share My Art
                </button>
              </div>
            </div>
          </div>

          <div v-else class="text-center">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Choose Art Style:
              </label>
              <select v-model="selectedArtAlgorithm"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="dna_helix">Cultural DNA Helix</option>
                <option value="taste_mandala">Taste Mandala</option>
                <option value="cultural_constellation">Cultural Constellation</option>
                <option value="flavor_waves">Flavor Waves</option>
                <option value="heritage_tree">Heritage Tree</option>
              </select>
            </div>
            <button @click="generateTasteArt" :disabled="isGeneratingArt"
              class="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50">
              {{ isGeneratingArt ? 'Creating Art...' : '🎨 Generate My Taste Art' }}
            </button>
          </div>
        </div>

        <!-- Time Travel Mode Section -->
        <TimeTravelMode :recommendations="recommendations" />

      </div>
    </div>

    <!-- Recommendation Details Modal -->
    <RecommendationDetailsModal :is-open="showDetailsModal" :recommendation="selectedRecommendation"
      @close="closeDetailsModal" @save="handleSaveFromModal" @share="handleShareFromModal"
      @find-similar="handleFindSimilar" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useTasteStore } from '../stores/taste';
import TasteDnaChart from '../components/TasteDnaChart.vue';
import TasteDNAVisualization from '../components/TasteDNAVisualization.vue';
import TimeTravelMode from '../components/TimeTravelMode.vue';
import BaseButton from '../components/BaseButton.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import ErrorState from '../components/ErrorState.vue';
import RecommendationDetailsModal from '../components/RecommendationDetailsModal.vue';
import { getFallbackImage } from '../utils/helpers';

const router = useRouter();
const tasteStore = useTasteStore();

const isLoading = ref(false);
const error = ref(null);
const isSaving = ref(false);
const activeCategory = ref('');
const viewMode = ref('grid'); // 'grid' or 'list' view mode
const surpriseResults = ref(null);
const isSurpriseLoading = ref(false);
const isSurpriseVisible = ref(false);

// Details Modal State
const showDetailsModal = ref(false);
const selectedRecommendation = ref(null);

// Revolutionary features data
const tastePersonality = ref(null);
const isDiscoveringPersonality = ref(false);
const culturalHeatmap = ref(null);
const isLoadingHeatmap = ref(false);
const curatorResponse = ref(null);
const curatorInput = ref('');
const isChatting = ref(false);
const generatedArt = ref(null);
const selectedArtAlgorithm = ref('dna_helix');
const isGeneratingArt = ref(false);

// Get data from the store
const tasteInput = computed(() => tasteStore.tasteInput);
const parsedTaste = computed(() => tasteStore.parsedTaste);
const recommendations = computed(() => tasteStore.recommendations);

// Category colors and icons
const categoryConfig = {
  music: { color: '#3B82F6', icon: '🎵' },
  food: { color: '#EF4444', icon: '🍜' },
  book: { color: '#10B981', icon: '📚' },
  travel: { color: '#F59E0B', icon: '✈️' },
  fashion: { color: '#8B5CF6', icon: '👗' },
  brand: { color: '#EC4899', icon: '🏷️' }
};

// Visual categories for the DNA chart
const visualCategories = computed(() => {
  const categories = Object.entries(parsedTaste.value).map(([name, value], index) => {
    const config = categoryConfig[name] || { color: '#6B7280', icon: '⭐' };
    const percentage = Math.floor(Math.random() * 30) + 70; // Mock percentage for demo
    const angle = (index / Object.keys(parsedTaste.value).length) * 2 * Math.PI;
    const radius = 120;
    const centerX = 150;
    const centerY = 150;

    // Calculate arc path
    const startAngle = angle - (percentage / 100) * Math.PI / 3;
    const endAngle = angle + (percentage / 100) * Math.PI / 3;
    const x1 = centerX + Math.cos(startAngle) * radius;
    const y1 = centerY + Math.sin(startAngle) * radius;
    const x2 = centerX + Math.cos(endAngle) * radius;
    const y2 = centerY + Math.sin(endAngle) * radius;
    const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";

    const arcPath = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;

    return {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      percentage,
      color: config.color,
      icon: config.icon,
      summary: getTasteSummary(name, value),
      arcPath,
      iconX: centerX + Math.cos(angle) * (radius + 30),
      iconY: centerY + Math.sin(angle) * (radius + 30),
      labelX: centerX + Math.cos(angle) * (radius + 55),
      labelY: centerY + Math.sin(angle) * (radius + 55)
    };
  });

  return categories.sort((a, b) => b.percentage - a.percentage);
});

// Computed insights
const dominantStyle = computed(() => {
  if (visualCategories.value.length === 0) return 'Balanced';
  const dominant = visualCategories.value[0];

  const styles = {
    Music: 'Audiophile',
    Food: 'Foodie',
    Book: 'Literary',
    Travel: 'Explorer',
    Fashion: 'Trendsetter',
    Brand: 'Brand Conscious'
  };

  return styles[dominant.name] || 'Eclectic';
});

const culturalAffinity = computed(() => {
  const input = Object.values(parsedTaste.value).join(' ').toLowerCase();
  if (input.includes('japanese') || input.includes('japan') || input.includes('anime') || input.includes('manga')) {
    return 'East Asian';
  } else if (input.includes('mediterranean') || input.includes('italian') || input.includes('greek')) {
    return 'Mediterranean';
  } else if (input.includes('korean') || input.includes('k-pop') || input.includes('k-drama')) {
    return 'Korean Wave';
  } else if (input.includes('french') || input.includes('european')) {
    return 'European';
  }
  return 'Global Fusion';
});

const moodProfile = computed(() => {
  const input = Object.values(parsedTaste.value).join(' ').toLowerCase();
  if (input.includes('relax') || input.includes('chill') || input.includes('lo-fi') || input.includes('calm')) {
    return 'Relaxed';
  } else if (input.includes('energy') || input.includes('upbeat') || input.includes('rock') || input.includes('dance')) {
    return 'Energetic';
  } else if (input.includes('romantic') || input.includes('jazz') || input.includes('wine') || input.includes('cozy')) {
    return 'Romantic';
  } else if (input.includes('adventure') || input.includes('explore') || input.includes('travel')) {
    return 'Adventurous';
  }
  return 'Balanced';
});

const explorationLevel = computed(() => {
  const categoryCount = Object.keys(parsedTaste.value).length;
  if (categoryCount >= 4) return 'High Explorer';
  if (categoryCount >= 2) return 'Moderate Explorer';
  return 'Focused Explorer';
});

// Revolutionary Features Functions
async function discoverPersonality() {
  if (Object.keys(recommendations.value).length === 0) {
    notification.warning('No Data Available', 'Please get some recommendations first before discovering your personality.');
    return;
  }

  isDiscoveringPersonality.value = true;
  notification.info('Analyzing Personality', 'Our AI is analyzing your cultural preferences...');

  try {
    console.log('🎭 Discovering taste personality...');

    const response = await fetch('/.netlify/functions/taste-personality', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recommendations: recommendations.value,
        tasteBridges: []
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    tastePersonality.value = data;

    console.log(`✨ Discovered personality: ${data.personality_type.name}`);
    notification.success(
      'Personality Discovered!',
      `You are "${data.personality_type.name}" ${data.personality_type.icon} - ${data.personality_type.description.substring(0, 80)}...`
    );
  } catch (error) {
    console.error('Error discovering personality:', error);
    notification.error('Discovery Failed', 'Could not analyze your cultural personality. Please try again.');
  } finally {
    isDiscoveringPersonality.value = false;
  }
}

async function loadCulturalHeatmap() {
  isLoadingHeatmap.value = true;
  notification.info('Loading Global Trends', 'Fetching real-time cultural data from around the world...');

  try {
    console.log('🌍 Loading cultural heatmap...');

    const response = await fetch('/.netlify/functions/cultural-heatmap', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    culturalHeatmap.value = data;

    console.log(`✨ Loaded heatmap for ${Object.keys(data.global_trends).length} regions`);
    notification.success(
      'Global Trends Loaded!',
      `Discovered cultural trends across ${Object.keys(data.global_trends).length} world regions. See what's trending now!`
    );
  } catch (error) {
    console.error('Error loading heatmap:', error);
    notification.error('Loading Failed', 'Could not load global cultural trends. Please try again.');
  } finally {
    isLoadingHeatmap.value = false;
  }
}

async function chatWithCurator() {
  if (!curatorInput.value.trim()) {
    notification.warning('Empty Message', 'Please type a message to chat with your curator.');
    return;
  }

  isChatting.value = true;
  const userMessage = curatorInput.value;
  curatorInput.value = '';
  notification.info('Curator Thinking', 'Your AI curator is analyzing your question...');

  try {
    console.log('🤖 Chatting with AI curator...');

    const response = await fetch('/.netlify/functions/ai-taste-curator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_input: userMessage,
        curator_personality: 'explorer',
        context: {
          current_recommendations: recommendations.value
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    curatorResponse.value = data;

    console.log(`✨ Curator responded with ${data.recommendations.primary.length} recommendations`);
    notification.success(
      'Curator Responded!',
      `Your ${data.curator_personality.name} has new recommendations for you!`
    );
  } catch (error) {
    console.error('Error chatting with curator:', error);
    notification.error('Chat Failed', 'Could not connect with your AI curator. Please try again.');
  } finally {
    isChatting.value = false;
  }
}

async function generateTasteArt() {
  if (Object.keys(recommendations.value).length === 0) {
    notification.warning('No Data Available', 'Please get some recommendations first before generating your taste art.');
    return;
  }

  isGeneratingArt.value = true;
  notification.info('Creating Art', `Our AI is generating your unique ${selectedArtAlgorithm.value.replace('_', ' ')} artwork...`);

  try {
    console.log('🎨 Generating taste art...');

    const response = await fetch('/.netlify/functions/generative-taste-art', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taste_profile: { recommendations: recommendations.value },
        algorithm: selectedArtAlgorithm.value
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    generatedArt.value = data;

    console.log(`✨ Generated ${data.art_data.algorithm.name} with ${data.art_data.elements.length} elements`);
    notification.success(
      'Artwork Created!',
      `Your unique ${data.art_data.algorithm.name} has been generated with ${data.art_data.elements.length} artistic elements!`
    );
  } catch (error) {
    console.error('Error generating art:', error);
    notification.error('Art Generation Failed', 'Could not create your taste artwork. Please try again.');
  } finally {
    isGeneratingArt.value = false;
  }
}

function shareArt() {
  if (!generatedArt.value) return;

  const shareText = generatedArt.value.sharing_text;

  if (navigator.share) {
    navigator.share({
      title: 'My Taste Art',
      text: shareText,
      url: window.location.href
    });
  } else {
    navigator.clipboard.writeText(shareText);
    // Could add a toast notification here
  }
}

// Set the active category to the first available one
onMounted(async () => {
  console.log('🔍 Results page mounted');
  console.log('📝 tasteInput.value:', tasteInput.value);
  console.log('📊 recommendations.value:', recommendations.value);
  console.log('🔢 recommendations keys:', Object.keys(recommendations.value));
  console.log('📏 recommendations length:', Object.keys(recommendations.value).length);

  // If there's no taste input, redirect to home
  if (!tasteInput.value) {
    console.log('❌ No taste input, redirecting to home');
    router.push('/');
    return;
  }

  // If there are no recommendations but we have taste input, process it
  if (Object.keys(recommendations.value).length === 0 && tasteInput.value) {
    console.log('🔄 No recommendations found, processing input...');
    try {
      isLoading.value = true;
      await tasteStore.processInput(tasteInput.value);
      console.log('✅ Processing complete, new recommendations:', recommendations.value);
    } catch (error) {
      console.error('Error processing taste input on Results page:', error);
      error.value = 'Failed to load recommendations. Please try again.';
    } finally {
      isLoading.value = false;
    }
  }

  // Set the first category as active
  if (Object.keys(recommendations.value).length > 0) {
    activeCategory.value = Object.keys(recommendations.value)[0];
    console.log('🎯 Set active category to:', activeCategory.value);
  } else {
    console.log('❌ No recommendations to set active category');
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
  if (isSharing.value) return; // Prevent multiple shares

  const shareText = `Check out my TastePulse cultural profile! I discovered my unique taste across music, food, travel, and books.`;
  const baseUrl = window.location.hostname === 'localhost'
    ? 'https://tastepulse.netlify.app'
    : window.location.origin;
  const shareUrl = `${baseUrl}/results`;

  isSharing.value = true;

  if (navigator.share) {
    navigator.share({
      title: 'My TastePulse Cultural Profile',
      text: shareText,
      url: shareUrl
    }).then(() => {
      if (notification) {
        notification.success('Shared Successfully', 'Your profile has been shared.');
      }
    }).catch(err => {
      if (err.name !== 'AbortError') {
        if (notification) {
          notification.error('Share Failed', 'Could not share your profile.');
        }
        console.error('Error sharing:', err);
        // Fallback to clipboard
        copyToClipboard(shareText + ' ' + shareUrl);
      }
    }).finally(() => {
      setTimeout(() => {
        isSharing.value = false;
      }, 1000);
    });
  } else {
    // Fallback to clipboard copy
    copyToClipboard(shareText + ' ' + shareUrl);
    if (notification) {
      notification.info('Link Copied', 'Profile link copied to clipboard!');
    }
    setTimeout(() => {
      isSharing.value = false;
    }, 1000);
  }
}

// Function to save a specific recommendation
function saveRecommendation(item) {
  tasteStore.saveRecommendation(item);
  notification.success('Recommendation Saved', `"${item.name}" has been saved to your collection.`);
}

// Function to share a specific recommendation
// Add sharing state to prevent multiple shares
const isSharing = ref(false);

function shareRecommendation(item) {
  if (isSharing.value) return; // Prevent multiple shares

  const shareText = `Check out this ${activeCategory.value} recommendation from TastePulse: ${item.name} - ${item.description}`;
  // Generate production-ready URL
  const baseUrl = window.location.hostname === 'localhost'
    ? 'https://tastepulse.netlify.app'
    : window.location.origin;
  const shareUrl = `${baseUrl}/results?shared=${encodeURIComponent(item.name)}&category=${activeCategory.value}`;

  isSharing.value = true;

  if (navigator.share) {
    navigator.share({
      title: `TastePulse ${activeCategory.value.charAt(0).toUpperCase() + activeCategory.value.slice(1)} Recommendation`,
      text: shareText,
      url: shareUrl
    }).then(() => {
      if (notification) {
        notification.success('Shared Successfully', 'Your recommendation has been shared.');
      }
    }).catch(err => {
      if (err.name !== 'AbortError') {
        if (notification) {
          notification.error('Share Failed', 'Could not share this recommendation.');
        }
        console.error('Error sharing:', err);
        // Fallback to clipboard if sharing fails
        copyToClipboard(shareText + ' ' + shareUrl);
      }
    }).finally(() => {
      setTimeout(() => {
        isSharing.value = false;
      }, 1000);
    });
  } else {
    // Fallback to clipboard copy
    copyToClipboard(shareText + ' ' + shareUrl);
    notification.info('Link Copied', 'Recommendation copied to clipboard!');
  }
}

// Function to handle image loading errors
function handleImageError(event, category) {
  // Replace the broken image with our fallback image
  event.target.src = getFallbackImage(category);
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

function closeSurprise() {
  isSurpriseVisible.value = false;
  setTimeout(() => {
    surpriseResults.value = null;
    notification.info('Surprise Closed', 'Surprise recommendations have been closed.');
  }, 300); // Match the transition duration
}

// Auto-hide surprise results if user interacts with recommendations
watch([activeCategory, viewMode], () => {
  if (isSurpriseVisible.value) closeSurprise();
});

async function getSurprise() {
  isSurpriseLoading.value = true;
  notification.info('Surprise Me!', 'Finding unexpected recommendations just for you...');

  try {
    const res = await fetch('/.netlify/functions/surprise-me');
    if (!res.ok) throw new Error('Failed to fetch surprise recommendations');
    surpriseResults.value = await res.json();
    isSurpriseVisible.value = true;

    // Count the number of surprise recommendations
    const surpriseCount = Object.keys(surpriseResults.value).length;
    notification.success(
      'Surprise Delivered!',
      `Found ${surpriseCount} unexpected recommendation${surpriseCount > 1 ? 's' : ''} that might surprise you!`
    );
  } catch (err) {
    surpriseResults.value = null;
    isSurpriseVisible.value = false;
    notification.error('Surprise Failed', 'Could not find surprise recommendations. Please try again.');
  } finally {
    isSurpriseLoading.value = false;
  }
}

function getTasteSummary(category, value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    // Show all non-empty arrays' values, joined by comma
    const parts = [];
    for (const key of Object.keys(value)) {
      if (Array.isArray(value[key]) && value[key].length > 0) {
        parts.push(...value[key]);
      }
    }
    return parts.length > 0 ? parts.join(', ') : '';
  }
  return '';
}

// Details Modal Methods
function showDetails(recommendation) {
  selectedRecommendation.value = recommendation;
  showDetailsModal.value = true;
}

function closeDetailsModal() {
  showDetailsModal.value = false;
  selectedRecommendation.value = null;
}

function handleSaveFromModal(recommendation) {
  saveRecommendation(recommendation);
}

function handleShareFromModal(recommendation) {
  shareRecommendation(recommendation);
}

function handleFindSimilar(recommendation) {
  notification.info('Finding Similar', `Looking for recommendations similar to ${recommendation.name}...`);
  // Here you could implement logic to find similar recommendations
  // For now, we'll just show a notification
}

// Methods for tab styling
function getCategoryActiveClass(category) {
  const categoryStyles = {
    music: 'bg-blue-600 text-white shadow-lg border-blue-600',
    food: 'bg-red-600 text-white shadow-lg border-red-600',
    book: 'bg-green-600 text-white shadow-lg border-green-600',
    travel: 'bg-yellow-600 text-white shadow-lg border-yellow-600',
    fashion: 'bg-purple-600 text-white shadow-lg border-purple-600',
    brand: 'bg-pink-600 text-white shadow-lg border-pink-600'
  };

  return categoryStyles[category] || 'bg-gray-600 text-white shadow-lg border-gray-600';
}

function getCategoryDotClass(category) {
  const categoryDotStyles = {
    music: 'bg-blue-400',
    food: 'bg-red-400',
    book: 'bg-green-400',
    travel: 'bg-yellow-400',
    fashion: 'bg-purple-400',
    brand: 'bg-pink-400'
  };

  return categoryDotStyles[category] || 'bg-gray-400';
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* DNA Visualization Animations */
@keyframes draw {
  from {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
  }

  to {
    stroke-dasharray: 1000;
    stroke-dashoffset: 0;
  }
}

.animate-draw {
  animation: draw 2s ease-in-out forwards;
}

/* Subtle bounce instead of aggressive shake */
@keyframes gentle-bounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-2px);
  }
}

.animate-gentle-bounce {
  animation: gentle-bounce 3s ease-in-out infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes slideInBottom {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in-bottom {
  animation: slideInBottom 0.6s ease-out;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scaleIn 0.5s ease-out;
}

/* Hover effects for cards */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

.group:hover .group-hover\:shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Custom scrollbar for horizontal tabs */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Pulse animation for DNA center */
@keyframes pulse-glow {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

/* Progress bar animation */
.progress-bar {
  transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Category icon bounce */
@keyframes bounce-subtle {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-4px);
  }
}

.animate-bounce-subtle {
  animation: bounce-subtle 2s ease-in-out infinite;
}
</style>