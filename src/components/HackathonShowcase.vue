<template>
  <div class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800 mb-8">
    <div class="text-center mb-6">
      <div class="flex items-center justify-center gap-3 mb-3">
        <div class="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Qloo Hackathon Entry</h2>
          <p class="text-sm text-blue-600 dark:text-blue-400 font-medium">AI + Cultural Intelligence</p>
        </div>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <!-- Technical Innovation -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Technical Innovation
        </h3>
        <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li class="flex items-center gap-2">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            Gemini 1.5 Flash + Qloo API Integration
          </li>
          <li class="flex items-center gap-2">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            Smart Duplicate Elimination System
          </li>
          <li class="flex items-center gap-2">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            Multi-language Natural Language Processing
          </li>
          <li class="flex items-center gap-2">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            Real-time Cultural Cross-Domain Mapping
          </li>
        </ul>
      </div>

      <!-- Cultural Intelligence -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Cultural Intelligence
        </h3>
        <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li class="flex items-center gap-2">
            <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
            95-99% Qloo Match Accuracy
          </li>
          <li class="flex items-center gap-2">
            <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
            Cross-Domain Cultural Connections
          </li>
          <li class="flex items-center gap-2">
            <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
            Privacy-First Recommendation Engine
          </li>
          <li class="flex items-center gap-2">
            <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
            Semantic Taste Profile Understanding
          </li>
        </ul>
      </div>
    </div>

    <!-- Performance Metrics -->
    <div class="mt-6 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <h3 class="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9z" />
        </svg>
        Performance Metrics
      </h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">1.8-12s</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Response Time</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">95-99%</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Match Accuracy</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">0</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Duplicates</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">40+</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Unique Images</div>
        </div>
      </div>
    </div>

    <!-- Call to Action -->
    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
        Experience the future of cultural discovery powered by AI and Qloo's taste intelligence
      </p>
      <div class="flex flex-wrap justify-center gap-3">
        <a href="https://github.com/yourusername/taste-pulse-app" target="_blank" 
           class="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          View Code
        </a>
        <a href="https://qloo.com" target="_blank" 
           class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Learn About Qloo
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
// This component showcases the hackathon-specific features and metrics
</script>