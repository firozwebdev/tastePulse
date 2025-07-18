const { generateMockRecommendations } = require('./get-recommendations.js');

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

  // Always return a unique, diverse recommendation for each category
  const categories = ["music", "food", "book", "travel"];
  const mockData = generateMockRecommendations({
    music: "random",
    food: "random",
    book: "random",
    travel: "random"
  });

  const usedNames = new Set();
  const surprise = {};
  for (const category of categories) {
    // Filter out options already used in other categories
    const options = mockData[category].filter(item => !usedNames.has(item.name));
    let pick = null;
    if (options.length > 0) {
      pick = options[Math.floor(Math.random() * options.length)];
    } else if (mockData[category].length > 0) {
      // If all options are used, allow repeats as fallback
      pick = mockData[category][Math.floor(Math.random() * mockData[category].length)];
    }
    if (pick) {
      surprise[category] = pick;
      usedNames.add(pick.name);
    }
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(surprise)
  };
}; 