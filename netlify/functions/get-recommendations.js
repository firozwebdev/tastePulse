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
          {
            name: "Rabindra Sangeet",
            description: "Classic Bengali songs by Rabindranath Tagore",
            category: "Genre",
            match: 99,
            funFact: "Rabindra Sangeet is an integral part of Bengali culture.",
            image: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Rabindra_Sangeet.jpg"
          },
          {
            name: "J-Pop",
            description: "Popular music from Japan",
            category: "Genre",
            match: 95,
            funFact: "J-Pop is known for its catchy melodies and vibrant performances.",
            image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&auto=format&fit=crop"
          },
          {
            name: "Fado",
            description: "Traditional Portuguese music characterized by its melancholic tunes",
            category: "Genre",
            match: 92,
            funFact: "Fado is often called the soul of Portuguese music.",
            image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=300&auto=format&fit=crop"
          },
          {
            name: "Afrobeat",
            description: "A fusion of West African musical styles with jazz and funk",
            category: "Genre",
            match: 90,
            funFact: "Afrobeat was pioneered by Nigerian legend Fela Kuti.",
            image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=300&auto=format&fit=crop"
          },
          {
            name: "Samba",
            description: "Lively Brazilian music and dance style",
            category: "Genre",
            match: 88,
            funFact: "Samba is a symbol of Brazilian national identity.",
            image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&auto=format&fit=crop"
          }
        ];
        break;
      case "food":
        mockRecommendations.food = [
          {
            name: "Hilsa Fish",
            description: "A beloved delicacy in Bengali cuisine",
            category: "Dish",
            match: 99,
            funFact: "Hilsa is the national fish of Bangladesh.",
            image: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Hilsa_fish.jpg"
          },
          {
            name: "Sushi",
            description: "Iconic Japanese dish of vinegared rice and seafood",
            category: "Dish",
            match: 95,
            funFact: "Sushi is enjoyed worldwide and comes in many varieties.",
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&auto=format&fit=crop"
          },
          {
            name: "Feijoada",
            description: "Hearty Brazilian stew of beans and pork",
            category: "Dish",
            match: 92,
            funFact: "Feijoada is often considered the national dish of Brazil.",
            image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&auto=format&fit=crop"
          },
          {
            name: "Paella",
            description: "Spanish rice dish with seafood and saffron",
            category: "Dish",
            match: 90,
            funFact: "Paella originated in Valencia, Spain.",
            image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&auto=format&fit=crop"
          },
          {
            name: "Pasta Carbonara",
            description: "Classic Italian pasta with eggs, cheese, and pancetta",
            category: "Dish",
            match: 88,
            funFact: "Carbonara is a staple of Roman cuisine.",
            image: "https://images.unsplash.com/photo-1523987355523-c7b5b0723c6b?w=400&h=300&auto=format&fit=crop"
          }
        ];
        break;
      case "book":
        mockRecommendations.book = [
          {
            name: "Humayun Ahmed novels",
            description: "Works by the celebrated Bangladeshi author",
            category: "Author",
            match: 99,
            funFact: "Humayun Ahmed is one of the most popular writers in Bengali literature.",
            image: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Humayun_Ahmed.jpg"
          },
          {
            name: "Haruki Murakami novels",
            description: "Surreal and magical realist works from Japan",
            category: "Author",
            match: 95,
            funFact: "Murakami's books are translated into over 50 languages.",
            image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&auto=format&fit=crop"
          },
          {
            name: "Gabriel García Márquez novels",
            description: "Magical realism from Colombia",
            category: "Author",
            match: 92,
            funFact: "García Márquez won the Nobel Prize in Literature in 1982.",
            image: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=400&h=300&auto=format&fit=crop"
          },
          {
            name: "Chinua Achebe novels",
            description: "Influential Nigerian literature",
            category: "Author",
            match: 90,
            funFact: "Achebe's 'Things Fall Apart' is a classic of African literature.",
            image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=300&auto=format&fit=crop"
          },
          {
            name: "Jane Austen novels",
            description: "Timeless English classics",
            category: "Author",
            match: 88,
            funFact: "Jane Austen's works are beloved for their wit and social commentary.",
            image: "https://images.unsplash.com/photo-1517231925375-bf2cb42917a5?w=400&h=300&auto=format&fit=crop"
          }
        ];
        break;
      case "travel":
        mockRecommendations.travel = [
          {
            name: "Sundarbans",
            description: "The world's largest mangrove forest, shared by Bangladesh and India",
            category: "Nature",
            match: 99,
            funFact: "The Sundarbans is home to the famous Royal Bengal Tiger.",
            image: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Sundarbans.jpg"
          },
          {
            name: "Kyoto",
            description: "Historic city in Japan known for its temples and cherry blossoms",
            category: "City",
            match: 95,
            funFact: "Kyoto was the capital of Japan for over a thousand years.",
            image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&h=300&auto=format&fit=crop"
          },
          {
            name: "Rio de Janeiro",
            description: "Vibrant Brazilian city famous for Carnival and beaches",
            category: "City",
            match: 92,
            funFact: "Rio's Christ the Redeemer statue is one of the New Seven Wonders of the World.",
            image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&auto=format&fit=crop"
          },
          {
            name: "Barcelona",
            description: "Spanish city known for art, architecture, and cuisine",
            category: "City",
            match: 90,
            funFact: "Barcelona is home to the famous Sagrada Família basilica.",
            image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&auto=format&fit=crop"
          },
          {
            name: "Cairo",
            description: "Egypt's capital, gateway to the pyramids",
            category: "City",
            match: 88,
            funFact: "Cairo is the largest city in the Arab world.",
            image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=300&auto=format&fit=crop"
          }
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

async function getQlooRecommendations(parsedTaste) {
  console.log('[Debug] parsedTaste received:', JSON.stringify(parsedTaste));
  const results = {};
  const categoryMap = {
    books: 'book',
    foods: 'food',
    travels: 'travel',
    musics: 'music'
  };
  for (const [category, tasteValue] of Object.entries(parsedTaste)) {
    const cleanedValue = cleanTasteValue(category, tasteValue);
    console.log(`[Debug] Processing category: '${category}', value: '${tasteValue}', cleaned: '${cleanedValue}'`);
    try {
      const entityId = await searchQlooEntityByName(category, cleanedValue);
      console.log(`[Qloo] Found entity for category '${category}':`, entityId);
      const insights = await getQlooInsightsForEntity(entityId);
      console.log(`[Qloo] Insights for category '${category}':`, JSON.stringify(insights));
      results[category] = insights;
    } catch (err) {
      console.warn(`[Qloo] Using mock data for category '${category}' (reason: ${err.message})`);
      const normalizedCategory = categoryMap[category] || category;
      const mockArray = generateMockRecommendations({ [normalizedCategory]: tasteValue })[normalizedCategory];
      let match = null;
      if (cleanedValue && mockArray && cleanedValue.toLowerCase() !== 'not specified') {
        match = mockArray.find(item =>
          item.name.toLowerCase().includes(cleanedValue.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(cleanedValue.toLowerCase()))
        );
      }
      // If Gemini output is 'Not specified' or empty, pick a random mock
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