// Direct function testing script
const fs = require('fs');
const path = require('path');

// Sample test data
const sampleRecommendations = {
  music: [
    {
      id: 1,
      name: "Bohemian Rhapsody by Queen",
      description: "Epic rock opera that blends multiple musical styles",
      match: 95,
      category: "music",
      image: "https://via.placeholder.com/300x200?text=Music"
    }
  ],
  food: [
    {
      id: 3,
      name: "Authentic Ramen from Tokyo",
      description: "Rich tonkotsu broth with handmade noodles",
      match: 92,
      category: "food",
      image: "https://via.placeholder.com/300x200?text=Ramen"
    }
  ]
};

async function testFunction(functionName, payload) {
  try {
    console.log(`\n🧪 Testing ${functionName}...`);
    
    // Import the function
    const functionPath = path.join(__dirname, 'netlify', 'functions', `${functionName}.js`);
    
    if (!fs.existsSync(functionPath)) {
      console.log(`❌ Function file not found: ${functionPath}`);
      return;
    }
    
    const { handler } = require(functionPath);
    
    // Create mock event
    const event = {
      httpMethod: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    // Call the function
    const result = await handler(event);
    
    console.log(`✅ ${functionName} Status:`, result.statusCode);
    
    if (result.statusCode === 200) {
      const data = JSON.parse(result.body);
      console.log(`📊 Response keys:`, Object.keys(data));
    } else {
      console.log(`❌ Error:`, result.body);
    }
    
  } catch (error) {
    console.log(`❌ ${functionName} failed:`, error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Direct Function Tests...\n');
  
  // Test Taste Bridge
  await testFunction('taste-bridge', {
    recommendations: sampleRecommendations,
    originalTaste: "I love Japanese culture and rock music"
  });
  
  // Test Time Travel
  await testFunction('time-travel-taste', {
    recommendations: sampleRecommendations,
    selectedEras: ['1980s', '1990s']
  });
  
  // Test Analytics
  await testFunction('taste-analytics', {
    recommendations: sampleRecommendations,
    location: 'San Francisco, CA'
  });
  
  console.log('\n🎉 Direct function tests completed!');
}

// Run the tests
runTests().catch(console.error);