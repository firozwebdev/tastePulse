// Import view components
import Home from '../views/Home.vue';

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
    meta: { title: 'Your Taste Profile - TastePulse' }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: { title: 'About TastePulse' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { title: 'Page Not Found - TastePulse' }
  }
];

export default routes;