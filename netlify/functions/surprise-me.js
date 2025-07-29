const fetch = require('node-fetch');

// Enhanced function to get contextual images based on content
function getContextualImage(category, itemName = '', description = '', qlooData = {}) {
  // First, try to use Qloo's own image if available
  if (qlooData.properties && qlooData.properties.image && qlooData.properties.image.url) {
    return qlooData.properties.image.url;
  }

  const lowerName = itemName.toLowerCase();
  const lowerDesc = description.toLowerCase();
  
  // Contextual images based on content
  const contextualImages = {
    // Music images
    'bossa nova': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&auto=format&fit=crop',
    'jazz': 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=300&auto=format&fit=crop',
    'electronic': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&auto=format&fit=crop',
    'rock': 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&h=300&auto=format&fit=crop',
    'classical': 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400&h=300&auto=format&fit=crop',
    'hip hop': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&auto=format&fit=crop',
    'world music': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&auto=format&fit=crop',
    
    // Food images
    'korean': 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&h=300&auto=format&fit=crop',
    'peruvian': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&auto=format&fit=crop',
    'ethiopian': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&auto=format&fit=crop',
    'vietnamese': 'https://images.unsplash.com/photo-1559314809-0f31657def5e?w=400&h=300&auto=format&fit=crop',
    'moroccan': 'https://images.unsplash.com/photo-1539136788836-5699e78bfc75?w=400&h=300&auto=format&fit=crop',
    'greek': 'https://images.unsplash.com/photo-1544510808-5f2eadc2b5c0?w=400&h=300&auto=format&fit=crop',
    'indian': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&auto=format&fit=crop',
    'japanese': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&auto=format&fit=crop',
    'mexican': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&auto=format&fit=crop',
    'lebanese': 'https://images.unsplash.com/photo-1571197119282-621c1aff4ac5?w=400&h=300&auto=format&fit=crop',
    'thai': 'https://images.unsplash.com/photo-1559314809-0f31657def5e?w=400&h=300&auto=format&fit=crop',
    'french': 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&auto=format&fit=crop',
    'turkish': 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=300&auto=format&fit=crop',
    'brazilian': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&auto=format&fit=crop',
    
    // Book images
    'magical realism': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&auto=format&fit=crop',
    'cyberpunk': 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&auto=format&fit=crop',
    'mystery': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&auto=format&fit=crop',
    'climate fiction': 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=400&h=300&auto=format&fit=crop',
    'memoir': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&auto=format&fit=crop',
    'nordic noir': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&auto=format&fit=crop',
    'thriller': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&auto=format&fit=crop',
    'poetry': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&auto=format&fit=crop',
    'art history': 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=400&h=300&auto=format&fit=crop',
    
    // Travel images
    'kyoto': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&auto=format&fit=crop',
    'berlin': 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=400&h=300&auto=format&fit=crop',
    'taipei': 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=400&h=300&auto=format&fit=crop',
    'new orleans': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&auto=format&fit=crop',
    'iceland': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&auto=format&fit=crop',
    'bangkok': 'https://images.unsplash.com/photo-1563492065-4c9d4d6e0b8e?w=400&h=300&auto=format&fit=crop',
    'paris': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&auto=format&fit=crop',
    'melbourne': 'https://images.unsplash.com/photo-1514395462725-fb4566210144?w=400&h=300&auto=format&fit=crop',
    'florence': 'https://images.unsplash.com/photo-1552832230-8b3c6b7e2bb9?w=400&h=300&auto=format&fit=crop',
    'patagonia': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&auto=format&fit=crop',
    'istanbul': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&h=300&auto=format&fit=crop',
    'montreal': 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=400&h=300&auto=format&fit=crop',
    'barcelona': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=300&auto=format&fit=crop',
    'singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&auto=format&fit=crop',
    'amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&h=300&auto=format&fit=crop'
  };

  // Try to match content with images
  for (const [key, imageUrl] of Object.entries(contextualImages)) {
    if (lowerName.includes(key) || lowerDesc.includes(key)) {
      return imageUrl;
    }
  }

  // Category fallbacks
  const categoryFallbacks = {
    music: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&auto=format&fit=crop',
    food: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400&h=300&auto=format&fit=crop',
    books: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&auto=format&fit=crop',
    travel: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=400&h=300&auto=format&fit=crop'
  };

  return categoryFallbacks[category] || categoryFallbacks.music;
}

// Curated surprise queries for diverse, interesting recommendations
const SURPRISE_QUERIES = {
  music: [
    'bossa nova', 'ambient electronic', 'indie folk', 'afrobeat', 'synthwave',
    'neo soul', 'post rock', 'world music', 'experimental jazz', 'lo-fi hip hop',
    'classical crossover', 'trip hop', 'reggaeton', 'k-pop', 'blues rock'
  ],
  food: [
    'korean bbq', 'peruvian cuisine', 'ethiopian food', 'vietnamese pho', 'moroccan tagine',
    'greek mezze', 'indian street food', 'japanese kaiseki', 'mexican mole', 'lebanese cuisine',
    'thai curry', 'argentinian steakhouse', 'french bistro', 'turkish kebab', 'brazilian churrasco'
  ],
  books: [
    'magical realism', 'cyberpunk novels', 'historical mystery', 'climate fiction', 'graphic memoirs',
    'nordic noir', 'afrofuturism', 'literary thriller', 'philosophical fiction', 'travel writing',
    'food memoirs', 'science writing', 'poetry collections', 'art history', 'cultural anthropology'
  ],
  travel: [
    'hidden temples kyoto', 'street art berlin', 'night markets taipei', 'jazz clubs new orleans', 'thermal baths iceland',
    'rooftop bars bangkok', 'bookshops paris', 'coffee culture melbourne', 'art galleries florence', 'hiking patagonia',
    'food tours istanbul', 'music festivals montreal', 'architecture barcelona', 'gardens singapore', 'museums amsterdam'
  ]
};

// Fun facts for different categories
const FUN_FACTS = {
  music: [
    "Did you know this genre originated from a fusion of different cultural influences?",
    "This music style is known for its unique rhythm patterns and improvisation.",
    "Musicians in this genre often use unconventional instruments.",
    "This sound has influenced many other musical movements worldwide.",
    "The emotional depth of this music makes it perfect for different moods."
  ],
  food: [
    "This cuisine uses spices and techniques passed down through generations.",
    "The cooking method for this dish creates unique flavors and textures.",
    "This food is traditionally shared among family and friends.",
    "The ingredients in this cuisine offer amazing health benefits.",
    "This dish represents the cultural heritage of its region."
  ],
  books: [
    "This genre challenges readers to think about the world differently.",
    "Authors in this category often blend reality with imagination.",
    "These books have influenced major cultural and social movements.",
    "This writing style creates immersive and thought-provoking experiences.",
    "Readers often discover new perspectives through these stories."
  ],
  travel: [
    "This destination offers experiences you can't find anywhere else.",
    "Local traditions here have been preserved for centuries.",
    "The architecture in this place tells fascinating historical stories.",
    "This location is a hidden gem known mainly to locals.",
    "The cultural blend here creates a unique atmosphere."
  ]
};

async function searchQlooForSurprise(query, category) {
  const QLOO_API_KEY = process.env.QLOO_API_KEY;
  const QLOO_API_URL = process.env.QLOO_API_URL || "https://hackathon.api.qloo.com";
  
  if (!QLOO_API_KEY) {
    throw new Error('No Qloo API key available');
  }

  try {
    const url = `${QLOO_API_URL}/search?query=${encodeURIComponent(query)}`;
    console.log(`[Surprise] Searching Qloo for: "${query}" (category: ${category})`);
    
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
    console.log(`[Surprise] Found ${data.results?.length || 0} results for "${query}"`);
    
    return data;
  } catch (error) {
    console.error(`[Surprise] Search failed for "${query}":`, error.message);
    throw error;
  }
}

function processQlooSurpriseResults(qlooData, category, originalQuery) {
  if (!qlooData || !qlooData.results || qlooData.results.length === 0) {
    return null;
  }

  // Pick a random result from the top 3 for variety
  const topResults = qlooData.results.slice(0, 3);
  const randomResult = topResults[Math.floor(Math.random() * topResults.length)];
  
  const properties = randomResult.properties || {};
  const location = randomResult.location || {};
  
  // Use Qloo's actual name
  let name = randomResult.name || randomResult.title || `${category} surprise`;
  
  // Use Qloo's actual description if available
  let description = randomResult.description || properties.description || properties.short_description || '';
  
  // Clean up HTML tags and entities from description
  if (description) {
    description = description.replace(/<[^>]*>/g, ' ')
                            .replace(/&amp;/g, '&')
                            .replace(/&lt;/g, '<')
                            .replace(/&gt;/g, '>')
                            .replace(/&quot;/g, '"')
                            .replace(/&#39;/g, "'")
                            .replace(/&nbsp;/g, ' ')
                            .replace(/\s+/g, ' ')
                            .trim();
    if (description.length > 150) {
      description = description.substring(0, 147) + '...';
    }
  }
  
  // If no description, create one based on available Qloo data
  if (!description) {
    if (properties.address && location.city) {
      description = `Located in ${location.city}${properties.address ? ' at ' + properties.address : ''}`;
    } else if (properties.genre) {
      description = `${properties.genre} ${category}`;
    } else if (randomResult.types && randomResult.types.length > 0) {
      const mainType = randomResult.types[0].split(':').pop();
      description = `${mainType.charAt(0).toUpperCase() + mainType.slice(1)} recommendation`;
    } else {
      description = `Discover this amazing ${category} recommendation`;
    }
  }
  
  // Calculate match based on Qloo's popularity score
  let match = 85; // Default
  if (randomResult.popularity && typeof randomResult.popularity === 'number') {
    match = Math.round(randomResult.popularity * 100);
    match = Math.max(75, Math.min(99, match));
  }
  
  // Determine category from Qloo's types
  let itemCategory = category;
  if (randomResult.types && randomResult.types.length > 0) {
    const mainType = randomResult.types[0].split(':').pop();
    itemCategory = mainType.charAt(0).toUpperCase() + mainType.slice(1);
  }

  // Create qlooData object for image selection
  const qlooDataForImage = {
    entity_id: randomResult.entity_id,
    popularity: randomResult.popularity,
    types: randomResult.types,
    location: location,
    properties: properties,
    tags: randomResult.tags || []
  };

  // Add a fun fact
  const funFacts = FUN_FACTS[category] || FUN_FACTS.music;
  const funFact = funFacts[Math.floor(Math.random() * funFacts.length)];
  
  return {
    name: name,
    description: description,
    category: itemCategory,
    match: match,
    image: getContextualImage(category, name, description, qlooDataForImage),
    source: 'qloo',
    id: randomResult.entity_id || `surprise_${Date.now()}_${Math.random()}`,
    funFact: funFact,
    qlooData: qlooDataForImage
  };
}

function generateFallbackSurprise(category) {
  const fallbackData = {
    music: { name: 'Discover New Sounds', description: 'Explore music beyond your usual preferences', category: 'Music' },
    food: { name: 'Culinary Adventure', description: 'Try flavors from around the world', category: 'Food' },
    books: { name: 'Literary Journey', description: 'Discover stories that will expand your mind', category: 'Books' },
    travel: { name: 'Hidden Destination', description: 'Explore places off the beaten path', category: 'Travel' }
  };

  const data = fallbackData[category] || fallbackData.music;
  const funFacts = FUN_FACTS[category] || FUN_FACTS.music;
  
  return {
    ...data,
    match: 80,
    image: getContextualImage(category, data.name, data.description, {}),
    source: 'fallback',
    id: `fallback_${category}_${Date.now()}`,
    funFact: funFacts[Math.floor(Math.random() * funFacts.length)]
  };
}

exports.handler = async function(event) {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    console.log('[Surprise] Generating surprise recommendations...');
    
    const categories = ['music', 'food', 'books', 'travel'];
    const surprise = {};
    const usedNames = new Set();

    // Get surprise recommendations for each category
    for (const category of categories) {
      try {
        // Pick a random query for this category
        const queries = SURPRISE_QUERIES[category];
        const randomQuery = queries[Math.floor(Math.random() * queries.length)];
        
        console.log(`[Surprise] Getting ${category} surprise with query: "${randomQuery}"`);
        
        // Search Qloo for surprise recommendation
        const qlooData = await searchQlooForSurprise(randomQuery, category);
        const processedResult = processQlooSurpriseResults(qlooData, category, randomQuery);
        
        if (processedResult && !usedNames.has(processedResult.name)) {
          surprise[category] = processedResult;
          usedNames.add(processedResult.name);
          console.log(`[Surprise] Got real Qloo surprise for ${category}: ${processedResult.name}`);
        } else {
          // Use fallback if no unique result
          const fallback = generateFallbackSurprise(category);
          surprise[category] = fallback;
          console.log(`[Surprise] Using fallback for ${category}`);
        }
      } catch (error) {
        console.error(`[Surprise] Error getting ${category} surprise:`, error.message);
        // Use fallback on error
        const fallback = generateFallbackSurprise(category);
        surprise[category] = fallback;
      }
    }

    console.log(`[Surprise] Generated ${Object.keys(surprise).length} surprise recommendations`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(surprise)
    };

  } catch (error) {
    console.error('[Surprise] Handler failed:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        message: 'Failed to generate surprise recommendations'
      })
    };
  }
}; 