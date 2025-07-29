const fetch = require('node-fetch');

async function testComplexStructure() {
  try {
    console.log('Testing with complex Gemini structure...');
    
    // This mimics the actual structure that Gemini returns
    const testData = {
      parsedTaste: {
        music: { 
          genres: ['i love lo-fi beats'], 
          artists: [] 
        },
        food: { 
          cuisines: ['japanese ramen'], 
          dishes: [] 
        },
        books: { 
          genres: [], 
          authors: [] 
        },
        travel: {
          destinations: ['', 'exploring hidden cafes in kyoto.'],
          activities: []
        }
      }
    };
    
    console.log('Sending data:', JSON.stringify(testData, null, 2));
    
    const response = await fetch('http://localhost:12486/.netlify/functions/get-recommendations-fixed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success! Response:', JSON.stringify(data, null, 2));
      
      // Check if we got real data
      if (data.metadata && data.metadata.usedMockData) {
        const realCategories = Object.entries(data.metadata.usedMockData)
          .filter(([cat, isMock]) => !isMock)
          .map(([cat]) => cat);
        
        console.log('\n🎉 REAL QLOO DATA for categories:', realCategories.join(', '));
        
        if (realCategories.length === 0) {
          console.log('⚠️  All categories used mock data');
        }
      }
    } else {
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testComplexStructure();