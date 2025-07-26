<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Hero Section -->
      <div class="text-center mb-12 animate-fade-in">
        <h1 class="text-4xl md:text-5xl font-display font-bold gradient-text mb-4">
          About TastePulse
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Discover your cultural fingerprint and explore personalized recommendations across multiple domains
        </p>
      </div>
      
      <!-- Mission Section -->
      <div class="bg-white dark:bg-dark-card rounded-xl shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border p-6 md:p-8 mb-8 animate-slide-in-bottom">
        <div class="flex flex-col md:flex-row gap-8 items-center">
          <div class="w-full md:w-1/3">
            <div class="relative">
              <div class="w-full h-64 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg animate-pulse-glow"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
            </div>
          </div>
          
          <div class="w-full md:w-2/3">
            <h2 class="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
            <p class="text-gray-700 dark:text-gray-300 mb-6">
              TastePulse is an AI-powered cultural recommendation app designed to help you discover new experiences across multiple domains based on your unique taste profile. Our mission is to break down the barriers between different cultural elements and help you find connections between your interests in music, food, books, travel, fashion, and more.
            </p>
            <div class="flex flex-wrap gap-2">
              <span class="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm rounded-full">
                AI-Powered
              </span>
              <span class="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm rounded-full">
                Multilingual
              </span>
              <span class="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm rounded-full">
                Cross-Domain
              </span>
              <span class="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm rounded-full">
                Personalized
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- How It Works Section -->
      <div class="bg-white dark:bg-dark-card rounded-xl shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border p-6 md:p-8 mb-8 animate-slide-in-bottom delay-100">
        <h2 class="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">How It Works</h2>
        
        <div class="space-y-6 mb-6">
          <div class="flex gap-4 animate-slide-in-left delay-200">
            <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse-glow">
              <span class="font-bold text-xl text-primary-600 dark:text-primary-400">1</span>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Natural Language Input</h3>
              <p class="text-gray-600 dark:text-gray-400 mt-1">
                Simply tell us what you enjoy in your own words. Our AI understands your preferences in multiple languages including English, Bangla, and Spanish.
              </p>
              <div class="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 italic">
                "I love lo-fi beats, Japanese ramen, Murakami novels, and exploring hidden cafes in Kyoto."
              </div>
            </div>
          </div>
          
          <div class="flex gap-4 animate-slide-in-right delay-300">
            <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse-glow">
              <span class="font-bold text-xl text-primary-600 dark:text-primary-400">2</span>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">AI Taste Analysis</h3>
              <p class="text-gray-600 dark:text-gray-400 mt-1">
                Our advanced AI parses your input to extract structured taste categories, identifying your preferences across different cultural domains.
              </p>
              <div class="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                <div class="bg-taste-music/10 p-2 rounded-lg border border-taste-music/20">
                  <div class="text-xs text-gray-500 dark:text-gray-400">MUSIC</div>
                  <div class="text-sm font-medium text-taste-music">lo-fi beats</div>
                </div>
                <div class="bg-taste-food/10 p-2 rounded-lg border border-taste-food/20">
                  <div class="text-xs text-gray-500 dark:text-gray-400">FOOD</div>
                  <div class="text-sm font-medium text-taste-food">Japanese ramen</div>
                </div>
                <div class="bg-taste-book/10 p-2 rounded-lg border border-taste-book/20">
                  <div class="text-xs text-gray-500 dark:text-gray-400">BOOK</div>
                  <div class="text-sm font-medium text-taste-book">Murakami novels</div>
                </div>
                <div class="bg-taste-travel/10 p-2 rounded-lg border border-taste-travel/20">
                  <div class="text-xs text-gray-500 dark:text-gray-400">TRAVEL</div>
                  <div class="text-sm font-medium text-taste-travel">Kyoto cafes</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex gap-4 animate-slide-in-left delay-400">
            <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse-glow">
              <span class="font-bold text-xl text-primary-600 dark:text-primary-400">3</span>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Cultural Recommendations</h3>
              <p class="text-gray-600 dark:text-gray-400 mt-1">
                Using the Qloo Taste Graph API, we generate personalized recommendations that match your unique taste profile across multiple categories.
              </p>
              <div class="mt-2 flex overflow-x-auto gap-3 pb-2">
                <div class="flex-shrink-0 w-32 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div class="h-24 bg-gray-100 dark:bg-gray-700"></div>
                  <div class="p-2">
                    <div class="text-xs text-taste-music font-medium">MUSIC</div>
                    <div class="text-sm text-gray-900 dark:text-white truncate">Nujabes</div>
                  </div>
                </div>
                <div class="flex-shrink-0 w-32 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div class="h-24 bg-gray-100 dark:bg-gray-700"></div>
                  <div class="p-2">
                    <div class="text-xs text-taste-food font-medium">FOOD</div>
                    <div class="text-sm text-gray-900 dark:text-white truncate">Ichiran Ramen</div>
                  </div>
                </div>
                <div class="flex-shrink-0 w-32 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div class="h-24 bg-gray-100 dark:bg-gray-700"></div>
                  <div class="p-2">
                    <div class="text-xs text-taste-book font-medium">BOOK</div>
                    <div class="text-sm text-gray-900 dark:text-white truncate">Norwegian Wood</div>
                  </div>
                </div>
                <div class="flex-shrink-0 w-32 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div class="h-24 bg-gray-100 dark:bg-gray-700"></div>
                  <div class="p-2">
                    <div class="text-xs text-taste-travel font-medium">TRAVEL</div>
                    <div class="text-sm text-gray-900 dark:text-white truncate">Arashiyama</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex gap-4 animate-slide-in-right delay-500">
            <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse-glow">
              <span class="font-bold text-xl text-primary-600 dark:text-primary-400">4</span>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Save & Share</h3>
              <p class="text-gray-600 dark:text-gray-400 mt-1">
                Save your taste profiles to revisit later, discover similar users, and share your cultural fingerprint with friends.
              </p>
              <div class="mt-2 flex gap-2">
                <button class="px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save Profile
                </button>
                <button class="px-3 py-1.5 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 text-sm rounded-lg flex items-center gap-1">
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
      
      <!-- Technology Stack Section -->
      <div class="bg-white dark:bg-dark-card rounded-xl shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border p-6 md:p-8 mb-8 animate-slide-in-bottom delay-200">
        <h2 class="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">Technology Stack</h2>
        
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center hover:shadow-taste transition-all duration-300 transform hover:-translate-y-1">
            <div class="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Vue 3</h3>
            <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">Progressive JavaScript Framework</p>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center hover:shadow-taste transition-all duration-300 transform hover:-translate-y-1">
            <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white">TailwindCSS</h3>
            <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">Utility-First CSS Framework</p>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center hover:shadow-taste transition-all duration-300 transform hover:-translate-y-1">
            <div class="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-yellow-600 dark:text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 3H4a1 1 0 00-1 1v16a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1zm-1 16H5V5h14v14z" />
                <path d="M11 7h2v10h-2zM7 9h2v6H7zM15 13h2v2h-2z" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Supabase</h3>
            <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">Open Source Firebase Alternative</p>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center hover:shadow-taste transition-all duration-300 transform hover:-translate-y-1">
            <div class="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.928 11.607c-.202-.488-.635-.605-.928-.633V8c0-1.103-.897-2-2-2h-6V4.61c.305-.274.5-.668.5-1.11a1.5 1.5 0 00-3 0c0 .442.195.836.5 1.11V6H5c-1.103 0-2 .897-2 2v2.997l-.082.006A1 1 0 001.99 12v2a1 1 0 001 1H3v5c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-5a1 1 0 001-1v-2a1.01 1.01 0 00-.072-.393z" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white">AI/ML</h3>
            <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">Natural Language Processing</p>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center hover:shadow-taste transition-all duration-300 transform hover:-translate-y-1">
            <div class="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-600 dark:text-red-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                <path d="M13 7h-2v6h6v-2h-4z" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Qloo API</h3>
            <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">Cultural Intelligence Platform</p>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center hover:shadow-taste transition-all duration-300 transform hover:-translate-y-1">
            <div class="w-16 h-16 bg-teal-100 dark:bg-teal-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-teal-600 dark:text-teal-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Netlify</h3>
            <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">Modern Web Deployment</p>
          </div>
        </div>
      </div>
      
      <!-- Team Section -->
      <div class="bg-white dark:bg-dark-card rounded-xl shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border p-6 md:p-8 animate-slide-in-bottom delay-300">
        <h2 class="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">Our Team</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex gap-4 hover:shadow-taste transition-all duration-300 transform hover:-translate-y-1">
            <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center">
              <span class="text-2xl font-bold text-white">SA</span>
            </div>
            <div>
              <h3 class="font-semibold text-lg text-gray-900 dark:text-white">Sabuz Ahmed</h3>
              <p class="text-sm text-primary-600 dark:text-primary-400 mb-2">Lead Developer</p>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Full-stack developer with expertise in Vue.js, AI integration, and cultural recommendation systems.
              </p>
              <div class="mt-3 flex gap-2">
                <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                  </svg>
                </a>
                <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm-1 15h-2v-6h2v6zm-1-7a1 1 0 100-2 1 1 0 000 2zm8 7h-2v-4c0-.5-.5-1-1-1s-1 .5-1 1v4h-2v-6h2v1h.1c.2-.3.6-1 1.9-1 1.6 0 2 1.2 2 2.6V17z" clip-rule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex gap-4 hover:shadow-taste transition-all duration-300 transform hover:-translate-y-1">
            <div class="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center">
              <span class="text-2xl font-bold text-white">AR</span>
            </div>
            <div>
              <h3 class="font-semibold text-lg text-gray-900 dark:text-white">Aisha Rahman</h3>
              <p class="text-sm text-primary-600 dark:text-primary-400 mb-2">AI Specialist</p>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Expert in natural language processing and multilingual AI systems with a focus on cultural understanding.
              </p>
              <div class="mt-3 flex gap-2">
                <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                  </svg>
                </a>
                <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm-1 15h-2v-6h2v6zm-1-7a1 1 0 100-2 1 1 0 000 2zm8 7h-2v-4c0-.5-.5-1-1-1s-1 .5-1 1v4h-2v-6h2v1h.1c.2-.3.6-1 1.9-1 1.6 0 2 1.2 2 2.6V17z" clip-rule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Contact Section -->
        <div class="mt-8 text-center bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-6 animate-pulse-glow">
          <h3 class="text-xl font-semibold text-white mb-2">Get in Touch</h3>
          <p class="text-white/80 mb-4">
            Have questions or feedback? We'd love to hear from you!
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              @click="showContactForm = true"
              class="px-6 py-3 bg-white text-primary-700 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Us
            </button>
            <a 
              href="mailto:contact@tastepulse.app" 
              class="px-6 py-3 bg-white/20 text-white font-medium rounded-lg hover:bg-white/30 transition-all duration-300 inline-flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Direct
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Form Modal -->
    <ContactForm v-if="showContactForm" @close="showContactForm = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ContactForm from '../components/ContactForm.vue';

const showContactForm = ref(false);
</script>