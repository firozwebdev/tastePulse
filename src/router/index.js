// Import view components
import Home from '../views/Home.vue';
import { useTasteStore } from '../stores/taste';

// Define routes
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'TastePulse - Discover Your Cultural Fingerprint' }
  },
  {
    path: '/results',
    name: 'Results',
    component: () => import('../views/Results.vue'),
    meta: { title: 'Your Taste Results - TastePulse' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: { title: 'Your Taste Profile - TastePulse', requiresAuth: true }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: { title: 'About TastePulse' }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('../views/Auth.vue'),
    meta: { title: 'Sign In or Sign Up - TastePulse' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { title: 'Page Not Found - TastePulse' }
  }
];

// Navigation guard for protected routes
const setupNavigationGuards = (router) => {
  router.beforeEach((to, from, next) => {
    const tasteStore = useTasteStore();
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    
    // If route requires auth and user is not authenticated
    if (requiresAuth && !tasteStore.isAuthenticated) {
      next({
        path: '/auth',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  });
};

export { routes, setupNavigationGuards };