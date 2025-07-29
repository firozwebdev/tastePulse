// AI Taste Personality System - Like Myers-Briggs for Culture
const fetch = require('node-fetch');

// Taste Personality Dimensions (16 types like Myers-Briggs)
const PERSONALITY_DIMENSIONS = {
  // Cultural Openness: Traditional vs Experimental
  cultural_openness: {
    traditional: { code: 'T', name: 'Traditional', description: 'Values heritage and classic forms' },
    experimental: { code: 'E', name: 'Experimental', description: 'Seeks new and innovative experiences' }
  },
  
  // Social Context: Individual vs Communal
  social_context: {
    individual: { code: 'I', name: 'Individual', description: 'Prefers personal, intimate experiences' },
    communal: { code: 'C', name: 'Communal', description: 'Enjoys shared, social experiences' }
  },
  
  // Sensory Preference: Subtle vs Intense
  sensory_preference: {
    subtle: { code: 'S', name: 'Subtle', description: 'Appreciates nuanced, refined experiences' },
    intense: { code: 'N', name: 'Intense', description: 'Craves bold, powerful sensations' }
  },
  
  // Discovery Style: Curated vs Spontaneous
  discovery_style: {
    curated: { code: 'U', name: 'Curated', description: 'Prefers guided, expert recommendations' },
    spontaneous: { code: 'P', name: 'Spontaneous', description: 'Enjoys random discoveries and surprises' }
  }
};

// 16 Taste Personality Types
const TASTE_PERSONALITIES = {
  'TISU': {
    name: 'The Cultural Curator',
    description: 'You appreciate traditional forms with subtle sophistication, preferring expertly curated experiences.',
    icon: '🎭',
    traits: ['Heritage lover', 'Quality focused', 'Refined palate', 'Expert guided'],
    recommendations: 'Classical music, fine dining, literary classics, historic destinations'
  },
  'TISN': {
    name: 'The Heritage Explorer',
    description: 'Traditional yet bold, you seek intense experiences within classic frameworks.',
    icon: '🏛️',
    traits: ['Bold traditionalist', 'Intense experiences', 'Cultural depth', 'Powerful emotions'],
    recommendations: 'Opera, spicy traditional cuisine, epic literature, cultural festivals'
  },
  'TICU': {
    name: 'The Social Traditionalist',
    description: 'You love sharing traditional experiences with others in refined settings.',
    icon: '🍷',
    traits: ['Social heritage', 'Group experiences', 'Refined sharing', 'Cultural bonding'],
    recommendations: 'Wine tastings, dinner parties, book clubs, cultural tours'
  },
  'TICN': {
    name: 'The Cultural Celebrant',
    description: 'Traditional but intense, you bring people together for powerful shared experiences.',
    icon: '🎪',
    traits: ['Festive traditionalist', 'Community builder', 'Intense sharing', 'Cultural celebration'],
    recommendations: 'Cultural festivals, group dining, shared adventures, traditional celebrations'
  },
  'EISU': {
    name: 'The Avant-Garde Connoisseur',
    description: 'You seek cutting-edge experiences with sophisticated, personal appreciation.',
    icon: '🎨',
    traits: ['Innovation seeker', 'Refined experimentation', 'Personal discovery', 'Artistic edge'],
    recommendations: 'Experimental music, molecular gastronomy, contemporary art, unique destinations'
  },
  'EISN': {
    name: 'The Cultural Pioneer',
    description: 'Bold and experimental, you blaze trails in intense, personal cultural exploration.',
    icon: '🚀',
    traits: ['Cultural pioneer', 'Intense innovation', 'Personal adventure', 'Boundary pusher'],
    recommendations: 'Experimental genres, fusion cuisine, avant-garde literature, off-grid travel'
  },
  'EICU': {
    name: 'The Trendsetter',
    description: 'You discover and share the latest cultural innovations with your community.',
    icon: '⭐',
    traits: ['Trend creator', 'Social innovator', 'Community influencer', 'Cultural bridge'],
    recommendations: 'Emerging artists, pop-up experiences, viral content, trendy destinations'
  },
  'EICN': {
    name: 'The Cultural Revolutionary',
    description: 'You bring intense, experimental experiences to groups, changing cultural landscapes.',
    icon: '🔥',
    traits: ['Cultural disruptor', 'Group innovator', 'Intense sharing', 'Revolutionary spirit'],
    recommendations: 'Underground scenes, experimental dining, radical art, transformative travel'
  }
  // ... (8 more personality types)
};

// Analyze taste profile to determine personality
function analyzeTastePersonality(recommendations, tasteBridges = []) {
  const scores = {
    cultural_openness: 0, // -100 (traditional) to +100 (experimental)
    social_context: 0,    // -100 (individual) to +100 (communal)
    sensory_preference: 0, // -100 (subtle) to +100 (intense)
    discovery_style: 0     // -100 (curated) to +100 (spontaneous)
  };
  
  // Analyze each category
  Object.entries(recommendations).forEach(([category, items]) => {
    if (!Array.isArray(items)) return;
    
    items.forEach(item => {
      const text = `${item.name} ${item.description}`.toLowerCase();
      
      // Cultural Openness Analysis
      const traditionalKeywords = ['classic', 'traditional', 'heritage', 'vintage', 'timeless', 'authentic', 'original'];
      const experimentalKeywords = ['experimental', 'innovative', 'modern', 'contemporary', 'fusion', 'avant-garde', 'cutting-edge'];
      
      traditionalKeywords.forEach(keyword => {
        if (text.includes(keyword)) scores.cultural_openness -= 10;
      });
      experimentalKeywords.forEach(keyword => {
        if (text.includes(keyword)) scores.cultural_openness += 10;
      });
      
      // Social Context Analysis
      const individualKeywords = ['solo', 'personal', 'intimate', 'private', 'meditation', 'reflection'];
      const communalKeywords = ['social', 'group', 'community', 'shared', 'festival', 'party', 'gathering'];
      
      individualKeywords.forEach(keyword => {
        if (text.includes(keyword)) scores.social_context -= 10;
      });
      communalKeywords.forEach(keyword => {
        if (text.includes(keyword)) scores.social_context += 10;
      });
      
      // Sensory Preference Analysis
      const subtleKeywords = ['subtle', 'delicate', 'refined', 'gentle', 'soft', 'nuanced', 'elegant'];
      const intenseKeywords = ['intense', 'bold', 'powerful', 'strong', 'dramatic', 'explosive', 'overwhelming'];
      
      subtleKeywords.forEach(keyword => {
        if (text.includes(keyword)) scores.sensory_preference -= 10;
      });
      intenseKeywords.forEach(keyword => {
        if (text.includes(keyword)) scores.sensory_preference += 10;
      });
      
      // Discovery Style Analysis (based on match scores and variety)
      if (item.match > 90) scores.discovery_style -= 5; // High match = curated
      if (item.match < 80) scores.discovery_style += 5; // Lower match = spontaneous
    });
  });
  
  // Analyze taste bridges for additional insights
  tasteBridges.forEach(bridge => {
    if (bridge.strength > 90) {
      scores.discovery_style -= 5; // Strong bridges suggest curated taste
    }
    if (bridge.bridgeType.includes('experimental')) {
      scores.cultural_openness += 15;
    }
  });
  
  // Normalize scores to -100 to +100 range
  Object.keys(scores).forEach(key => {
    scores[key] = Math.max(-100, Math.min(100, scores[key]));
  });
  
  return scores;
}

// Determine personality type from scores
function determinePersonalityType(scores) {
  const type = [
    scores.cultural_openness >= 0 ? 'E' : 'T',
    scores.social_context >= 0 ? 'C' : 'I', 
    scores.sensory_preference >= 0 ? 'N' : 'S',
    scores.discovery_style >= 0 ? 'P' : 'U'
  ].join('');
  
  return TASTE_PERSONALITIES[type] || TASTE_PERSONALITIES['TISU'];
}

// Generate personality insights
function generatePersonalityInsights(personalityType, scores) {
  const insights = [];
  
  // Cultural Openness Insights
  if (Math.abs(scores.cultural_openness) > 50) {
    if (scores.cultural_openness > 0) {
      insights.push({
        type: 'cultural_openness',
        message: 'You\'re a cultural innovator who seeks cutting-edge experiences',
        strength: Math.abs(scores.cultural_openness)
      });
    } else {
      insights.push({
        type: 'cultural_openness', 
        message: 'You appreciate timeless classics and traditional forms',
        strength: Math.abs(scores.cultural_openness)
      });
    }
  }
  
  // Social Context Insights
  if (Math.abs(scores.social_context) > 50) {
    if (scores.social_context > 0) {
      insights.push({
        type: 'social_context',
        message: 'You thrive in social settings and shared experiences',
        strength: Math.abs(scores.social_context)
      });
    } else {
      insights.push({
        type: 'social_context',
        message: 'You prefer intimate, personal cultural experiences',
        strength: Math.abs(scores.social_context)
      });
    }
  }
  
  // Generate compatibility insights
  const compatibleTypes = findCompatibleTypes(personalityType);
  
  return {
    primary_insights: insights,
    compatibility: compatibleTypes,
    growth_areas: generateGrowthSuggestions(scores),
    cultural_journey: generateCulturalJourney(personalityType, scores)
  };
}

// Find compatible personality types
function findCompatibleTypes(personalityType) {
  // Simplified compatibility logic - in reality this would be more complex
  const compatible = [];
  const typeCode = personalityType.name.replace(/[^A-Z]/g, '');
  
  // Find types with 2-3 matching dimensions
  Object.entries(TASTE_PERSONALITIES).forEach(([code, type]) => {
    if (code === typeCode) return;
    
    let matches = 0;
    for (let i = 0; i < 4; i++) {
      if (code[i] === typeCode[i]) matches++;
    }
    
    if (matches >= 2) {
      compatible.push({
        type: type.name,
        compatibility_score: (matches / 4) * 100,
        reason: `Shares ${matches} key taste dimensions with you`
      });
    }
  });
  
  return compatible.slice(0, 3); // Top 3 compatible types
}

// Generate growth suggestions
function generateGrowthSuggestions(scores) {
  const suggestions = [];
  
  // Suggest exploring opposite dimensions
  if (scores.cultural_openness < -30) {
    suggestions.push({
      area: 'Cultural Exploration',
      suggestion: 'Try exploring some contemporary or fusion experiences to broaden your cultural horizons',
      challenge: 'Listen to a modern remix of a classical piece you love'
    });
  }
  
  if (scores.social_context < -30) {
    suggestions.push({
      area: 'Social Experiences',
      suggestion: 'Consider joining group activities related to your interests',
      challenge: 'Attend a cultural event with friends or join a taste-based community'
    });
  }
  
  return suggestions;
}

// Generate cultural journey narrative
function generateCulturalJourney(personalityType, scores) {
  return {
    current_phase: `You're in your "${personalityType.name}" phase`,
    journey_narrative: `Your cultural journey shows a ${Math.abs(scores.cultural_openness) > 50 ? 'strong' : 'balanced'} preference for ${scores.cultural_openness > 0 ? 'innovation' : 'tradition'}, combined with ${Math.abs(scores.social_context) > 50 ? 'strong' : 'moderate'} ${scores.social_context > 0 ? 'social' : 'individual'} tendencies.`,
    next_evolution: generateNextEvolution(personalityType, scores)
  };
}

function generateNextEvolution(personalityType, scores) {
  // Predict how taste might evolve
  const evolutions = [
    'As you explore more, you might develop appreciation for cross-cultural fusion',
    'Your taste journey could lead you toward more experimental experiences',
    'You might find yourself drawn to sharing your discoveries with others',
    'Your refined palate could evolve toward more adventurous territories'
  ];
  
  return evolutions[Math.floor(Math.random() * evolutions.length)];
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
    const { recommendations, tasteBridges = [] } = JSON.parse(event.body);

    if (!recommendations) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing recommendations data" })
      };
    }

    console.log('[TastePersonality] Analyzing cultural personality...');

    // Analyze personality dimensions
    const personalityScores = analyzeTastePersonality(recommendations, tasteBridges);
    
    // Determine personality type
    const personalityType = determinePersonalityType(personalityScores);
    
    // Generate insights
    const insights = generatePersonalityInsights(personalityType, personalityScores);
    
    const response = {
      personality_type: personalityType,
      personality_scores: personalityScores,
      insights,
      personality_dimensions: PERSONALITY_DIMENSIONS,
      share_text: `I'm a "${personalityType.name}" ${personalityType.icon} - ${personalityType.description}`,
      metadata: {
        timestamp: new Date().toISOString(),
        algorithm: 'taste-personality-v1',
        total_personalities: Object.keys(TASTE_PERSONALITIES).length
      }
    };

    console.log(`[TastePersonality] Identified as: ${personalityType.name}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error('[TastePersonality] Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        message: 'Failed to analyze taste personality'
      })
    };
  }
};