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

  // Split input by commas and 'and'
  const phrases = inputLower.split(/,| and /).map(s => s.trim());

  // Keyword lists for each category
  const musicKeywords = ['music', 'song', 'band', 'jazz', 'rock', 'pop', 'k-pop', 'indie', 'classical', 'salsa', 'hip-hop', 'folk', 'blues', 'edm'];
  const foodKeywords = ['food', 'dish', 'cuisine', 'sushi', 'pizza', 'burger', 'taco', 'biryani', 'kimchi', 'curry', 'pasta', 'ramen', 'paella', 'croissant', 'pastries', 'hot pot', 'burrito'];
  const bookKeywords = ['book', 'novel', 'author', 'murakami', 'austen', 'twain', 'tolkien', 'asimov', 'marquez', 'coelho', 'hugo', 'zafón', 'lahiri', 'gordimer'];
  const travelKeywords = ['travel', 'trip', 'visit', 'tokyo', 'paris', 'new york', 'kyoto', 'rio', 'london', 'barcelona', 'sundarbans', 'beijing', 'havana', 'athens', 'mumbai', 'mexico city', 'cape town', 'sydney', 'portland', 'silicon valley', 'provence', 'grand canyon', 'hawaii', 'jeju', 'busan', 'seoul', 'osaka'];

  for (const phrase of phrases) {
    if (musicKeywords.some(k => phrase.includes(k))) result.music.push(phrase);
    else if (foodKeywords.some(k => phrase.includes(k))) result.food.push(phrase);
    else if (bookKeywords.some(k => phrase.includes(k))) result.book.push(phrase);
    else if (travelKeywords.some(k => phrase.includes(k))) result.travel.push(phrase);
    // Optionally: fallback to first empty category
    else if (!result.music.length) result.music.push(phrase);
    else if (!result.food.length) result.food.push(phrase);
    else if (!result.book.length) result.book.push(phrase);
    else if (!result.travel.length) result.travel.push(phrase);
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
        You are a world-class cultural and lifestyle expert. Given a user's input, infer and fill in their likely preferences for music, food, book, and travel, even if not explicitly mentioned. Assign each detected item to the correct category. Do not repeat the same value for multiple categories unless it makes sense. If a category is not mentioned, use 'Not specified'. Always return a JSON object with these four keys.

        Example input: "I love jazz, sushi, and Murakami novels, and I'm planning a trip to Tokyo."
        Example output: {"music": "jazz", "food": "sushi", "book": "Murakami novels", "travel": "Tokyo"}

        Example input: "My favorites are K-pop, ramen, and Haruki Murakami, and I want to visit Kyoto."
        Example output: {"music": "K-pop", "food": "ramen", "book": "Haruki Murakami", "travel": "Kyoto"}

        Example input: "Recommend me food and music for a trip to Paris. I like jazz and pastries."
        Example output: {"music": "jazz", "food": "pastries", "book": "Not specified", "travel": "Paris"}

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
        // --- Post-process Gemini output to ensure uniqueness ---
        const used = new Set();
        for (const category of ["music", "food", "book", "travel"]) {
          if (geminiData[category] && used.has(geminiData[category])) {
            geminiData[category] = "Not specified";
          }
          used.add(geminiData[category]);
        }
        // Merge Gemini results with local parsing
        for (const category of ["music", "food", "book", "travel"]) {
          if (geminiData[category] && geminiData[category] !== "Not specified") {
            locallyParsed[category] = [geminiData[category]];
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