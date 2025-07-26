<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 animate-fade-in">
        <LoadingSpinner 
          size="xl" 
          text="Analyzing your taste profile" 
          subtext="Our AI is processing your preferences and finding personalized recommendations..."
        />
      </div>
      
      <!-- Error State -->
      <ErrorState 
        v-else-if="error"
        title="Something went wrong"
        :message="error"
        retryText="Try Again"
        backText="Go Home"
        @retry="goBack"
        @back="router.push('/')"
      />
      
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
              <BaseButton 
                @click="saveTasteProfile" 
                variant="secondary"
                :loading="isSaving"
                :disabled="isSaving"
              >
                <template #icon-left v-if="!isSaving">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                </template>
                {{ isSaving ? 'Saving...' : 'Save Profile' }}
              </BaseButton>
              
              <BaseButton 
                @click="shareProfile" 
                variant="outline"
              >
                <template #icon-left>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
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
            <div class="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 mb-8">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <!-- DNA Helix Visualization -->
                <div class="relative">
                  <div class="aspect-square max-w-md mx-auto">
                    <svg class="w-full h-full" viewBox="0 0 300 300">
                      <!-- Background Circle -->
                      <circle cx="150" cy="150" r="140" fill="none" stroke="currentColor" stroke-width="1" class="text-gray-200 dark:text-gray-700" stroke-dasharray="5,5" />
                      
                      <!-- Category Arcs -->
                      <g v-for="(category, index) in visualCategories" :key="category.name">
                        <path
                          :d="category.arcPath"
                          fill="none"
                          :stroke="category.color"
                          stroke-width="8"
                          stroke-linecap="round"
                          class="animate-draw"
                          :style="{ animationDelay: `${index * 0.3}s` }"
                        />
                        
                        <!-- Category Icon -->
                        <g :transform="`translate(${category.iconX}, ${category.iconY})`">
                          <circle r="20" :fill="category.color" class="animate-bounce" :style="{ animationDelay: `${index * 0.2}s` }" />
                          <text text-anchor="middle" dy="6" class="text-sm font-bold fill-white">
                            {{ category.icon }}
                          </text>
                        </g>
                        
                        <!-- Percentage Label -->
                        <text 
                          :x="category.labelX" 
                          :y="category.labelY" 
                          text-anchor="middle" 
                          class="text-xs font-semibold fill-gray-700 dark:fill-gray-300"
                        >
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
                        <div 
                          class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          :style="{ backgroundColor: category.color }"
                        >
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
                      <div 
                        class="h-2 rounded-full transition-all duration-1000 ease-out"
                        :style="{ 
                          width: `${category.percentage}%`, 
                          backgroundColor: category.color 
                        }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Taste Insights Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div class="bg-white dark:bg-dark-card rounded-xl p-4 shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9z" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-600 dark:text-gray-400">Dominant Style</div>
                    <div class="text-lg font-bold text-gray-900 dark:text-white">{{ dominantStyle }}</div>
                  </div>
                </div>
              </div>

              <div class="bg-white dark:bg-dark-card rounded-xl p-4 shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-600 dark:text-gray-400">Cultural Affinity</div>
                    <div class="text-lg font-bold text-gray-900 dark:text-white">{{ culturalAffinity }}</div>
                  </div>
                </div>
              </div>

              <div class="bg-white dark:bg-dark-card rounded-xl p-4 shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-600 dark:text-gray-400">Mood Profile</div>
                    <div class="text-lg font-bold text-gray-900 dark:text-white">{{ moodProfile }}</div>
                  </div>
                </div>
              </div>

              <div class="bg-white dark:bg-dark-card rounded-xl p-4 shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
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
          <BaseButton
            variant="secondary"
            size="md"
            @click="getSurprise"
            :loading="isSurpriseLoading"
            class="surprise-btn"
          >
            <template #icon-left>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </template>
            Surprise Me!
          </BaseButton>
        </div>
        
        <!-- Recommendations Tabs -->
        <div class="mb-8 animate-slide-in-bottom delay-300">
          <div class="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
            <button 
              v-for="(_, category) in recommendations" 
              :key="category"
              @click="activeCategory = category"
              class="px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2"
              :class="[
                activeCategory === category 
                  ? getCategoryActiveClass(category)
                  : `bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700`
              ]"
            >
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
              <button 
                @click="viewMode = 'grid'"
                class="p-2 rounded-md transition-colors"
                :class="viewMode === 'grid' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button 
                @click="viewMode = 'list'"
                class="p-2 rounded-md transition-colors"
                :class="viewMode === 'list' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Grid View -->
          <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="(item, index) in recommendations[activeCategory]" 
              :key="index"
              class="bg-white dark:bg-dark-card rounded-xl overflow-hidden shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border hover:shadow-taste transition-all duration-300 transform hover:-translate-y-1 animate-slide-in-bottom"
              :style="{ animationDelay: `${index * 100}ms` }"
            >
              <div class="h-48 bg-gray-200 dark:bg-gray-700 relative">
                <img 
                  :src="item.image || getFallbackImage(activeCategory)"
                  :alt="item.name"
                  class="w-full h-full object-cover"
                  loading="lazy"
                  @error="handleImageError($event, activeCategory)"
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
                <h3 class="font-semibold text-lg text-gray-900 dark:text-white cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors" @click="showDetails(item)">{{ item.name }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ item.description }}</p>
                
                <div class="mt-4 flex justify-between items-center">
                  <span class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">{{ item.category }}</span>
                  <div class="flex gap-2">
                    <button 
                      class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1"
                      @click="showDetails(item)"
                      title="View Details"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Details
                    </button>
                    <button 
                      class="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium flex items-center gap-1"
                      @click="saveRecommendation(item)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      Save
                    </button>
                    <button 
                      class="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium flex items-center gap-1"
                      @click="shareRecommendation(item)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- List View -->
          <div v-else class="space-y-4">
            <div 
              v-for="(item, index) in recommendations[activeCategory]" 
              :key="index"
              class="bg-white dark:bg-dark-card rounded-xl overflow-hidden shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border hover:shadow-taste transition-all duration-300 flex animate-slide-in-bottom"
              :style="{ animationDelay: `${index * 100}ms` }"
            >
              <div class="w-24 sm:w-40 bg-gray-200 dark:bg-gray-700 relative">
                <img 
                  :src="item.image || getFallbackImage(activeCategory)" 
                  :alt="item.name"
                  class="w-full h-full object-cover"
                  loading="lazy"
                  @error="handleImageError($event, activeCategory)"
                />
                <div class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                <div class="absolute bottom-0 left-0 p-2">
                  <span 
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="`bg-taste-${activeCategory}/90 text-white`"
                  >
                    {{ item.match }}%
                  </span>
                </div>
              </div>
              
              <div class="p-4 flex-1">
                <div class="flex justify-between items-start">
                  <h3 class="font-semibold text-lg text-gray-900 dark:text-white">{{ item.name }}</h3>
                  <span class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">{{ item.category }}</span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ item.description }}</p>
                
                <div class="mt-4 flex justify-end gap-3">
                  <button 
                    class="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium flex items-center gap-1"
                    @click="saveRecommendation(item)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Save
                  </button>
                  <button 
                    class="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium flex items-center gap-1"
                    @click="shareRecommendation(item)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else-if="activeCategory" class="text-center py-12 animate-fade-in">
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No Recommendations Found</h3>
          <p class="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            We couldn't find any recommendations for this category. Try exploring other categories or updating your taste profile.
          </p>
        </div>
        
        <transition name="fade" mode="out-in">
          <div v-if="surpriseResults && isSurpriseVisible" class="mb-8 mt-8 animate-fade-in">
            <div class="bg-white dark:bg-dark-card rounded-xl shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border p-6 md:p-8 relative">
              <button @click="closeSurprise" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors" aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 class="text-2xl font-display font-semibold text-gray-900 dark:text-white mb-4">Surprise Recommendations</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div v-for="(item, category) in surpriseResults" :key="category" class="flex flex-col items-center text-center">
                  <img
                    :src="item.image || getFallbackImage(category)"
                    :alt="item.name"
                    class="w-32 h-32 object-cover rounded-lg mb-3 shadow"
                    @error="handleImageError($event, category)"
                  />
                  <div class="font-bold text-lg text-gray-900 dark:text-white capitalize">{{ item.name }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">{{ item.description }}</div>
                  <div class="text-xs text-primary-600 dark:text-primary-400 font-medium mb-1">{{ item.category }}</div>
                  <div v-if="item.funFact" class="text-xs italic text-gray-500 dark:text-gray-400">💡 {{ item.funFact }}</div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Recommendation Details Modal -->
    <RecommendationDetailsModal
      :is-open="showDetailsModal"
      :recommendation="selectedRecommendation"
      @close="closeDetailsModal"
      @save="handleSaveFromModal"
      @share="handleShareFromModal"
      @find-similar="handleFindSimilar"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useTasteStore } from '../stores/taste';
import TasteDnaChart from '../components/TasteDnaChart.vue';
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
  // Implement sharing functionality
  // Could use Web Share API or generate a shareable link
  if (navigator.share) {
    navigator.share({
      title: 'My TastePulse Profile',
      text: `Check out my taste profile on TastePulse: ${tasteInput.value}`,
      url: window.location.href
    }).then(() => {
      notification.success('Shared Successfully', 'Your profile has been shared.');
    }).catch(err => {
      if (err.name !== 'AbortError') {
        notification.error('Share Failed', 'Could not share your profile.');
        console.error('Error sharing:', err);
      }
    });
  } else {
    // Fallback for browsers that don't support Web Share API
    // Copy a link to clipboard
    const dummyInput = document.createElement('input');
    document.body.appendChild(dummyInput);
    dummyInput.value = window.location.href;
    dummyInput.select();
    document.execCommand('copy');
    document.body.removeChild(dummyInput);
    
    notification.info('Link Copied', 'Profile link copied to clipboard!');
  }
}

// Function to save a specific recommendation
function saveRecommendation(item) {
  tasteStore.saveRecommendation(item);
  notification.success('Recommendation Saved', `"${item.name}" has been saved to your collection.`);
}

// Function to share a specific recommendation
function shareRecommendation(item) {
  const shareText = `Check out this ${activeCategory.value} recommendation from TastePulse: ${item.name} - ${item.description}`;
  const shareUrl = window.location.href;
  
  if (navigator.share) {
    navigator.share({
      title: `TastePulse ${activeCategory.value.charAt(0).toUpperCase() + activeCategory.value.slice(1)} Recommendation`,
      text: shareText,
      url: shareUrl
    }).then(() => {
      notification.success('Shared Successfully', 'Your recommendation has been shared.');
    }).catch(err => {
      if (err.name !== 'AbortError') {
        notification.error('Share Failed', 'Could not share this recommendation.');
        console.error('Error sharing:', err);
        // Fallback to clipboard if sharing fails
        copyToClipboard(shareText + ' ' + shareUrl);
      }
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
  try {
    const res = await fetch('/.netlify/functions/surprise-me');
    if (!res.ok) throw new Error('Failed to fetch surprise recommendations');
    surpriseResults.value = await res.json();
    isSurpriseVisible.value = true;
  } catch (err) {
    surpriseResults.value = null;
    isSurpriseVisible.value = false;
    // Optionally show a notification
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
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
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
  0%, 100% {
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
  0%, 100% {
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
  0%, 100% {
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