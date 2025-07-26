# TastePulse Authentication System

This document describes the complete authentication system implemented in TastePulse using Supabase.

## Overview

The authentication system provides:
- User registration and login
- Password reset functionality
- Google OAuth integration
- Demo user access
- Profile management
- Secure data storage with Row Level Security (RLS)

## Components

### 1. Auth Component (`src/components/Auth.vue`)
The main authentication component that handles:
- Login and signup forms
- Form validation
- Password visibility toggle
- Password generation
- Google OAuth integration
- Demo user login
- Forgot password functionality

### 2. AuthModal Component (`src/components/AuthModal.vue`)
A modal wrapper for the Auth component that can be used throughout the app:
- Teleports to body for proper z-index handling
- Backdrop click to close
- Mode switching between login and signup

### 3. PasswordReset Component (`src/components/PasswordReset.vue`)
Handles password reset functionality:
- Validates reset tokens from URL
- Secure password update
- Form validation

### 4. UserSettings Component (`src/components/UserSettings.vue`)
Comprehensive user profile management:
- Profile information editing
- Password change
- Avatar upload (placeholder)
- Account deletion (placeholder)

## Store Integration

### Taste Store (`src/stores/taste.js`)
The main store handles authentication state:
- `isAuthenticated`: Boolean indicating auth status
- `user`: User object with profile information
- `initAuth()`: Initializes authentication on app load
- `setUser()`: Sets user data after successful auth
- `logout()`: Handles user logout
- `updateUserProfile()`: Updates user profile information
- `updateUserPassword()`: Updates user password

## Database Schema

### Tables
1. **profiles**: Stores user taste profiles
2. **saved_recommendations**: Individual saved recommendations
3. **user_preferences**: User settings and preferences
4. **user_sessions**: Session tracking (optional)

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Automatic user preferences creation on signup

## Setup Instructions

### 1. Supabase Configuration
1. Create a new Supabase project
2. Run the SQL schema from `supabase-schema.sql`
3. Configure authentication providers in Supabase dashboard
4. Update environment variables in `.env`

### 2. Environment Variables
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Google OAuth Setup (Optional)
1. Create Google OAuth credentials
2. Configure in Supabase Auth settings
3. Add authorized redirect URIs

### 4. Demo User Setup
1. Create a user with email `demo@example.com` in Supabase Auth
2. Set password to `tastepulse123`
3. The demo login button will use these credentials

## Usage Examples

### Basic Authentication
```vue
<template>
  <AuthModal
    :is-open="showAuth"
    initial-mode="login"
    @close="showAuth = false"
    @success="handleAuthSuccess"
  />
</template>

<script setup>
import { ref } from 'vue';
import AuthModal from '@/components/AuthModal.vue';

const showAuth = ref(false);

function handleAuthSuccess() {
  console.log('User authenticated successfully');
}
</script>
```

### Checking Authentication Status
```vue
<script setup>
import { computed } from 'vue';
import { useTasteStore } from '@/stores/taste';

const tasteStore = useTasteStore();
const isLoggedIn = computed(() => tasteStore.isAuthenticated);
const currentUser = computed(() => tasteStore.user);
</script>
```

### Protected Routes
```javascript
// In router/index.js
{
  path: '/profile',
  name: 'Profile',
  component: Profile,
  meta: { requiresAuth: true }
}

// Navigation guard
router.beforeEach((to, from, next) => {
  const tasteStore = useTasteStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  if (requiresAuth && !tasteStore.isAuthenticated) {
    next('/auth');
  } else {
    next();
  }
});
```

## Features

### 1. User Registration
- Email and password validation
- Automatic email confirmation
- User preferences initialization

### 2. User Login
- Email/password authentication
- Remember me functionality
- Error handling and user feedback

### 3. Password Reset
- Secure token-based reset
- Email delivery
- New password validation

### 4. Google OAuth
- One-click Google sign-in
- Automatic profile creation
- Seamless user experience

### 5. Demo Access
- Quick demo user login
- Pre-populated data
- No registration required

### 6. Profile Management
- Edit profile information
- Change password
- Account settings
- Data export (future feature)

## Security Features

### 1. Row Level Security (RLS)
- Database-level security
- User data isolation
- Automatic policy enforcement

### 2. Password Security
- Minimum length requirements
- Strong password generation
- Secure password hashing (handled by Supabase)

### 3. Session Management
- Automatic session refresh
- Secure token storage
- Session expiration handling

### 4. Input Validation
- Client-side form validation
- Server-side data validation
- XSS protection

## Error Handling

The authentication system includes comprehensive error handling:
- Network errors
- Invalid credentials
- Email already exists
- Password reset failures
- Session expiration

## Notifications

User feedback is provided through the notification system:
- Success messages for completed actions
- Error messages for failed operations
- Info messages for important updates
- Loading states for async operations

## Accessibility

The authentication components are built with accessibility in mind:
- Proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility
- High contrast support

## Testing

### Manual Testing Checklist
- [ ] User can register with valid email/password
- [ ] User receives email confirmation
- [ ] User can login with correct credentials
- [ ] User cannot login with incorrect credentials
- [ ] Password reset email is sent
- [ ] Password can be reset with valid token
- [ ] Google OAuth works correctly
- [ ] Demo user login works
- [ ] User can update profile information
- [ ] User can change password
- [ ] User can logout successfully
- [ ] Protected routes redirect to auth when not logged in
- [ ] User data is properly isolated (RLS working)

### Automated Testing
Consider adding:
- Unit tests for authentication functions
- Integration tests for auth flow
- E2E tests for complete user journeys

## Troubleshooting

### Common Issues
1. **Supabase connection errors**: Check environment variables
2. **Email not sending**: Verify Supabase email settings
3. **Google OAuth not working**: Check OAuth configuration
4. **RLS policies blocking access**: Verify policy definitions
5. **Demo user not working**: Ensure demo user exists in Supabase

### Debug Mode
Enable debug logging by setting:
```javascript
// In supabase.js
const supabase = createClient(url, key, {
  auth: {
    debug: true
  }
});
```

## Future Enhancements

Planned improvements:
- Two-factor authentication (2FA)
- Social login with more providers
- Account deletion with data export
- Advanced session management
- Audit logging
- Rate limiting
- Account recovery options

## Support

For authentication-related issues:
1. Check the browser console for errors
2. Verify Supabase configuration
3. Review the troubleshooting section
4. Check Supabase dashboard for auth logs
5. Consult Supabase documentation