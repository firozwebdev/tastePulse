const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
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
    const { query, category } = JSON.parse(event.body);
    
    const QLOO_API_KEY = process.env.QLOO_API_KEY;
    const QLOO_API_URL = process.env.QLOO_API_URL || "https://hackathon.api.qloo.com";
    
    console.log('Testing Qloo API with:', { query, category, QLOO_API_URL, hasKey: !!QLOO_API_KEY });
    
    // Try different endpoint variations
    const endpoints = [
      `/entities?query=${encodeURIComponent(query)}&type=${category}`,
      `/entities?query=${encodeURIComponent(query)}`,
      `/search?query=${encodeURIComponent(query)}&type=${category}`,
      `/search?query=${encodeURIComponent(query)}`,
      `/v1/entities?query=${encodeURIComponent(query)}&type=${category}`,
      `/v2/entities?query=${encodeURIComponent(query)}&type=${category}`
    ];
    
    const results = [];
    
    for (const endpoint of endpoints) {
      try {
        const url = `${QLOO_API_URL}${endpoint}`;
        console.log('Trying endpoint:', url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'X-Api-Key': QLOO_API_KEY,
            'Content-Type': 'application/json',
            'User-Agent': 'TastePulse/1.0'
          }
        });
        
        const responseText = await response.text();
        let responseData;
        
        try {
          responseData = JSON.parse(responseText);
        } catch (e) {
          responseData = { raw: responseText };
        }
        
        results.push({
          endpoint,
          status: response.status,
          statusText: response.statusText,
          success: response.ok,
          data: responseData,
          headers: Object.fromEntries(response.headers.entries())
        });
        
        // If we found a working endpoint, break
        if (response.ok && responseData && Object.keys(responseData).length > 0) {
          console.log('Found working endpoint:', endpoint);
          break;
        }
        
      } catch (error) {
        results.push({
          endpoint,
          error: error.message,
          success: false
        });
      }
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        query,
        category,
        apiUrl: QLOO_API_URL,
        hasApiKey: !!QLOO_API_KEY,
        results
      })
    };
    
  } catch (error) {
    console.error('Test error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};