// 🔒 TastePulse Security Configuration
// Comprehensive security settings for production deployment

module.exports = {
  // Content Security Policy
  csp: {
    directives: {
      'default-src': ["'self'"],
      'script-src': [
        "'self'",
        "'unsafe-inline'", // Required for Vue.js
        'https://cdn.jsdelivr.net', // For CDN resources
        'https://unpkg.com' // For CDN resources
      ],
      'style-src': [
        "'self'",
        "'unsafe-inline'", // Required for dynamic styles
        'https://fonts.googleapis.com',
        'https://cdn.jsdelivr.net'
      ],
      'img-src': [
        "'self'",
        'data:', // For base64 images
        'https:', // Allow HTTPS images
        'https://images.unsplash.com', // Unsplash images
        'https://images.qloo.com' // Qloo images
      ],
      'font-src': [
        "'self'",
        'https://fonts.gstatic.com',
        'https://cdn.jsdelivr.net'
      ],
      'connect-src': [
        "'self'",
        'https://pzwrocsqwhmgosninpmv.supabase.co', // Supabase
        'https://hackathon.api.qloo.com', // Qloo API
        'https://generativelanguage.googleapis.com' // Gemini API
      ],
      'frame-ancestors': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"]
    }
  },

  // Security Headers
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
  },

  // Input Validation Rules
  validation: {
    maxInputLength: 5000,
    maxRequestSize: 1024 * 1024, // 1MB
    allowedCategories: ['music', 'food', 'books', 'travel', 'fashion', 'brand'],
    sanitizePatterns: [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // Remove script tags
      /javascript:/gi, // Remove javascript: protocol
      /on\w+=/gi, // Remove event handlers
      /\0/g // Remove null bytes
    ]
  },

  // Rate Limiting (for future implementation)
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  },

  // API Security
  api: {
    timeout: 30000, // 30 seconds
    retries: 3,
    backoff: 1000 // 1 second
  },

  // Environment Security
  env: {
    requiredVars: [
      'QLOO_API_KEY',
      'GEMINI_API_KEYS',
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY'
    ],
    sensitiveVars: [
      'QLOO_API_KEY',
      'GEMINI_API_KEYS'
    ]
  }
};

// Security utility functions
const SecurityUtils = {
  // Sanitize user input
  sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    
    let sanitized = input;
    
    // Apply sanitization patterns
    module.exports.validation.sanitizePatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
    
    return sanitized
      .trim()
      .substring(0, module.exports.validation.maxInputLength);
  },

  // Validate request size
  validateRequestSize(body) {
    if (!body) return false;
    return body.length <= module.exports.validation.maxRequestSize;
  },

  // Generate secure headers
  getSecurityHeaders() {
    return {
      ...module.exports.headers,
      'Content-Security-Policy': this.generateCSP()
    };
  },

  // Generate CSP header
  generateCSP() {
    const csp = module.exports.csp.directives;
    return Object.entries(csp)
      .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
      .join('; ');
  },

  // Validate environment variables
  validateEnvironment() {
    const missing = [];
    
    module.exports.env.requiredVars.forEach(varName => {
      if (!process.env[varName]) {
        missing.push(varName);
      }
    });
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
    
    return true;
  },

  // Log security events (for monitoring)
  logSecurityEvent(event, details = {}) {
    const timestamp = new Date().toISOString();
    console.log(`[SECURITY] ${timestamp} - ${event}`, details);
  }
};

module.exports.SecurityUtils = SecurityUtils;