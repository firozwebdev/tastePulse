import { ref, watch } from 'vue';

const isDarkMode = ref(false);

export function useTheme() {
  // Initialize theme from localStorage or system preference
  function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  }
  
  // Set dark mode
  function setDarkMode(dark) {
    isDarkMode.value = dark;
    
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
  
  // Toggle dark mode
  function toggleDarkMode() {
    setDarkMode(!isDarkMode.value);
  }
  
  // Watch for system theme changes
  function watchSystemTheme() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        setDarkMode(e.matches);
      }
    });
  }
  
  return {
    isDarkMode,
    initializeTheme,
    setDarkMode,
    toggleDarkMode,
    watchSystemTheme
  };
}