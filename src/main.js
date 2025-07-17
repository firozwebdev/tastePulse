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

// Create the Vue application
const app = createApp(App);

// Use plugins
app.use(pinia);
app.use(router);

// Set up global notification manager
app.config.globalProperties.$notificationManager = null;
app.provide('notificationManager', null);

// Mount the app
const vueApp = app.mount('#app');

// Set the notification manager after the app is mounted
app.config.globalProperties.$notificationManager = vueApp.$refs.notificationManager;
app.provide('notificationManager', vueApp.$refs.notificationManager);
