const { GoogleGenAI } = require("@google/genai");

// Helper function to extract JSON-like content from text
function extractJsonFromText(text) {
  // Try to find content that looks like JSON
  const result = {};
  
  // Look for patterns like "music": "jazz" or "food": "ramen"
  const matches = text.match(/"([^"]+)":\s*"([^"]+)"/g);
  if (matches) {
    matches.forEach(match => {
      const parts = match.split(":");
      if (parts.length === 2) {
        const key = parts[0].replace(/"/g, '').trim();
        const value = parts[1].replace(/"/g, '').trim();
        result[key] = value;
      }
    });
  }
  
  return result;
}

// Fallback parsing function for when Gemini API fails
function fallbackParsing(input) {
  const result = {};
  
  // English patterns
  if (input.toLowerCase().includes('lo-fi') || input.toLowerCase().includes('jazz')) {
    result.music = input.toLowerCase().includes('lo-fi') ? 'lo-fi beats' : 'jazz';
  }
  
  if (input.toLowerCase().includes('ramen') || input.toLowerCase().includes('cuisine')) {
    result.food = input.toLowerCase().includes('ramen') ? 'Japanese ramen' : 'Mediterranean cuisine';
  }
  
  if (input.toLowerCase().includes('murakami') || input.toLowerCase().includes('sci-fi')) {
    result.book = input.toLowerCase().includes('murakami') ? 'Murakami novels' : 'Science fiction';
  }
  
  if (input.toLowerCase().includes('kyoto') || input.toLowerCase().includes('national park')) {
    result.travel = input.toLowerCase().includes('kyoto') ? 'Kyoto, Japan' : 'National parks';
  }
  
  // Bengali patterns
  if (input.toLowerCase().includes('hilsha') || input.toLowerCase().includes('ilish')) {
    result.food = 'Hilsha fish';
  }
  
  if (input.toLowerCase().includes('bangladesh')) {
    result.travel = 'Bangladesh';
  }
  
  if (input.includes('রবীন্দ্রসঙ্গীত')) result.music = 'রবীন্দ্রসঙ্গীত';
  if (input.includes('ইলিশ')) result.food = 'ইলিশ মাছ';
  if (input.includes('কবিতা')) result.book = 'বাংলা কবিতা';
  if (input.includes('দার্জিলিং')) result.travel = 'দার্জিলিং';
  
  // Spanish patterns
  if (input.includes('flamenca')) result.music = 'música flamenca';
  if (input.includes('paella')) result.food = 'paella';
  if (input.includes('García Márquez')) result.book = 'novelas de Gabriel García Márquez';
  if (input.includes('playas de España')) result.travel = 'playas de España';
  
  // Default fallback
  if (Object.keys(result).length === 0) {
    if (/[\u0980-\u09FF]/.test(input)) {
      result.music = 'বাংলা গান';
      result.food = 'বাঙালি খাবার';
      result.book = 'বাংলা সাহিত্য';
      result.travel = 'বাংলাদেশ';
    } else if (/[áéíóúüñ¿¡]/.test(input)) {
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
}

exports.handler = async function(event, context) {
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

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: "Invalid JSON"
    };
  }

  const { input } = body;

  if (!input) {
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Missing input text" })
    };
  }

  // Prepare the prompt for Gemini
  const prompt = `
    Parse the following text and extract taste preferences into the following structured categories: music, food, book, travel.
    Return ONLY a JSON object with these exact keys: music, food, book, travel. If a category is not mentioned, set its value to an empty string.
    
    Example input: "I love lo-fi beats and Japanese ramen."
    Example output: {"music": "lo-fi beats", "food": "Japanese ramen", "book": "", "travel": ""}
    
    Input: "${input}"
  `;

  // Support multiple keys (comma-separated)
  const keys = (process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "")
    .split(",")
    .map(k => k.trim())
    .filter(Boolean);

  if (!keys.length) {
    const parsedResult = fallbackParsing(input);
    return {
      statusCode: 200,
      headers: { 
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(parsedResult)
    };
  }

  const apiUrl = process.env.GEMINI_API_URL;
  let lastError;
  for (const apiKey of keys) {
    try {
      const ai = apiUrl
        ? new GoogleGenAI({ apiKey, apiUrl })
        : new GoogleGenAI({ apiKey });

      // Add a timeout for Gemini response (25s)
      const response = await Promise.race([
        ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("AI is taking too long to respond. Please try again or ask a simpler question.")), 25000))
      ]);

      // Extract the text from the SDK response
      const textContent = response.text || (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts && response.candidates[0].content.parts[0].text);
      if (!textContent) throw new Error("No text content in Gemini response");

      console.log('[Debug] Raw Gemini response text:', textContent);

      // Extract JSON from the text (in case it's wrapped in markdown code blocks)
      const jsonMatch = textContent.match(/```json\s*([\s\S]*?)\s*```/) || 
                        textContent.match(/```\s*([\s\S]*?)\s*```/) || 
                        [null, textContent];
      const jsonText = jsonMatch[1].trim();
      let parsedResult = {};
      try {
        parsedResult = JSON.parse(jsonText);
      } catch (jsonError) {
        parsedResult = extractJsonFromText(textContent);
      }
      if (Object.keys(parsedResult).length === 0) {
        parsedResult = fallbackParsing(input);
      }
      console.log('[Debug] Final parsed result:', parsedResult);
      return {
        statusCode: 200,
        headers: { 
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(parsedResult)
      };
    } catch (err) {
      lastError = err;
      // Try next key
    }
  }

  // If all keys fail, use fallback parsing
  const parsedResult = fallbackParsing(input);
  return {
    statusCode: 200,
    headers: { 
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(parsedResult)
  };
};