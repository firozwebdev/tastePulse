// Results.vue Fixes - Copy these functions to your Results.vue file

// 1. Fix sharing error with proper state management
const isSharing = ref(false);

// 2. Enhanced shareRecommendation function with production URL handling
function shareRecommendation(item) {
  if (isSharing.value) return; // Prevent multiple shares
  
  const shareText = `Check out this ${activeCategory.value} recommendation from TastePulse: ${item.name} - ${item.description}`;
  
  // Generate production-ready URL
  const baseUrl = window.location.hostname === 'localhost' 
    ? 'https://tastepulse.netlify.app' 
    : window.location.origin;
  const shareUrl = `${baseUrl}/results?shared=${encodeURIComponent(item.name)}&category=${activeCategory.value}`;
  
  isSharing.value = true;
  
  if (navigator.share) {
    navigator.share({
      title: `TastePulse ${activeCategory.value.charAt(0).toUpperCase() + activeCategory.value.slice(1)} Recommendation`,
      text: shareText,
      url: shareUrl
    }).then(() => {
      if (notification) {
        notification.success('Shared Successfully', 'Your recommendation has been shared.');
      }
    }).catch(err => {
      if (err.name !== 'AbortError') {
        if (notification) {
          notification.error('Share Failed', 'Could not share this recommendation.');
        }
        console.error('Error sharing:', err);
        // Fallback to clipboard if sharing fails
        copyToClipboard(shareText + ' ' + shareUrl);
      }
    }).finally(() => {
      setTimeout(() => {
        isSharing.value = false;
      }, 1000);
    });
  } else {
    // Fallback to clipboard copy
    copyToClipboard(shareText + ' ' + shareUrl);
    if (notification) {
      notification.success('Copied to Clipboard', 'Share link copied to clipboard.');
    }
    setTimeout(() => {
      isSharing.value = false;
    }, 1000);
  }
}

// 3. Enhanced shareProfile function
const shareProfile = () => {
  if (isSharing.value) return;
  
  const shareText = `Check out my TastePulse cultural profile! I discovered my unique taste across music, food, travel, and books.`;
  const baseUrl = window.location.hostname === 'localhost' 
    ? 'https://tastepulse.netlify.app' 
    : window.location.origin;
  const shareUrl = `${baseUrl}/results`;
  
  isSharing.value = true;
  
  if (navigator.share) {
    navigator.share({
      title: 'My TastePulse Cultural Profile',
      text: shareText,
      url: shareUrl
    }).catch(err => {
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err);
        copyToClipboard(shareText + ' ' + shareUrl);
      }
    }).finally(() => {
      setTimeout(() => {
        isSharing.value = false;
      }, 1000);
    });
  } else {
    copyToClipboard(shareText + ' ' + shareUrl);
    setTimeout(() => {
      isSharing.value = false;
    }, 1000);
  }
};

// 4. Enhanced showDetails function to fetch Qloo data
async function showDetails(item) {
  selectedRecommendation.value = item;
  
  // If item doesn't have detailed Qloo data, fetch it
  if (!item.qloo_data || !item.detailed_info) {
    try {
      // Fetch detailed Qloo data for this item
      const response = await fetch('/.netlify/functions/get-qloo-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item_name: item.name,
          category: item.category,
          item_id: item.id
        })
      });

      if (response.ok) {
        const detailedData = await response.json();
        
        // Enhance the item with Qloo data
        selectedRecommendation.value = {
          ...item,
          qloo_data: detailedData.qloo_data,
          detailed_info: detailedData.detailed_info,
          similar_items: detailedData.similar_items,
          cultural_context: detailedData.cultural_context,
          popularity_score: detailedData.popularity_score,
          tags: detailedData.tags || []
        };
      }
    } catch (error) {
      console.error('Error fetching detailed data:', error);
      // Continue with existing data if fetch fails
    }
  }
  
  showDetailsModal.value = true;
}

// 5. Enhanced getSurprise function with details support
async function getSurprise() {
  isSurpriseLoading.value = true;
  try {
    const response = await api.get('/.netlify/functions/surprise-me');
    
    if (response.data) {
      // Enhance surprise results with detailed data
      const enhancedSurpriseResults = {};
      
      for (const [category, item] of Object.entries(response.data)) {
        enhancedSurpriseResults[category] = {
          ...item,
          // Add showDetails support for surprise items
          showDetails: () => showDetails(item),
          // Add share support for surprise items
          share: () => shareRecommendation(item)
        };
      }
      
      surpriseResults.value = enhancedSurpriseResults;
      isSurpriseVisible.value = true;
      
      // Replace current recommendations with surprise ones
      Object.keys(response.data).forEach(category => {
        if (recommendations.value[category]) {
          recommendations.value[category] = [response.data[category]];
        }
      });
      
      // Set the first category as active
      if (Object.keys(recommendations.value).length > 0) {
        activeCategory.value = Object.keys(recommendations.value)[0];
      }
      
      // Enhance with taste bridging
      await enhanceWithTasteBridging();
    }
  } catch (error) {
    console.error('Error getting surprise recommendations:', error);
    error.value = 'Failed to get surprise recommendations. Please try again.';
  } finally {
    isSurpriseLoading.value = false;
  }
}

// 6. Helper function to copy to clipboard
function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
}

// 7. Enhanced handleShareFromModal function
function handleShareFromModal(item) {
  if (isSharing.value) return;
  
  shareRecommendation(item);
  showDetailsModal.value = false; // Close modal after sharing
}

// 8. Function to create Qloo details endpoint (add this to netlify/functions/)
// This should be a separate file: netlify/functions/get-qloo-details.js
const getQlooDetailsFunction = `
exports.handler = async function(event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

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
    const { item_name, category, item_id } = JSON.parse(event.body);

    // Mock detailed Qloo data (replace with actual Qloo API calls)
    const detailedData = {
      qloo_data: {
        id: item_id || Math.random().toString(36).substr(2, 9),
        name: item_name,
        category: category,
        popularity_score: Math.floor(Math.random() * 100) + 1,
        cultural_relevance: Math.floor(Math.random() * 100) + 1,
        trending_score: Math.floor(Math.random() * 100) + 1
      },
      detailed_info: {
        full_description: \`Detailed information about \${item_name}. This would contain rich content from Qloo's database including cultural context, popularity trends, and detailed analysis.\`,
        origin: "Qloo Cultural Intelligence Platform",
        last_updated: new Date().toISOString(),
        data_sources: ["Qloo API", "Cultural Database", "Trend Analysis"]
      },
      similar_items: [
        {
          name: \`Similar to \${item_name} #1\`,
          match: Math.floor(Math.random() * 20) + 80,
          category: category
        },
        {
          name: \`Similar to \${item_name} #2\`,
          match: Math.floor(Math.random() * 20) + 75,
          category: category
        }
      ],
      cultural_context: \`\${item_name} represents a significant cultural touchstone in the \${category} domain, with deep connections to contemporary cultural movements.\`,
      tags: [\`\${category}\`, "trending", "cultural", "recommended"]
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(detailedData)
    };

  } catch (error) {
    console.error('Error fetching Qloo details:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        message: 'Failed to fetch detailed information'
      })
    };
  }
};
`;

export { getQlooDetailsFunction };