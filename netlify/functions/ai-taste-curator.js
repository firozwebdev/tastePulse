// AI Taste Curator - Personal Cultural Assistant
const fetch = require('node-fetch');

// AI Curator Personality Types
const CURATOR_PERSONALITIES = {
  'explorer': {
    name: 'The Cultural Explorer',
    personality: 'Adventurous and curious, always seeking new cultural experiences',
    speaking_style: 'enthusiastic and encouraging',
    specialties: ['discovering hidden gems', 'cross-cultural connections', 'emerging trends'],
    greeting: "Hey there, cultural adventurer! I'm excited to explore new territories with you today.",
    emoji: '🗺️'
  },
  'connoisseur': {
    name: 'The Refined Connoisseur',
    personality: 'Sophisticated and knowledgeable, with deep appreciation for quality',
    speaking_style: 'elegant and insightful',
    specialties: ['premium experiences', 'historical context', 'artistic depth'],
    greeting: "Good day! I'm here to guide you toward the finest cultural experiences.",
    emoji: '🎭'
  },
  'trendsetter': {
    name: 'The Trendsetter',
    personality: 'Hip and current, always ahead of the cultural curve',
    speaking_style: 'casual and trendy',
    specialties: ['viral content', 'emerging artists', 'social trends'],
    greeting: "What's up! Ready to discover what's about to blow up culturally?",
    emoji: '🔥'
  },
  'bridge_builder': {
    name: 'The Bridge Builder',
    personality: 'Thoughtful connector who finds meaningful relationships between different cultures',
    speaking_style: 'warm and connecting',
    specialties: ['cultural fusion', 'meaningful connections', 'storytelling'],
    greeting: "Hello! I love finding the beautiful connections between different cultural worlds.",
    emoji: '🌉'
  }
};

// Conversation context and memory
class CuratorMemory {
  constructor() {
    this.userPreferences = {};
    this.conversationHistory = [];
    this.discoveredItems = [];
    this.rejectedItems = [];
    this.currentMood = 'neutral';
    this.sessionGoals = [];
  }

  addInteraction(interaction) {
    this.conversationHistory.push({
      ...interaction,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 20 interactions for context
    if (this.conversationHistory.length > 20) {
      this.conversationHistory = this.conversationHistory.slice(-20);
    }
  }

  updatePreferences(preferences) {
    this.userPreferences = { ...this.userPreferences, ...preferences };
  }

  addDiscovery(item) {
    this.discoveredItems.push({
      ...item,
      discovered_at: new Date().toISOString()
    });
  }

  addRejection(item, reason) {
    this.rejectedItems.push({
      ...item,
      rejected_at: new Date().toISOString(),
      reason
    });
  }
}

// AI Curator Engine
class AICurator {
  constructor(personalityType = 'explorer') {
    this.personality = CURATOR_PERSONALITIES[personalityType];
    this.memory = new CuratorMemory();
    this.currentContext = {};
  }

  // Generate personalized recommendations with AI reasoning
  async generateRecommendations(userInput, context = {}) {
    this.currentContext = context;
    
    // Analyze user input for intent and preferences
    const analysis = this.analyzeUserInput(userInput);
    
    // Generate contextual recommendations
    const recommendations = await this.createContextualRecommendations(analysis);
    
    // Generate curator response
    const curatorResponse = this.generateCuratorResponse(analysis, recommendations);
    
    // Update memory
    this.memory.addInteraction({
      user_input: userInput,
      analysis,
      recommendations,
      curator_response: curatorResponse
    });

    return {
      curator_personality: this.personality,
      analysis,
      recommendations,
      curator_response: curatorResponse,
      conversation_context: this.getConversationContext(),
      follow_up_questions: this.generateFollowUpQuestions(analysis)
    };
  }

  analyzeUserInput(input) {
    const analysis = {
      intent: this.detectIntent(input),
      mood: this.detectMood(input),
      preferences: this.extractPreferences(input),
      context_clues: this.extractContextClues(input),
      specificity_level: this.assessSpecificity(input),
      cultural_interests: this.identifyCulturalInterests(input)
    };

    return analysis;
  }

  detectIntent(input) {
    const intents = {
      discovery: ['find', 'discover', 'explore', 'new', 'different', 'recommend'],
      mood_based: ['feel like', 'mood for', 'in the mood', 'feeling', 'vibe'],
      specific_request: ['want', 'need', 'looking for', 'searching'],
      comparison: ['like', 'similar to', 'reminds me of', 'compare'],
      learning: ['learn', 'understand', 'know more', 'explain', 'why'],
      social: ['share', 'friends', 'group', 'together', 'date']
    };

    const inputLower = input.toLowerCase();
    const detectedIntents = [];

    Object.entries(intents).forEach(([intent, keywords]) => {
      if (keywords.some(keyword => inputLower.includes(keyword))) {
        detectedIntents.push(intent);
      }
    });

    return detectedIntents.length > 0 ? detectedIntents[0] : 'general';
  }

  detectMood(input) {
    const moodKeywords = {
      excited: ['excited', 'pumped', 'energetic', 'hyped'],
      relaxed: ['chill', 'relax', 'calm', 'peaceful', 'zen'],
      adventurous: ['adventure', 'bold', 'daring', 'wild'],
      nostalgic: ['nostalgic', 'memories', 'reminds', 'childhood'],
      romantic: ['romantic', 'date', 'intimate', 'cozy'],
      social: ['party', 'friends', 'group', 'social'],
      contemplative: ['think', 'reflect', 'deep', 'meaningful']
    };

    const inputLower = input.toLowerCase();
    
    for (const [mood, keywords] of Object.entries(moodKeywords)) {
      if (keywords.some(keyword => inputLower.includes(keyword))) {
        return mood;
      }
    }

    return 'neutral';
  }

  extractPreferences(input) {
    const preferences = {};
    const inputLower = input.toLowerCase();

    // Extract genre preferences
    const genres = ['jazz', 'rock', 'pop', 'classical', 'electronic', 'hip-hop', 'folk', 'country'];
    genres.forEach(genre => {
      if (inputLower.includes(genre)) {
        preferences.music_genres = preferences.music_genres || [];
        preferences.music_genres.push(genre);
      }
    });

    // Extract cuisine preferences
    const cuisines = ['italian', 'japanese', 'mexican', 'indian', 'french', 'thai', 'chinese', 'mediterranean'];
    cuisines.forEach(cuisine => {
      if (inputLower.includes(cuisine)) {
        preferences.cuisines = preferences.cuisines || [];
        preferences.cuisines.push(cuisine);
      }
    });

    // Extract activity preferences
    const activities = ['outdoor', 'indoor', 'active', 'quiet', 'social', 'solo'];
    activities.forEach(activity => {
      if (inputLower.includes(activity)) {
        preferences.activities = preferences.activities || [];
        preferences.activities.push(activity);
      }
    });

    return preferences;
  }

  extractContextClues(input) {
    const clues = {};
    const inputLower = input.toLowerCase();

    // Time context
    const timeClues = ['morning', 'afternoon', 'evening', 'night', 'weekend', 'weekday'];
    timeClues.forEach(time => {
      if (inputLower.includes(time)) {
        clues.time_context = time;
      }
    });

    // Location context
    const locationClues = ['home', 'work', 'travel', 'restaurant', 'outdoors', 'city', 'nature'];
    locationClues.forEach(location => {
      if (inputLower.includes(location)) {
        clues.location_context = location;
      }
    });

    // Social context
    const socialClues = ['alone', 'friends', 'family', 'date', 'colleagues', 'strangers'];
    socialClues.forEach(social => {
      if (inputLower.includes(social)) {
        clues.social_context = social;
      }
    });

    return clues;
  }

  assessSpecificity(input) {
    const specificWords = input.split(' ').filter(word => 
      word.length > 3 && 
      !['that', 'this', 'with', 'from', 'they', 'have', 'been', 'were'].includes(word.toLowerCase())
    );

    if (specificWords.length > 8) return 'high';
    if (specificWords.length > 4) return 'medium';
    return 'low';
  }

  identifyCulturalInterests(input) {
    const culturalKeywords = {
      'traditional': ['traditional', 'classic', 'heritage', 'authentic', 'original'],
      'modern': ['modern', 'contemporary', 'current', 'new', 'fresh'],
      'fusion': ['fusion', 'mix', 'blend', 'combination', 'hybrid'],
      'underground': ['underground', 'indie', 'alternative', 'hidden', 'secret'],
      'mainstream': ['popular', 'mainstream', 'trending', 'viral', 'famous']
    };

    const inputLower = input.toLowerCase();
    const interests = [];

    Object.entries(culturalKeywords).forEach(([interest, keywords]) => {
      if (keywords.some(keyword => inputLower.includes(keyword))) {
        interests.push(interest);
      }
    });

    return interests;
  }

  async createContextualRecommendations(analysis) {
    const recommendations = {
      primary: [],
      secondary: [],
      experimental: []
    };

    // Generate primary recommendations based on intent
    switch (analysis.intent) {
      case 'discovery':
        recommendations.primary = this.generateDiscoveryRecommendations(analysis);
        break;
      case 'mood_based':
        recommendations.primary = this.generateMoodBasedRecommendations(analysis);
        break;
      case 'specific_request':
        recommendations.primary = this.generateSpecificRecommendations(analysis);
        break;
      default:
        recommendations.primary = this.generateGeneralRecommendations(analysis);
    }

    // Add secondary recommendations for variety
    recommendations.secondary = this.generateSecondaryRecommendations(analysis);
    
    // Add experimental recommendations for growth
    recommendations.experimental = this.generateExperimentalRecommendations(analysis);

    return recommendations;
  }

  generateDiscoveryRecommendations(analysis) {
    const recommendations = [];
    
    // Based on personality type
    switch (this.personality.name) {
      case 'The Cultural Explorer':
        recommendations.push({
          category: 'music',
          name: 'Mongolian Throat Singing',
          description: 'Ancient vocal technique creating otherworldly harmonics',
          reasoning: 'Perfect for your adventurous spirit - this is music unlike anything in the mainstream',
          cultural_context: 'Traditional Mongolian art form with spiritual significance',
          match: 85,
          discovery_level: 'high'
        });
        break;
        
      case 'The Refined Connoisseur':
        recommendations.push({
          category: 'food',
          name: 'Kaiseki Dining Experience',
          description: 'Multi-course Japanese haute cuisine emphasizing seasonality',
          reasoning: 'Your refined taste would appreciate the artistry and philosophy behind each dish',
          cultural_context: 'Represents the pinnacle of Japanese culinary art',
          match: 92,
          discovery_level: 'medium'
        });
        break;
    }

    return recommendations;
  }

  generateMoodBasedRecommendations(analysis) {
    const moodRecommendations = {
      excited: [
        {
          category: 'music',
          name: 'Afrobeats Dance Party Playlist',
          description: 'High-energy African rhythms that make you move',
          reasoning: 'Your excited energy matches the infectious rhythms of Afrobeats',
          match: 88
        }
      ],
      relaxed: [
        {
          category: 'books',
          name: 'Japanese Forest Bathing Guide',
          description: 'Learn the art of shinrin-yoku for deep relaxation',
          reasoning: 'Perfect for your chill mood - connects you with nature\'s calming power',
          match: 90
        }
      ],
      nostalgic: [
        {
          category: 'travel',
          name: 'Vintage Train Journey',
          description: 'Scenic railway routes that evoke golden age travel',
          reasoning: 'Captures the romantic nostalgia you\'re feeling',
          match: 87
        }
      ]
    };

    return moodRecommendations[analysis.mood] || [];
  }

  generateSpecificRecommendations(analysis) {
    // Generate based on extracted preferences
    const recommendations = [];
    
    if (analysis.preferences.music_genres) {
      analysis.preferences.music_genres.forEach(genre => {
        recommendations.push({
          category: 'music',
          name: `Hidden Gems in ${genre.charAt(0).toUpperCase() + genre.slice(1)}`,
          description: `Discover underground artists pushing ${genre} boundaries`,
          reasoning: `Since you mentioned ${genre}, here are some artists you probably haven't heard`,
          match: 85
        });
      });
    }

    return recommendations;
  }

  generateGeneralRecommendations(analysis) {
    return [
      {
        category: 'experience',
        name: 'Cultural Fusion Workshop',
        description: 'Learn to cook while listening to world music',
        reasoning: 'Combines multiple cultural elements for a rich experience',
        match: 80
      }
    ];
  }

  generateSecondaryRecommendations(analysis) {
    return [
      {
        category: 'books',
        name: 'Cultural Anthropology Bestseller',
        description: 'Fascinating insights into human cultural diversity',
        reasoning: 'Expands your cultural understanding',
        match: 75
      }
    ];
  }

  generateExperimentalRecommendations(analysis) {
    return [
      {
        category: 'experimental',
        name: 'Synesthetic Art Experience',
        description: 'Art that combines sound, color, and taste',
        reasoning: 'Push your cultural boundaries with multi-sensory art',
        match: 70,
        experimental_note: 'This might be outside your comfort zone, but could be transformative'
      }
    ];
  }

  generateCuratorResponse(analysis, recommendations) {
    const response = {
      greeting: this.generatePersonalizedGreeting(analysis),
      main_message: this.generateMainMessage(analysis, recommendations),
      insights: this.generateInsights(analysis),
      encouragement: this.generateEncouragement(analysis),
      personality_touch: this.addPersonalityTouch(analysis)
    };

    return response;
  }

  generatePersonalizedGreeting(analysis) {
    const greetings = {
      excited: `${this.personality.emoji} I can feel your excitement! Let's channel that energy into some amazing discoveries.`,
      relaxed: `${this.personality.emoji} I love your chill vibe. Let's find something that perfectly matches your relaxed mood.`,
      adventurous: `${this.personality.emoji} An adventurous spirit! My favorite kind of person to work with.`,
      default: this.personality.greeting
    };

    return greetings[analysis.mood] || greetings.default;
  }

  generateMainMessage(analysis, recommendations) {
    const primaryRec = recommendations.primary[0];
    if (!primaryRec) return "Let me think of something special for you...";

    return `Based on your ${analysis.intent} intent and ${analysis.mood} mood, I think you'd love ${primaryRec.name}. ${primaryRec.reasoning}`;
  }

  generateInsights(analysis) {
    const insights = [];
    
    if (analysis.cultural_interests.length > 0) {
      insights.push(`I notice you're drawn to ${analysis.cultural_interests.join(' and ')} cultural elements.`);
    }

    if (analysis.specificity_level === 'high') {
      insights.push("You've given me great detail to work with - I love specific requests!");
    }

    return insights;
  }

  generateEncouragement(analysis) {
    const encouragements = {
      'The Cultural Explorer': "Remember, every great discovery starts with curiosity!",
      'The Refined Connoisseur': "Quality over quantity - let's find something truly exceptional.",
      'The Trendsetter': "You're about to be ahead of the curve on this one!",
      'The Bridge Builder': "I see beautiful connections forming between your interests."
    };

    return encouragements[this.personality.name];
  }

  addPersonalityTouch(analysis) {
    const touches = {
      'The Cultural Explorer': "🗺️ Adventure awaits in every recommendation!",
      'The Refined Connoisseur': "🎭 Excellence is in the details.",
      'The Trendsetter': "🔥 This is about to be everywhere.",
      'The Bridge Builder': "🌉 Everything is connected in beautiful ways."
    };

    return touches[this.personality.name];
  }

  generateFollowUpQuestions(analysis) {
    const questions = [];

    if (analysis.specificity_level === 'low') {
      questions.push("What specific aspect interests you most?");
      questions.push("Are you looking for something familiar or completely new?");
    }

    if (!analysis.context_clues.time_context) {
      questions.push("When are you planning to enjoy this?");
    }

    if (!analysis.context_clues.social_context) {
      questions.push("Will this be a solo experience or with others?");
    }

    questions.push("What's your comfort zone, and how far outside it are you willing to go?");

    return questions.slice(0, 3); // Limit to 3 questions
  }

  getConversationContext() {
    return {
      interaction_count: this.memory.conversationHistory.length,
      discovered_items: this.memory.discoveredItems.length,
      user_preferences: this.memory.userPreferences,
      current_mood: this.memory.currentMood,
      session_goals: this.memory.sessionGoals
    };
  }
}

exports.handler = async function(event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const { 
      user_input, 
      curator_personality = 'explorer',
      context = {},
      conversation_history = []
    } = JSON.parse(event.body);

    if (!user_input) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing user input" })
      };
    }

    console.log('[AICurator] Processing user input with', curator_personality, 'personality');

    // Initialize AI Curator
    const curator = new AICurator(curator_personality);
    
    // Restore conversation history if provided
    if (conversation_history.length > 0) {
      curator.memory.conversationHistory = conversation_history;
    }

    // Generate personalized response
    const curatorResponse = await curator.generateRecommendations(user_input, context);
    
    const response = {
      ...curatorResponse,
      available_personalities: Object.keys(CURATOR_PERSONALITIES),
      session_id: `curator_${Date.now()}`,
      metadata: {
        timestamp: new Date().toISOString(),
        algorithm: 'ai-curator-v1',
        personality_used: curator_personality
      }
    };

    console.log(`[AICurator] Generated response with ${curatorResponse.recommendations.primary.length} primary recommendations`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error('[AICurator] Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        message: 'Failed to generate curator response'
      })
    };
  }
};