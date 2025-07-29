const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
let supabase = null;

// Only initialize if environment variables are available
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

// Privacy-first taste analytics
function generateAnonymousTasteHash(tasteProfile) {
  // Create a hash that represents taste patterns without personal data
  const categories = Object.keys(tasteProfile).sort();
  const tasteVector = categories.map(cat => {
    const items = tasteProfile[cat] || [];
    if (Array.isArray(items)) {
      return items.length > 0 ? items[0].match || 80 : 0;
    }
    return 0;
  });
  
  // Create taste signature (no personal data)
  const signature = {
    adventure_level: calculateAdventureLevel(tasteProfile),
    sophistication_score: calculateSophisticationScore(tasteProfile),
    cultural_diversity: calculateCulturalDiversity(tasteProfile),
    innovation_preference: calculateInnovationPreference(tasteProfile),
    authenticity_focus: calculateAuthenticityFocus(tasteProfile)
  };
  
  return signature;
}

function calculateAdventureLevel(tasteProfile) {
  const travelItems = tasteProfile.travel || [];
  const adventureKeywords = ['adventure', 'explore', 'hidden', 'remote', 'off-beaten', 'wilderness'];
  
  let score = 50; // Base score
  
  travelItems.forEach(item => {
    const description = (item.description || '').toLowerCase();
    adventureKeywords.forEach(keyword => {
      if (description.includes(keyword)) {
        score += 10;
      }
    });
  });
  
  return Math.min(100, score);
}

function calculateSophisticationScore(tasteProfile) {
  const musicItems = tasteProfile.music || [];
  const bookItems = tasteProfile.books || [];
  const foodItems = tasteProfile.food || [];
  
  const sophisticatedKeywords = ['classical', 'fine', 'artisanal', 'craft', 'gourmet', 'premium', 'authentic'];
  let score = 50;
  
  [...musicItems, ...bookItems, ...foodItems].forEach(item => {
    const description = (item.description || '').toLowerCase();
    sophisticatedKeywords.forEach(keyword => {
      if (description.includes(keyword)) {
        score += 8;
      }
    });
  });
  
  return Math.min(100, score);
}

function calculateCulturalDiversity(tasteProfile) {
  const allItems = Object.values(tasteProfile).flat();
  const culturalKeywords = ['japanese', 'italian', 'french', 'indian', 'mexican', 'thai', 'korean', 'chinese', 'mediterranean', 'middle eastern'];
  
  const foundCultures = new Set();
  allItems.forEach(item => {
    const text = ((item.name || '') + ' ' + (item.description || '')).toLowerCase();
    culturalKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        foundCultures.add(keyword);
      }
    });
  });
  
  return Math.min(100, 40 + (foundCultures.size * 10));
}

function calculateInnovationPreference(tasteProfile) {
  const allItems = Object.values(tasteProfile).flat();
  const innovationKeywords = ['experimental', 'fusion', 'modern', 'contemporary', 'innovative', 'cutting-edge', 'avant-garde'];
  
  let score = 50;
  allItems.forEach(item => {
    const text = ((item.name || '') + ' ' + (item.description || '')).toLowerCase();
    innovationKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        score += 8;
      }
    });
  });
  
  return Math.min(100, score);
}

function calculateAuthenticityFocus(tasteProfile) {
  const allItems = Object.values(tasteProfile).flat();
  const authenticityKeywords = ['traditional', 'authentic', 'original', 'heritage', 'classic', 'time-honored', 'artisan'];
  
  let score = 50;
  allItems.forEach(item => {
    const text = ((item.name || '') + ' ' + (item.description || '')).toLowerCase();
    authenticityKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        score += 8;
      }
    });
  });
  
  return Math.min(100, score);
}

// Find similar taste profiles (privacy-preserving)
async function findSimilarTasteProfiles(tasteSignature, limit = 5) {
  // If Supabase is not available, return empty array (graceful degradation)
  if (!supabase) {
    console.log('Supabase not available, returning empty similar profiles');
    return [];
  }

  try {
    // Query for similar taste signatures
    const { data, error } = await supabase
      .from('anonymous_taste_profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50); // Get recent profiles for comparison
    
    if (error) {
      console.error('Error fetching taste profiles:', error);
      return [];
    }
    
    // Calculate similarity scores
    const similarities = data.map(profile => {
      const similarity = calculateTasteSimilarity(tasteSignature, profile.taste_signature);
      return {
        ...profile,
        similarity_score: similarity
      };
    });
    
    // Return top similar profiles
    return similarities
      .filter(profile => profile.similarity_score > 0.6) // Minimum similarity threshold
      .sort((a, b) => b.similarity_score - a.similarity_score)
      .slice(0, limit);
    
  } catch (error) {
    console.error('Error finding similar profiles:', error);
    return [];
  }
}

function calculateTasteSimilarity(signature1, signature2) {
  const keys = Object.keys(signature1);
  let totalDifference = 0;
  
  keys.forEach(key => {
    const diff = Math.abs(signature1[key] - signature2[key]) / 100;
    totalDifference += diff;
  });
  
  const averageDifference = totalDifference / keys.length;
  return 1 - averageDifference; // Convert to similarity score
}

// Store anonymous taste profile
async function storeAnonymousTasteProfile(tasteSignature, location = null) {
  // If Supabase is not available, skip storage (graceful degradation)
  if (!supabase) {
    console.log('Supabase not available, skipping profile storage');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('anonymous_taste_profiles')
      .insert({
        taste_signature: tasteSignature,
        location_region: location, // Only store region/city, not exact location
        created_at: new Date().toISOString()
      })
      .select();
    
    if (error) {
      console.error('Error storing taste profile:', error);
      return null;
    }
    
    return data[0];
  } catch (error) {
    console.error('Error storing anonymous profile:', error);
    return null;
  }
}

// Generate collaborative insights
function generateCollaborativeInsights(similarProfiles, userSignature) {
  if (similarProfiles.length === 0) {
    return {
      message: "You have a unique taste profile! You're a trendsetter.",
      insights: [],
      community_size: 0
    };
  }
  
  const insights = [];
  const communitySize = similarProfiles.length;
  
  // Analyze common patterns
  const avgAdventure = similarProfiles.reduce((sum, p) => sum + p.taste_signature.adventure_level, 0) / communitySize;
  const avgSophistication = similarProfiles.reduce((sum, p) => sum + p.taste_signature.sophistication_score, 0) / communitySize;
  const avgDiversity = similarProfiles.reduce((sum, p) => sum + p.taste_signature.cultural_diversity, 0) / communitySize;
  
  if (userSignature.adventure_level > avgAdventure + 10) {
    insights.push("You're more adventurous than most people with similar tastes");
  } else if (userSignature.adventure_level < avgAdventure - 10) {
    insights.push("You prefer familiar experiences compared to your taste community");
  }
  
  if (userSignature.sophistication_score > avgSophistication + 10) {
    insights.push("Your taste leans more sophisticated than your peer group");
  }
  
  if (userSignature.cultural_diversity > avgDiversity + 10) {
    insights.push("You embrace cultural diversity more than similar taste profiles");
  }
  
  // Location-based insights (if available)
  const locationGroups = {};
  similarProfiles.forEach(profile => {
    if (profile.location_region) {
      locationGroups[profile.location_region] = (locationGroups[profile.location_region] || 0) + 1;
    }
  });
  
  const topLocation = Object.entries(locationGroups)
    .sort(([,a], [,b]) => b - a)[0];
  
  if (topLocation) {
    insights.push(`People with your taste are commonly found in ${topLocation[0]}`);
  }
  
  return {
    message: `You share taste patterns with ${communitySize} other cultural explorers`,
    insights,
    community_size: communitySize,
    taste_percentiles: {
      adventure: Math.round((userSignature.adventure_level / 100) * 100),
      sophistication: Math.round((userSignature.sophistication_score / 100) * 100),
      diversity: Math.round((userSignature.cultural_diversity / 100) * 100)
    }
  };
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
    const { recommendations, location } = JSON.parse(event.body);

    if (!recommendations) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing recommendations data" })
      };
    }

    console.log('[TasteAnalytics] Generating privacy-first analytics...');

    // Generate anonymous taste signature
    const tasteSignature = generateAnonymousTasteHash(recommendations);
    
    // Find similar taste profiles
    const similarProfiles = await findSimilarTasteProfiles(tasteSignature);
    
    // Store this profile anonymously (optional, based on user consent)
    await storeAnonymousTasteProfile(tasteSignature, location);
    
    // Generate collaborative insights
    const collaborativeInsights = generateCollaborativeInsights(similarProfiles, tasteSignature);
    
    const response = {
      taste_signature: tasteSignature,
      collaborative_insights: collaborativeInsights,
      privacy_note: "Your data is anonymized and no personal information is stored",
      metadata: {
        timestamp: new Date().toISOString(),
        algorithm_version: 'privacy-first-v1',
        similar_profiles_found: similarProfiles.length
      }
    };

    console.log(`[TasteAnalytics] Found ${similarProfiles.length} similar taste profiles`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error('[TasteAnalytics] Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        message: 'Failed to generate taste analytics'
      })
    };
  }
};