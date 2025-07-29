// Debug script to check environment configuration
import { ENABLE_MOCK_API, QLOO_API_KEY, GEMINI_API_KEY } from './src/config/env.js';

console.log('🔍 Environment Configuration Debug:');
console.log('=====================================');
console.log('ENABLE_MOCK_API:', ENABLE_MOCK_API);
console.log('QLOO_API_KEY present:', !!QLOO_API_KEY);
console.log('GEMINI_API_KEY present:', !!GEMINI_API_KEY);
console.log('');

console.log('🌍 Environment Variables:');
console.log('VITE_ENABLE_MOCK_API:', process.env.VITE_ENABLE_MOCK_API);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MODE:', process.env.MODE);
console.log('');

console.log('🎯 Expected Behavior:');
if (ENABLE_MOCK_API) {
    console.log('❌ MOCK API IS ENABLED - You will see demo data');
    console.log('   To fix: Set VITE_ENABLE_MOCK_API=false in .env');
} else {
    console.log('✅ REAL API IS ENABLED - You should see real Qloo data');
    console.log('   If you still see demo data, check Netlify function logs');
}