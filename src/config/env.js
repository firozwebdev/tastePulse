// Environment configuration
const config = {
  development: {
    API_BASE_URL: 'http://localhost:8080',
    SUPABASE_URL: 'https://your-project.supabase.co',
    SUPABASE_ANON_KEY: 'your-supabase-anon-key',
    QLOO_API_URL: 'https://api.qloo.com/v1',
    QLOO_API_KEY: 'P6WXhn-98bT0H__jpKNimCEwq1oa6DW8WVtVFj4I_QU',
    GPT_API_URL: 'https://api.openai.com/v1',
    GPT_API_KEY: 'your-openai-api-key',
    GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta',
    GEMINI_API_KEY: 'AIzaSyBtO2J8lMY7hakS-LeBBhy-Zqhzpb-Iw98',
    ENABLE_MOCK_API: true,
    DEBUG: true
  },
  
  production: {
    API_BASE_URL: 'https://api.tastepulse.app',
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    QLOO_API_URL: 'https://api.qloo.com/v1',
    QLOO_API_KEY: import.meta.env.VITE_QLOO_API_KEY,
    GPT_API_URL: 'https://api.openai.com/v1',
    GPT_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
    GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta',
    GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY,
    ENABLE_MOCK_API: false,
    DEBUG: false
  }
};

// Get current environment
const environment = import.meta.env.MODE || 'development';

// Export configuration for current environment
export default config[environment] || config.development;

// Export individual config values
export const {
  API_BASE_URL,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  QLOO_API_URL,
  QLOO_API_KEY,
  GPT_API_URL,
  GPT_API_KEY,
  GEMINI_API_URL,
  GEMINI_API_KEY,
  ENABLE_MOCK_API,
  DEBUG
} = config[environment] || config.development;