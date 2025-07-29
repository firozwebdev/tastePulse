<template>
  <div
    class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
    <!-- Profile Header -->
    <div class="relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <svg class="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cultural-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.3" />
              <path d="M5,5 L15,15 M15,5 L5,15" stroke="currentColor" stroke-width="0.5" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#cultural-pattern)" />
        </svg>
      </div>

      <!-- Profile Hero Section -->
      <div class="relative px-4 py-12 sm:px-6 lg:px-8">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <!-- Profile Avatar with Cultural DNA Ring -->
            <div class="relative inline-block mb-6">
              <div class="w-32 h-32 mx-auto relative">
                <!-- DNA Ring Animation -->
                <div
                  class="absolute inset-0 rounded-full border-4 border-purple-200 dark:border-purple-800 animate-spin"
                  style="animation-duration: 20s;"></div>
                <div class="absolute inset-2 rounded-full border-2 border-blue-200 dark:border-blue-800 animate-spin"
                  style="animation-duration: 15s; animation-direction: reverse;"></div>

                <!-- Avatar -->
                <div
                  class="absolute inset-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-2xl">
                  {{ userInitials }}
                </div>

                <!-- Cultural Level Badge -->
                <div
                  class="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  Level {{ culturalLevel }}
                </div>
              </div>
            </div>

            <!-- User Info -->
            <h1 class="text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">
              {{ user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Cultural Explorer' }}
            </h1>
            <p class="text-xl text-gray-600 dark:text-gray-400 mb-4">
              {{ userPersonality?.name || 'Discovering Cultural Identity...' }}
            </p>

            <!-- Cultural Stats -->
            <div class="flex justify-center space-x-8 mb-8">
              <div class="text-center">
                <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ totalRecommendations }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Discoveries</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ culturalConnections }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Connections</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ exploredEras }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Eras Explored</div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-center space-x-4">
              <button @click="shareProfile"
                class="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
                <svg class="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z">
                  </path>
                </svg>
                Share Profile
              </button>
              <button @click="editProfile"
                class="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-purple-500 hover:shadow-lg px-6 py-3 rounded-lg font-semibold transition-all">
                <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                  </path>
                </svg>
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Content -->
    <div class="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <!-- Cultural Dashboard -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

        <!-- Cultural Personality Card -->
        <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div class="flex items-center mb-6">
            <div class="text-3xl mr-4">🎭</div>
            <div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Cultural Personality</h3>
              <p class="text-gray-600 dark:text-gray-400">Your unique cultural identity</p>
            </div>
          </div>

          <div v-if="userPersonality" class="space-y-6">
            <!-- Personality Type -->
            <div
              class="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6">
              <div class="flex items-center mb-4">
                <div class="text-4xl mr-4">{{ userPersonality.icon }}</div>
                <div>
                  <h4 class="text-xl font-bold text-gray-900 dark:text-white">{{ userPersonality.name }}</h4>
                  <p class="text-gray-600 dark:text-gray-400">{{ userPersonality.description }}</p>
                </div>
              </div>

              <!-- Personality Traits -->
              <div class="flex flex-wrap gap-2">
                <span v-for="trait in userPersonality.traits" :key="trait"
                  class="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
                  {{ trait }}
                </span>
              </div>
            </div>

            <!-- Personality Dimensions -->
            <div class="space-y-4">
              <h5 class="font-semibold text-gray-900 dark:text-white">Personality Dimensions</h5>
              <div v-for="(score, dimension) in personalityScores" :key="dimension" class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="font-medium text-gray-700 dark:text-gray-300 capitalize">{{ dimension.replace('_', ' ')
                    }}</span>
                  <span class="text-gray-600 dark:text-gray-400">{{ Math.abs(score) }}%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div class="h-2 rounded-full transition-all duration-1000"
                    :class="score >= 0 ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-gradient-to-r from-orange-500 to-red-500'"
                    :style="{ width: Math.abs(score) + '%' }"></div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8">
            <div class="text-6xl mb-4">🎭</div>
            <p class="text-gray-600 dark:text-gray-400 mb-4">Discover your cultural personality</p>
            <button @click="discoverPersonality"
              class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Analyze My Personality
            </button>
          </div>
        </div>

        <!-- Quick Stats Card -->
        <div class="space-y-6">
          <!-- Cultural Level Progress -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Cultural Level</h4>
            <div class="relative">
              <div class="w-24 h-24 mx-auto relative">
                <svg class="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="currentColor" stroke-width="8" fill="none"
                    class="text-gray-200 dark:text-gray-700" />
                  <circle cx="50" cy="50" r="40" stroke="currentColor" stroke-width="8" fill="none"
                    class="text-purple-500" :stroke-dasharray="`${levelProgress * 2.51} 251`" stroke-linecap="round" />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ culturalLevel }}</span>
                </div>
              </div>
              <p class="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                {{ levelProgress }}% to Level {{ culturalLevel + 1 }}
              </p>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h4>
            <div class="space-y-3">
              <div v-for="activity in recentActivities" :key="activity.id" class="flex items-center space-x-3">
                <div class="text-xl">{{ activity.icon }}</div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ activity.action }}</p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">{{ activity.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cultural Journey Timeline -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
        <div class="flex items-center mb-6">
          <div class="text-3xl mr-4">🗺️</div>
          <div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Cultural Journey</h3>
            <p class="text-gray-600 dark:text-gray-400">Your exploration through different cultural domains</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(category, index) in culturalCategories" :key="category.name" class="relative">
            <!-- Connection Line -->
            <div v-if="index < culturalCategories.length - 1"
              class="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-purple-300 to-blue-300 dark:from-purple-700 dark:to-blue-700 z-0">
            </div>

            <!-- Category Card -->
            <div
              class="relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all z-10">
              <div class="text-center">
                <div class="text-3xl mb-3">{{ category.icon }}</div>
                <h4 class="font-bold text-gray-900 dark:text-white mb-2">{{ category.name }}</h4>
                <div class="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">{{ category.count }}</div>
                <p class="text-xs text-gray-600 dark:text-gray-400">Discoveries</p>

                <!-- Progress Ring -->
                <div class="mt-4">
                  <div class="w-16 h-16 mx-auto relative">
                    <svg class="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="35" stroke="currentColor" stroke-width="6" fill="none"
                        class="text-gray-200 dark:text-gray-600" />
                      <circle cx="50" cy="50" r="35" stroke="currentColor" stroke-width="6" fill="none"
                        :class="category.color" :stroke-dasharray="`${category.progress * 2.2} 220`"
                        stroke-linecap="round" />
                    </svg>
                    <div class="absolute inset-0 flex items-center justify-center">
                      <span class="text-xs font-bold text-gray-700 dark:text-gray-300">{{ category.progress }}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Saved Taste Profiles -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center">
            <div class="text-3xl mr-4">🎭</div>
            <div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Your Taste Profiles</h3>
              <p class="text-gray-600 dark:text-gray-400">Complete cultural analysis profiles you've created</p>
            </div>
          </div>
        </div>
        
        <div v-if="savedProfiles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div 
            v-for="profile in savedProfiles" 
            :key="profile.id"
            class="group bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all cursor-pointer transform hover:scale-105"
            @click="viewTasteProfile(profile)"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h4 class="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {{ profile.name }}
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {{ profile.taste_input }}
                </p>
              </div>
              <div class="text-2xl ml-3">🎨</div>
            </div>
            
            <!-- Profile Stats -->
            <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
              <span>{{ formatDate(profile.created_at) }}</span>
              <span>{{ Object.keys(profile.recommendations || {}).length }} categories</span>
            </div>
            
            <!-- Categories Preview -->
            <div class="flex flex-wrap gap-1">
              <span 
                v-for="category in Object.keys(profile.parsed_taste || {}).slice(0, 3)" 
                :key="category"
                class="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs font-medium"
              >
                {{ category }}
              </span>
              <span 
                v-if="Object.keys(profile.parsed_taste || {}).length > 3"
                class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs"
              >
                +{{ Object.keys(profile.parsed_taste || {}).length - 3 }}
              </span>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-12">
          <div class="text-6xl mb-4">🎭</div>
          <p class="text-gray-600 dark:text-gray-400 mb-4">No taste profiles created yet</p>
          <router-link 
            to="/" 
            class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
          >
            Create Your First Profile
          </router-link>
        </div>
      </div>

      <!-- Saved Collections -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
          <div class="flex items-center">
            <div class="text-3xl mr-4">💎</div>
            <div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Saved Collections</h3>
              <p class="text-gray-600 dark:text-gray-400">
                {{ filteredRecommendations.length }} cultural discoveries
                {{ selectedCategory !== 'all' ? `in ${selectedCategory}` : '' }}
              </p>
            </div>
          </div>

          <!-- Filters and Controls -->
          <div class="flex flex-col sm:flex-row gap-3">
            <!-- Category Filter -->
            <select v-model="selectedCategory"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="all">All Categories</option>
              <option v-for="category in availableCategories" :key="category" :value="category">
                {{ category.charAt(0).toUpperCase() + category.slice(1) }}
              </option>
            </select>

            <!-- Sort Options -->
            <select v-model="sortBy"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="match">Best Match</option>
              <option value="name">Name A-Z</option>
            </select>

            <!-- View Toggle -->
            <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button @click="viewMode = 'grid'" :class="[
                'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              ]">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z">
                  </path>
                </svg>
              </button>
              <button @click="viewMode = 'list'" :class="[
                'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              ]">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clip-rule="evenodd"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Grid View -->
        <div v-if="filteredRecommendations.length > 0 && viewMode === 'grid'"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="item in filteredRecommendations" :key="item.id"
            class="group bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all cursor-pointer transform hover:scale-105"
            @click="viewRecommendation(item)">
            <div class="flex items-start space-x-4">
              <div class="text-2xl">{{ getCategoryIcon(item.category) }}</div>
              <div class="flex-1">
                <h4
                  class="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {{ item.name }}
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                  {{ item.description }}
                </p>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500 dark:text-gray-500 capitalize">{{ item.category }}</span>
                  <div class="flex items-center text-xs text-green-600 dark:text-green-400">
                    <div class="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    {{ item.match }}% match
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- List View -->
        <div v-else-if="filteredRecommendations.length > 0 && viewMode === 'list'" class="space-y-4">
          <div v-for="item in filteredRecommendations" :key="item.id"
            class="group bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all cursor-pointer"
            @click="viewRecommendation(item)">
            <div class="flex items-center space-x-6">
              <!-- Icon and Basic Info -->
              <div class="flex items-center space-x-4 flex-1">
                <div class="text-3xl">{{ getCategoryIcon(item.category) }}</div>
                <div class="flex-1">
                  <h4
                    class="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {{ item.name }}
                  </h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                    {{ item.description }}
                  </p>
                  <div class="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-500">
                    <span class="capitalize">{{ item.category }}</span>
                    <span>•</span>
                    <span>{{ formatDate(item.created_at) }}</span>
                  </div>
                </div>
              </div>

              <!-- Match Score -->
              <div class="flex items-center space-x-3">
                <div class="text-right">
                  <div class="flex items-center text-green-600 dark:text-green-400 mb-1">
                    <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span class="font-semibold">{{ item.match }}%</span>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-500">Match</p>
                </div>

                <!-- Arrow Icon -->
                <svg class="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <div class="text-6xl mb-4">📚</div>
          <p class="text-gray-600 dark:text-gray-400 mb-4">No saved recommendations yet</p>
          <router-link to="/"
            class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block">
            Discover Recommendations
          </router-link>
        </div>
      </div>

      <!-- Cultural Achievements -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div class="flex items-center mb-6">
          <div class="text-3xl mr-4">🏆</div>
          <div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Cultural Achievements</h3>
            <p class="text-gray-600 dark:text-gray-400">Milestones in your cultural journey</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="achievement in achievements" :key="achievement.id" :class="[
            'relative bg-gradient-to-br rounded-xl p-6 border transition-all',
            achievement.unlocked
              ? 'from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800'
              : 'from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-gray-200 dark:border-gray-600 opacity-60'
          ]">
            <!-- Achievement Badge -->
            <div class="text-center">
              <div :class="['text-4xl mb-3', achievement.unlocked ? '' : 'grayscale']">
                {{ achievement.icon }}
              </div>
              <h4
                :class="['font-bold mb-2', achievement.unlocked ? 'text-yellow-800 dark:text-yellow-200' : 'text-gray-600 dark:text-gray-400']">
                {{ achievement.name }}
              </h4>
              <p
                :class="['text-sm mb-3', achievement.unlocked ? 'text-yellow-700 dark:text-yellow-300' : 'text-gray-500 dark:text-gray-500']">
                {{ achievement.description }}
              </p>

              <!-- Progress Bar for Locked Achievements -->
              <div v-if="!achievement.unlocked && achievement.progress !== undefined" class="mt-4">
                <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    class="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                    :style="{ width: achievement.progress + '%' }"></div>
                </div>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {{ achievement.progress }}% Complete
                </p>
              </div>

              <!-- Unlock Date -->
              <div v-if="achievement.unlocked" class="mt-4">
                <p class="text-xs text-yellow-600 dark:text-yellow-400">
                  Unlocked {{ achievement.unlockedDate }}
                </p>
              </div>
            </div>

            <!-- Shine Effect for Unlocked Achievements -->
            <div v-if="achievement.unlocked"
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse">
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="text-2xl mr-3">✏️</div>
            <div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Update your cultural identity and preferences</p>
            </div>
          </div>
          <button @click="closeEditModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-6 space-y-8">
          <!-- Basic Information -->
          <div class="space-y-6">
            <div class="flex items-center mb-4">
              <div class="text-xl mr-3">👤</div>
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h4>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input v-model="editForm.fullName" type="text"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  placeholder="Enter your full name" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Display Name
                </label>
                <input v-model="editForm.displayName" type="text"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  placeholder="How others see you" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              <textarea v-model="editForm.bio" rows="3"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors resize-none"
                placeholder="Tell others about your cultural interests and personality..."></textarea>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ editForm.bio?.length || 0 }}/200 characters
              </p>
            </div>
          </div>

          <!-- Cultural Preferences -->
          <div class="space-y-6">
            <div class="flex items-center mb-4">
              <div class="text-xl mr-3">🎭</div>
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Cultural Preferences</h4>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Favorite Cultural Categories
              </label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div v-for="category in availableCategories" :key="category.id" @click="toggleCategory(category.id)"
                  :class="[
                    'flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all',
                    editForm.favoriteCategories.includes(category.id)
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400'
                  ]">
                  <div class="text-2xl mb-2">{{ category.icon }}</div>
                  <span class="text-sm font-medium">{{ category.name }}</span>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Cultural Exploration Style
              </label>
              <div class="space-y-3">
                <div v-for="style in explorationStyles" :key="style.id" @click="editForm.explorationStyle = style.id"
                  :class="[
                    'flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all',
                    editForm.explorationStyle === style.id
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  ]">
                  <div class="text-xl mr-3">{{ style.icon }}</div>
                  <div>
                    <h5 class="font-medium text-gray-900 dark:text-white">{{ style.name }}</h5>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ style.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Privacy Settings -->
          <div class="space-y-6">
            <div class="flex items-center mb-4">
              <div class="text-xl mr-3">🔒</div>
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Privacy Settings</h4>
            </div>

            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <h5 class="font-medium text-gray-900 dark:text-white">Public Profile</h5>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Allow others to view your cultural profile</p>
                </div>
                <button @click="editForm.isPublic = !editForm.isPublic" :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  editForm.isPublic ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                ]">
                  <span :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    editForm.isPublic ? 'translate-x-6' : 'translate-x-1'
                  ]" />
                </button>
              </div>

              <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <h5 class="font-medium text-gray-900 dark:text-white">Show Achievements</h5>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Display your cultural achievements publicly</p>
                </div>
                <button @click="editForm.showAchievements = !editForm.showAchievements" :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  editForm.showAchievements ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                ]">
                  <span :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    editForm.showAchievements ? 'translate-x-6' : 'translate-x-1'
                  ]" />
                </button>
              </div>

              <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <h5 class="font-medium text-gray-900 dark:text-white">Activity Tracking</h5>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Track your cultural exploration activity</p>
                </div>
                <button @click="editForm.trackActivity = !editForm.trackActivity" :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  editForm.trackActivity ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                ]">
                  <span :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    editForm.trackActivity ? 'translate-x-6' : 'translate-x-1'
                  ]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <button @click="closeEditModal"
            class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Cancel
          </button>
          <div class="flex space-x-3">
            <button @click="resetForm"
              class="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
              Reset
            </button>
            <button @click="saveProfile" :disabled="isSaving"
              class="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
              <svg v-if="isSaving" class="w-5 h-5 inline mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              {{ isSaving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Recommendation Details Modal -->
    <div v-if="showRecommendationModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="relative">
          <!-- Background Image -->
          <div v-if="selectedRecommendation?.image" class="h-48 bg-cover bg-center rounded-t-2xl"
            :style="{ backgroundImage: `url(${selectedRecommendation.image})` }">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-2xl"></div>
          </div>
          <div v-else class="h-48 bg-gradient-to-br from-purple-500 to-blue-600 rounded-t-2xl"></div>

          <!-- Close Button -->
          <button @click="closeRecommendationModal"
            class="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <!-- Title Overlay -->
          <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div class="flex items-center mb-2">
              <div class="text-3xl mr-3">{{ getCategoryIcon(selectedRecommendation?.category) }}</div>
              <div>
                <h3 class="text-2xl font-bold">{{ selectedRecommendation?.name }}</h3>
                <p class="text-white/80 capitalize">{{ selectedRecommendation?.category }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Content -->
        <div class="p-6 space-y-6">
          <!-- Match Score -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="flex items-center text-green-600 dark:text-green-400">
                <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span class="font-semibold">{{ selectedRecommendation?.match }}% Match</span>
              </div>
              <div v-if="selectedRecommendation?.rating" class="flex items-center text-yellow-500">
                <svg class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                  </path>
                </svg>
                <span class="font-semibold">{{ selectedRecommendation.rating }}/5</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-3">
              <button @click="shareRecommendation"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                <svg class="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z">
                  </path>
                </svg>
                Share
              </button>
              <button @click="removeRecommendation"
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                  </path>
                </svg>
                Remove
              </button>
            </div>
          </div>

          <!-- Description -->
          <div>
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h4>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
              {{ selectedRecommendation?.description }}
            </p>
          </div>

          <!-- Additional Details -->
          <div v-if="selectedRecommendation?.details" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Artist/Creator -->
            <div v-if="selectedRecommendation.artist || selectedRecommendation.creator">
              <h5 class="font-semibold text-gray-900 dark:text-white mb-2">
                {{ selectedRecommendation.category === 'music' ? 'Artist' : 'Creator' }}
              </h5>
              <p class="text-gray-600 dark:text-gray-400">
                {{ selectedRecommendation.artist || selectedRecommendation.creator }}
              </p>
            </div>

            <!-- Genre/Style -->
            <div v-if="selectedRecommendation.genre || selectedRecommendation.style">
              <h5 class="font-semibold text-gray-900 dark:text-white mb-2">
                {{ selectedRecommendation.category === 'music' ? 'Genre' : 'Style' }}
              </h5>
              <p class="text-gray-600 dark:text-gray-400">
                {{ selectedRecommendation.genre || selectedRecommendation.style }}
              </p>
            </div>

            <!-- Year/Date -->
            <div v-if="selectedRecommendation.year || selectedRecommendation.date">
              <h5 class="font-semibold text-gray-900 dark:text-white mb-2">Year</h5>
              <p class="text-gray-600 dark:text-gray-400">
                {{ selectedRecommendation.year || selectedRecommendation.date }}
              </p>
            </div>

            <!-- Duration/Length -->
            <div v-if="selectedRecommendation.duration || selectedRecommendation.length">
              <h5 class="font-semibold text-gray-900 dark:text-white mb-2">Duration</h5>
              <p class="text-gray-600 dark:text-gray-400">
                {{ selectedRecommendation.duration || selectedRecommendation.length }}
              </p>
            </div>
          </div>

          <!-- Tags -->
          <div v-if="selectedRecommendation?.tags && selectedRecommendation.tags.length > 0">
            <h5 class="font-semibold text-gray-900 dark:text-white mb-3">Tags</h5>
            <div class="flex flex-wrap gap-2">
              <span v-for="tag in selectedRecommendation.tags" :key="tag"
                class="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- External Links -->
          <div v-if="selectedRecommendation?.links && Object.keys(selectedRecommendation.links).length > 0"
            class="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h5 class="font-semibold text-gray-900 dark:text-white mb-3">External Links</h5>
            <div class="flex flex-wrap gap-3">
              <a v-for="(url, platform) in selectedRecommendation.links" :key="platform" :href="url" target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
                {{ platform.charAt(0).toUpperCase() + platform.slice(1) }}
              </a>
            </div>
          </div>

          <!-- Saved Date -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Saved on {{ formatDate(selectedRecommendation?.created_at) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useTasteStore } from '../stores/taste';
import { useNotification } from '../composables/useNotification';
import { useRouter } from 'vue-router';

const tasteStore = useTasteStore();
const notification = useNotification();
const router = useRouter();

// Reactive data
const userPersonality = ref(null);
const personalityScores = ref({});
const savedRecommendations = ref([]);
const recentActivities = ref([]);
const achievements = ref([]);
const isLoading = ref(false);

// Profile editing data
const showEditModal = ref(false);
const isSaving = ref(false);

// Recommendation details modal
const showRecommendationModal = ref(false);
const selectedRecommendation = ref(null);

// Filtering and sorting
const selectedCategory = ref('all');
const sortBy = ref('newest');
const viewMode = ref('grid');
const editForm = ref({
  fullName: '',
  displayName: '',
  bio: '',
  favoriteCategories: [],
  explorationStyle: 'adventurous',
  isPublic: true,
  showAchievements: true,
  trackActivity: true
});

// Available options for editing
// const availableCategories = ref([
//   { id: 'music', name: 'Music', icon: '🎵' },
//   { id: 'food', name: 'Food', icon: '🍽️' },
//   { id: 'travel', name: 'Travel', icon: '✈️' },
//   { id: 'books', name: 'Books', icon: '📚' },
//   { id: 'movies', name: 'Movies', icon: '🎬' },
//   { id: 'art', name: 'Art', icon: '🎨' },
//   { id: 'fashion', name: 'Fashion', icon: '👗' },
//   { id: 'technology', name: 'Technology', icon: '💻' }
// ]);

const explorationStyles = ref([
  {
    id: 'adventurous',
    name: 'Adventurous Explorer',
    icon: '🚀',
    description: 'Love discovering completely new and unexpected cultural experiences'
  },
  {
    id: 'methodical',
    name: 'Methodical Curator',
    icon: '📋',
    description: 'Prefer systematic exploration with detailed analysis and comparison'
  },
  {
    id: 'social',
    name: 'Social Discoverer',
    icon: '👥',
    description: 'Enjoy cultural experiences that can be shared and discussed with others'
  },
  {
    id: 'introspective',
    name: 'Introspective Seeker',
    icon: '🧘',
    description: 'Focus on deep, meaningful cultural experiences that promote self-reflection'
  }
]);

// Computed properties
const user = computed(() => tasteStore.user);

const userInitials = computed(() => {
  const name = user.value?.user_metadata?.full_name || user.value?.email || 'User';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
});

const totalRecommendations = computed(() => {
  return savedRecommendations.value.length;
});

const culturalConnections = computed(() => {
  // Calculate based on cross-category recommendations
  const categories = new Set(savedRecommendations.value.map(r => r.category));
  return categories.size * 3; // Mock calculation
});

const exploredEras = computed(() => {
  // Mock calculation - in real app, track time travel usage
  return Math.min(5, Math.floor(totalRecommendations.value / 5));
});

const culturalLevel = computed(() => {
  return Math.floor(totalRecommendations.value / 10) + 1;
});

const levelProgress = computed(() => {
  const currentLevelReqs = culturalLevel.value * 10;
  const nextLevelReqs = (culturalLevel.value + 1) * 10;
  const progress = ((totalRecommendations.value - (currentLevelReqs - 10)) / 10) * 100;
  return Math.min(100, Math.max(0, progress));
});

const culturalCategories = computed(() => {
  const categories = ['music', 'food', 'travel', 'books'];
  return categories.map(category => {
    const count = savedRecommendations.value.filter(r => r.category === category).length;
    const progress = Math.min(100, (count / 5) * 100); // 5 items = 100%

    return {
      name: category.charAt(0).toUpperCase() + category.slice(1),
      icon: getCategoryIcon(category),
      count,
      progress: Math.round(progress),
      color: {
        music: 'text-purple-500',
        food: 'text-orange-500',
        travel: 'text-blue-500',
        books: 'text-green-500'
      }[category]
    };
  });
});

// Available categories for filtering
const availableCategories = computed(() => {
  const categories = [...new Set(savedRecommendations.value.map(r => r.category))];
  return categories.sort();
});

// Filtered and sorted recommendations
const filteredRecommendations = computed(() => {
  let filtered = savedRecommendations.value;

  // Filter by category
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(item => item.category === selectedCategory.value);
  }

  // Sort recommendations
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy.value) {
      case 'newest':
        return new Date(b.created_at || b.date || 0) - new Date(a.created_at || a.date || 0);
      case 'oldest':
        return new Date(a.created_at || a.date || 0) - new Date(b.created_at || b.date || 0);
      case 'match':
        return (b.match || 0) - (a.match || 0);
      case 'name':
        return (a.name || '').localeCompare(b.name || '');
      default:
        return 0;
    }
  });

  return filtered;
});

// Methods
function getCategoryIcon(category) {
  const icons = {
    music: '🎵',
    food: '🍽️',
    travel: '✈️',
    books: '📚'
  };
  return icons[category] || '🎭';
}

async function discoverPersonality() {
  if (!tasteStore.recommendations || Object.keys(tasteStore.recommendations).length === 0) {
    notification.warning('No Data Available', 'Please get some recommendations first to analyze your personality.');
    router.push('/');
    return;
  }

  isLoading.value = true;
  notification.info('Analyzing Personality', 'Discovering your cultural personality type...');

  try {
    const response = await fetch('/.netlify/functions/taste-personality', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recommendations: tasteStore.recommendations,
        tasteBridges: []
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    userPersonality.value = data.personality_type;
    personalityScores.value = data.personality_scores;

    notification.success(
      'Personality Discovered!',
      `You are "${data.personality_type.name}" - ${data.personality_type.description.substring(0, 80)}...`
    );
  } catch (error) {
    console.error('Error discovering personality:', error);
    notification.error('Discovery Failed', 'Could not analyze your cultural personality. Please try again.');
  } finally {
    isLoading.value = false;
  }
}

function shareProfile() {
  const shareText = `Check out my TastePulse cultural profile! I'm a ${userPersonality.value?.name || 'Cultural Explorer'} with ${totalRecommendations.value} discoveries across ${culturalConnections.value} cultural connections.`;
  const baseUrl = window.location.hostname === 'localhost'
    ? 'https://tastepulse.netlify.app'
    : window.location.origin;
  const shareUrl = `${baseUrl}/profile`;

  if (navigator.share) {
    navigator.share({
      title: 'My TastePulse Cultural Profile',
      text: shareText,
      url: shareUrl
    }).then(() => {
      notification.success('Profile Shared', 'Your cultural profile has been shared!');
    }).catch(err => {
      if (err.name !== 'AbortError') {
        copyToClipboard(shareText + ' ' + shareUrl);
      }
    });
  } else {
    copyToClipboard(shareText + ' ' + shareUrl);
  }
}

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
    notification.success('Copied to Clipboard', 'Profile link copied to clipboard!');
  }
}

function editProfile() {
  // Initialize form with current user data
  initializeEditForm();
  showEditModal.value = true;
}

function initializeEditForm() {
  // Load current user data into the form
  editForm.value = {
    fullName: user.value?.user_metadata?.full_name || '',
    displayName: user.value?.user_metadata?.display_name || user.value?.email?.split('@')[0] || '',
    bio: user.value?.user_metadata?.bio || '',
    favoriteCategories: user.value?.user_metadata?.favorite_categories || ['music', 'food'],
    explorationStyle: user.value?.user_metadata?.exploration_style || 'adventurous',
    isPublic: user.value?.user_metadata?.is_public !== false,
    showAchievements: user.value?.user_metadata?.show_achievements !== false,
    trackActivity: user.value?.user_metadata?.track_activity !== false
  };
}

function closeEditModal() {
  showEditModal.value = false;
  // Reset form to original values
  initializeEditForm();
}

function resetForm() {
  initializeEditForm();
  notification.info('Form Reset', 'All changes have been reset to original values.');
}

function toggleCategory(categoryId) {
  const index = editForm.value.favoriteCategories.indexOf(categoryId);
  if (index > -1) {
    editForm.value.favoriteCategories.splice(index, 1);
  } else {
    editForm.value.favoriteCategories.push(categoryId);
  }
}

async function saveProfile() {
  if (!editForm.value.fullName.trim()) {
    notification.error('Validation Error', 'Full name is required.');
    return;
  }

  if (editForm.value.bio && editForm.value.bio.length > 200) {
    notification.error('Validation Error', 'Bio must be 200 characters or less.');
    return;
  }

  isSaving.value = true;

  try {
    // Update user profile using the taste store method
    await tasteStore.updateUserProfileComplete({
      fullName: editForm.value.fullName,
      displayName: editForm.value.displayName,
      bio: editForm.value.bio,
      favoriteCategories: editForm.value.favoriteCategories,
      explorationStyle: editForm.value.explorationStyle,
      isPublic: editForm.value.isPublic,
      showAchievements: editForm.value.showAchievements,
      trackActivity: editForm.value.trackActivity
    });

    notification.success(
      'Profile Updated!',
      'Your cultural profile has been successfully updated.'
    );

    closeEditModal();
  } catch (error) {
    console.error('Error updating profile:', error);
    notification.error(
      'Update Failed',
      'Could not update your profile. Please try again.'
    );
  } finally {
    isSaving.value = false;
  }
}

function viewAllCollections() {
  // Navigate to collections page
  notification.info('Coming Soon', 'Collections page is coming soon!');
}

function viewRecommendation(item) {
  selectedRecommendation.value = item;
  showRecommendationModal.value = true;
}

function closeRecommendationModal() {
  showRecommendationModal.value = false;
  selectedRecommendation.value = null;
}

function shareRecommendation() {
  if (!selectedRecommendation.value) return;

  const shareText = `Check out this amazing recommendation: ${selectedRecommendation.value.name} - ${selectedRecommendation.value.description}`;
  const baseUrl = window.location.hostname === 'localhost'
    ? 'https://tastepulse.netlify.app'
    : window.location.origin;
  const shareUrl = `${baseUrl}/profile`;

  if (navigator.share) {
    navigator.share({
      title: selectedRecommendation.value.name,
      text: shareText,
      url: shareUrl
    }).then(() => {
      notification.success('Shared!', 'Recommendation shared successfully!');
    }).catch(err => {
      if (err.name !== 'AbortError') {
        copyToClipboard(shareText + ' ' + shareUrl);
      }
    });
  } else {
    copyToClipboard(shareText + ' ' + shareUrl);
  }
}

async function removeRecommendation() {
  if (!selectedRecommendation.value) return;

  try {
    // Remove from store
    await tasteStore.deleteSavedRecommendation(selectedRecommendation.value.id);

    // Remove from local array
    const index = savedRecommendations.value.findIndex(item => item.id === selectedRecommendation.value.id);
    if (index > -1) {
      savedRecommendations.value.splice(index, 1);
    }

    notification.success('Removed!', 'Recommendation removed from your collection.');
    closeRecommendationModal();
  } catch (error) {
    console.error('Error removing recommendation:', error);
    notification.error('Remove Failed', 'Could not remove the recommendation. Please try again.');
  }
}

function formatDate(dateString) {
  if (!dateString) return 'Unknown date';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return 'Unknown date';
  }
}

// Initialize data
async function initializeProfileData() {
  console.log('🚀 ProfileEnhanced: Starting to initialize profile data...');
  console.log('🚀 ProfileEnhanced: User authenticated?', tasteStore.isAuthenticated);
  console.log('🚀 ProfileEnhanced: Current user:', tasteStore.user);

  // Load saved recommendations from store
  try {
    console.log('🚀 ProfileEnhanced: Calling loadSavedRecommendations...');
    await tasteStore.loadSavedRecommendations();

    console.log('🚀 ProfileEnhanced: tasteStore.savedRecommendations:', tasteStore.savedRecommendations);
    console.log('🚀 ProfileEnhanced: Raw array length:', tasteStore.savedRecommendations?.length);
    console.log('🚀 ProfileEnhanced: All items:', tasteStore.savedRecommendations);

    savedRecommendations.value = tasteStore.savedRecommendations || [];

    console.log('🔍 ProfileEnhanced: Final savedRecommendations.value:', savedRecommendations.value);
    console.log('🔍 ProfileEnhanced: Final length:', savedRecommendations.value.length);

    // Log each recommendation individually
    savedRecommendations.value.forEach((item, index) => {
      console.log(`🔍 ProfileEnhanced: Recommendation ${index + 1}:`, {
        id: item.id,
        name: item.name,
        category: item.category,
        match: item.match
      });
    });

    if (savedRecommendations.value.length === 0) {
      console.log('❌ ProfileEnhanced: No saved recommendations found');

      // Check localStorage directly
      const localStorageData = localStorage.getItem('savedRecommendations');
      console.log('🔍 ProfileEnhanced: Raw localStorage data:', localStorageData);

      const tasteProfiles = localStorage.getItem('tasteProfiles');
      console.log('🔍 ProfileEnhanced: Raw tasteProfiles data:', tasteProfiles);
    }
  } catch (error) {
    console.error('❌ ProfileEnhanced: Error loading saved recommendations:', error);
    savedRecommendations.value = [];
  }

  // Generate recent activities
  recentActivities.value = [
    {
      id: 1,
      icon: '🎭',
      action: 'Discovered cultural personality',
      time: '2 hours ago'
    },
    {
      id: 2,
      icon: '🎨',
      action: 'Generated taste art',
      time: '1 day ago'
    },
    {
      id: 3,
      icon: '⏰',
      action: 'Explored 1980s taste profile',
      time: '2 days ago'
    },
    {
      id: 4,
      icon: '🌍',
      action: 'Viewed global cultural trends',
      time: '3 days ago'
    }
  ];

  // Generate achievements
  achievements.value = [
    {
      id: 1,
      name: 'First Discovery',
      description: 'Made your first cultural discovery',
      icon: '🌟',
      unlocked: totalRecommendations.value > 0,
      unlockedDate: '2 days ago'
    },
    {
      id: 2,
      name: 'Cultural Explorer',
      description: 'Discovered 10 recommendations',
      icon: '🗺️',
      unlocked: totalRecommendations.value >= 10,
      progress: Math.min(100, (totalRecommendations.value / 10) * 100),
      unlockedDate: totalRecommendations.value >= 10 ? '1 day ago' : null
    },
    {
      id: 3,
      name: 'Time Traveler',
      description: 'Explored different cultural eras',
      icon: '⏰',
      unlocked: exploredEras.value >= 3,
      progress: Math.min(100, (exploredEras.value / 3) * 100),
      unlockedDate: exploredEras.value >= 3 ? '3 days ago' : null
    },
    {
      id: 4,
      name: 'Cultural Connoisseur',
      description: 'Reached Level 5 cultural mastery',
      icon: '🎩',
      unlocked: culturalLevel.value >= 5,
      progress: Math.min(100, (culturalLevel.value / 5) * 100),
      unlockedDate: culturalLevel.value >= 5 ? '1 week ago' : null
    },
    {
      id: 5,
      name: 'Taste Curator',
      description: 'Saved 25 recommendations',
      icon: '💎',
      unlocked: totalRecommendations.value >= 25,
      progress: Math.min(100, (totalRecommendations.value / 25) * 100),
      unlockedDate: totalRecommendations.value >= 25 ? '5 days ago' : null
    },
    {
      id: 6,
      name: 'Cultural Bridge Builder',
      description: 'Connected 50 cultural elements',
      icon: '🌉',
      unlocked: culturalConnections.value >= 50,
      progress: Math.min(100, (culturalConnections.value / 50) * 100),
      unlockedDate: culturalConnections.value >= 50 ? '1 week ago' : null
    }
  ];
}

onMounted(async () => {
  await initializeProfileData();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.font-display {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.grayscale {
  filter: grayscale(100%);
}
</style>