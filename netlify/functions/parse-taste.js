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
      
      const prompt = `
        You are a world-class cultural and lifestyle expert. Given a user's input, infer and fill in their likely preferences for music, food, book, and travel, even if not explicitly mentioned. Use cultural, regional, and contextual clues, and be creative, rational, and professional. Always return a JSON object with these four keys. If you must guess, do so intelligently and with cultural sensitivity. Make the results user-friendly, relevant, and impressive.

        Example input: "I am Bangladeshi."
        Example output: {"music": "Rabindra Sangeet", "food": "Hilsa fish", "book": "Humayun Ahmed novels", "travel": "Sundarbans"}

        Example input: "I am from Japan."
        Example output: {"music": "J-Pop", "food": "Sushi", "book": "Haruki Murakami novels", "travel": "Kyoto"}

        Example input: "I am from China."
        Example output: {"music": "Mandopop", "food": "Peking duck", "book": "Mo Yan novels", "travel": "Beijing"}

        Example input: "I am from Korea."
        Example output: {"music": "K-Pop", "food": "Kimchi", "book": "Han Kang novels", "travel": "Seoul"}

        Example input: "I am from India."
        Example output: {"music": "Bollywood", "food": "Biryani", "book": "Chetan Bhagat novels", "travel": "Mumbai"}

        Example input: "I am from France."
        Example output: {"music": "Chanson française", "food": "Croissant", "book": "Victor Hugo novels", "travel": "Paris"}

        Example input: "I am from Italy."
        Example output: {"music": "Opera", "food": "Pasta Carbonara", "book": "Italo Calvino novels", "travel": "Rome"}

        Example input: "I am from Spain."
        Example output: {"music": "Flamenco", "food": "Paella", "book": "Carlos Ruiz Zafón novels", "travel": "Barcelona"}

        Example input: "I am from Germany."
        Example output: {"music": "Classical", "food": "Bratwurst", "book": "Goethe novels", "travel": "Berlin"}

        Example input: "I am from Russia."
        Example output: {"music": "Folk", "food": "Borscht", "book": "Tolstoy novels", "travel": "Moscow"}

        Example input: "I am from the UK."
        Example output: {"music": "Rock", "food": "Fish and chips", "book": "Jane Austen novels", "travel": "London"}

        Example input: "I am from the USA."
        Example output: {"music": "Jazz", "food": "Burger", "book": "Mark Twain novels", "travel": "New York City"}

        Example input: "I am from Brazil."
        Example output: {"music": "Samba", "food": "Feijoada", "book": "Paulo Coelho novels", "travel": "Rio de Janeiro"}

        Example input: "I am from Mexico."
        Example output: {"music": "Mariachi", "food": "Tacos", "book": "Laura Esquivel novels", "travel": "Mexico City"}

        Example input: "I am from Egypt."
        Example output: {"music": "Arabic pop", "food": "Koshari", "book": "Naguib Mahfouz novels", "travel": "Cairo"}

        Example input: "I am from Nigeria."
        Example output: {"music": "Afrobeat", "food": "Jollof Rice", "book": "Chinua Achebe novels", "travel": "Lagos"}

        Example input: "I am from South Africa."
        Example output: {"music": "Highlife", "food": "Bunny Chow", "book": "Nadine Gordimer novels", "travel": "Cape Town"}

        Example input: "I am from Australia."
        Example output: {"music": "Didgeridoo", "food": "Pavlova", "book": "Liane Moriarty novels", "travel": "Sydney"}

        Example input: "I love K-pop and Korean food."
        Example output: {"music": "K-Pop", "food": "Kimchi", "book": "Han Kang novels", "travel": "Seoul"}

        Example input: "I'm a vegan who enjoys indie folk, Buddha bowls, and hiking in the Pacific Northwest."
        Example output: {"music": "Indie folk", "food": "Vegan Buddha bowl", "book": "Jonathan Safran Foer books", "travel": "Portland"}

        Example input: "I'm a tech enthusiast who likes electronic music, sushi burritos, and reading Asimov."
        Example output: {"music": "Electronic", "food": "Sushi burrito", "book": "Isaac Asimov novels", "travel": "Silicon Valley"}

        Example input: "I love Bollywood movies, biryani, and exploring Mumbai's street food."
        Example output: {"music": "Bollywood", "food": "Biryani", "book": "Chetan Bhagat novels", "travel": "Mumbai"}

        Example input: "I enjoy fantasy books and medieval festivals."
        Example output: {"music": "Epic movie soundtracks", "food": "Medieval feast", "book": "J.R.R. Tolkien novels", "travel": "New Zealand"}

        Example input: "I love salsa dancing, tacos, and magical realism books."
        Example output: {"music": "Salsa", "food": "Tacos", "book": "Gabriel García Márquez novels", "travel": "Havana"}

        Example input: "I'm a history buff who loves classical music, Greek food, and ancient ruins."
        Example output: {"music": "Classical", "food": "Moussaka", "book": "Mary Renault novels", "travel": "Athens"}

        Input: "${input}"
        Output:
      `;

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