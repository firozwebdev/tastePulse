const fetch = require('node-fetch');

// Helper function to get static images for recommendations
function getStaticImageForCategory(category, itemName = '') {
  const categoryImages = {
    music: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&auto=format&fit=crop'
    ],
    food: [
      'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&h=300&auto=format&fit=crop'
    ],
    book: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&auto=format&fit=crop'
    ],
    travel: [
      'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&auto=format&fit=crop'
    ]
  };

  const images = categoryImages[category] || categoryImages.music;
  const nameHash = itemName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = nameHash % images.length;
  return images[index];
}

// Function to call the working Qloo /search endpoint
async function searchQloo(query, category = '') {
  const QLOO_API_KEY = process.env.QLOO_API_KEY;
  const QLOO_API_URL = process.env.QLOO_API_URL || "https://hackathon.api.qloo.com";
  
  if (!QLOO_API_KEY) {
    throw new Error('No Qloo API key available');
  }

  try {
    // Use the working /search endpoint
    let url = `${QLOO_API_URL}/search?query=${encodeURIComponent(query)}`;
    
    // Add category if provided (but don't use 'type' parameter since it causes 403)
    if (category) {
      // We'll filter results by category after getting them, since type parameter is blocked
      console.log(`[Qloo] Searching for "${query}" (category: ${category})`);
    } else {
      console.log(`[Qloo] Searching for "${query}"`);
    }
    
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
    console.log(`[Qloo] Search successful for "${query}":`, data);
    
    return data;
  } catch (error) {
    console.error(`[Qloo] Search failed for "${query}":`, error.message);
    throw error;
  }
}

// Function to process Qloo search results into our format
function processQlooSearchResults(qlooData, category, originalQuery) {
  if (!qlooData || !qlooData.results) {
    return [];
  }

  console.log(`[Qloo] Processing ${qlooData.results.length} results for ${category}:`, qlooData.results.slice(0, 3));

  const results = qlooData.results.slice(0, 6).map((item, index) => {
    // Extract rich data from Qloo response
    const properties = item.properties || {};
    const location = item.location || {};
    
    // Use Qloo's actual name, not our search term
    let name = item.name || item.title || `${category} recommendation`;
    
    // Use Qloo's actual description if available
    let description = item.description || properties.description || properties.short_description || '';
    
    // Clean up HTML tags and entities from description
    if (description) {
      // Remove HTML tags
      description = description.replace(/<[^>]*>/g, ' ');
      // Replace HTML entities
      description = description.replace(/&amp;/g, '&')
                              .replace(/&lt;/g, '<')
                              .replace(/&gt;/g, '>')
                              .replace(/&quot;/g, '"')
                              .replace(/&#39;/g, "'")
                              .replace(/&nbsp;/g, ' ');
      // Clean up multiple spaces and trim
      description = description.replace(/\s+/g, ' ').trim();
      // Limit description length for better UI
      if (description.length > 200) {
        description = description.substring(0, 197) + '...';
      }
    }
    
    // If no description, create one based on available Qloo data
    if (!description) {
      if (properties.address && location.city) {
        description = `Located in ${location.city}${properties.address ? ' at ' + properties.address : ''}`;
      } else if (properties.genre) {
        description = `${properties.genre} ${category}`;
      } else if (item.types && item.types.length > 0) {
        const mainType = item.types[0].split(':').pop();
        description = `${mainType.charAt(0).toUpperCase() + mainType.slice(1)} recommendation`;
      } else {
        description = `${name} - ${category} recommendation from Qloo`;
      }
    }
    
    // Calculate match based on Qloo's popularity score if available
    let match = Math.max(75, 100 - (index * 3)); // Default fallback
    if (item.popularity && typeof item.popularity === 'number') {
      match = Math.round(item.popularity * 100);
      match = Math.max(75, Math.min(99, match)); // Keep between 75-99
    }
    
    // Determine category from Qloo's types if available
    let itemCategory = category;
    if (item.types && item.types.length > 0) {
      const mainType = item.types[0].split(':').pop();
      itemCategory = mainType.charAt(0).toUpperCase() + mainType.slice(1);
    }
    
    return {
      name: name,
      description: description,
      category: itemCategory,
      match: match,
      image: getStaticImageForCategory(category, name),
      source: 'qloo',
      id: item.entity_id || item.id || `qloo_${Date.now()}_${index}`,
      
      // Include additional Qloo data for debugging/future use
      qlooData: {
        entity_id: item.entity_id,
        popularity: item.popularity,
        types: item.types,
        location: location,
        properties: properties,
        tags: item.tags || []
      }
    };
  });

  console.log(`[Qloo] Processed results sample:`, results.slice(0, 2));
  return results;
}

// Function to generate mock data when Qloo fails
function generateMockData(category, query) {
  const mockData = {
    music: [
      { name: 'Jazz Essentials', description: 'Classic jazz compilation for music lovers', category: 'Playlist', match: 92 },
      { name: 'Miles Davis', description: 'Legendary jazz trumpeter and composer', category: 'Artist', match: 89 },
      { name: 'Blue Note Records', description: 'Iconic jazz record label', category: 'Label', match: 86 }
    ],
    food: [
      { name: 'Authentic Italian Pizza', description: 'Traditional Neapolitan-style pizza', category: 'Dish', match: 94 },
      { name: 'Local Pizzeria', description: 'Neighborhood pizza restaurant', category: 'Restaurant', match: 91 },
      { name: 'Pizza Making Class', description: 'Learn to make authentic pizza', category: 'Experience', match: 88 }
    ],
    book: [
      { name: 'Contemporary Fiction', description: 'Modern literary works', category: 'Genre', match: 90 },
      { name: 'Book Club Favorites', description: 'Popular book club selections', category: 'Collection', match: 87 },
      { name: 'Literary Awards Winners', description: 'Award-winning literature', category: 'Collection', match: 85 }
    ],
    travel: [
      { name: 'Cultural City Tours', description: 'Explore local culture and history', category: 'Experience', match: 93 },
      { name: 'Hidden Local Gems', description: 'Off-the-beaten-path destinations', category: 'Destination', match: 90 },
      { name: 'Cultural Immersion', description: 'Deep cultural experiences', category: 'Experience', match: 87 }
    ]
  };

  const categoryData = mockData[category] || mockData.music;
  return categoryData.map((item, index) => ({
    ...item,
    image: getStaticImageForCategory(category, item.name),
    source: 'mock',
    id: `mock_${category}_${index}`
  }));
}

// Main handler function
exports.handler = async function(event, context) {
  console.log('🎯 Fixed Qloo recommendations handler called');

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

    console.log('[Debug] Processing parsed taste:', parsedTaste);

    const recommendations = {};
    const usedMockData = {};

    // Process each category
    for (const [category, tasteData] of Object.entries(parsedTaste)) {
      // Skip non-category fields
      if (!tasteData || !['music', 'food', 'book', 'books', 'travel', 'fashion', 'brand'].includes(category)) {
        continue;
      }

      // Extract actual taste string from complex object structure
      let taste = '';
      if (typeof tasteData === 'string') {
        taste = tasteData;
      } else if (typeof tasteData === 'object') {
        // Handle Gemini's complex structure
        const allValues = [];
        
        // Extract from different possible fields, filtering out "Not specified" values
        if (tasteData.genres && Array.isArray(tasteData.genres)) {
          allValues.push(...tasteData.genres.filter(g => g && g.trim() && !g.toLowerCase().includes('not specified')));
        }
        if (tasteData.artists && Array.isArray(tasteData.artists)) {
          allValues.push(...tasteData.artists.filter(a => a && a.trim() && !a.toLowerCase().includes('not specified')));
        }
        if (tasteData.cuisines && Array.isArray(tasteData.cuisines)) {
          allValues.push(...tasteData.cuisines.filter(c => c && c.trim() && !c.toLowerCase().includes('not specified')));
        }
        if (tasteData.dishes && Array.isArray(tasteData.dishes)) {
          allValues.push(...tasteData.dishes.filter(d => d && d.trim() && !d.toLowerCase().includes('not specified')));
        }
        if (tasteData.destinations && Array.isArray(tasteData.destinations)) {
          allValues.push(...tasteData.destinations.filter(d => d && d.trim() && !d.toLowerCase().includes('not specified')));
        }
        if (tasteData.activities && Array.isArray(tasteData.activities)) {
          allValues.push(...tasteData.activities.filter(a => a && a.trim() && !a.toLowerCase().includes('not specified')));
        }
        if (tasteData.authors && Array.isArray(tasteData.authors)) {
          allValues.push(...tasteData.authors.filter(a => a && a.trim() && !a.toLowerCase().includes('not specified')));
        }
        
        // Use the first non-empty value or combine multiple values
        taste = allValues.length > 0 ? allValues[0] : '';
      }

      // Skip if we couldn't extract a meaningful taste
      if (!taste || taste.trim() === '') {
        console.log(`[Skip] No meaningful taste extracted for ${category}`);
        continue;
      }

      console.log(`[Processing] Category: ${category}, Extracted Taste: "${taste}"`);

      try {
        // Try to get real Qloo data using the working /search endpoint
        const qlooData = await searchQloo(taste, category);
        const processedResults = processQlooSearchResults(qlooData, category, taste);
        
        if (processedResults.length > 0) {
          recommendations[category] = processedResults;
          usedMockData[category] = false;
          console.log(`[Success] Got ${processedResults.length} real Qloo results for ${category}`);
        } else {
          // No results from Qloo, use mock data
          recommendations[category] = generateMockData(category, taste);
          usedMockData[category] = true;
          console.log(`[Fallback] Using mock data for ${category} - no Qloo results`);
        }
      } catch (error) {
        // Qloo API failed, use mock data
        console.error(`[Error] Qloo failed for ${category}:`, error.message);
        recommendations[category] = generateMockData(category, taste);
        usedMockData[category] = true;
      }
    }

    const response = {
      recommendations,
      metadata: {
        usedMockData,
        timestamp: new Date().toISOString(),
        apiEndpoint: '/search',
        message: 'Using working Qloo /search endpoint'
      }
    };

    console.log('[Final] Sending response with', Object.keys(recommendations).length, 'categories');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error('[Error] Handler failed:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        message: 'Recommendation generation failed'
      })
    };
  }
};