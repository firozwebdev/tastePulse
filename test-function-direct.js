const fetch = require('node-fetch');

async function testFunction() {
  try {
    console.log('Testing the fixed function...');
    
    const testData = {
      parsedTaste: {
        music: "jazz",
        food: "pizza"
      }
    };
    
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
    } else {
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testFunction();