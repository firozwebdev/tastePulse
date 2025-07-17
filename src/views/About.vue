<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-6">
        About TastePulse
      </h1>
      
      <div class="bg-white dark:bg-dark-card rounded-xl shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border p-6 md:p-8 mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Our Mission</h2>
        <p class="text-gray-700 dark:text-gray-300 mb-6">
          TastePulse is an AI-powered cultural recommendation app designed to help you discover new experiences across multiple domains based on your unique taste profile. Our mission is to break down the barriers between different cultural elements and help you find connections between your interests in music, food, books, travel, fashion, and more.
        </p>
        
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">How It Works</h2>
        <div class="space-y-4 mb-6">
          <div class="flex gap-4">
            <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="font-semibold text-primary-600 dark:text-primary-400">1</span>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">Natural Language Input</h3>
              <p class="text-gray-600 dark:text-gray-400">
                Simply tell us what you enjoy in your own words. Our AI understands your preferences in multiple languages including English, Bangla, and Spanish.
              </p>
            </div>
          </div>
          
          <div class="flex gap-4">
            <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="font-semibold text-primary-600 dark:text-primary-400">2</span>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">AI Taste Analysis</h3>
              <p class="text-gray-600 dark:text-gray-400">
                Our advanced AI parses your input to extract structured taste categories, identifying your preferences across different cultural domains.
              </p>
            </div>
          </div>
          
          <div class="flex gap-4">
            <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="font-semibold text-primary-600 dark:text-primary-400">3</span>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">Cultural Recommendations</h3>
              <p class="text-gray-600 dark:text-gray-400">
                Using the Qloo Taste Graph API, we generate personalized recommendations that match your unique taste profile across multiple categories.
              </p>
            </div>
          </div>
          
          <div class="flex gap-4">
            <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="font-semibold text-primary-600 dark:text-primary-400">4</span>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">Save & Share</h3>
              <p class="text-gray-600 dark:text-gray-400">
                Save your taste profiles to revisit later, discover similar users, and share your cultural fingerprint with friends.
              </p>
            </div>
          </div>
        </div>
        
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Technology Stack</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto mb-2 text-green-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <h3 class="font-medium text-gray-900 dark:text-white">Vue 3</h3>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto mb-2 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <h3 class="font-medium text-gray-900 dark:text-white">TailwindCSS</h3>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto mb-2 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 3H4a1 1 0 00-1 1v16a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1zm-1 16H5V5h14v14z" />
              <path d="M11 7h2v10h-2zM7 9h2v6H7zM15 13h2v2h-2z" />
            </svg>
            <h3 class="font-medium text-gray-900 dark:text-white">Supabase</h3>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto mb-2 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.928 11.607c-.202-.488-.635-.605-.928-.633V8c0-1.103-.897-2-2-2h-6V4.61c.305-.274.5-.668.5-1.11a1.5 1.5 0 00-3 0c0 .442.195.836.5 1.11V6H5c-1.103 0-2 .897-2 2v2.997l-.082.006A1 1 0 001.99 12v2a1 1 0 001 1H3v5c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-5a1 1 0 001-1v-2a1.01 1.01 0 00-.072-.393z" />
            </svg>
            <h3 class="font-medium text-gray-900 dark:text-white">AI/ML</h3>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto mb-2 text-red-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
              <path d="M13 7h-2v6h6v-2h-4z" />
            </svg>
            <h3 class="font-medium text-gray-900 dark:text-white">Qloo API</h3>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto mb-2 text-teal-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
            </svg>
            <h3 class="font-medium text-gray-900 dark:text-white">Netlify</h3>
          </div>
        </div>
      </div>
      
      <!-- Team Section -->
      <div class="bg-white dark:bg-dark-card rounded-xl shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border p-6 md:p-8">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Our Team</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex gap-4">
            <div class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex-shrink-0">
              <img src="https://source.unsplash.com/random/100x100?person" alt="Team member" class="w-full h-full object-cover" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">Sabuz Ahmed</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Lead Developer</p>
              <p class="text-gray-700 dark:text-gray-300">
                Full-stack developer with expertise in Vue.js, AI integration, and cultural recommendation systems.
              </p>
            </div>
          </div>
          
          <div class="flex gap-4">
            <div class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex-shrink-0">
              <img src="https://source.unsplash.com/random/100x100?developer" alt="Team member" class="w-full h-full object-cover" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">Aisha Rahman</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">AI Specialist</p>
              <p class="text-gray-700 dark:text-gray-300">
                Expert in natural language processing and multilingual AI systems with a focus on cultural understanding.
              </p>
            </div>
          </div>
        </div>
        
        <div class="mt-8 text-center">
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Have questions or feedback? We'd love to hear from you!
          </p>
          <a 
            href="mailto:contact@tastepulse.app" 
            class="px-6 py-3 bg-gradient-taste text-white font-medium rounded-lg shadow-taste hover:shadow-taste-hover transition-all duration-300 inline-block"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No additional logic needed for this page
</script>