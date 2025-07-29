// Global Cultural Heatmap - Real-time taste trends worldwide
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

// Global regions for heatmap
const GLOBAL_REGIONS = {
  'north_america': {
    name: 'North America',
    countries: ['US', 'CA', 'MX'],
    coordinates: { lat: 45.0, lng: -100.0 },
    timezone: 'America/New_York'
  },
  'south_america': {
    name: 'South America', 
    countries: ['BR', 'AR', 'CL', 'CO', 'PE'],
    coordinates: { lat: -15.0, lng: -60.0 },
    timezone: 'America/Sao_Paulo'
  },
  'europe': {
    name: 'Europe',
    countries: ['GB', 'FR', 'DE', 'IT', 'ES', 'NL', 'SE', 'NO'],
    coordinates: { lat: 50.0, lng: 10.0 },
    timezone: 'Europe/London'
  },
  'asia_pacific': {
    name: 'Asia Pacific',
    countries: ['JP', 'KR', 'CN', 'AU', 'NZ', 'SG', 'HK'],
    coordinates: { lat: 35.0, lng: 135.0 },
    timezone: 'Asia/Tokyo'
  },
  'south_asia': {
    name: 'South Asia',
    countries: ['IN', 'BD', 'PK', 'LK'],
    coordinates: { lat: 20.0, lng: 77.0 },
    timezone: 'Asia/Kolkata'
  },
  'middle_east_africa': {
    name: 'Middle East & Africa',
    countries: ['AE', 'SA', 'ZA', 'EG', 'NG', 'KE'],
    coordinates: { lat: 0.0, lng: 25.0 },
    timezone: 'Africa/Cairo'
  }
};

// Cultural trend categories
const TREND_CATEGORIES = {
  music: {
    trending_keywords: ['viral', 'tiktok', 'remix', 'collaboration', 'live'],
    cultural_indicators: ['genre_fusion', 'artist_discovery', 'playlist_sharing']
  },
  food: {
    trending_keywords: ['fusion', 'street', 'plant-based', 'fermented', 'local'],
    cultural_indicators: ['cuisine_mixing', 'dietary_trends', 'cooking_methods']
  },
  travel: {
    trending_keywords: ['sustainable', 'remote', 'cultural', 'adventure', 'wellness'],
    cultural_indicators: ['destination_types', 'travel_styles', 'experience_focus']
  },
  books: {
    trending_keywords: ['bestseller', 'adaptation', 'diverse', 'contemporary', 'series'],
    cultural_indicators: ['genre_popularity', 'author_diversity', 'format_preferences']
  }
};

// Generate mock cultural trends (in production, this would aggregate real data)
function generateCulturalTrends() {
  const trends = {};
  
  Object.entries(GLOBAL_REGIONS).forEach(([regionId, region]) => {
    trends[regionId] = {
      region_info: region,
      current_trends: generateRegionalTrends(regionId),
      cultural_temperature: Math.floor(Math.random() * 40) + 60, // 60-100 scale
      trending_now: generateTrendingItems(regionId),
      cultural_velocity: Math.floor(Math.random() * 20) + 5, // How fast trends change
      cross_cultural_influence: generateCulturalInfluence(regionId)
    };
  });
  
  return trends;
}

function generateRegionalTrends(regionId) {
  const trends = {};
  
  Object.entries(TREND_CATEGORIES).forEach(([category, config]) => {
    trends[category] = {
      popularity_score: Math.floor(Math.random() * 30) + 70,
      trending_keywords: config.trending_keywords.slice(0, 3),
      growth_rate: (Math.random() * 40 - 20).toFixed(1), // -20% to +20%
      unique_characteristics: generateUniqueCharacteristics(regionId, category)
    };
  });
  
  return trends;
}

function generateUniqueCharacteristics(regionId, category) {
  const characteristics = {
    north_america: {
      music: ['Hip-hop dominance', 'Streaming culture', 'Festival circuits'],
      food: ['Food truck culture', 'Craft brewing', 'Farm-to-table'],
      travel: ['National parks', 'Road trips', 'Urban exploration'],
      books: ['Audiobook popularity', 'Book clubs', 'Celebrity memoirs']
    },
    europe: {
      music: ['Electronic festivals', 'Classical heritage', 'Eurovision influence'],
      food: ['Wine culture', 'Artisanal cheese', 'Michelin dining'],
      travel: ['Historic cities', 'Cultural tours', 'Sustainable tourism'],
      books: ['Literary fiction', 'Philosophy', 'Translated works']
    },
    asia_pacific: {
      music: ['K-pop influence', 'Traditional fusion', 'Karaoke culture'],
      food: ['Street food', 'Tea culture', 'Umami focus'],
      travel: ['Temple visits', 'Cherry blossoms', 'Hot springs'],
      books: ['Manga/Light novels', 'Philosophy', 'Poetry']
    },
    south_asia: {
      music: ['Bollywood influence', 'Classical traditions', 'Fusion experiments'],
      food: ['Spice complexity', 'Vegetarian cuisine', 'Regional diversity'],
      travel: ['Spiritual journeys', 'Heritage sites', 'Ayurveda retreats'],
      books: ['Epic literature', 'Spiritual texts', 'Contemporary voices']
    },
    middle_east_africa: {
      music: ['Traditional rhythms', 'Modern fusion', 'Storytelling songs'],
      food: ['Spice routes', 'Communal dining', 'Ancient grains'],
      travel: ['Desert experiences', 'Historical sites', 'Cultural immersion'],
      books: ['Oral traditions', 'Historical narratives', 'Contemporary fiction']
    },
    south_america: {
      music: ['Latin rhythms', 'Folk traditions', 'Dance culture'],
      food: ['Tropical fruits', 'Grilled meats', 'Coffee culture'],
      travel: ['Natural wonders', 'Adventure sports', 'Cultural festivals'],
      books: ['Magical realism', 'Political literature', 'Indigenous stories']
    }
  };
  
  return characteristics[regionId]?.[category] || ['Cultural diversity', 'Traditional meets modern', 'Global influences'];
}

function generateTrendingItems(regionId) {
  const items = [];
  const categories = ['music', 'food', 'travel', 'books'];
  
  categories.forEach(category => {
    items.push({
      category,
      name: generateTrendingName(regionId, category),
      trend_score: Math.floor(Math.random() * 30) + 70,
      velocity: Math.floor(Math.random() * 50) + 10,
      description: generateTrendDescription(regionId, category)
    });
  });
  
  return items;
}

function generateTrendingName(regionId, category) {
  const trendingNames = {
    north_america: {
      music: 'Neo-Soul Revival',
      food: 'Korean-Mexican Fusion',
      travel: 'Micro-Adventures',
      books: 'Climate Fiction'
    },
    europe: {
      music: 'Nordic Noir Soundtracks',
      food: 'New Nordic Cuisine',
      travel: 'Slow Tourism',
      books: 'Scandinavian Crime'
    },
    asia_pacific: {
      music: 'City Pop Revival',
      food: 'Okinawan Longevity Diet',
      travel: 'Digital Nomad Hubs',
      books: 'Cli-Fi Literature'
    },
    south_asia: {
      music: 'Indo-Fusion Jazz',
      food: 'Ancient Grain Bowls',
      travel: 'Wellness Retreats',
      books: 'Diaspora Narratives'
    },
    middle_east_africa: {
      music: 'Afrobeats Global',
      food: 'Levantine Street Food',
      travel: 'Cultural Immersion',
      books: 'Postcolonial Voices'
    },
    south_america: {
      music: 'Reggaeton Evolution',
      food: 'Amazonian Superfoods',
      travel: 'Eco-Adventures',
      books: 'Indigenous Storytelling'
    }
  };
  
  return trendingNames[regionId]?.[category] || `Trending ${category}`;
}

function generateTrendDescription(regionId, category) {
  return `Emerging ${category} trend gaining momentum in ${GLOBAL_REGIONS[regionId].name} with unique cultural characteristics`;
}

function generateCulturalInfluence(regionId) {
  const influences = [];
  const otherRegions = Object.keys(GLOBAL_REGIONS).filter(r => r !== regionId);
  
  // Pick 2-3 regions that influence this one
  const influencingRegions = otherRegions.slice(0, 3);
  
  influencingRegions.forEach(influencer => {
    influences.push({
      from_region: GLOBAL_REGIONS[influencer].name,
      influence_strength: Math.floor(Math.random() * 30) + 20,
      cultural_exchange: generateCulturalExchange(influencer, regionId)
    });
  });
  
  return influences;
}

function generateCulturalExchange(fromRegion, toRegion) {
  const exchanges = [
    'Music streaming and viral content',
    'Culinary fusion and restaurant trends',
    'Travel destination popularity',
    'Literary translations and adaptations',
    'Social media cultural movements',
    'Fashion and lifestyle trends'
  ];
  
  return exchanges[Math.floor(Math.random() * exchanges.length)];
}

// Generate global cultural insights
function generateGlobalInsights(trends) {
  const insights = [];
  
  // Find the most culturally active region
  const mostActive = Object.entries(trends)
    .sort(([,a], [,b]) => b.cultural_temperature - a.cultural_temperature)[0];
  
  insights.push({
    type: 'most_active_region',
    message: `${mostActive[1].region_info.name} is the most culturally active region right now`,
    data: mostActive[1]
  });
  
  // Find fastest growing trends
  const fastestGrowing = [];
  Object.entries(trends).forEach(([regionId, data]) => {
    data.trending_now.forEach(item => {
      if (item.velocity > 40) {
        fastestGrowing.push({
          ...item,
          region: data.region_info.name
        });
      }
    });
  });
  
  if (fastestGrowing.length > 0) {
    insights.push({
      type: 'fastest_growing_trends',
      message: 'These trends are exploding globally',
      data: fastestGrowing.slice(0, 5)
    });
  }
  
  // Cross-cultural influences
  insights.push({
    type: 'cultural_bridges',
    message: 'Strongest cross-cultural influences happening now',
    data: generateCrossCulturalBridges(trends)
  });
  
  return insights;
}

function generateCrossCulturalBridges(trends) {
  const bridges = [];
  
  Object.entries(trends).forEach(([regionId, data]) => {
    data.cross_cultural_influence.forEach(influence => {
      if (influence.influence_strength > 35) {
        bridges.push({
          from: influence.from_region,
          to: data.region_info.name,
          strength: influence.influence_strength,
          type: influence.cultural_exchange
        });
      }
    });
  });
  
  return bridges.slice(0, 8);
}

exports.handler = async function(event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    console.log('[CulturalHeatmap] Generating global cultural trends...');

    // Generate current cultural trends
    const globalTrends = generateCulturalTrends();
    
    // Generate insights
    const insights = generateGlobalInsights(globalTrends);
    
    const response = {
      global_trends: globalTrends,
      insights,
      regions: GLOBAL_REGIONS,
      last_updated: new Date().toISOString(),
      metadata: {
        total_regions: Object.keys(GLOBAL_REGIONS).length,
        trend_categories: Object.keys(TREND_CATEGORIES),
        update_frequency: '15 minutes',
        algorithm: 'cultural-heatmap-v1'
      }
    };

    console.log(`[CulturalHeatmap] Generated trends for ${Object.keys(globalTrends).length} regions`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error('[CulturalHeatmap] Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        message: 'Failed to generate cultural heatmap'
      })
    };
  }
};