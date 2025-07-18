const { GoogleGenAI } = require("@google/genai");

// Enhanced cultural mapping database
const CULTURAL_PROFILES = {
  // Asian
  japan: {
    music: ["J-Pop", "City Pop", "Enka"],
    food: ["Sushi", "Ramen", "Wagyu beef"],
    book: ["Haruki Murakami", "Yukio Mishima", "Banana Yoshimoto"],
    travel: ["Tokyo", "Kyoto", "Osaka"]
  },
  korea: {
    music: ["K-Pop", "Trot", "Indie Korean"],
    food: ["Kimchi", "Bibimbap", "Korean BBQ"],
    book: ["Han Kang", "Shin Kyung-sook"],
    travel: ["Seoul", "Busan", "Jeju Island"]
  },
  
  // South Asian
  bangladesh: {
    music: ["Rabindra Sangeet", "Nazrul Geeti", "Modern Bangla"],
    food: ["Hilsa fish", "Panta bhat", "Beef tehari"],
    book: ["Humayun Ahmed", "Tahmima Anam", "Jhumpa Lahiri"],
    travel: ["Sundarbans", "Cox's Bazar", "Sylhet"]
  },
  india: {
    music: ["Bollywood", "Carnatic", "Indie Hindi"],
    food: ["Biryani", "Butter Chicken", "Dosa"],
    book: ["Arundhati Roy", "Chetan Bhagat", "Jhumpa Lahiri"],
    travel: ["Goa", "Kerala", "Rajasthan"]
  },

  // Western
  france: {
    music: ["Chanson", "French Pop", "Electronic"],
    food: ["Croissant", "Bouillabaisse", "Coq au vin"],
    book: ["Victor Hugo", "Albert Camus", "Simone de Beauvoir"],
    travel: ["Paris", "Provence", "French Alps"]
  },
  usa: {
    music: ["Rock", "Hip-Hop", "Country"],
    food: ["Burgers", "BBQ", "Tex-Mex"],
    book: ["Mark Twain", "Toni Morrison", "Ernest Hemingway"],
    travel: ["New York", "Grand Canyon", "Hawaii"]
  }
};

// Enhanced keyword triggers
const CULTURAL_TRIGGERS = {
  music: {
    jazz: ["blue note", "saxophone", "miles davis"],
    classical: ["symphony", "mozart", "piano concerto"],
    electronic: ["edm", "techno", "house music"]
  },
  food: {
    vegan: ["plant-based", "tofu", "tempeh"],
    mediterranean: ["hummus", "falafel", "olive oil"],
    streetfood: ["taco", "kebab", "bao bun"]
  }
};

// Smart parser with contextual understanding
function smartParse(input) {
  const result = { music: [], food: [], book: [], travel: [] };
  const inputLower = input.toLowerCase();
  
  // 1. Detect explicit mentions
  for (const category of Object.keys(result)) {
    const matches = inputLower.match(new RegExp(`(love|like|enjoy|prefer)\\s+(${category}\\s+)?([a-z0-9\\s]+)`, 'i'));
    if (matches && matches[3]) {
      result[category].push(matches[3].trim());
    }
  }

  // 2. Cultural/regional detection
  for (const [region, data] of Object.entries(CULTURAL_PROFILES)) {
    if (inputLower.includes(region)) {
      for (const [category, items] of Object.entries(data)) {
        result[category] = [...new Set([...result[category], ...items])];
      }
    }
  }

  // 3. Keyword triggers
  for (const [category, triggers] of Object.entries(CULTURAL_TRIGGERS)) {
    for (const [key, terms] of Object.entries(triggers)) {
      if (terms.some(term => inputLower.includes(term))) {
        result[category].push(key);
      }
    }
  }

  // 4. Language detection
  if (/[\u0980-\u09FF]/.test(input)) { // Bengali
    if (!result.music.length) result.music.push("Rabindra Sangeet");
    if (!result.food.length) result.food.push("Hilsa fish");
  } else if (/[áéíóúüñ¿¡]/.test(input)) { // Spanish
    if (!result.music.length) result.music.push("Flamenco");
    if (!result.food.length) result.food.push("Paella");
  }

  // 5. Fallback to sophisticated guessing
  if (!result.music.length) {
    if (inputLower.includes("tech") || inputLower.includes("programming")) {
      result.music.push("Electronic");
    } else if (inputLower.includes("art") || inputLower.includes("design")) {
      result.music.push("Indie");
    }
  }

  // Remove duplicates and empty categories
  for (const category of Object.keys(result)) {
    result[category] = [...new Set(result[category])];
    if (!result[category].length) {
      result[category] = ["Not specified"];
    }
  }

  return result;
}

// Optimized for Qloo API format
function formatForQloo(parsedData) {
  return {
    music: {
      genres: parsedData.music,
      artists: []
    },
    food: {
      cuisines: parsedData.food,
      dishes: []
    },
    books: {
      genres: [],
      authors: parsedData.book.filter(item => !item.toLowerCase().includes("novel"))
    },
    travel: {
      destinations: parsedData.travel,
      activities: []
    }
  };
}

exports.handler = async function(event, context) {
  // [Previous CORS and method handling code remains the same...]

  const { input } = JSON.parse(event.body);

  try {
    // First try smart local parsing
    const locallyParsed = smartParse(input);
    const qlooReadyData = formatForQloo(locallyParsed);

    // Only call Gemini if local parsing is too vague
    if (locallyParsed.music[0] === "Not specified" || 
        locallyParsed.food[0] === "Not specified") {
      
      const prompt = `Analyze this cultural preference: "${input}". 
        Return ONLY JSON with music, food, book, travel arrays. 
        Example: {"music":["jazz"], "food":["Italian"], "book":["Sci-Fi"], "travel":["Japan"]}`;

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-1.5-pro",
        contents: prompt,
        response_mime_type: "application/json"
      });

      if (response.data) {
        const geminiData = JSON.parse(response.data);
        // Merge Gemini results with local parsing
        for (const category of ["music", "food", "book", "travel"]) {
          if (geminiData[category]) {
            qlooReadyData[category] = [
              ...new Set([...qlooReadyData[category], ...geminiData[category]])
            ];
          }
        }
      }
    }

    return {
      statusCode: 200,
      headers: { 
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(qlooReadyData)
    };

  } catch (error) {
    // Fallback to local parsing only
    const locallyParsed = smartParse(input);
    return {
      statusCode: 200,
      headers: { 
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formatForQloo(locallyParsed))
    };
  }
};