const fetch = require('node-fetch');

// Simple, reliable parsing function
function simpleParsing(input) {
  console.log("Using simple parsing for input:", input);
  
  const result = {};
  const lowerInput = input.toLowerCase();
  
  // Music detection
  if (/music|song|band|jazz|pop|rock|singer|beat|lo-fi|classical|hip-hop|reggae|folk/.test(lowerInput)) {
    if (/lo-?fi/.test(lowerInput)) {
      result.music = { genres: ['lo-fi beats'], artists: [] };
    } else if (/jazz/.test(lowerInput)) {
      result.music = { genres: ['jazz'], artists: [] };
    } else if (/rock/.test(lowerInput)) {
      result.music = { genres: ['rock'], artists: [] };
    } else if (/pop/.test(lowerInput)) {
      result.music = { genres: ['pop'], artists: [] };
    } else {
      result.music = { genres: ['indie pop'], artists: [] };
    }
  }
  
  // Food detection
  if (/food|dish|cuisine|sushi|pizza|ramen|pasta|burger|restaurant/.test(lowerInput)) {
    if (/ramen/.test(lowerInput)) {
      result.food = { cuisines: ['japanese ramen'], dishes: [] };
    } else if (/pizza/.test(lowerInput)) {
      result.food = { cuisines: ['italian pizza'], dishes: [] };
    } else if (/italian/.test(lowerInput)) {
      result.food = { cuisines: ['italian cuisine'], dishes: [] };
    } else if (/japanese/.test(lowerInput)) {
      result.food = { cuisines: ['japanese cuisine'], dishes: [] };
    } else if (/mexican/.test(lowerInput)) {
      result.food = { cuisines: ['mexican cuisine'], dishes: [] };
    } else {
      result.food = { cuisines: ['fusion cuisine'], dishes: [] };
    }
  }
  
  // Books detection
  if (/book|novel|author|read|literature|fiction|story/.test(lowerInput)) {
    if (/sci-?fi|science fiction/.test(lowerInput)) {
      result.books = { genres: ['science fiction books'], authors: [] };
    } else if (/fantasy/.test(lowerInput)) {
      result.books = { genres: ['fantasy books'], authors: [] };
    } else if (/mystery/.test(lowerInput)) {
      result.books = { genres: ['mystery books'], authors: [] };
    } else if (/romance/.test(lowerInput)) {
      result.books = { genres: ['romance books'], authors: [] };
    } else {
      result.books = { genres: ['contemporary fiction books'], authors: [] };
    }
  }
  
  // Travel detection
  if (/travel|trip|visit|explore|city|country|kyoto|tokyo|paris|london|beach|mountain/.test(lowerInput)) {
    if (/kyoto/.test(lowerInput)) {
      result.travel = { destinations: ['kyoto japan'], activities: [] };
    } else if (/tokyo/.test(lowerInput)) {
      result.travel = { destinations: ['tokyo japan'], activities: [] };
    } else if (/japan/.test(lowerInput)) {
      result.travel = { destinations: ['japan'], activities: [] };
    } else if (/paris/.test(lowerInput)) {
      result.travel = { destinations: ['paris france'], activities: [] };
    } else if (/beach/.test(lowerInput)) {
      result.travel = { destinations: ['beach destinations'], activities: [] };
    } else if (/mountain/.test(lowerInput)) {
      result.travel = { destinations: ['mountain destinations'], activities: [] };
    } else {
      result.travel = { destinations: ['urban exploration'], activities: [] };
    }
  }
  
  // If no categories detected, add defaults
  if (Object.keys(result).length === 0) {
    result.music = { genres: ['indie pop'], artists: [] };
    result.food = { cuisines: ['fusion cuisine'], dishes: [] };
    result.books = { genres: ['contemporary fiction'], authors: [] };
    result.travel = { destinations: ['urban exploration'], activities: [] };
  }
  
  console.log("Simple parsing result:", result);
  return result;
}

exports.handler = async function(event) {
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
    const { input } = JSON.parse(event.body);

    if (!input) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing input text" })
      };
    }

    console.log("Processing input:", input);

    // Use simple, reliable parsing
    const result = simpleParsing(input);

    console.log("Returning result:", result);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error("Parse function error:", error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        message: "Failed to parse taste preferences"
      })
    };
  }
};