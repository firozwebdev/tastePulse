import { ref } from 'vue';
import supabase from '../utils/supabase';

const sessionId = ref(generateSessionId());

function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
}

export function useAnalytics() {
  async function trackEvent(eventType, eventData = {}) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const analyticsData = {
        user_id: user?.id || null,
        event_type: eventType,
        event_data: eventData,
        session_id: sessionId.value,
        ip_address: null, // Will be handled by server
        user_agent: navigator.userAgent,
        created_at: new Date().toISOString()
      };

      // Don't await this to avoid blocking the UI
      supabase
        .from('user_analytics')
        .insert([analyticsData])
        .catch(error => {
          console.warn('Analytics tracking failed:', error);
        });

    } catch (error) {
      console.warn('Analytics tracking error:', error);
    }
  }

  // Specific tracking methods
  function trackPageView(pageName, additionalData = {}) {
    trackEvent('page_view', {
      page: pageName,
      timestamp: new Date().toISOString(),
      ...additionalData
    });
  }

  function trackTasteAnalysis(inputLength, categories, processingTime) {
    trackEvent('taste_analysis', {
      input_length: inputLength,
      categories_detected: categories,
      processing_time_ms: processingTime,
      timestamp: new Date().toISOString()
    });
  }

  function trackRecommendationInteraction(action, recommendation, category) {
    trackEvent('recommendation_interaction', {
      action, // 'view', 'save', 'share', 'click'
      recommendation_name: recommendation.name,
      category,
      match_score: recommendation.match,
      timestamp: new Date().toISOString()
    });
  }

  function trackProfileAction(action, profileData = {}) {
    trackEvent('profile_action', {
      action, // 'create', 'save', 'load', 'delete', 'share'
      profile_name: profileData.name,
      categories_count: Object.keys(profileData.parsed_taste || {}).length,
      timestamp: new Date().toISOString()
    });
  }

  function trackUserEngagement(action, duration = null) {
    trackEvent('user_engagement', {
      action, // 'session_start', 'session_end', 'feature_used'
      duration_seconds: duration,
      timestamp: new Date().toISOString()
    });
  }

  function trackError(errorType, errorMessage, context = {}) {
    trackEvent('error', {
      error_type: errorType,
      error_message: errorMessage,
      context,
      timestamp: new Date().toISOString()
    });
  }

  return {
    trackEvent,
    trackPageView,
    trackTasteAnalysis,
    trackRecommendationInteraction,
    trackProfileAction,
    trackUserEngagement,
    trackError,
    sessionId: sessionId.value
  };
}