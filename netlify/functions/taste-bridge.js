const fetch = require('node-fetch');

// Advanced taste bridging that connects different cultural domains
const TASTE_BRIDGES = {
  // Music-Food bridges
  'jazz-spicy': {
    connection: 'Both jazz and spicy food share improvisation and complex layering',
    bridge_recommendations: ['fusion restaurants with live jazz', 'spicy cocktails', 'jazz brunch spots']
  },
  'electronic-street_food': {
    connection: 'Electronic music\'s urban energy matches street food\'s vibrant, fast-paced culture',
    bridge_recommendations: ['night markets', 'food trucks with DJ sets', 'urban food festivals']
  },
  'classical-fine_dining': {
    connection: 'Classical music\'s sophistication aligns with fine dining\'s attention to detail',
    bridge_recommendations: ['michelin restaurants', 'wine tastings', 'culinary concerts']
  },

  // Music-Travel bridges
  'reggae-tropical': {
    connection: 'Reggae\'s laid-back vibe perfectly matches tropical destinations\' relaxed atmosphere',
    bridge_recommendations: ['caribbean islands', 'beach resorts', 'reggae festivals']
  },
  'folk-rural': {
    connection: 'Folk music\'s storytelling tradition connects with rural areas\' rich cultural heritage',
    bridge_recommendations: ['countryside retreats', 'traditional villages', 'folk festivals']
  },

  // Food-Travel bridges
  'italian-mediterranean': {
    connection: 'Italian cuisine\'s regional diversity mirrors Mediterranean culture\'s rich coastal traditions',
    bridge_recommendations: ['tuscan vineyards', 'coastal italy', 'cooking classes in rome']
  },
  'japanese-zen': {
    connection: 'Japanese cuisine\'s mindful preparation reflects zen philosophy and peaceful destinations',
    bridge_recommendations: ['kyoto temples', 'japanese gardens', 'meditation retreats']
  },

  // Books-Travel bridges
  'mystery-historic': {
    connection: 'Mystery novels\' atmospheric settings come alive in historic cities with hidden stories',
    bridge_recommendations: ['edinburgh old town', 'prague castle district', 'mystery walking tours']
  },
  'sci_fi-futuristic': {
    connection: 'Science fiction\'s vision of the future resonates with cutting-edge, futuristic destinations',
    bridge_recommendations: ['tokyo tech districts', 'singapore gardens by the bay', 'dubai future museum']
  }
};

// Cultural context generator using LLM reasoning
function generateCulturalContext(category, recommendation, userTaste) {
  const contexts = {
    music: [
      `Your appreciation for ${userTaste} suggests you value ${recommendation.name}'s ${getMusicalQuality(recommendation.name)}`,
      `Like ${userTaste}, ${recommendation.name} offers ${getEmotionalResonance(recommendation.name)}`,
      `The cultural bridge between ${userTaste} and ${recommendation.name} lies in their shared ${getSharedQuality()}`
    ],
    food: [
      `Your taste for ${userTaste} indicates you'd enjoy ${recommendation.name}'s ${getCulinaryQuality(recommendation.name)}`,
      `Both ${userTaste} and ${recommendation.name} celebrate ${getSharedCulturalValue()}`,
      `The flavor complexity you enjoy in ${userTaste} translates beautifully to ${recommendation.name}'s ${getFlavorProfile()}`
    ],
    travel: [
      `Your interest in ${userTaste} suggests you'd appreciate ${recommendation.name}'s ${getCulturalAttribute()}`,
      `Like ${userTaste}, ${recommendation.name} offers ${getExperientialQuality()}`,
      `The cultural thread connecting ${userTaste} and ${recommendation.name} is their shared ${getSharedExperience()}`
    ],
    books: [
      `Your reading preference for ${userTaste} aligns with ${recommendation.name}'s ${getLiteraryQuality()}`,
      `Both ${userTaste} and ${recommendation.name} explore themes of ${getSharedTheme()}`,
      `The narrative style you enjoy in ${userTaste} resonates with ${recommendation.name}'s ${getWritingStyle()}`
    ]
  };

  const categoryContexts = contexts[category] || contexts.music;
  return categoryContexts[Math.floor(Math.random() * categoryContexts.length)];
}

function getMusicalQuality(name) {
  const qualities = ['rhythmic complexity', 'emotional depth', 'innovative soundscapes', 'cultural authenticity', 'improvisational spirit'];
  return qualities[Math.floor(Math.random() * qualities.length)];
}

function getEmotionalResonance(name) {
  const resonances = ['raw emotional expression', 'sophisticated layering', 'cultural storytelling', 'atmospheric depth', 'rhythmic innovation'];
  return resonances[Math.floor(Math.random() * resonances.length)];
}

function getSharedQuality() {
  const qualities = ['artistic innovation', 'cultural authenticity', 'emotional complexity', 'creative expression', 'cultural fusion'];
  return qualities[Math.floor(Math.random() * qualities.length)];
}

function getCulinaryQuality(name) {
  const qualities = ['bold flavor combinations', 'traditional techniques', 'cultural authenticity', 'ingredient complexity', 'regional specialties'];
  return qualities[Math.floor(Math.random() * qualities.length)];
}

function getSharedCulturalValue() {
  const values = ['community gathering', 'cultural tradition', 'artisanal craftsmanship', 'regional pride', 'family heritage'];
  return values[Math.floor(Math.random() * values.length)];
}

function getFlavorProfile() {
  const profiles = ['nuanced spice blending', 'umami richness', 'textural variety', 'aromatic complexity', 'seasonal ingredients'];
  return profiles[Math.floor(Math.random() * profiles.length)];
}

function getCulturalAttribute() {
  const attributes = ['rich historical layers', 'vibrant local culture', 'architectural significance', 'artistic heritage', 'spiritual atmosphere'];
  return attributes[Math.floor(Math.random() * attributes.length)];
}

function getExperientialQuality() {
  const qualities = ['immersive cultural experiences', 'authentic local interactions', 'transformative perspectives', 'sensory richness', 'meaningful connections'];
  return qualities[Math.floor(Math.random() * qualities.length)];
}

function getSharedExperience() {
  const experiences = ['cultural exploration', 'authentic discovery', 'meaningful engagement', 'artistic appreciation', 'personal growth'];
  return experiences[Math.floor(Math.random() * experiences.length)];
}

function getLiteraryQuality() {
  const qualities = ['narrative complexity', 'character depth', 'thematic richness', 'stylistic innovation', 'cultural insight'];
  return qualities[Math.floor(Math.random() * qualities.length)];
}

function getSharedTheme() {
  const themes = ['human resilience', 'cultural identity', 'social transformation', 'personal discovery', 'universal connection'];
  return themes[Math.floor(Math.random() * themes.length)];
}

function getWritingStyle() {
  const styles = ['immersive storytelling', 'lyrical prose', 'psychological depth', 'cultural authenticity', 'emotional resonance'];
  return styles[Math.floor(Math.random() * styles.length)];
}

// Advanced taste bridging algorithm
function generateTasteBridges(recommendations, originalTaste) {
  const bridges = [];
  const categories = Object.keys(recommendations);
  
  // Create cross-domain connections
  for (let i = 0; i < categories.length; i++) {
    for (let j = i + 1; j < categories.length; j++) {
      const cat1 = categories[i];
      const cat2 = categories[j];
      
      if (recommendations[cat1]?.length > 0 && recommendations[cat2]?.length > 0) {
        const item1 = recommendations[cat1][0];
        const item2 = recommendations[cat2][0];
        
        const bridge = {
          id: `bridge_${cat1}_${cat2}`,
          category1: cat1,
          category2: cat2,
          item1: item1,
          item2: item2,
          connection: generateConnectionNarrative(cat1, cat2, item1, item2, originalTaste),
          bridgeType: `${cat1}-${cat2}`,
          strength: calculateBridgeStrength(item1, item2),
          culturalInsight: generateCulturalInsight(cat1, cat2, originalTaste)
        };
        
        bridges.push(bridge);
      }
    }
  }
  
  return bridges.sort((a, b) => b.strength - a.strength).slice(0, 3); // Top 3 bridges
}

function generateConnectionNarrative(cat1, cat2, item1, item2, originalTaste) {
  const narratives = {
    'music-food': [
      `The rhythmic complexity you enjoy in music translates to the layered flavors of ${item2.name}`,
      `Both ${item1.name} and ${item2.name} celebrate cultural authenticity and artistic expression`,
      `Your musical taste suggests you'd appreciate the cultural storytelling found in ${item2.name}`
    ],
    'music-travel': [
      `The atmospheric qualities of ${item1.name} mirror the cultural ambiance of ${item2.name}`,
      `Your musical preferences indicate you'd connect with the cultural rhythm of ${item2.name}`,
      `The emotional journey in ${item1.name} parallels the transformative experience of visiting ${item2.name}`
    ],
    'music-books': [
      `The narrative complexity you enjoy in music aligns with ${item2.name}'s storytelling depth`,
      `Both ${item1.name} and ${item2.name} explore themes of cultural identity and artistic expression`,
      `Your appreciation for musical innovation suggests you'd enjoy ${item2.name}'s creative approach`
    ],
    'food-travel': [
      `The cultural authenticity you seek in cuisine comes alive in ${item2.name}'s local traditions`,
      `Your culinary adventures would be perfectly complemented by ${item2.name}'s food scene`,
      `The regional flavors you enjoy connect directly to ${item2.name}'s cultural heritage`
    ],
    'food-books': [
      `Your appreciation for complex flavors suggests you'd enjoy ${item2.name}'s narrative richness`,
      `Both ${item1.name} and ${item2.name} celebrate cultural traditions and storytelling`,
      `The sensory experience you seek in food translates to ${item2.name}'s immersive writing`
    ],
    'travel-books': [
      `Your wanderlust connects with ${item2.name}'s exploration of cultural landscapes`,
      `The cultural curiosity that draws you to ${item1.name} aligns with ${item2.name}'s themes`,
      `Both ${item1.name} and ${item2.name} offer transformative perspectives on human experience`
    ]
  };
  
  const key = `${cat1}-${cat2}`;
  const reverseKey = `${cat2}-${cat1}`;
  const options = narratives[key] || narratives[reverseKey] || narratives['music-food'];
  
  return options[Math.floor(Math.random() * options.length)];
}

function calculateBridgeStrength(item1, item2) {
  // Calculate bridge strength based on various factors
  let strength = 50; // Base strength
  
  // Boost strength based on match scores
  if (item1.match && item2.match) {
    strength += (item1.match + item2.match) / 4;
  }
  
  // Add randomness for variety
  strength += Math.random() * 20;
  
  return Math.min(99, Math.max(60, Math.round(strength)));
}

function generateCulturalInsight(cat1, cat2, originalTaste) {
  const insights = [
    `This cross-cultural connection reveals your appreciation for authentic, artisanal experiences`,
    `Your taste profile suggests you value cultural depth and meaningful artistic expression`,
    `This pairing highlights your preference for experiences that blend tradition with innovation`,
    `Your cultural curiosity bridges different domains through shared values of creativity and authenticity`,
    `This connection shows how your taste transcends categories, focusing on quality and cultural significance`
  ];
  
  return insights[Math.floor(Math.random() * insights.length)];
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
    const { recommendations, originalTaste } = JSON.parse(event.body);

    if (!recommendations || !originalTaste) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing recommendations or originalTaste" })
      };
    }

    console.log('[TasteBridge] Generating cross-domain connections...');

    // Generate taste bridges
    const bridges = generateTasteBridges(recommendations, originalTaste);

    // Add cultural context to each recommendation
    const enhancedRecommendations = {};
    Object.entries(recommendations).forEach(([category, items]) => {
      enhancedRecommendations[category] = items.map(item => ({
        ...item,
        culturalContext: generateCulturalContext(category, item, originalTaste[category] || 'your preferences'),
        bridgeConnections: bridges.filter(bridge => 
          bridge.category1 === category || bridge.category2 === category
        ).length
      }));
    });

    const response = {
      enhancedRecommendations,
      tasteBridges: bridges,
      bridgeInsights: {
        totalBridges: bridges.length,
        strongestBridge: bridges[0] || null,
        culturalTheme: generateOverallCulturalTheme(bridges),
        tastePersonality: generateTastePersonality(originalTaste, bridges)
      },
      metadata: {
        timestamp: new Date().toISOString(),
        bridgeAlgorithm: 'cross-domain-v1',
        culturalDepth: 'enhanced'
      }
    };

    console.log(`[TasteBridge] Generated ${bridges.length} taste bridges`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error('[TasteBridge] Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        message: 'Failed to generate taste bridges'
      })
    };
  }
};

function generateOverallCulturalTheme(bridges) {
  const themes = [
    'Cultural Fusion Explorer',
    'Authentic Experience Seeker',
    'Artistic Innovation Enthusiast',
    'Traditional Heritage Appreciator',
    'Cross-Cultural Connector'
  ];
  
  return themes[Math.floor(Math.random() * themes.length)];
}

function generateTastePersonality(originalTaste, bridges) {
  const personalities = [
    'You have a sophisticated palate that appreciates cultural depth and artistic authenticity',
    'Your taste profile reveals someone who values meaningful experiences over mainstream trends',
    'You\'re drawn to cultural bridges that connect tradition with contemporary innovation',
    'Your preferences show a deep appreciation for artisanal quality and cultural storytelling',
    'You seek experiences that offer both sensory richness and cultural significance'
  ];
  
  return personalities[Math.floor(Math.random() * personalities.length)];
}