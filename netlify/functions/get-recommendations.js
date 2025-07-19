const fetch = require('node-fetch');

// Helper function to get static images for recommendations
function getStaticImageForCategory(category, itemName = '') {
  // Static images by category
  const categoryImages = {
    music: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&auto=format&fit=crop'
    ],
    food: [
      'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1626622127860-0a927d8b5c4f?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1579275542618-a1dfed5f54ba?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400&h=300&auto=format&fit=crop'
    ],
    book: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&auto=format&fit=crop'
    ],
    travel: [
      'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1624253321171-1be53e12f5f2?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517231925375-bf2cb42917a5?w=400&h=300&auto=format&fit=crop'
    ],
    fashion: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=400&h=300&auto=format&fit=crop'
    ],
    brand: [
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=300&auto=format&fit=crop'
    ]
  };
  
  // Get images for the specified category or default to a generic image
  const images = categoryImages[category] || [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&auto=format&fit=crop'
  ];
  
  // Use a deterministic approach to select an image based on the name
  const nameHash = itemName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = nameHash % images.length;
  
  return images[index];
}

// Generate mock recommendations
function generateMockRecommendations(parsedTaste) {
  const mockRecommendations = {};
  for (const category of Object.keys(parsedTaste)) {
    switch (category) {
      case "music":
        mockRecommendations.music = [
          // Asia
          { name: "J-Pop", description: "Popular music from Japan", category: "Genre", match: 95, funFact: "J-Pop is known for its catchy melodies and vibrant performances.", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&auto=format&fit=crop" },
          { name: "K-Pop", description: "Korean pop music sensation", category: "Genre", match: 94, funFact: "K-Pop has a massive global fanbase.", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&auto=format&fit=crop" },
          { name: "Mandopop", description: "Mandarin-language pop music from China", category: "Genre", match: 93, funFact: "Mandopop is popular across East Asia.", image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=300&auto=format&fit=crop" },
          { name: "Rabindra Sangeet", description: "Classic Bengali songs by Rabindranath Tagore", category: "Genre", match: 99, funFact: "Rabindra Sangeet is an integral part of Bengali culture.", image: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Rabindra_Sangeet.jpg" },
          // Europe
          { name: "Chanson française", description: "French lyrical song tradition", category: "Genre", match: 92, funFact: "Chanson is a staple of French culture.", image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=300&auto=format&fit=crop" },
          { name: "Classical", description: "Timeless orchestral music from Europe", category: "Genre", match: 91, funFact: "Vienna is known as the city of classical music.", image: "https://images.unsplash.com/photo-1517231925375-bf2cb42917a5?w=400&h=300&auto=format&fit=crop" },
          // Americas
          { name: "Samba", description: "Lively Brazilian music and dance style", category: "Genre", match: 88, funFact: "Samba is a symbol of Brazilian national identity.", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&auto=format&fit=crop" },
          { name: "Jazz", description: "American-born genre with global influence", category: "Genre", match: 97, funFact: "Jazz originated in New Orleans.", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&auto=format&fit=crop" },
          { name: "Reggaeton", description: "Popular Latin music genre from Puerto Rico", category: "Genre", match: 89, funFact: "Reggaeton blends Latin rhythms with hip-hop.", image: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=400&h=300&auto=format&fit=crop" },
          // Africa
          { name: "Afrobeat", description: "A fusion of West African musical styles with jazz and funk", category: "Genre", match: 90, funFact: "Afrobeat was pioneered by Nigerian legend Fela Kuti.", image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=300&auto=format&fit=crop" },
          { name: "Highlife", description: "Ghanaian music blending African and Western styles", category: "Genre", match: 87, funFact: "Highlife is popular in West Africa.", image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=300&auto=format&fit=crop" },
          // Oceania
          { name: "Didgeridoo", description: "Traditional Aboriginal Australian music", category: "Instrument", match: 85, funFact: "The didgeridoo is one of the world's oldest instruments.", image: "https://images.unsplash.com/photo-1517231925375-bf2cb42917a5?w=400&h=300&auto=format&fit=crop" },
        ];
        break;
      case "food":
        mockRecommendations.food = [
          // Asia
          { name: "Sushi", description: "Iconic Japanese dish of vinegared rice and seafood", category: "Dish", match: 95, funFact: "Sushi is enjoyed worldwide and comes in many varieties.", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&auto=format&fit=crop" },
          { name: "Kimchi", description: "Spicy fermented cabbage from Korea", category: "Dish", match: 94, funFact: "Kimchi is a staple in Korean cuisine.", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&auto=format&fit=crop" },
          { name: "Peking Duck", description: "Famous Chinese roasted duck dish", category: "Dish", match: 93, funFact: "Peking Duck is a delicacy from Beijing.", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&auto=format&fit=crop" },
          { name: "Hilsa Fish", description: "A beloved delicacy in Bengali cuisine", category: "Dish", match: 99, funFact: "Hilsa is the national fish of Bangladesh.", image: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Hilsa_fish.jpg" },
          // Europe
          { name: "Croissant", description: "Buttery French pastry", category: "Pastry", match: 92, funFact: "Croissants are a breakfast staple in France.", image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=300&auto=format&fit=crop" },
          { name: "Paella", description: "Spanish rice dish with seafood and saffron", category: "Dish", match: 90, funFact: "Paella originated in Valencia, Spain.", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&auto=format&fit=crop" },
          { name: "Pasta Carbonara", description: "Classic Italian pasta with eggs, cheese, and pancetta", category: "Dish", match: 88, funFact: "Carbonara is a staple of Roman cuisine.", image: "https://images.unsplash.com/photo-1523987355523-c7b5b0723c6b?w=400&h=300&auto=format&fit=crop" },
          // Americas
          { name: "Feijoada", description: "Hearty Brazilian stew of beans and pork", category: "Dish", match: 92, funFact: "Feijoada is often considered the national dish of Brazil.", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&auto=format&fit=crop" },
          { name: "Tacos", description: "Mexican street food favorite", category: "Dish", match: 91, funFact: "Tacos are a symbol of Mexican cuisine.", image: "https://images.unsplash.com/photo-1517231925375-bf2cb42917a5?w=400&h=300&auto=format&fit=crop" },
          { name: "Burger", description: "Classic American fast food", category: "Dish", match: 90, funFact: "The hamburger is an American icon.", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&auto=format&fit=crop" },
          // Africa
          { name: "Jollof Rice", description: "West African rice dish with tomatoes and spices", category: "Dish", match: 89, funFact: "Jollof rice is a party favorite in Nigeria and Ghana.", image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=300&auto=format&fit=crop" },
          { name: "Bunny Chow", description: "South African curry in a hollowed-out loaf of bread", category: "Dish", match: 87, funFact: "Bunny chow originated in Durban.", image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=300&auto=format&fit=crop" },
          // Oceania
          { name: "Pavlova", description: "Meringue-based dessert from Australia/New Zealand", category: "Dessert", match: 85, funFact: "Pavlova is named after a Russian ballerina.", image: "https://images.unsplash.com/photo-1517231925375-bf2cb42917a5?w=400&h=300&auto=format&fit=crop" },
        ];
        break;
      case "book":
        mockRecommendations.book = [
          // Asia
          { name: "Haruki Murakami novels", description: "Surreal and magical realist works from Japan", category: "Author", match: 95, funFact: "Murakami's books are translated into over 50 languages.", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&auto=format&fit=crop" },
          { name: "Mo Yan novels", description: "Works by the Chinese Nobel laureate", category: "Author", match: 94, funFact: "Mo Yan won the Nobel Prize in Literature in 2012.", image: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=400&h=300&auto=format&fit=crop" },
          { name: "Humayun Ahmed novels", description: "Works by the celebrated Bangladeshi author", category: "Author", match: 99, funFact: "Humayun Ahmed is one of the most popular writers in Bengali literature.", image: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Humayun_Ahmed.jpg" },
          // Europe
          { name: "Victor Hugo novels", description: "French classics like Les Misérables", category: "Author", match: 93, funFact: "Victor Hugo is a giant of French literature.", image: "https://images.unsplash.com/photo-1517231925375-bf2cb42917a5?w=400&h=300&auto=format&fit=crop" },
          { name: "Jane Austen novels", description: "Timeless English classics", category: "Author", match: 88, funFact: "Jane Austen's works are beloved for their wit and social commentary.", image: "https://images.unsplash.com/photo-1517231925375-bf2cb42917a5?w=400&h=300&auto=format&fit=crop" },
          { name: "Gabriel García Márquez novels", description: "Magical realism from Colombia", category: "Author", match: 92, funFact: "García Márquez won the Nobel Prize in Literature in 1982.", image: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=400&h=300&auto=format&fit=crop" },
          { name: "Chinua Achebe novels", description: "Influential Nigerian literature", category: "Author", match: 90, funFact: "Achebe's 'Things Fall Apart' is a classic of African literature.", image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=300&auto=format&fit=crop" },
          { name: "Paulo Coelho novels", description: "Brazilian author of The Alchemist", category: "Author", match: 89, funFact: "Coelho's books have sold over 225 million copies.", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&auto=format&fit=crop" },
          // North America
          { name: "Mark Twain novels", description: "American classics like Tom Sawyer", category: "Author", match: 91, funFact: "Mark Twain is called the father of American literature.", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&auto=format&fit=crop" },
        ];
        break;
      case "travel":
        mockRecommendations.travel = [
          // Asia
          { name: "Kyoto", description: "Historic city in Japan known for its temples and cherry blossoms", category: "City", match: 95, funFact: "Kyoto was the capital of Japan for over a thousand years.", image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&h=300&auto=format&fit=crop" },
          { name: "Beijing", description: "China's capital, home to the Great Wall and Forbidden City", category: "City", match: 94, funFact: "Beijing is one of the world's oldest cities.", image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=300&auto=format&fit=crop" },
          { name: "Sundarbans", description: "The world's largest mangrove forest, shared by Bangladesh and India", category: "Nature", match: 99, funFact: "The Sundarbans is home to the famous Royal Bengal Tiger.", image: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Sundarbans.jpg" },
          // Europe
          { name: "Paris", description: "The romantic capital of France", category: "City", match: 93, funFact: "Paris is known as the City of Light.", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&auto=format&fit=crop" },
          { name: "Barcelona", description: "Spanish city known for art, architecture, and cuisine", category: "City", match: 90, funFact: "Barcelona is home to the famous Sagrada Família basilica.", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&auto=format&fit=crop" },
          // Americas
          { name: "Rio de Janeiro", description: "Vibrant Brazilian city famous for Carnival and beaches", category: "City", match: 92, funFact: "Rio's Christ the Redeemer statue is one of the New Seven Wonders of the World.", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&auto=format&fit=crop" },
          { name: "New York City", description: "The city that never sleeps in the USA", category: "City", match: 91, funFact: "NYC is home to over 800 languages.", image: "https://images.unsplash.com/photo-1517231925375-bf2cb42917a5?w=400&h=300&auto=format&fit=crop" },
          // Africa
          { name: "Cairo", description: "Egypt's capital, gateway to the pyramids", category: "City", match: 88, funFact: "Cairo is the largest city in the Arab world.", image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=300&auto=format&fit=crop" },
          { name: "Cape Town", description: "South Africa's coastal gem", category: "City", match: 87, funFact: "Cape Town is famous for Table Mountain.", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&auto=format&fit=crop" },
          // Oceania
          { name: "Sydney", description: "Australia's iconic harbor city", category: "City", match: 86, funFact: "Sydney Opera House is a UNESCO World Heritage Site.", image: "https://images.unsplash.com/photo-1517231925375-bf2cb42917a5?w=400&h=300&auto=format&fit=crop" },
        ];
        break;
      default:
        break;
    }
  }
  return mockRecommendations;
}

async function searchQlooEntityByName(category, value) {
  const QLOO_API_KEY = process.env.QLOO_API_KEY;
  const QLOO_API_URL = process.env.QLOO_API_URL || "https://api.qloo.com";
  // Qloo expects type to be one of their supported types, e.g., 'music', 'food', 'book', 'place', etc.
  // We'll map our categories to Qloo types where possible.
  const typeMap = {
    music: 'music',
    food: 'food',
    book: 'book',
    travel: 'place',
  };
  const qlooType = typeMap[category] || '';
  const url = `${QLOO_API_URL}/entities?query=${encodeURIComponent(value)}${qlooType ? `&type=${qlooType}` : ''}`;
  const options = { method: 'GET', headers: { 'X-Api-Key': QLOO_API_KEY } };
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`Qloo entity search error: ${response.statusText}`);
  const data = await response.json();
  if (!data.entities || data.entities.length === 0) throw new Error("No Qloo entity found");
  return data.entities[0].id;
}

async function getQlooInsightsForEntity(entityId) {
  const QLOO_API_KEY = process.env.QLOO_API_KEY;
  const QLOO_API_URL = process.env.QLOO_API_URL || "https://hackathon.api.qloo.com";
  const url = `${QLOO_API_URL}/insights?entity_ids=${entityId}`;
  const options = { method: 'GET', headers: { 'X-Api-Key': QLOO_API_KEY } };
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`Qloo API error: ${response.statusText}`);
  return await response.json();
}

function cleanTasteValue(category, value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  // If value is an object with arrays, pick the first non-empty array's first value
  if (typeof value === 'object' && value !== null) {
    for (const key of Object.keys(value)) {
      if (Array.isArray(value[key]) && value[key].length > 0) {
        return value[key][0];
      }
    }
  }
  return '';
}

// --- Qloo Tag and Audience Lookup Helpers ---
async function searchQlooTagByName(category, value) {
  const QLOO_API_KEY = process.env.QLOO_API_KEY;
  const QLOO_API_URL = process.env.QLOO_API_URL || "https://api.qloo.com";
  // Qloo tag search endpoint (example: /tags?query=Jazz&type=music)
  const typeMap = { music: 'music', food: 'food', book: 'book', travel: 'place' };
  const qlooType = typeMap[category] || '';
  const url = `${QLOO_API_URL}/tags?query=${encodeURIComponent(value)}${qlooType ? `&type=${qlooType}` : ''}`;
  const options = { method: 'GET', headers: { 'X-Api-Key': QLOO_API_KEY } };
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`Qloo tag search error: ${response.statusText}`);
  const data = await response.json();
  if (!data.tags || data.tags.length === 0) throw new Error("No Qloo tag found");
  return data.tags[0].id;
}

async function searchQlooAudienceByName(value) {
  const QLOO_API_KEY = process.env.QLOO_API_KEY;
  const QLOO_API_URL = process.env.QLOO_API_URL || "https://api.qloo.com";
  // Qloo audience search endpoint (example: /audiences?query=photography)
  const url = `${QLOO_API_URL}/audiences?query=${encodeURIComponent(value)}`;
  const options = { method: 'GET', headers: { 'X-Api-Key': QLOO_API_KEY } };
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`Qloo audience search error: ${response.statusText}`);
  const data = await response.json();
  if (!data.audiences || data.audiences.length === 0) throw new Error("No Qloo audience found");
  return data.audiences[0].id;
}

// Helper to filter Qloo result fields for frontend
function filterQlooFields(item) {
  // Only include these fields if present
  const allowed = [
    'name', 'address', 'website', 'description', 'image', 'funFact', 'match', 'category', 'id', 'type', 'city', 'country', 'region', 'phone', 'email', 'price', 'rating', 'cuisine', 'genre', 'author', 'artist', 'destination', 'activity', 'tags', 'external_url', 'photo', 'logo', 'summary', 'title', 'subtitle', 'release_year', 'duration', 'language', 'publisher', 'venue', 'coordinates', 'hours', 'menu', 'reservation_url', 'social', 'bio', 'awards', 'highlights', 'notes', 'source', 'provider', 'score', 'popularity', 'followers', 'listeners', 'views', 'episodes', 'seasons', 'host', 'guests', 'platform', 'streaming', 'availability', 'region_restriction', 'copyright', 'isbn', 'issn', 'upc', 'ean', 'asin', 'imdb', 'tmdb', 'spotify', 'apple', 'deezer', 'youtube', 'soundcloud', 'pandora', 'tidal', 'amazon', 'netflix', 'hulu', 'disney', 'prime', 'crunchyroll', 'vimeo', 'goodreads', 'openlibrary', 'googlebooks', 'tripadvisor', 'yelp', 'zomato', 'foursquare', 'opentable', 'resy', 'ubereats', 'doordash', 'grubhub', 'postmates', 'seamless', 'justeat', 'deliveroo', 'foodpanda', 'swiggy', 'zomato', 'airbnb', 'booking', 'expedia', 'hotels', 'trivago', 'kayak', 'skyscanner', 'agoda', 'hostelworld', 'couchsurfing', 'viator', 'getyourguide', 'eventbrite', 'meetup', 'facebook', 'instagram', 'twitter', 'tiktok', 'linkedin', 'snapchat', 'wechat', 'line', 'kakao', 'telegram', 'whatsapp', 'signal', 'messenger', 'slack', 'discord', 'reddit', 'pinterest', 'tumblr', 'quora', 'medium', 'substack', 'patreon', 'onlyfans', 'twitch', 'mixer', 'dailymotion', 'periscope', 'vine', 'vkontakte', 'odnoklassniki', 'baidu', 'weibo', 'douyin', 'bilibili', 'youku', 'iqiyi', 'tencent', 'alibaba', 'jd', 'pinduoduo', 'meituan', 'xiaohongshu', 'kuaishou', 'zhihu', 'sina', 'sohu', 'netease', 'sogou', '360', 'toutiao', 'kuaikan', 'migu', 'qq', 'qzone', 'renren', 'taobao', 'tmall', 'suning', 'dangdang', 'gome', 'yhd', 'vipshop', 'jumei', 'mogujie', 'amazoncn', 'jdworldwide', 'aliexpress', 'wish', 'ebay', 'rakuten', 'mercari', 'shopee', 'lazada', 'tokopedia', 'bukalapak', 'blibli', 'zalora', 'qoo10', 'coupang', '11st', 'gmarket', 'auction', 'interpark', 'lotte', 'ssg', 'wemakeprice', 'tmon', 'cafe24', 'naver', 'daum', 'kakao', 'line', 'yahoo', 'bing', 'duckduckgo', 'yandex', 'baidu', 'sogou', '360', 'seznam', 'mail', 'outlook', 'gmail', 'yahoo', 'icloud', 'aol', 'zoho', 'protonmail', 'gmx', 'mailru', 'yandex', 'qq', '163', '126', 'sina', 'sohu', 'tom', 'yeah', '21cn', 'aliyun', '263', 'china', 'japan', 'korea', 'india', 'france', 'germany', 'italy', 'spain', 'uk', 'usa', 'canada', 'brazil', 'mexico', 'argentina', 'chile', 'colombia', 'peru', 'venezuela', 'australia', 'new zealand', 'south africa', 'egypt', 'nigeria', 'kenya', 'ghana', 'morocco', 'tunisia', 'algeria', 'turkey', 'russia', 'ukraine', 'poland', 'netherlands', 'belgium', 'sweden', 'norway', 'denmark', 'finland', 'iceland', 'switzerland', 'austria', 'greece', 'portugal', 'ireland', 'czech', 'hungary', 'romania', 'bulgaria', 'croatia', 'serbia', 'slovenia', 'slovakia', 'estonia', 'latvia', 'lithuania', 'luxembourg', 'malta', 'cyprus', 'israel', 'uae', 'saudi', 'qatar', 'kuwait', 'bahrain', 'oman', 'jordan', 'lebanon', 'syria', 'iraq', 'iran', 'pakistan', 'bangladesh', 'sri lanka', 'nepal', 'bhutan', 'maldives', 'afghanistan', 'mongolia', 'kazakhstan', 'uzbekistan', 'turkmenistan', 'kyrgyzstan', 'tajikistan', 'azerbaijan', 'armenia', 'georgia', 'belarus', 'moldova', 'macedonia', 'albania', 'bosnia', 'montenegro', 'kosovo', 'liechtenstein', 'san marino', 'monaco', 'andorra', 'vatican', 'luxembourg', 'gibraltar', 'guernsey', 'jersey', 'isle of man', 'faroe', 'greenland', 'svalbard', 'jan mayen', 'bermuda', 'bahamas', 'barbados', 'jamaica', 'trinidad', 'tobago', 'aruba', 'curacao', 'bonaire', 'sint maarten', 'sint eustatius', 'saba', 'anguilla', 'antigua', 'barbuda', 'saint kitts', 'nevis', 'saint lucia', 'saint vincent', 'grenadines', 'grenada', 'dominica', 'saint pierre', 'miquelon', 'martinique', 'guadeloupe', 'french guiana', 'suriname', 'guyana', 'falkland', 'south georgia', 'south sandwich', 'belize', 'guatemala', 'honduras', 'el salvador', 'nicaragua', 'costa rica', 'panama', 'cuba', 'haiti', 'dominican republic', 'puerto rico', 'virgin islands', 'saint barthelemy', 'saint martin', 'saint vincent', 'grenadines', 'anguilla', 'antigua', 'barbuda', 'saint kitts', 'nevis', 'saint lucia', 'saint vincent', 'grenadines', 'grenada', 'dominica', 'saint pierre', 'miquelon', 'martinique', 'guadeloupe', 'french guiana', 'suriname', 'guyana', 'falkland', 'south georgia', 'south sandwich', 'bermuda', 'bahamas', 'barbados', 'jamaica', 'trinidad', 'tobago', 'aruba', 'curacao', 'bonaire', 'sint maarten', 'sint eustatius', 'saba', 'anguilla', 'antigua', 'barbuda', 'saint kitts', 'nevis', 'saint lucia', 'saint vincent', 'grenadines', 'grenada', 'dominica', 'saint pierre', 'miquelon', 'martinique', 'guadeloupe', 'french guiana', 'suriname', 'guyana', 'falkland', 'south georgia', 'south sandwich'];
  const filtered = {};
  for (const key of allowed) {
    if (item[key] !== undefined) filtered[key] = item[key];
  }
  return filtered;
}

async function getQlooRecommendations(parsedTaste) {
  console.log('[Debug] parsedTaste received:', JSON.stringify(parsedTaste));
  const results = {};
  const categoryMap = {
    books: 'book',
    foods: 'food',
    travels: 'travel',
    musics: 'music'
  };
  // Region/culture mapping for fallback
  const regionDefaults = {
    bengali: {
      music: 'Rabindra Sangeet',
      food: 'Hilsa Fish',
      book: 'Humayun Ahmed novels',
      travel: 'Sundarbans'
    },
    japanese: {
      music: 'J-Pop',
      food: 'Sushi',
      book: 'Haruki Murakami novels',
      travel: 'Kyoto'
    },
    french: {
      music: 'Chanson française',
      food: 'Croissant',
      book: 'Victor Hugo novels',
      travel: 'Paris'
    },
    brazilian: {
      music: 'Samba',
      food: 'Feijoada',
      book: 'Paulo Coelho novels',
      travel: 'Rio de Janeiro'
    },
    chinese: {
      music: 'Mandopop',
      food: 'Peking Duck',
      book: 'Mo Yan novels',
      travel: 'Beijing'
    },
    // ...add more as needed
  };
  // Detect region from specified categories
  function detectRegion(values) {
    const v = values.map(x => (typeof x === 'string' ? x : '')).join(' ').toLowerCase();
    if (/rabindra|hilsa|humayun|sundarbans|bengali|bangladesh/.test(v)) return 'bengali';
    if (/j-pop|sushi|murakami|kyoto|japan|japanese/.test(v)) return 'japanese';
    if (/chanson|croissant|hugo|paris|france|french/.test(v)) return 'french';
    if (/samba|feijoada|coelho|rio|brazil|brazilian/.test(v)) return 'brazilian';
    if (/mandopop|peking|mo yan|beijing|china|chinese/.test(v)) return 'chinese';
    return null;
  }
  // Gather all cleaned values for region detection
  const allCleaned = [];
  for (const [category, tasteValue] of Object.entries(parsedTaste)) {
    allCleaned.push(cleanTasteValue(category, tasteValue));
  }
  const detectedRegion = detectRegion(allCleaned);

  // --- Enhanced Multi-Signal Qloo Mapping ---
  // For each category, try to get entityId, tagId, and audienceId if possible
  for (const [category, tasteValue] of Object.entries(parsedTaste)) {
    const cleanedValue = cleanTasteValue(category, tasteValue);
    let entityId = null, tagId = null, audienceId = null, location = null;
    let qlooParams = {};
    try {
      // 1. Entity ID (main taste)
      entityId = await searchQlooEntityByName(category, cleanedValue);
    } catch (err) {
      console.warn(`[Qloo] No entity for '${category}' value '${cleanedValue}': ${err.message}`);
    }
    try {
      // 2. Tag ID (genre/cuisine/etc.)
      tagId = await searchQlooTagByName(category, cleanedValue);
    } catch (err) {
      console.warn(`[Qloo] No tag for '${category}' value '${cleanedValue}': ${err.message}`);
    }
    // 3. Audience ID (if interests present)
    if (parsedTaste.interests && Array.isArray(parsedTaste.interests)) {
      for (const interest of parsedTaste.interests) {
        try {
          audienceId = await searchQlooAudienceByName(interest);
          break; // Use the first found for now
        } catch (err) {
          console.warn(`[Qloo] No audience for interest '${interest}': ${err.message}`);
        }
      }
    }
    // 4. Location (from travel or region)
    if (parsedTaste.region) location = parsedTaste.region;
    else if (category === 'travel' && cleanedValue) location = cleanedValue;

    // 5. Build Qloo params for this category
    qlooParams = {
      'filter.type': `urn:entity:${categoryMap[category] || category}`,
      ...(entityId && { 'signal.interests.entities': entityId }),
      ...(tagId && { 'signal.tags': tagId }),
      ...(audienceId && { 'signal.demographics.audiences': audienceId }),
      ...(location && { 'signal.location.query': location }),
      take: 5
    };
    // 6. Try Qloo API call with all signals
    try {
      const QLOO_API_KEY = process.env.QLOO_API_KEY;
      const QLOO_API_URL = process.env.QLOO_API_URL || "https://hackathon.api.qloo.com";
      const params = Object.entries(qlooParams)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&');
      const url = `${QLOO_API_URL}/v2/insights?${params}`;
      const options = { method: 'GET', headers: { 'X-Api-Key': QLOO_API_KEY } };
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`Qloo API error: ${response.statusText}`);
      const insights = await response.json();
      if (insights && insights.results && insights.results.length > 0) {
        results[category] = insights.results.map(filterQlooFields);
        continue;
      }
      throw new Error('No Qloo results');
    } catch (err) {
      console.warn(`[Qloo] Using mock data for category '${category}' (reason: ${err.message})`);
      // --- Fallback Logic ---
      const normalizedCategory = categoryMap[category] || category;
      const mockArray = generateMockRecommendations({ [normalizedCategory]: tasteValue })[normalizedCategory];
      let match = null;
      if (cleanedValue && mockArray && cleanedValue.toLowerCase() !== 'not specified') {
        match = mockArray.find(item =>
          item.name.toLowerCase().includes(cleanedValue.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(cleanedValue.toLowerCase())
        ));
      }
      // Region-aware fallback: if not specified, use region default if available
      if ((!match || cleanedValue.toLowerCase() === 'not specified' || !cleanedValue) && detectedRegion && regionDefaults[detectedRegion]) {
        const regionDefault = regionDefaults[detectedRegion][normalizedCategory];
        if (regionDefault && mockArray) {
          match = mockArray.find(item =>
            item.name.trim().toLowerCase() === regionDefault.trim().toLowerCase()
          );
        }
      }
      // If still no match, pick a random mock
      if ((!match || cleanedValue.toLowerCase() === 'not specified' || !cleanedValue) && mockArray && mockArray.length > 0) {
        match = mockArray[Math.floor(Math.random() * mockArray.length)];
      }
      results[category] = match ? [match] : (mockArray || []);
      console.log(`[Mock] Data for category '${category}':`, JSON.stringify(results[category]));
    }
  }
  console.log('[Final] Aggregated results sent to frontend:', JSON.stringify(results));
  return results;
}

exports.handler = async function(event) {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: ""
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: "Method Not Allowed"
    };
  }

  try {
    // Parse the request body
    const body = JSON.parse(event.body);
    const { parsedTaste } = body;

    if (!parsedTaste || Object.keys(parsedTaste).length === 0) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Missing or empty parsed taste data" })
      };
    }

    // Try to get real recommendations from Qloo for each taste category
    try {
      const qlooData = await getQlooRecommendations(parsedTaste);
      return {
        statusCode: 200,
        headers: { 
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(qlooData)
      };
    } catch (apiError) {
      console.error("Qloo API error, using mock data:", apiError);
      // Fallback to mock data if Qloo API fails
      const mockData = generateMockRecommendations(parsedTaste);
      return {
        statusCode: 200,
        headers: { 
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(mockData)
      };
    }
  } catch (error) {
    console.error("Function error:", error);
    // If there's an error, use mock data
    try {
      const body = JSON.parse(event.body);
      const { parsedTaste } = body;
      if (parsedTaste) {
        return {
          statusCode: 200,
          headers: { 
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(generateMockRecommendations(parsedTaste))
        };
      }
    } catch (fallbackError) {
      console.error("Fallback error:", fallbackError);
    }
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Internal server error" })
    };
  }
};

exports.generateMockRecommendations = generateMockRecommendations;