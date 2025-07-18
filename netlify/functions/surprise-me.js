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

  // Always return a random recommendation for each category
  const categories = ["music", "food", "book", "travel"];
  const mockData = generateMockRecommendations({
    music: "random",
    food: "random",
    book: "random",
    travel: "random"
  });

  const surprise = {};
  for (const category of categories) {
    const options = mockData[category];
    if (options && options.length > 0) {
      surprise[category] = options[Math.floor(Math.random() * options.length)];
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