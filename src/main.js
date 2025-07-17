import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import './style.css';

// Import routes
import routes from './router/index.js';

// Create Vue Router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

// Create Pinia store
const pinia = createPinia();

// Create and mount the Vue application
const app = createApp(App);
app.use(pinia);
app.use(router);
app.mount('#app');
