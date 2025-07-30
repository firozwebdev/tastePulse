const fetch = require('node-fetch');

// Enhanced function to get contextual images based on content
function getContextualImage(category, itemName = '', description = '', qlooData = {}) {
  // First, try to use Qloo's own image if available
  if (qlooData.properties && qlooData.properties.image && qlooData.properties.image.url) {
    return qlooData.properties.image.url;
  }

  // Create search terms based on item name and description
  const searchTerms = [];
  const lowerName = itemName.toLowerCase();
  const lowerDesc = description.toLowerCase();
  
  // Extract specific terms for better image matching
  if (category === 'music') {
    // Music-specific image matching
    if (lowerName.includes('jazz') || lowerDesc.includes('jazz')) {
      searchTerms.push('jazz-music', 'saxophone', 'jazz-band');
    } else if (lowerName.includes('rock') || lowerDesc.includes('rock')) {
      searchTerms.push('rock-concert', 'electric-guitar', 'rock-band');
    } else if (lowerName.includes('classical') || lowerDesc.includes('classical')) {
      searchTerms.push('orchestra', 'piano', 'classical-music');
    } else if (lowerName.includes('pop') || lowerDesc.includes('pop')) {
      searchTerms.push('pop-music', 'microphone', 'concert');
    } else if (lowerName.includes('hip-hop') || lowerName.includes('rap')) {
      searchTerms.push('hip-hop', 'microphone', 'urban-music');
    } else if (lowerName.includes('electronic') || lowerName.includes('edm')) {
      searchTerms.push('dj', 'electronic-music', 'synthesizer');
    } else {
      searchTerms.push('music', 'headphones', 'vinyl-records');
    }
  } else if (category === 'food') {
    // Food-specific image matching
    if (lowerName.includes('pizza') || lowerDesc.includes('pizza')) {
      searchTerms.push('pizza', 'italian-food', 'pizzeria');
    } else if (lowerName.includes('ramen') || lowerDesc.includes('ramen')) {
      searchTerms.push('ramen', 'japanese-food', 'noodles');
    } else if (lowerName.includes('italian') || lowerDesc.includes('italian')) {
      searchTerms.push('italian-cuisine', 'pasta', 'italian-restaurant');
    } else if (lowerName.includes('japanese') || lowerDesc.includes('japanese')) {
      searchTerms.push('japanese-food', 'sushi', 'japanese-restaurant');
    } else if (lowerName.includes('chinese') || lowerDesc.includes('chinese')) {
      searchTerms.push('chinese-food', 'dim-sum', 'chinese-restaurant');
    } else if (lowerName.includes('mexican') || lowerDesc.includes('mexican')) {
      searchTerms.push('mexican-food', 'tacos', 'mexican-restaurant');
    } else if (lowerName.includes('indian') || lowerDesc.includes('indian')) {
      searchTerms.push('indian-food', 'curry', 'indian-restaurant');
    } else if (lowerName.includes('thai') || lowerDesc.includes('thai')) {
      searchTerms.push('thai-food', 'pad-thai', 'thai-restaurant');
    } else {
      searchTerms.push('restaurant', 'food', 'dining');
    }
  } else if (category === 'book' || category === 'books') {
    // Book-specific image matching
    if (lowerName.includes('mystery') || lowerDesc.includes('mystery')) {
      searchTerms.push('mystery-books', 'detective', 'crime-novel');
    } else if (lowerName.includes('sci-fi') || lowerName.includes('science fiction')) {
      searchTerms.push('science-fiction', 'space', 'futuristic');
    } else if (lowerName.includes('fantasy') || lowerDesc.includes('fantasy')) {
      searchTerms.push('fantasy-books', 'magic', 'medieval');
    } else if (lowerName.includes('romance') || lowerDesc.includes('romance')) {
      searchTerms.push('romance-novel', 'love-story', 'romantic');
    } else if (lowerName.includes('horror') || lowerDesc.includes('horror')) {
      searchTerms.push('horror-books', 'dark', 'scary');
    } else if (lowerName.includes('biography') || lowerDesc.includes('biography')) {
      searchTerms.push('biography', 'memoir', 'life-story');
    } else {
      searchTerms.push('books', 'library', 'reading');
    }
  } else if (category === 'travel') {
    // Travel-specific image matching
    if (lowerName.includes('tokyo') || lowerDesc.includes('tokyo')) {
      searchTerms.push('tokyo', 'japan', 'japanese-city');
    } else if (lowerName.includes('paris') || lowerDesc.includes('paris')) {
      searchTerms.push('paris', 'eiffel-tower', 'france');
    } else if (lowerName.includes('london') || lowerDesc.includes('london')) {
      searchTerms.push('london', 'big-ben', 'england');
    } else if (lowerName.includes('new york') || lowerDesc.includes('new york')) {
      searchTerms.push('new-york', 'manhattan', 'skyscrapers');
    } else if (lowerName.includes('beach') || lowerDesc.includes('beach')) {
      searchTerms.push('beach', 'ocean', 'tropical');
    } else if (lowerName.includes('mountain') || lowerDesc.includes('mountain')) {
      searchTerms.push('mountains', 'hiking', 'nature');
    } else if (lowerName.includes('museum') || lowerDesc.includes('museum')) {
      searchTerms.push('museum', 'art-gallery', 'culture');
    } else {
      searchTerms.push('travel', 'destination', 'adventure');
    }
  }

  // Generate contextual Unsplash URL
  const searchTerm = searchTerms[0] || category;
  const fallbackTerm = searchTerms[1] || 'lifestyle';
  
  // Use Unsplash's search API with specific terms
  const contextualImages = {
    // Music images
    'jazz-music': 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=300&auto=format&fit=crop',
    'saxophone': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&auto=format&fit=crop',
    'rock-concert': 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&h=300&auto=format&fit=crop',
    'electric-guitar': 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=300&auto=format&fit=crop',
    'orchestra': 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400&h=300&auto=format&fit=crop',
    'piano': 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=300&auto=format&fit=crop',
    'dj': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&auto=format&fit=crop',
    'vinyl-records': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&auto=format&fit=crop',
    
    // Food images
    'pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&auto=format&fit=crop',
    'ramen': 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400&h=300&auto=format&fit=crop',
    'italian-cuisine': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&auto=format&fit=crop',
    'japanese-food': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&auto=format&fit=crop',
    'sushi': 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&auto=format&fit=crop',
    'chinese-food': 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400&h=300&auto=format&fit=crop',
    'mexican-food': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&auto=format&fit=crop',
    'indian-food': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&auto=format&fit=crop',
    'thai-food': 'https://images.unsplash.com/photo-1559314809-0f31657def5e?w=400&h=300&auto=format&fit=crop',
    
    // Book images
    'mystery-books': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&auto=format&fit=crop',
    'science-fiction': 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&auto=format&fit=crop',
    'fantasy-books': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&auto=format&fit=crop',
    'romance-novel': 'https://images.unsplash.com/photo-1518481612222-68bbe828ecd1?w=400&h=300&auto=format&fit=crop',
    'horror-books': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&auto=format&fit=crop',
    'biography': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&auto=format&fit=crop',
    
    // Travel images
    'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&auto=format&fit=crop',
    'paris': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&auto=format&fit=crop',
    'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&auto=format&fit=crop',
    'new-york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&auto=format&fit=crop',
    'beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&auto=format&fit=crop',
    'mountains': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&auto=format&fit=crop',
    'museum': 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=400&h=300&auto=format&fit=crop'
  };

  // Return contextual image or fallback
  return contextualImages[searchTerm] || 
         contextualImages[fallbackTerm] || 
         contextualImages[category] || 
         'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&auto=format&fit=crop';
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

  // DUPLICATE REMOVAL: Track seen names to prevent duplicates
  const seenNames = new Set();
  const uniqueResults = qlooData.results.filter(item => {
    const uniqueKey = `${item.name?.toLowerCase()}-${category}`;
    if (seenNames.has(uniqueKey)) {
      console.log(`🔄 Removing duplicate: ${item.name} (${category})`);
      return false;
    }
    seenNames.add(uniqueKey);
    return true;
  });

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
    
    // Create qlooData object for image selection
    const qlooDataForImage = {
      entity_id: item.entity_id,
      popularity: item.popularity,
      types: item.types,
      location: location,
      properties: properties,
      tags: item.tags || []
    };

    return {
      name: name,
      description: description,
      category: itemCategory,
      match: match,
      image: getContextualImage(category, name, description, qlooDataForImage),
      source: 'qloo',
      id: item.entity_id || item.id || `qloo_${Date.now()}_${index}`,
      
      // Include additional Qloo data for debugging/future use
      qlooData: qlooDataForImage
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