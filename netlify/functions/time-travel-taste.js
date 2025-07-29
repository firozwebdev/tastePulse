const fetch = require('node-fetch');

// Historical era mappings for different categories
const ERA_MAPPINGS = {
  '1920s': {
    name: 'The Roaring Twenties',
    description: 'Jazz Age, Art Deco, and cultural revolution',
    music: {
      keywords: ['jazz', 'swing', 'blues', 'ragtime', 'big band'],
      style: 'Jazz clubs and speakeasies defined the sound',
      icon: '🎷'
    },
    food: {
      keywords: ['cocktails', 'canapés', 'oysters', 'champagne', 'french cuisine'],
      style: 'Prohibition-era cocktails and elegant dining',
      icon: '🍸'
    },
    books: {
      keywords: ['modernist literature', 'fitzgerald', 'hemingway', 'poetry'],
      style: 'The Lost Generation and literary modernism',
      icon: '📚'
    },
    travel: {
      keywords: ['paris', 'new york', 'art deco', 'grand hotels', 'ocean liners'],
      style: 'Transatlantic luxury and cultural capitals',
      icon: '🚢'
    }
  },
  '1950s': {
    name: 'The Golden Fifties',
    description: 'Post-war optimism, suburban culture, and rock\'n\'roll',
    music: {
      keywords: ['rock and roll', 'doo-wop', 'country', 'crooners', 'elvis'],
      style: 'The birth of rock and teenage culture',
      icon: '🎸'
    },
    food: {
      keywords: ['diners', 'milkshakes', 'barbecue', 'casseroles', 'tv dinners'],
      style: 'American comfort food and suburban dining',
      icon: '🍔'
    },
    books: {
      keywords: ['beat generation', 'science fiction', 'suburban novels'],
      style: 'Beat poetry and the rise of sci-fi',
      icon: '📖'
    },
    travel: {
      keywords: ['route 66', 'motels', 'national parks', 'car culture', 'suburbia'],
      style: 'The American road trip and car culture',
      icon: '🚗'
    }
  },
  '1960s': {
    name: 'The Swinging Sixties',
    description: 'Cultural revolution, counterculture, and social change',
    music: {
      keywords: ['rock', 'folk', 'psychedelic', 'motown', 'british invasion'],
      style: 'Revolutionary sounds and cultural awakening',
      icon: '☮️'
    },
    food: {
      keywords: ['ethnic cuisine', 'health food', 'fondue', 'international'],
      style: 'Culinary exploration and health consciousness',
      icon: '🥗'
    },
    books: {
      keywords: ['counterculture', 'new journalism', 'social commentary'],
      style: 'Revolutionary literature and social critique',
      icon: '✊'
    },
    travel: {
      keywords: ['europe backpacking', 'hippie trail', 'festivals', 'communes'],
      style: 'Alternative travel and cultural exploration',
      icon: '🎪'
    }
  },
  '1980s': {
    name: 'The Electric Eighties',
    description: 'Neon lights, synthesizers, and pop culture explosion',
    music: {
      keywords: ['synthwave', 'new wave', 'pop', 'electronic', 'mtv'],
      style: 'Synthesizers and the birth of music videos',
      icon: '🎹'
    },
    food: {
      keywords: ['nouvelle cuisine', 'sushi', 'fusion', 'wine bars', 'gourmet'],
      style: 'Culinary sophistication and fusion cuisine',
      icon: '🍣'
    },
    books: {
      keywords: ['cyberpunk', 'postmodern', 'minimalism', 'genre fiction'],
      style: 'Cyberpunk and postmodern literature',
      icon: '🤖'
    },
    travel: {
      keywords: ['business travel', 'luxury resorts', 'theme parks', 'shopping'],
      style: 'Luxury travel and consumer culture',
      icon: '✈️'
    }
  },
  '1990s': {
    name: 'The Alternative Nineties',
    description: 'Grunge, indie culture, and the dawn of the internet',
    music: {
      keywords: ['grunge', 'alternative rock', 'hip hop', 'electronic dance'],
      style: 'Alternative culture and musical diversity',
      icon: '🎤'
    },
    food: {
      keywords: ['coffee culture', 'organic', 'mediterranean', 'fusion'],
      style: 'Coffee shop culture and organic movement',
      icon: '☕'
    },
    books: {
      keywords: ['literary fiction', 'memoir', 'multicultural literature'],
      style: 'Diverse voices and personal narratives',
      icon: '🌍'
    },
    travel: {
      keywords: ['ecotourism', 'adventure travel', 'cultural immersion'],
      style: 'Sustainable and authentic travel experiences',
      icon: '🌿'
    }
  }
};

// Modern taste to historical era mapping
function mapModernTasteToEra(modernTaste, era) {
  const eraData = ERA_MAPPINGS[era];
  if (!eraData) return null;
  
  const mappedTaste = {};
  
  Object.entries(modernTaste).forEach(([category, items]) => {
    if (!eraData[category] || !Array.isArray(items)) return;
    
    const eraCategory = eraData[category];
    const mappedItems = items.map(item => {
      return {
        ...item,
        name: generateHistoricalName(item.name, category, era),
        description: generateHistoricalDescription(item.description, category, era, eraCategory),
        era: era,
        era_context: eraCategory.style,
        time_travel_note: `In the ${eraData.name}, this would have been ${generateEraRelevance(item, category, era)}`
      };
    });
    
    mappedTaste[category] = mappedItems;
  });
  
  return mappedTaste;
}

function generateHistoricalName(modernName, category, era) {
  const eraData = ERA_MAPPINGS[era];
  const categoryData = eraData[category];
  
  // Generate era-appropriate names based on category and era
  const historicalNames = {
    '1920s': {
      music: ['The Cotton Club Orchestra', 'Speakeasy Serenaders', 'Jazz Age Ensemble'],
      food: ['The Ritz Cocktail Lounge', 'Prohibition Era Dining', 'Art Deco Bistro'],
      books: ['Lost Generation Chronicles', 'Modernist Manifesto', 'Jazz Age Literature'],
      travel: ['Grand Hotel Experience', 'Transatlantic Voyage', 'Art Deco Destinations']
    },
    '1950s': {
      music: ['Rock Around the Clock', 'Doo-Wop Dreams', 'Teenage Rebellion'],
      food: ['All-American Diner', 'Suburban Kitchen', 'Drive-In Delights'],
      books: ['Beat Generation Tales', 'Atomic Age Fiction', 'Suburban Stories'],
      travel: ['Route 66 Adventure', 'Motor Lodge Experience', 'American Road Trip']
    },
    '1960s': {
      music: ['Psychedelic Sounds', 'Folk Revolution', 'British Invasion'],
      food: ['Hippie Health Food', 'International Cuisine', 'Counterculture Café'],
      books: ['Revolutionary Literature', 'New Journalism', 'Social Commentary'],
      travel: ['European Backpacking', 'Festival Circuit', 'Cultural Revolution']
    },
    '1980s': {
      music: ['Synthwave Sensation', 'New Wave Revolution', 'MTV Generation'],
      food: ['Nouvelle Cuisine', 'Sushi Bar Experience', 'Wine Bar Culture'],
      books: ['Cyberpunk Chronicles', 'Postmodern Fiction', 'Genre Revolution'],
      travel: ['Business Class Luxury', 'Resort Paradise', 'Consumer Culture']
    },
    '1990s': {
      music: ['Grunge Underground', 'Alternative Scene', 'Hip-Hop Culture'],
      food: ['Coffee Shop Culture', 'Organic Movement', 'Fusion Cuisine'],
      books: ['Literary Renaissance', 'Multicultural Voices', 'Personal Narratives'],
      travel: ['Ecotourism Adventure', 'Cultural Immersion', 'Authentic Experiences']
    }
  };
  
  const names = historicalNames[era]?.[category] || [modernName];
  return names[Math.floor(Math.random() * names.length)];
}

function generateHistoricalDescription(modernDescription, category, era, eraCategory) {
  const eraData = ERA_MAPPINGS[era];
  const contextPhrases = {
    '1920s': ['during the Jazz Age', 'in the era of speakeasies', 'when Art Deco ruled'],
    '1950s': ['in post-war America', 'during the suburban boom', 'in the age of rock\'n\'roll'],
    '1960s': ['during the cultural revolution', 'in the age of social change', 'when counterculture emerged'],
    '1980s': ['in the neon-lit decade', 'during the MTV era', 'when synthesizers ruled'],
    '1990s': ['in the alternative decade', 'during the grunge era', 'when indie culture emerged']
  };
  
  const context = contextPhrases[era]?.[Math.floor(Math.random() * contextPhrases[era].length)] || `in the ${era}`;
  
  return `${eraCategory.style} ${context}. ${modernDescription.substring(0, 100)}...`;
}

function generateEraRelevance(item, category, era) {
  const relevanceMap = {
    '1920s': {
      music: 'the soundtrack to speakeasy nights and jazz club revelry',
      food: 'served at elegant soirées and prohibition-era gatherings',
      books: 'discussed in Parisian salons and literary circles',
      travel: 'accessible via luxury ocean liners and grand hotels'
    },
    '1950s': {
      music: 'playing on jukeboxes and teenage radio shows',
      food: 'served at drive-ins and suburban dinner parties',
      books: 'read by the Beat Generation and suburban families',
      travel: 'explored via the new interstate highway system'
    },
    '1960s': {
      music: 'the anthem of social movements and cultural change',
      food: 'shared at communes and international food festivals',
      books: 'inspiring the counterculture and social activists',
      travel: 'discovered through backpacking and cultural exploration'
    },
    '1980s': {
      music: 'featured on MTV and synthesizer-driven dance floors',
      food: 'served at upscale wine bars and fusion restaurants',
      books: 'defining the cyberpunk movement and postmodern thought',
      travel: 'experienced through luxury resorts and business travel'
    },
    '1990s': {
      music: 'defining the alternative scene and indie culture',
      food: 'served at coffee shops and organic food co-ops',
      books: 'representing diverse voices and personal storytelling',
      travel: 'explored through ecotourism and authentic cultural experiences'
    }
  };
  
  return relevanceMap[era]?.[category] || `popular in the ${era}`;
}

// Generate time travel insights
function generateTimeTravelInsights(originalTaste, timeTravelResults) {
  const insights = [];
  const eras = Object.keys(timeTravelResults);
  
  // Analyze which era best matches the user's taste
  const eraScores = {};
  eras.forEach(era => {
    const eraData = timeTravelResults[era];
    let totalItems = 0;
    Object.values(eraData).forEach(items => {
      if (Array.isArray(items)) totalItems += items.length;
    });
    eraScores[era] = totalItems;
  });
  
  const bestEra = Object.entries(eraScores)
    .sort(([,a], [,b]) => b - a)[0];
  
  if (bestEra) {
    const [era, score] = bestEra;
    const eraInfo = ERA_MAPPINGS[era];
    insights.push({
      type: 'best_era_match',
      era: era,
      message: `Your taste would have thrived in the ${eraInfo.name}!`,
      description: eraInfo.description,
      reason: `Your preferences align strongly with the cultural movements of this era`
    });
  }
  
  // Generate category-specific insights
  const categories = ['music', 'food', 'books', 'travel'];
  categories.forEach(category => {
    const categoryInsights = [];
    eras.forEach(era => {
      const items = timeTravelResults[era][category];
      if (items && items.length > 0) {
        const eraInfo = ERA_MAPPINGS[era];
        categoryInsights.push({
          era,
          icon: eraInfo[category]?.icon || '🎭',
          description: eraInfo[category]?.style || `${category} from the ${era}`
        });
      }
    });
    
    if (categoryInsights.length > 0) {
      insights.push({
        type: 'category_evolution',
        category,
        message: `Your ${category} taste has evolved through the decades`,
        evolution: categoryInsights
      });
    }
  });
  
  return insights;
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
    const { recommendations, selectedEras } = JSON.parse(event.body);

    if (!recommendations) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing recommendations data" })
      };
    }

    console.log('[TimeTravel] Generating historical taste mappings...');

    const eras = selectedEras || ['1920s', '1950s', '1960s', '1980s', '1990s'];
    const timeTravelResults = {};
    
    // Map current taste to each historical era
    eras.forEach(era => {
      const mappedTaste = mapModernTasteToEra(recommendations, era);
      if (mappedTaste) {
        timeTravelResults[era] = mappedTaste;
      }
    });
    
    // Generate insights about the user's taste evolution
    const insights = generateTimeTravelInsights(recommendations, timeTravelResults);
    
    const response = {
      time_travel_results: timeTravelResults,
      insights,
      era_descriptions: Object.fromEntries(
        eras.map(era => [era, {
          name: ERA_MAPPINGS[era]?.name || era,
          description: ERA_MAPPINGS[era]?.description || `The ${era}`,
          cultural_highlights: Object.fromEntries(
            Object.entries(ERA_MAPPINGS[era] || {}).filter(([key]) => key !== 'name' && key !== 'description')
          )
        }])
      ),
      metadata: {
        timestamp: new Date().toISOString(),
        eras_analyzed: eras.length,
        algorithm: 'historical-mapping-v1'
      }
    };

    console.log(`[TimeTravel] Generated mappings for ${eras.length} historical eras`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error('[TimeTravel] Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        message: 'Failed to generate time travel taste mapping'
      })
    };
  }
};