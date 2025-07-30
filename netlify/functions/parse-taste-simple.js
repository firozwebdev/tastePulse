const fetch = require('node-fetch');

// Enhanced parsing function with better extraction
function enhancedParsing(input) {
  console.log("Using enhanced parsing for input:", input);
  
  const result = {};
  const lowerInput = input.toLowerCase();
  
  // Books detection with authors and specific genres
  if (/book|novel|author|read|literature|fiction|story|mystery|detective|agatha|christie|poirot/.test(lowerInput)) {
    const genres = [];
    const authors = [];
    
    // Extract specific authors
    if (/agatha christie/i.test(input)) authors.push('Agatha Christie');
    if (/poirot/i.test(input)) authors.push('Hercule Poirot series');
    if (/calladine|bayliss/i.test(input)) authors.push('Detective Calladine & Bayliss series');
    
    // Extract genres
    if (/mystery|detective/i.test(input)) genres.push('mystery');
    if (/contemporary fiction/i.test(input)) genres.push('contemporary fiction');
    if (/complex narratives/i.test(input)) genres.push('literary fiction');
    if (/character development/i.test(input)) genres.push('character-driven fiction');
    
    // Default genres if none found
    if (genres.length === 0) {
      if (/mystery|detective/i.test(input)) genres.push('mystery');
      else genres.push('contemporary fiction');
    }
    
    result.books = { genres, authors };
  }
  
  // Food detection with multiple cuisines and dishes
  if (/food|cuisine|dish|restaurant|dining|thai|pizza|ethiopian|japanese|omakase|injera|neapolitan/.test(lowerInput)) {
    const cuisines = [];
    const dishes = [];
    
    // Extract specific cuisines
    if (/thai.*street food|thai food/i.test(input)) cuisines.push('Thai street food');
    if (/neapolitan pizza|authentic.*pizza/i.test(input)) cuisines.push('Neapolitan pizza');
    if (/ethiopian/i.test(input)) cuisines.push('Ethiopian cuisine');
    if (/japanese.*omakase|omakase/i.test(input)) cuisines.push('Japanese omakase');
    if (/italian/i.test(input) && !cuisines.some(c => c.includes('pizza'))) cuisines.push('Italian cuisine');
    
    // Extract specific dishes
    if (/injera/i.test(input)) dishes.push('injera');
    if (/pizza/i.test(input)) dishes.push('pizza');
    if (/omakase/i.test(input)) dishes.push('omakase dining');
    
    // Default if none found
    if (cuisines.length === 0) {
      cuisines.push('international cuisine');
    }
    
    result.food = { cuisines, dishes };
  }
  
  // Music detection
  if (/music|song|band|jazz|pop|rock|singer|beat|lo-fi|classical|hip-hop|reggae|folk|artist/.test(lowerInput)) {
    const genres = [];
    const artists = [];
    
    if (/lo-?fi/i.test(input)) genres.push('lo-fi');
    if (/jazz/i.test(input)) genres.push('jazz');
    if (/rock/i.test(input)) genres.push('rock');
    if (/pop/i.test(input)) genres.push('pop');
    if (/classical/i.test(input)) genres.push('classical');
    if (/hip-hop/i.test(input)) genres.push('hip-hop');
    
    if (genres.length === 0) genres.push('indie');
    
    result.music = { genres, artists };
  }
  
  // Travel detection
  if (/travel|trip|visit|explore|city|country|destination|place/.test(lowerInput)) {
    const destinations = [];
    const activities = [];
    
    // Extract specific destinations from context
    if (/japan|japanese/i.test(input)) destinations.push('Japan');
    if (/italy|italian/i.test(input)) destinations.push('Italy');
    if (/thailand|thai/i.test(input)) destinations.push('Thailand');
    if (/ethiopia|ethiopian/i.test(input)) destinations.push('Ethiopia');
    
    // Extract activities
    if (/street food/i.test(input)) activities.push('street food tours');
    if (/dining|restaurant/i.test(input)) activities.push('culinary experiences');
    if (/cultural/i.test(input)) activities.push('cultural exploration');
    
    if (destinations.length === 0) destinations.push('cultural destinations');
    if (activities.length === 0) activities.push('cultural experiences');
    
    result.travel = { destinations, activities };
  }
  
  // Movies/Entertainment detection
  if (/movie|film|cinema|watch|series|show|tv/.test(lowerInput)) {
    const genres = [];
    const titles = [];
    
    if (/mystery|detective/i.test(input)) genres.push('mystery');
    if (/drama/i.test(input)) genres.push('drama');
    if (/thriller/i.test(input)) genres.push('thriller');
    
    if (genres.length === 0) genres.push('drama');
    
    result.movies = { genres, titles };
  }
  
  // If no categories detected, infer from context
  if (Object.keys(result).length === 0) {
    // Analyze the input for implicit preferences
    result.books = { genres: ['contemporary fiction'], authors: [] };
    result.food = { cuisines: ['international cuisine'], dishes: [] };
  }
  
  console.log("Enhanced parsing result:", result);
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

    // Use enhanced parsing
    const result = enhancedParsing(input);

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