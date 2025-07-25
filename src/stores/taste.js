import { defineStore } from 'pinia';
import { ref } from 'vue';
import { createClient } from '@supabase/supabase-js';
import api, { mockApi, apiEndpoints } from '../utils/api';
import { ENABLE_MOCK_API } from '../config/env';

// Supabase client is now imported from utils/supabase.js
import supabase from '../utils/supabase';

export const useTasteStore = defineStore('taste', () => {
  // State
  const tasteInput = ref('');
  const parsedTaste = ref({});
  const recommendations = ref({});
  const isAuthenticated = ref(false);
  const user = ref(null);
  const savedProfiles = ref([]);
  const savedRecommendations = ref([]);
  const isProcessing = ref(false);
  const processingError = ref(null);
  const processingStage = ref('idle'); // idle, parsing, validating, recommending, complete
  const inputMode = ref('freetext'); // freetext or structured
  const structuredInput = ref({});
  const entitySearchResults = ref({});
  const entitySearchLoading = ref(false);
  
  // Parse free text input with GPT
  async function parseWithGPT(input) {
    try {
      processingStage.value = 'parsing';
      isProcessing.value = true;
      processingError.value = null;
      
      console.log('Parsing input with GPT:', input);
      
      let result;
      
      if (ENABLE_MOCK_API) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock parsed result based on input
        result = {};
        
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
        
        // Bengali input detection
        if (input.includes('রবীন্দ্রসঙ্গীত')) {
          result.music = 'রবীন্দ্রসঙ্গীত';
        }
        
        if (input.includes('ইলিশ')) {
          result.food = 'ইলিশ মাছ';
        }
        
        if (input.includes('কবিতা')) {
          result.book = 'বাংলা কবিতা';
        }
        
        if (input.includes('দার্জিলিং')) {
          result.travel = 'দার্জিলিং';
        }
        
        // Spanish input detection
        if (input.includes('flamenca')) {
          result.music = 'música flamenca';
        }
        
        if (input.includes('paella')) {
          result.food = 'paella';
        }
        
        if (input.includes('García Márquez')) {
          result.book = 'novelas de Gabriel García Márquez';
        }
        
        if (input.includes('playas de España')) {
          result.travel = 'playas de España';
        }
        
        // If no specific categories were detected, add some defaults based on language
        if (Object.keys(result).length === 0) {
          if (/[\u0980-\u09FF]/.test(input)) { // Bengali script detection
            result = {
              music: 'বাংলা গান',
              food: 'বাঙালি খাবার',
              book: 'বাংলা সাহিত্য',
              travel: 'বাংলাদেশ'
            };
          } else if (/[áéíóúüñ¿¡]/.test(input)) { // Spanish character detection
            result = {
              music: 'música latina',
              food: 'cocina española',
              book: 'literatura española',
              travel: 'España'
            };
          } else {
            result = {
              music: 'indie pop',
              food: 'fusion cuisine',
              book: 'contemporary fiction',
              travel: 'urban exploration'
            };
          }
        }
      } else {
        // Call the real API endpoint
        const response = await api.parseText(input);
        result = response.data;
      }
      
      // Validate the parsed result
      processingStage.value = 'validating';
      await validateParsedEntities(result);
      
      return result;
    } catch (error) {
      console.error('Error parsing input:', error);
      processingError.value = 'Failed to parse your taste preferences. Please try again.';
      throw error;
    } finally {
      if (processingStage.value === 'validating') {
        processingStage.value = 'recommending';
      }
    }
  }
  
  // Process structured input directly
  async function processStructuredInput(structuredData) {
    try {
      processingStage.value = 'validating';
      isProcessing.value = true;
      processingError.value = null;
      structuredInput.value = structuredData;
      
      console.log('Processing structured input:', structuredData);
      
      // Format the structured data for Qloo
      const formattedData = {};
      
      for (const [category, entities] of Object.entries(structuredData)) {
        if (entities.length > 0) {
          formattedData[category] = entities.map(entity => ({
            id: entity.id,
            name: entity.name,
            type: entity.type
          }));
        }
      }
      
      // Validate the entities
      await validateStructuredEntities(formattedData);
      
      // Set the parsed taste from structured input
      parsedTaste.value = formattedData;
      
      // Get recommendations based on structured input
      processingStage.value = 'recommending';
      const recs = await getRecommendationsFromStructured(formattedData);
      recommendations.value = recs;
      
      processingStage.value = 'complete';
      return recs;
    } catch (error) {
      console.error('Error processing structured input:', error);
      processingError.value = 'Failed to process your structured preferences. Please try again.';
      throw error;
    } finally {
      isProcessing.value = false;
    }
  }
  
  // Search for entities in the Qloo database
  async function searchQlooEntities(category, query) {
    try {
      if (!query || query.length < 2) {
        return [];
      }
      
      entitySearchLoading.value = true;
      
      if (ENABLE_MOCK_API) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Generate mock search results
        const results = generateMockSearchResults(category, query);
        entitySearchResults.value[category] = results;
        return results;
      } else {
        // Call the real API endpoint
        const response = await api.searchEntities(category, query);
        entitySearchResults.value[category] = response.data;
        return response.data;
      }
    } catch (error) {
      console.error(`Error searching ${category} entities:`, error);
      return [];
    } finally {
      entitySearchLoading.value = false;
    }
  }
  
  // Generate mock search results for entity search
  function generateMockSearchResults(category, query) {
    const lowercaseQuery = query.toLowerCase();
    let results = [];
    
    switch (category) {
      case 'music':
        if (lowercaseQuery.includes('jazz')) {
          results = [
            { id: 'music-001', name: 'Jazz', type: 'Genre' },
            { id: 'music-002', name: 'Jazz Fusion', type: 'Genre' },
            { id: 'music-003', name: 'Miles Davis', type: 'Artist' },
            { id: 'music-004', name: 'John Coltrane', type: 'Artist' },
            { id: 'music-005', name: 'Smooth Jazz', type: 'Genre' }
          ];
        } else if (lowercaseQuery.includes('rock')) {
          results = [
            { id: 'music-006', name: 'Rock', type: 'Genre' },
            { id: 'music-007', name: 'Alternative Rock', type: 'Genre' },
            { id: 'music-008', name: 'The Rolling Stones', type: 'Artist' },
            { id: 'music-009', name: 'Led Zeppelin', type: 'Artist' },
            { id: 'music-010', name: 'Rock and Roll', type: 'Genre' }
          ];
        } else {
          results = [
            { id: 'music-011', name: 'Pop', type: 'Genre' },
            { id: 'music-012', name: 'Hip Hop', type: 'Genre' },
            { id: 'music-013', name: 'Electronic', type: 'Genre' },
            { id: 'music-014', name: 'Classical', type: 'Genre' },
            { id: 'music-015', name: 'Folk', type: 'Genre' }
          ];
        }
        break;
        
      case 'food':
        if (lowercaseQuery.includes('italian')) {
          results = [
            { id: 'food-001', name: 'Italian Cuisine', type: 'Cuisine' },
            { id: 'food-002', name: 'Pizza', type: 'Dish' },
            { id: 'food-003', name: 'Pasta', type: 'Dish' },
            { id: 'food-004', name: 'Risotto', type: 'Dish' },
            { id: 'food-005', name: 'Tiramisu', type: 'Dessert' }
          ];
        } else if (lowercaseQuery.includes('asian')) {
          results = [
            { id: 'food-006', name: 'Asian Cuisine', type: 'Cuisine' },
            { id: 'food-007', name: 'Sushi', type: 'Dish' },
            { id: 'food-008', name: 'Ramen', type: 'Dish' },
            { id: 'food-009', name: 'Pad Thai', type: 'Dish' },
            { id: 'food-010', name: 'Dim Sum', type: 'Dish' }
          ];
        } else {
          results = [
            { id: 'food-011', name: 'American Cuisine', type: 'Cuisine' },
            { id: 'food-012', name: 'Mexican Cuisine', type: 'Cuisine' },
            { id: 'food-013', name: 'Indian Cuisine', type: 'Cuisine' },
            { id: 'food-014', name: 'French Cuisine', type: 'Cuisine' },
            { id: 'food-015', name: 'Mediterranean Cuisine', type: 'Cuisine' }
          ];
        }
        break;
        
      case 'book':
        if (lowercaseQuery.includes('fiction')) {
          results = [
            { id: 'book-001', name: 'Fiction', type: 'Genre' },
            { id: 'book-002', name: 'Science Fiction', type: 'Genre' },
            { id: 'book-003', name: 'Historical Fiction', type: 'Genre' },
            { id: 'book-004', name: 'Literary Fiction', type: 'Genre' },
            { id: 'book-005', name: 'Contemporary Fiction', type: 'Genre' }
          ];
        } else if (lowercaseQuery.includes('mystery')) {
          results = [
            { id: 'book-006', name: 'Mystery', type: 'Genre' },
            { id: 'book-007', name: 'Thriller', type: 'Genre' },
            { id: 'book-008', name: 'Crime Fiction', type: 'Genre' },
            { id: 'book-009', name: 'Detective Fiction', type: 'Genre' },
            { id: 'book-010', name: 'Suspense', type: 'Genre' }
          ];
        } else {
          results = [
            { id: 'book-011', name: 'Non-Fiction', type: 'Genre' },
            { id: 'book-012', name: 'Biography', type: 'Genre' },
            { id: 'book-013', name: 'Self-Help', type: 'Genre' },
            { id: 'book-014', name: 'History', type: 'Genre' },
            { id: 'book-015', name: 'Philosophy', type: 'Genre' }
          ];
        }
        break;
        
      case 'travel':
        if (lowercaseQuery.includes('europe')) {
          results = [
            { id: 'travel-001', name: 'Europe', type: 'Region' },
            { id: 'travel-002', name: 'Paris, France', type: 'City' },
            { id: 'travel-003', name: 'Rome, Italy', type: 'City' },
            { id: 'travel-004', name: 'Barcelona, Spain', type: 'City' },
            { id: 'travel-005', name: 'London, UK', type: 'City' }
          ];
        } else if (lowercaseQuery.includes('asia')) {
          results = [
            { id: 'travel-006', name: 'Asia', type: 'Region' },
            { id: 'travel-007', name: 'Tokyo, Japan', type: 'City' },
            { id: 'travel-008', name: 'Bangkok, Thailand', type: 'City' },
            { id: 'travel-009', name: 'Seoul, South Korea', type: 'City' },
            { id: 'travel-010', name: 'Singapore', type: 'City' }
          ];
        } else {
          results = [
            { id: 'travel-011', name: 'North America', type: 'Region' },
            { id: 'travel-012', name: 'South America', type: 'Region' },
            { id: 'travel-013', name: 'Africa', type: 'Region' },
            { id: 'travel-014', name: 'Australia', type: 'Region' },
            { id: 'travel-015', name: 'Antarctica', type: 'Region' }
          ];
        }
        break;
        
      default:
        results = [];
    }
    
    // Filter results by query
    return results.filter(result => 
      result.name.toLowerCase().includes(lowercaseQuery)
    );
  }
  
  // Validate parsed entities from free text
  async function validateParsedEntities(parsedResult) {
    try {
      // In a real app, this would validate entities against the Qloo database
      console.log('Validating parsed entities:', parsedResult);
      
      // Simulate validation delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For now, we'll just return the parsed result as is
      return parsedResult;
    } catch (error) {
      console.error('Error validating parsed entities:', error);
      throw error;
    }
  }
  
  // Validate structured entities
  async function validateStructuredEntities(structuredData) {
    try {
      // In a real app, this would validate the structured entities against the Qloo database
      console.log('Validating structured entities:', structuredData);
      
      // Simulate validation delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For now, we'll just return the structured data as is
      return structuredData;
    } catch (error) {
      console.error('Error validating structured entities:', error);
      throw error;
    }
  }
  
  // Get recommendations from structured input
  async function getRecommendationsFromStructured(structuredData) {
    try {
      // In a real app, this would call the Qloo API with the structured data
      console.log('Getting recommendations from structured data:', structuredData);
      
      if (ENABLE_MOCK_API) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate mock recommendations based on structured data
        return getQlooRecommendations(structuredData);
      } else {
        // Call the real API endpoint
        const response = await api.getRecommendations(structuredData);
        return response.data;
      }
    } catch (error) {
      console.error('Error getting recommendations from structured data:', error);
      throw error;
    }
  }
  
  // Mock function to simulate Qloo API recommendations
  async function getQlooRecommendations(parsedTaste) {
    // In a real app, this would call the Qloo API
    console.log('Getting recommendations from Qloo:', parsedTaste);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock recommendations based on parsed taste
    const mockRecommendations = {};
    
    if (parsedTaste.music) {
      mockRecommendations.music = generateMusicRecommendations(parsedTaste.music);
    }
    
    if (parsedTaste.food) {
      mockRecommendations.food = generateFoodRecommendations(parsedTaste.food);
    }
    
    if (parsedTaste.book) {
      mockRecommendations.book = generateBookRecommendations(parsedTaste.book);
    }
    
    if (parsedTaste.travel) {
      mockRecommendations.travel = generateTravelRecommendations(parsedTaste.travel);
    }
    
    return mockRecommendations;
  }
  
  // Helper functions to generate mock recommendations
  function generateMusicRecommendations(musicTaste) {
    const recommendations = [
      {
        name: 'Nujabes',
        description: 'Japanese hip-hop producer and DJ, known for jazzy, atmospheric beats',
        category: 'Artist',
        match: 95,
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&auto=format&fit=crop'
      },
      {
        name: 'Chillhop Essentials',
        description: 'A curated playlist of the best lo-fi and chillhop tracks',
        category: 'Playlist',
        match: 92,
        image: 'https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?w=400&h=300&auto=format&fit=crop'
      },
      {
        name: 'Tycho',
        description: 'American ambient music project led by Scott Hansen',
        category: 'Artist',
        match: 88,
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&auto=format&fit=crop'
      },
      {
        name: 'Bonobo',
        description: 'British musician, producer and DJ Simon Green',
        category: 'Artist',
        match: 85,
        image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=300&auto=format&fit=crop'
      },
      {
        name: 'Studio Ghibli Lo-Fi',
        description: 'Lo-fi remixes of Studio Ghibli soundtrack classics',
        category: 'Album',
        match: 82,
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&auto=format&fit=crop'
      },
      {
        name: 'Emancipator',
        description: 'American electronic music producer from Portland, Oregon',
        category: 'Artist',
        match: 80,
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&auto=format&fit=crop'
      }
    ];
    
    // Filter or modify based on specific taste
    if (musicTaste.includes('রবীন্দ্রসঙ্গীত')) {
      return [
        {
          name: 'Rabindra Sangeet Modern Covers',
          description: 'Contemporary interpretations of classic Tagore songs',
          category: 'Playlist',
          match: 96,
          image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'Somlata Acharyya Chowdhury',
          description: 'Bengali singer known for her Rabindra Sangeet performances',
          category: 'Artist',
          match: 94,
          image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'Kaushiki Chakraborty',
          description: 'Renowned Indian classical vocalist',
          category: 'Artist',
          match: 90,
          image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'Tagore & Beyond',
          description: 'Fusion of Rabindra Sangeet with contemporary styles',
          category: 'Album',
          match: 87,
          image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&auto=format&fit=crop'
        }
      ];
    }
    
    if (musicTaste.includes('flamenca')) {
      return [
        {
          name: 'Paco de Lucía',
          description: 'Spanish virtuoso flamenco guitarist, composer and producer',
          category: 'Artist',
          match: 97,
          image: 'https://images.unsplash.com/photo-1514119412350-e174d90d280e?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'Camarón de la Isla',
          description: 'Legendary flamenco vocalist',
          category: 'Artist',
          match: 95,
          image: 'https://images.unsplash.com/photo-1517230878791-4d28214057c2?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'Flamenco Passion',
          description: 'Collection of the most emotional flamenco performances',
          category: 'Playlist',
          match: 92,
          image: 'https://images.unsplash.com/photo-1516747773440-e04ce5d5e3b2?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'Estrella Morente',
          description: 'Spanish flamenco singer from a renowned flamenco family',
          category: 'Artist',
          match: 89,
          image: 'https://images.unsplash.com/photo-1535090467336-9501f96eef89?w=400&h=300&auto=format&fit=crop'
        }
      ];
    }
    
    return recommendations;
  }
  
  function generateFoodRecommendations(foodTaste) {
    const recommendations = [
      {
        name: 'Ichiran Ramen',
        description: 'Famous Japanese ramen chain known for tonkotsu broth',
        category: 'Restaurant',
        match: 96,
        image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400&h=300&auto=format&fit=crop'
      },
      {
        name: 'Homemade Ramen',
        description: 'Recipe for authentic Japanese ramen you can make at home',
        category: 'Recipe',
        match: 93,
        image: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400&h=300&auto=format&fit=crop'
      },
      {
        name: 'Momofuku',
        description: 'David Chang\'s famous restaurant group',
        category: 'Restaurant',
        match: 89,
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&auto=format&fit=crop'
      },
      {
        name: 'Japanese Street Food Tour',
        description: 'Guided tour of authentic Japanese street food',
        category: 'Experience',
        match: 86,
        image: 'https://images.unsplash.com/photo-1535189043414-47a3c49a0bed?w=400&h=300&auto=format&fit=crop'
      },
      {
        name: 'Ramen Cookbook',
        description: 'Comprehensive guide to making various ramen styles',
        category: 'Book',
        match: 83,
        image: 'https://images.unsplash.com/photo-1530174883092-c2a7aa3f1cfe?w=400&h=300&auto=format&fit=crop'
      }
    ];
    
    // Filter or modify based on specific taste
    if (foodTaste.includes('ইলিশ')) {
      return [
        {
          name: 'Ilish Bhapa',
          description: 'Steamed hilsa fish with mustard sauce',
          category: 'Recipe',
          match: 97,
          image: 'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'Ilish Paturi',
          description: 'Hilsa fish marinated in mustard paste and wrapped in banana leaf',
          category: 'Recipe',
          match: 95,
          image: 'https://images.unsplash.com/photo-1611599537845-1c7aca0091c0?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'Bengali Fish Festivals',
          description: 'Seasonal celebrations of hilsa fish in Bengal',
          category: 'Experience',
          match: 92,
          image: 'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'Ilish with Mustard Gravy',
          description: 'Classic Bengali preparation of hilsa fish',
          category: 'Recipe',
          match: 90,
          image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&auto=format&fit=crop'
        }
      ];
    }
    
    if (foodTaste.includes('paella')) {
      return [
        {
          name: 'Authentic Valencian Paella',
          description: 'Traditional Spanish rice dish with rabbit and chicken',
          category: 'Recipe',
          match: 98,
          image: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'Seafood Paella',
          description: 'Coastal variation with various seafood',
          category: 'Recipe',
          match: 96,
          image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'Paella Cooking Class in Valencia',
          description: 'Learn to make authentic paella from local chefs',
          category: 'Experience',
          match: 93,
          image: 'https://images.unsplash.com/photo-1607877742574-a7253c7a2e2c?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'The Perfect Paella Pan',
          description: 'Traditional wide, shallow pan for cooking paella',
          category: 'Cookware',
          match: 90,
          image: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400&h=300&auto=format&fit=crop'
        }
      ];
    }
    
    return recommendations;
  }
  
  function generateBookRecommendations(bookTaste) {
    const recommendations = [
      {
        name: 'Kafka on the Shore',
        description: 'Surreal novel by Haruki Murakami',
        category: 'Novel',
        match: 97,
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&auto=format&fit=crop'
      },
      {
        name: 'Norwegian Wood',
        description: 'Coming-of-age novel by Haruki Murakami',
        category: 'Novel',
        match: 94,
        image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=300&auto=format&fit=crop'
      },
      {
        name: 'The Wind-Up Bird Chronicle',
        description: 'Epic novel by Haruki Murakami',
        category: 'Novel',
        match: 91,
        image: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=300&auto=format&fit=crop'
      },
      {
        name: '1Q84',
        description: 'Dystopian novel by Haruki Murakami',
        category: 'Novel',
        match: 88,
        image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=300&auto=format&fit=crop'
      },
      {
        name: 'After Dark',
        description: 'Short novel by Haruki Murakami',
        category: 'Novel',
        match: 85,
        image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=300&auto=format&fit=crop'
      }
    ];
    
    // Filter or modify based on specific taste
    if (bookTaste.includes('কবিতা')) {
      return [
        {
          name: 'Selected Poems of Rabindranath Tagore',
          description: 'Collection of poems by Nobel laureate Rabindranath Tagore',
          category: 'Poetry',
          match: 98,
          image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'Works of Kazi Nazrul Islam',
          description: 'Revolutionary poetry by the national poet of Bangladesh',
          category: 'Poetry',
          match: 95,
          image: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'Modern Bengali Poetry',
          description: 'Anthology of contemporary Bengali poets',
          category: 'Poetry',
          match: 92,
          image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'Jibananda Das: Selected Poems',
          description: 'Works by one of Bengal\'s most significant poets',
          category: 'Poetry',
          match: 89,
          image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=300&auto=format&fit=crop'
        }
      ];
    }
    
    if (bookTaste.includes('García Márquez')) {
      return [
        {
          name: 'Cien años de soledad',
          description: 'One Hundred Years of Solitude - Gabriel García Márquez\'s masterpiece',
          category: 'Novel',
          match: 99,
          image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'El amor en los tiempos del cólera',
          description: 'Love in the Time of Cholera - Novel by Gabriel García Márquez',
          category: 'Novel',
          match: 96,
          image: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'Crónica de una muerte anunciada',
          description: 'Chronicle of a Death Foretold - Novella by Gabriel García Márquez',
          category: 'Novella',
          match: 93,
          image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'El coronel no tiene quien le escriba',
          description: 'No One Writes to the Colonel - Novella by Gabriel García Márquez',
          category: 'Novella',
          match: 90,
          image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=300&auto=format&fit=crop'
        }
      ];
    }
    
    return recommendations;
  }
  
  function generateTravelRecommendations(travelTaste) {
    const recommendations = [
      {
        name: 'Kyoto, Japan',
        description: 'Ancient capital with over 1,600 Buddhist temples and 400 Shinto shrines',
        category: 'City',
        match: 98,
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&auto=format&fit=crop'
      },
      {
        name: 'Arashiyama Bamboo Grove',
        description: 'Iconic bamboo forest in western Kyoto',
        category: 'Attraction',
        match: 95,
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400&h=300&auto=format&fit=crop'
      },
      {
        name: 'Fushimi Inari Shrine',
        description: 'Famous shrine with thousands of vermilion torii gates',
        category: 'Attraction',
        match: 92,
        image: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=400&h=300&auto=format&fit=crop'
      },
      {
        name: 'Kinkaku-ji (Golden Pavilion)',
        description: 'Zen Buddhist temple covered in gold leaf',
        category: 'Attraction',
        match: 89,
        image: 'https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?w=400&h=300&auto=format&fit=crop'
      },
      {
        name: 'Traditional Ryokan Stay',
        description: 'Experience traditional Japanese hospitality in a ryokan',
        category: 'Experience',
        match: 86,
        image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&auto=format&fit=crop'
      }
    ];
    
    // Filter or modify based on specific taste
    if (travelTaste.includes('দার্জিলিং')) {
      return [
        {
          name: 'Darjeeling, West Bengal',
          description: 'Hill station in the Himalayas known for tea plantations',
          category: 'City',
          match: 99,
          image: 'https://images.unsplash.com/photo-1544461772-722f2a1a21f4?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'Darjeeling Himalayan Railway',
          description: 'UNESCO World Heritage "Toy Train" railway',
          category: 'Attraction',
          match: 96,
          image: 'https://images.unsplash.com/photo-1602550033651-c3e0dcc08ddf?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'Tiger Hill, Darjeeling',
          description: 'Famous viewpoint for sunrise over the Himalayas',
          category: 'Attraction',
          match: 93,
          image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'Darjeeling Tea Estates',
          description: 'Tour of famous tea gardens and tea tasting',
          category: 'Experience',
          match: 90,
          image: 'https://images.unsplash.com/photo-1523920290228-4f321a939b4c?w=400&h=300&auto=format&fit=crop'
        }
      ];
    }
    
    if (travelTaste.includes('playas de España')) {
      return [
        {
          name: 'Playa de Las Catedrales, Galicia',
          description: 'Beach with natural stone arches resembling cathedral architecture',
          category: 'Beach',
          match: 97,
          image: 'https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'Playa de Ses Illetes, Formentera',
          description: 'Caribbean-like beach with crystal clear waters',
          category: 'Beach',
          match: 95,
          image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'Playa de Bolonia, Cádiz',
          description: 'Unspoiled beach with Roman ruins and sand dunes',
          category: 'Beach',
          match: 92,
          image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'Costa del Sol',
          description: 'Sun-soaked coastline in southern Spain',
          category: 'Region',
          match: 89,
          image: 'https://images.unsplash.com/photo-1520942702018-0862200e6873?w=400&h=300&auto=format&fit=crop'
        }
      ];
    }
    
    return recommendations;
  }
  
  // Get surprise recommendations
  async function getSurpriseRecommendations() {
    try {
      // In a real app, this would call a recommendation API with a randomization parameter
      console.log('Getting surprise recommendations');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate random recommendations
      return {
        music: [
          {
            name: 'Khruangbin',
            description: 'American musical trio blending global influences',
            category: 'Artist',
            match: '?',
            image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&auto=format&fit=crop'
          },
          {
            name: 'Balkan Beat Box',
            description: 'Israeli-American group mixing Mediterranean traditions with electronic music',
            category: 'Artist',
            match: '?',
            image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&auto=format&fit=crop'
          }
        ],
        food: [
          {
            name: 'Georgian Cuisine',
            description: 'Distinctive food from the country of Georgia featuring khachapuri and khinkali',
            category: 'Cuisine',
            match: '?',
            image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&auto=format&fit=crop'
          },
          {
            name: 'Peruvian Ceviche',
            description: 'Fresh seafood dish marinated in citrus juices',
            category: 'Dish',
            match: '?',
            image: 'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=400&h=300&auto=format&fit=crop'
          }
        ],
        book: [
          {
            name: 'The Master and Margarita',
            description: 'Satirical novel by Mikhail Bulgakov about the devil visiting Soviet Moscow',
            category: 'Novel',
            match: '?',
            image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&auto=format&fit=crop'
          },
          {
            name: 'The Shadow of the Wind',
            description: 'Mystery novel by Carlos Ruiz Zafón set in post-war Barcelona',
            category: 'Novel',
            match: '?',
            image: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=300&auto=format&fit=crop'
          }
        ],
        travel: [
          {
            name: 'Tbilisi, Georgia',
            description: 'Capital city with a blend of medieval, neoclassical, and Soviet architecture',
            category: 'City',
            match: '?',
            image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=400&h=300&auto=format&fit=crop'
          },
          {
            name: 'Faroe Islands',
            description: 'Remote archipelago with dramatic landscapes and traditional villages',
            category: 'Region',
            match: '?',
            image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&auto=format&fit=crop'
          }
        ]
      };
    } catch (error) {
      console.error('Error getting surprise recommendations:', error);
      throw error;
    }
  }
  
  // Process user input and get recommendations
  async function processInput(input) {
    try {
      isProcessing.value = true;
      processingError.value = null;
      tasteInput.value = input;
      
      // Parse the input
      const parsed = await parseWithGPT(input);
      parsedTaste.value = parsed;
      
      // Get recommendations based on parsed taste
      const recs = await getQlooRecommendations(parsed);
      recommendations.value = recs;
      
      processingStage.value = 'complete';
      return recs;
    } catch (error) {
      console.error('Error processing input:', error);
      processingError.value = 'Failed to process your taste preferences. Please try again.';
      throw error;
    } finally {
      isProcessing.value = false;
    }
  }
  
  // Save taste profile to user account
  async function saveTasteProfile(profileName) {
    try {
      if (!isAuthenticated.value) {
        throw new Error('You must be logged in to save a profile');
      }
      
      const profile = {
        id: `profile-${Date.now()}`,
        name: profileName || `Taste Profile ${savedProfiles.value.length + 1}`,
        date: new Date().toISOString(),
        input: tasteInput.value,
        parsedTaste: parsedTaste.value,
        recommendations: recommendations.value
      };
      
      // In a real app, this would save to Supabase or another backend
      // For now, we'll just add it to the local state
      savedProfiles.value.push(profile);
      
      return profile;
    } catch (error) {
      console.error('Error saving taste profile:', error);
      throw error;
    }
  }
  
  // Save individual recommendation
  async function saveRecommendation(recommendation, category) {
    try {
      if (!isAuthenticated.value) {
        throw new Error('You must be logged in to save a recommendation');
      }
      
      const savedRec = {
        id: `rec-${Date.now()}`,
        date: new Date().toISOString(),
        category,
        ...recommendation
      };
      
      // In a real app, this would save to Supabase or another backend
      // For now, we'll just add it to the local state
      savedRecommendations.value.push(savedRec);
      
      return savedRec;
    } catch (error) {
      console.error('Error saving recommendation:', error);
      throw error;
    }
  }
  
  // Load saved profiles from user account
  async function loadSavedProfiles() {
    try {
      if (!isAuthenticated.value) {
        return [];
      }
      
      // In a real app, this would load from Supabase or another backend
      // For now, we'll just return the local state
      return savedProfiles.value;
    } catch (error) {
      console.error('Error loading saved profiles:', error);
      throw error;
    }
  }
  
  // Load saved recommendations from user account
  async function loadSavedRecommendations() {
    try {
      if (!isAuthenticated.value) {
        return [];
      }
      
      // In a real app, this would load from Supabase or another backend
      // For now, we'll just return the local state
      return savedRecommendations.value;
    } catch (error) {
      console.error('Error loading saved recommendations:', error);
      throw error;
    }
  }
  
  // Delete a saved profile
  async function deleteSavedProfile(profileId) {
    try {
      if (!isAuthenticated.value) {
        throw new Error('You must be logged in to delete a profile');
      }
      
      // In a real app, this would delete from Supabase or another backend
      // For now, we'll just filter the local state
      savedProfiles.value = savedProfiles.value.filter(profile => profile.id !== profileId);
      
      return true;
    } catch (error) {
      console.error('Error deleting saved profile:', error);
      throw error;
    }
  }
  
  // Delete a saved recommendation
  async function deleteSavedRecommendation(recommendationId) {
    try {
      if (!isAuthenticated.value) {
        throw new Error('You must be logged in to delete a recommendation');
      }
      
      // In a real app, this would delete from Supabase or another backend
      // For now, we'll just filter the local state
      savedRecommendations.value = savedRecommendations.value.filter(rec => rec.id !== recommendationId);
      
      return true;
    } catch (error) {
      console.error('Error deleting saved recommendation:', error);
      throw error;
    }
  }
  
  // Check if user is already logged in on page load
  async function initAuth() {
    try {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        await setUser(data.session.user);
      }
      
      // Set up auth state change listener
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await setUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          isAuthenticated.value = false;
          user.value = null;
        }
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
    }
  }
  
  // Set user data after successful authentication
  async function setUser(userData) {
    if (!userData) return;
    
    isAuthenticated.value = true;
    user.value = {
      id: userData.id,
      email: userData.email,
      name: userData.user_metadata?.name || userData.email.split('@')[0],
      avatar_url: userData.user_metadata?.avatar_url
    };
    
    // Load user data
    await loadSavedProfiles();
    await loadSavedRecommendations();
    
    return user.value;
  }
  
  // User logout
  async function logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      isAuthenticated.value = false;
      user.value = null;
      savedProfiles.value = [];
      savedRecommendations.value = [];
      
      return true;
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }
  
  // Reset the state
  function reset() {
    tasteInput.value = '';
    parsedTaste.value = {};
    recommendations.value = {};
    processingStage.value = 'idle';
    processingError.value = null;
    isProcessing.value = false;
    inputMode.value = 'freetext';
    structuredInput.value = {};
    entitySearchResults.value = {};
  }
  
  // Initialize auth on store creation
  initAuth();

  return {
    // State
    tasteInput,
    parsedTaste,
    recommendations,
    isAuthenticated,
    user,
    savedProfiles,
    savedRecommendations,
    isProcessing,
    processingError,
    processingStage,
    inputMode,
    structuredInput,
    entitySearchResults,
    entitySearchLoading,
    
    // Methods
    processInput,
    parseWithGPT,
    processStructuredInput,
    searchQlooEntities,
    getQlooRecommendations,
    getSurpriseRecommendations,
    saveTasteProfile,
    saveRecommendation,
    loadSavedProfiles,
    loadSavedRecommendations,
    deleteSavedProfile,
    deleteSavedRecommendation,
    setUser,
    logout,
    reset
  };
});