const fetch = require('node-fetch');

// Function to call Qloo's search endpoint and get real data
async function searchQlooNative(query) {
  const QLOO_API_KEY = process.env.QLOO_API_KEY;
  const QLOO_API_URL = process.env.QLOO_API_URL || "https://hackathon.api.qloo.com";
  
  if (!QLOO_API_KEY) {
    throw new Error('No Qloo API key available');
  }

  try {
    const url = `${QLOO_API_URL}/search?query=${encodeURIComponent(query)}`;
    console.log(`[Qloo Native] Searching for: "${query}"`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Api-Key': QLOO_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Qloo API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`[Qloo Native] Found ${data.results?.length || 0} results for "${query}"`);
    
    return data;
  } catch (error) {
    console.error(`[Qloo Native] Search failed for "${query}":`, error.message);
    throw error;
  }
}

// Function to categorize Qloo results based on their actual types
function categorizeQlooResults(results) {
  const categorized = {
    places: [],      // Restaurants, venues, locations
    music: [],       // Artists, albums
    entertainment: [], // Movies, shows
    experiences: [], // Events, activities
    other: []        // Everything else
  };

  results.forEach(item => {
    const types = item.types || [];
    const hasPlace = types.some(type => type.includes('place'));
    const hasArtist = types.some(type => type.includes('artist'));
    const hasAlbum = types.some(type => type.includes('album'));
    const hasMovie = types.some(type => type.includes('movie'));
    
    // Categorize based on Qloo's actual types
    if (hasPlace) {
      categorized.places.push(item);
    } else if (hasArtist || hasAlbum) {
      categorized.music.push(item);
    } else if (hasMovie) {
      categorized.entertainment.push(item);
    } else {
      categorized.other.push(item);
    }
  });

  return categorized;
}

// Function to format Qloo results for our app
function formatQlooResult(item, category) {
  const properties = item.properties || {};
  const location = item.location || {};
  
  // Extract the best available image
  let image = 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=300&auto=format&fit=crop';
  if (properties.image && properties.image.url) {
    image = properties.image.url;
  }

  // Create description based on available data
  let description = properties.description || properties.short_description || '';
  
  if (!description) {
    // Generate description based on type and available data
    if (category === 'places' && properties.address) {
      description = `Located at ${properties.address}`;
      if (properties.business_rating) {
        description += ` • ${properties.business_rating}⭐ rating`;
      }
    } else if (category === 'music' && properties.external) {
      description = 'Musical artist or album';
      if (properties.external.spotify) {
        description += ' • Available on Spotify';
      }
    } else if (category === 'entertainment') {
      description = properties.content_rating ? 
        `${properties.content_rating} rated content` : 
        'Entertainment content';
    }
  }

  // Calculate match score based on popularity
  const popularity = item.popularity || 0;
  const match = Math.round(popularity * 100);

  // Determine category display name
  let categoryDisplay = category;
  if (item.types && item.types.length > 0) {
    const mainType = item.types[0].split(':').pop();
    categoryDisplay = mainType.charAt(0).toUpperCase() + mainType.slice(1);
  }

  return {
    id: item.entity_id || `qloo_${Date.now()}_${Math.random()}`,
    name: item.name || 'Unknown',
    description: description || 'Qloo recommendation',
    category: categoryDisplay,
    match: Math.max(75, Math.min(99, match)), // Keep between 75-99
    image: image,
    source: 'qloo',
    
    // Additional Qloo-specific data
    qlooData: {
      entity_id: item.entity_id,
      popularity: item.popularity,
      types: item.types,
      location: location,
      properties: properties,
      tags: item.tags || []
    }
  };
}

// Main handler function
exports.handler = async function(event, context) {
  console.log('🎯 Qloo Native recommendations handler called');

  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  // Handle CORS preflight
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
    const { parsedTaste } = JSON.parse(event.body);
    
    if (!parsedTaste || typeof parsedTaste !== 'object') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid parsedTaste object" })
      };
    }

    console.log('[Debug] Processing parsed taste with Qloo native approach:', parsedTaste);

    const recommendations = {};
    const usedQlooData = {};
    const allQlooResults = [];

    // Extract all taste preferences and search Qloo
    const searchQueries = [];
    
    // Collect all taste inputs for searching
    Object.entries(parsedTaste).forEach(([category, taste]) => {
      if (taste && typeof taste === 'string' && taste.trim()) {
        searchQueries.push({ category, taste: taste.trim() });
      }
    });

    // Search Qloo for each taste preference
    for (const { category, taste } of searchQueries) {
      try {
        console.log(`[Processing] Searching Qloo for: ${taste} (original category: ${category})`);
        
        const qlooData = await searchQlooNative(taste);
        
        if (qlooData.results && qlooData.results.length > 0) {
          allQlooResults.push(...qlooData.results);
          usedQlooData[category] = true;
          console.log(`[Success] Found ${qlooData.results.length} Qloo results for ${taste}`);
        } else {
          usedQlooData[category] = false;
          console.log(`[No Results] No Qloo results for ${taste}`);
        }
      } catch (error) {
        console.error(`[Error] Qloo search failed for ${taste}:`, error.message);
        usedQlooData[category] = false;
      }
    }

    // Categorize all results based on Qloo's actual structure
    const categorizedResults = categorizeQlooResults(allQlooResults);

    // Format results for each category
    Object.entries(categorizedResults).forEach(([qlooCategory, items]) => {
      if (items.length > 0) {
        recommendations[qlooCategory] = items
          .slice(0, 6) // Limit to 6 items per category
          .map(item => formatQlooResult(item, qlooCategory));
      }
    });

    // If we have no results, provide a helpful message
    if (Object.keys(recommendations).length === 0) {
      recommendations.message = {
        title: "No specific matches found",
        description: "Try more general terms like 'pizza', 'jazz music', or 'tokyo travel'",
        suggestions: ["pizza", "jazz", "tokyo", "coffee", "movies"]
      };
    }

    const response = {
      recommendations,
      metadata: {
        usedQlooData,
        totalQlooResults: allQlooResults.length,
        qlooCategories: Object.keys(categorizedResults).filter(cat => categorizedResults[cat].length > 0),
        timestamp: new Date().toISOString(),
        apiEndpoint: '/search',
        message: 'Using Qloo native structure and categories'
      }
    };

    console.log('[Final] Sending Qloo native response with', Object.keys(recommendations).length, 'categories');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error('[Error] Qloo native handler failed:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        message: 'Qloo native recommendation generation failed'
      })
    };
  }
};