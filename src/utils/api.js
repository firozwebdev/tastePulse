import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('auth_token');
      // Could redirect to login page here
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const apiEndpoints = {
  // GPT/AI endpoints
  parseText: '/api/parse-taste',

  // Qloo endpoints
  getRecommendations: '/api/recommendations',
  searchEntities: (category) => `/api/entities/search/${category}`,
  validateEntities: '/api/entities/validate',
  getEntityById: (id) => `/api/entities/${id}`,

  // User endpoints
  saveProfile: '/api/profiles',
  getProfiles: '/api/profiles',
  deleteProfile: (id) => `/api/profiles/${id}`,

  // Similar profiles
  getSimilarProfiles: '/api/profiles/similar',
  
  // Structured input
  processStructuredInput: '/api/structured-input'
};

// Mock API functions for development
export const mockApi = {
  async parseText(text) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock GPT parsing logic
    const result = {};

    // English patterns
    if (text.toLowerCase().includes('lo-fi') || text.toLowerCase().includes('jazz')) {
      result.music = text.toLowerCase().includes('lo-fi') ? 'lo-fi beats' : 'jazz';
    }

    if (text.toLowerCase().includes('ramen') || text.toLowerCase().includes('cuisine')) {
      result.food = text.toLowerCase().includes('ramen') ? 'Japanese ramen' : 'Mediterranean cuisine';
    }

    if (text.toLowerCase().includes('murakami') || text.toLowerCase().includes('sci-fi')) {
      result.book = text.toLowerCase().includes('murakami') ? 'Murakami novels' : 'Science fiction';
    }

    if (text.toLowerCase().includes('kyoto') || text.toLowerCase().includes('national park')) {
      result.travel = text.toLowerCase().includes('kyoto') ? 'Kyoto, Japan' : 'National parks';
    }

    // Bengali patterns
    if (text.includes('রবীন্দ্রসঙ্গীত')) result.music = 'রবীন্দ্রসঙ্গীত';
    if (text.includes('ইলিশ')) result.food = 'ইলিশ মাছ';
    if (text.includes('কবিতা')) result.book = 'বাংলা কবিতা';
    if (text.includes('দার্জিলিং')) result.travel = 'দার্জিলিং';

    // Spanish patterns
    if (text.includes('flamenca')) result.music = 'música flamenca';
    if (text.includes('paella')) result.food = 'paella';
    if (text.includes('García Márquez')) result.book = 'novelas de Gabriel García Márquez';
    if (text.includes('playas de España')) result.travel = 'playas de España';

    // Default fallback
    if (Object.keys(result).length === 0) {
      if (/[\u0980-\u09FF]/.test(text)) {
        result.music = 'বাংলা গান';
        result.food = 'বাঙালি খাবার';
        result.book = 'বাংলা সাহিত্য';
        result.travel = 'বাংলাদেশ';
      } else if (/[áéíóúüñ¿¡]/.test(text)) {
        result.music = 'música latina';
        result.food = 'cocina española';
        result.book = 'literatura española';
        result.travel = 'España';
      } else {
        result.music = 'indie pop';
        result.food = 'fusion cuisine';
        result.book = 'contemporary fiction';
        result.travel = 'urban exploration';
      }
    }

    return result;
  },

  async getRecommendations(parsedTaste) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const recommendations = {};

    // Generate mock recommendations for each category
    Object.keys(parsedTaste).forEach(category => {
      recommendations[category] = generateMockRecommendations(category, parsedTaste[category]);
    });

    return recommendations;
  },
  
  async searchEntities(category, query) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate mock search results based on category and query
    const results = [];
    const categories = ['music', 'food', 'book', 'travel'];
    
    if (!categories.includes(category)) {
      return { error: 'Invalid category', results: [] };
    }
    
    if (!query || query.length < 2) {
      return { results: [] };
    }
    
    // Generate 3-7 mock results
    const count = Math.floor(Math.random() * 5) + 3;
    
    for (let i = 0; i < count; i++) {
      const id = `${category}_${Math.floor(Math.random() * 10000)}`;
      let name, description;
      
      // Generate category-specific mock results
      switch(category) {
        case 'music':
          if (query.toLowerCase().includes('jazz')) {
            name = [`Miles Davis`, `John Coltrane`, `Ella Fitzgerald`, `Duke Ellington`, `Thelonious Monk`][i % 5];
            description = 'Jazz musician';
          } else if (query.toLowerCase().includes('rock')) {
            name = [`Led Zeppelin`, `The Beatles`, `Queen`, `Pink Floyd`, `The Rolling Stones`][i % 5];
            description = 'Rock band';
          } else {
            name = `${query.charAt(0).toUpperCase() + query.slice(1)} ${['Band', 'Orchestra', 'Ensemble', 'Quartet', 'Trio'][i % 5]}`;
            description = `${['Popular', 'Emerging', 'Classic', 'Contemporary', 'Fusion'][i % 5]} ${['artist', 'musician', 'composer', 'performer', 'band'][i % 5]}`;
          }
          break;
          
        case 'food':
          if (query.toLowerCase().includes('ramen')) {
            name = [`Tonkotsu Ramen`, `Shoyu Ramen`, `Miso Ramen`, `Shio Ramen`, `Tsukemen`][i % 5];
            description = 'Japanese noodle dish';
          } else if (query.toLowerCase().includes('pizza')) {
            name = [`Neapolitan Pizza`, `New York Style Pizza`, `Chicago Deep Dish`, `Sicilian Pizza`, `Detroit Style Pizza`][i % 5];
            description = 'Pizza variety';
          } else {
            name = `${query.charAt(0).toUpperCase() + query.slice(1)} ${['Cuisine', 'Dish', 'Specialty', 'Delicacy', 'Recipe'][i % 5]}`;
            description = `${['Traditional', 'Modern', 'Fusion', 'Gourmet', 'Street'][i % 5]} ${['food', 'dish', 'cuisine', 'delicacy', 'specialty'][i % 5]}`;
          }
          break;
          
        case 'book':
          if (query.toLowerCase().includes('fiction')) {
            name = [`The Great Gatsby`, `To Kill a Mockingbird`, `1984`, `Pride and Prejudice`, `The Catcher in the Rye`][i % 5];
            description = 'Classic fiction novel';
          } else if (query.toLowerCase().includes('sci-fi')) {
            name = [`Dune`, `Foundation`, `Neuromancer`, `The Hitchhiker's Guide to the Galaxy`, `Ender's Game`][i % 5];
            description = 'Science fiction novel';
          } else {
            name = `The ${query.charAt(0).toUpperCase() + query.slice(1)} ${['Chronicles', 'Series', 'Saga', 'Trilogy', 'Collection'][i % 5]}`;
            description = `${['Award-winning', 'Bestselling', 'Acclaimed', 'Popular', 'Classic'][i % 5]} ${['novel', 'book', 'series', 'anthology', 'publication'][i % 5]}`;
          }
          break;
          
        case 'travel':
          if (query.toLowerCase().includes('japan')) {
            name = [`Tokyo`, `Kyoto`, `Osaka`, `Hokkaido`, `Okinawa`][i % 5];
            description = 'Japanese destination';
          } else if (query.toLowerCase().includes('beach')) {
            name = [`Maldives`, `Bali`, `Santorini`, `Hawaii`, `Cancun`][i % 5];
            description = 'Beach destination';
          } else {
            name = `${query.charAt(0).toUpperCase() + query.slice(1)} ${['City', 'Island', 'Mountains', 'National Park', 'Coast'][i % 5]}`;
            description = `${['Popular', 'Hidden gem', 'Historic', 'Scenic', 'Cultural'][i % 5]} ${['destination', 'location', 'attraction', 'place', 'region'][i % 5]}`;
          }
          break;
      }
      
      results.push({
        id,
        name,
        description,
        category,
        image: `https://images.unsplash.com/photo-${Math.floor(1500000000 + Math.random() * 100000000)}?w=200&h=150&auto=format&fit=crop&q=80`,
        match: Math.floor(Math.random() * 20) + 80 // Match score between 80-99
      });
    }
    
    return { results };
  },
  
  async validateEntities(entities) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation - in a real API this would check if entities exist in the database
    const validatedEntities = {};
    const categories = ['music', 'food', 'book', 'travel'];
    
    categories.forEach(category => {
      if (entities[category]) {
        // Simulate that 90% of entities are valid
        validatedEntities[category] = entities[category].map(entity => ({
          ...entity,
          valid: Math.random() < 0.9,
          suggestions: Math.random() < 0.9 ? [] : [
            { id: `${category}_${Math.floor(Math.random() * 10000)}`, name: `${entity.name} (corrected)` },
            { id: `${category}_${Math.floor(Math.random() * 10000)}`, name: `Alternative to ${entity.name}` }
          ]
        }));
      }
    });
    
    return validatedEntities;
  },
  
  async getEntityById(id) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Parse the category from the ID (format: category_number)
    const category = id.split('_')[0];
    
    // Generate a mock entity based on the ID
    return {
      id,
      name: `Entity ${id}`,
      description: `A ${category} entity with ID ${id}`,
      category,
      image: `https://images.unsplash.com/photo-${Math.floor(1500000000 + Math.random() * 100000000)}?w=400&h=300&auto=format&fit=crop&q=80`,
      details: {
        popularity: Math.floor(Math.random() * 100),
        year: 2000 + Math.floor(Math.random() * 23),
        tags: ['tag1', 'tag2', 'tag3'].slice(0, Math.floor(Math.random() * 3) + 1)
      }
    };
  },
  
  async processStructuredInput(structuredInput) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock processing of structured input
    const recommendations = {};
    const categories = ['music', 'food', 'book', 'travel'];
    
    categories.forEach(category => {
      if (structuredInput[category] && structuredInput[category].length > 0) {
        recommendations[category] = generateMockRecommendations(category, structuredInput[category][0].name);
      }
    });
    
    return recommendations;
  }
};

// Helper function to generate mock recommendations
function generateMockRecommendations(category, taste) {
  const baseRecommendations = {
    music: [
      { name: 'Nujabes', description: 'Japanese hip-hop producer known for jazzy beats', category: 'Artist', match: 95 },
      { name: 'Chillhop Essentials', description: 'Curated lo-fi and chillhop playlist', category: 'Playlist', match: 92 },
      { name: 'Tycho', description: 'American ambient music project', category: 'Artist', match: 88 },
      { name: 'Bonobo', description: 'British electronic music producer', category: 'Artist', match: 85 }
    ],
    food: [
      { name: 'Ichiran Ramen', description: 'Famous Japanese ramen chain', category: 'Restaurant', match: 96 },
      { name: 'Homemade Ramen Guide', description: 'Step-by-step ramen cooking guide', category: 'Recipe', match: 93 },
      { name: 'Tsukemen', description: 'Dipping ramen style', category: 'Dish', match: 90 },
      { name: 'Yakitori', description: 'Japanese grilled chicken skewers', category: 'Dish', match: 87 }
    ],
    book: [
      { name: 'Norwegian Wood', description: 'Haruki Murakami\'s nostalgic novel', category: 'Novel', match: 98 },
      { name: 'Kafka on the Shore', description: 'Magical realist novel by Murakami', category: 'Novel', match: 95 },
      { name: 'The Wind-Up Bird Chronicle', description: 'Epic tale by Murakami', category: 'Novel', match: 92 },
      { name: 'After Dark', description: 'Short novel set in Tokyo', category: 'Novel', match: 89 }
    ],
    travel: [
      { name: 'Fushimi Inari Shrine', description: 'Famous shrine with torii gates in Kyoto', category: 'Attraction', match: 97 },
      { name: 'Arashiyama Bamboo Grove', description: 'Stunning bamboo forest in Kyoto', category: 'Nature', match: 94 },
      { name: 'Gion District', description: 'Kyoto\'s famous geisha district', category: 'District', match: 91 },
      { name: 'Philosopher\'s Path', description: 'Stone path with cherry trees', category: 'Walk', match: 88 }
    ]
  };

  // Add images to recommendations
  const recommendations = baseRecommendations[category] || [];
  return recommendations.map(rec => ({
    ...rec,
    // Use static Unsplash images instead of random API which might be blocked
    image: `https://images.unsplash.com/photo-${Math.floor(1500000000 + Math.random() * 100000000)}?w=400&h=300&auto=format&fit=crop&q=80`
  }));
}

export default api;