import { defineStore } from 'pinia';
import { ref } from 'vue';
import { createClient } from '@supabase/supabase-js';
import api, { mockApi, apiEndpoints } from '../utils/api';
import { ENABLE_MOCK_API } from '../config/env';

// Initialize Supabase client
// In a real app, these would be environment variables
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseKey = 'your-supabase-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export const useTasteStore = defineStore('taste', () => {
  // State
  const tasteInput = ref('');
  const parsedTaste = ref({});
  const recommendations = ref({});
  const isAuthenticated = ref(false);
  const user = ref(null);
  const savedProfiles = ref([]);
  const savedRecommendations = ref([]);
  
  // Mock function to simulate GPT parsing
  async function parseWithGPT(input) {
    // In a real app, this would call an API endpoint
    console.log('Parsing input with GPT:', input);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock parsed result based on input
    let result = {};
    
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
    
    return result;
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
        name: 'Homemade Ramen Guide',
        description: 'Step-by-step guide to making authentic ramen at home',
        category: 'Recipe',
        match: 93,
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&auto=format&fit=crop'
      },
      {
        name: 'Tsukemen',
        description: 'Dipping ramen - noodles served separately from the broth',
        category: 'Dish',
        match: 90,
        image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&h=300&auto=format&fit=crop'
      },
      {
        name: 'Yakitori',
        description: 'Japanese skewered chicken, pairs well with ramen',
        category: 'Dish',
        match: 87,
        image: 'https://images.unsplash.com/photo-1626622127860-0a927d8b5c4f?w=400&h=300&auto=format&fit=crop'
      },
      {
        name: 'Sake Pairing Guide',
        description: 'How to pair different types of sake with ramen',
        category: 'Guide',
        match: 84,
        image: 'https://images.unsplash.com/photo-1579275542618-a1dfed5f54ba?w=400&h=300&auto=format&fit=crop'
      },
      {
        name: 'Ramen Tour of Tokyo',
        description: 'Curated guide to the best ramen shops in Tokyo',
        category: 'Experience',
        match: 82,
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400&h=300&auto=format&fit=crop'
      }
    ];
    
    if (foodTaste.includes('ইলিশ')) {
      return [
        {
          name: 'ইলিশ পোলাও',
          description: 'Traditional Bengali dish of fragrant rice cooked with Hilsa fish',
          category: 'Recipe',
          match: 98,
          image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'শর্ষে ইলিশ',
          description: 'Hilsa fish cooked in mustard sauce, a Bengali delicacy',
          category: 'Dish',
          match: 96,
          image: 'https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'ভাপা ইলিশ',
          description: 'Steamed Hilsa fish with mustard paste',
          category: 'Recipe',
          match: 93,
          image: 'https://images.unsplash.com/photo-1580217593608-61931cefc821?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'কোলকাতার বিখ্যাত ইলিশ রেস্টুরেন্ট',
          description: 'Famous restaurants in Kolkata serving the best Hilsa dishes',
          category: 'Guide',
          match: 90,
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&auto=format&fit=crop'
        }
      ];
    }
    
    if (foodTaste.includes('paella')) {
      return [
        {
          name: 'Paella Valenciana',
          description: 'Traditional Spanish rice dish with rabbit, chicken and vegetables',
          category: 'Dish',
          match: 97,
          image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'Seafood Paella',
          description: 'Coastal variation with various seafood and saffron rice',
          category: 'Recipe',
          match: 95,
          image: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'La Pepica',
          description: 'Historic restaurant in Valencia known for authentic paella',
          category: 'Restaurant',
          match: 92,
          image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'Spanish Tapas Selection',
          description: 'Small dishes that pair perfectly with paella',
          category: 'Guide',
          match: 88,
          image: 'https://images.unsplash.com/photo-1593504049359-74330189a345?w=400&h=300&auto=format&fit=crop'
        }
      ];
    }
    
    return recommendations;
  }
  
  function generateBookRecommendations(bookTaste) {
    const recommendations = [
      {
        name: 'Norwegian Wood',
        description: 'Haruki Murakami\'s nostalgic story of loss and sexuality',
        category: 'Novel',
        match: 98,
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&auto=format&fit=crop'
      },
      {
        name: 'Kafka on the Shore',
        description: 'Murakami\'s magical realist novel about a teenage runaway',
        category: 'Novel',
        match: 95,
        image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=300&auto=format&fit=crop'
      },
      {
        name: 'The Wind-Up Bird Chronicle',
        description: 'Murakami\'s epic tale of a man\'s search for his missing wife',
        category: 'Novel',
        match: 92,
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&auto=format&fit=crop'
      },
      {
        name: 'After Dark',
        description: 'Murakami\'s short novel set during one night in Tokyo',
        category: 'Novel',
        match: 89,
        image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=400&h=300&auto=format&fit=crop'
      },
      {
        name: 'Colorless Tsukuru Tazaki',
        description: 'Murakami\'s novel about a man dealing with being rejected by his friends',
        category: 'Novel',
        match: 86,
        image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400&h=300&auto=format&fit=crop'
      },
      {
        name: 'The Memory Police',
        description: 'Yoko Ogawa\'s dystopian novel about memory and loss',
        category: 'Novel',
        match: 83,
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&auto=format&fit=crop'
      }
    ];
    
    if (bookTaste.includes('কবিতা')) {
      return [
        {
          name: 'গীতাঞ্জলি',
          description: 'Rabindranath Tagore\'s Nobel Prize-winning collection of poems',
          category: 'Poetry',
          match: 97,
          image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'শেষের কবিতা',
          description: 'One of Tagore\'s most celebrated works',
          category: 'Novel/Poetry',
          match: 94,
          image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'কাজী নজরুল ইসলামের কবিতা সংকলন',
          description: 'Collection of poems by the rebel poet Kazi Nazrul Islam',
          category: 'Poetry',
          match: 91,
          image: 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'আধুনিক বাংলা কবিতা',
          description: 'Anthology of modern Bengali poetry',
          category: 'Poetry Collection',
          match: 88,
          image: 'https://images.unsplash.com/photo-1533669955142-6a73332af4db?w=400&h=300&auto=format&fit=crop'
        }
      ];
    }
    
    if (bookTaste.includes('García Márquez')) {
      return [
        {
          name: 'Cien años de soledad',
          description: 'One Hundred Years of Solitude - García Márquez\'s masterpiece',
          category: 'Novel',
          match: 99,
          image: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'El amor en los tiempos del cólera',
          description: 'Love in the Time of Cholera - A story of love and patience',
          category: 'Novel',
          match: 96,
          image: 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'Crónica de una muerte anunciada',
          description: 'Chronicle of a Death Foretold - Novella by García Márquez',
          category: 'Novella',
          match: 93,
          image: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'Isabel Allende - La casa de los espíritus',
          description: 'The House of the Spirits - Similar magical realism style',
          category: 'Novel',
          match: 90,
          image: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=400&h=300&auto=format&fit=crop'
        }
      ];
    }
    
    return recommendations;
  }
  
  function generateTravelRecommendations(travelTaste) {
    const recommendations = [
      {
        name: 'Fushimi Inari Shrine',
        description: 'Famous shrine with thousands of vermilion torii gates in Kyoto',
        category: 'Attraction',
        match: 97,
        image: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=400&h=300&auto=format&fit=crop'
      },
      {
        name: 'Arashiyama Bamboo Grove',
        description: 'Stunning bamboo forest path in western Kyoto',
        category: 'Nature',
        match: 94,
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400&h=300&auto=format&fit=crop'
      },
      {
        name: 'Gion District',
        description: 'Kyoto\'s famous geisha district with traditional wooden machiya houses',
        category: 'District',
        match: 91,
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&auto=format&fit=crop'
      },
      {
        name: 'Philosopher\'s Path',
        description: 'Stone path following a canal lined with cherry trees in Kyoto',
        category: 'Walk',
        match: 88,
        image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&h=300&auto=format&fit=crop'
      },
      {
        name: 'Kinkaku-ji (Golden Pavilion)',
        description: 'Zen Buddhist temple covered in gold leaf in Kyoto',
        category: 'Temple',
        match: 85,
        image: 'https://images.unsplash.com/photo-1624253321171-1be53e12f5f2?w=400&h=300&auto=format&fit=crop'
      },
      {
        name: 'Hidden Cafes of Kyoto',
        description: 'Guide to the best secluded cafes in Kyoto\'s back streets',
        category: 'Guide',
        match: 82,
        image: 'https://images.unsplash.com/photo-1517231925375-bf2cb42917a5?w=400&h=300&auto=format&fit=crop'
      }
    ];
    
    if (travelTaste.includes('দার্জিলিং')) {
      return [
        {
          name: 'টাইগার হিল',
          description: 'Tiger Hill - Famous for stunning sunrise views of the Himalayas',
          category: 'Viewpoint',
          match: 96,
          image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'দার্জিলিং হিমালয়ান রেলওয়ে',
          description: 'Darjeeling Himalayan Railway - UNESCO World Heritage toy train',
          category: 'Experience',
          match: 94,
          image: 'https://images.unsplash.com/photo-1554629947-334ff61d85dc?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'চা বাগান ভ্রমণ',
          description: 'Tea garden tours in Darjeeling\'s famous estates',
          category: 'Tour',
          match: 91,
          image: 'https://images.unsplash.com/photo-1582126892906-5ba118eaf46e?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'কাঞ্চনজঙ্ঘা দর্শন',
          description: 'Views of Kanchenjunga, the world\'s third highest mountain',
          category: 'Nature',
          match: 89,
          image: 'https://images.unsplash.com/photo-1516233758813-a38d024919c5?w=400&h=300&auto=format&fit=crop'
        }
      ];
    }
    
    if (travelTaste.includes('playas de España')) {
      return [
        {
          name: 'Playa de Las Catedrales',
          description: 'Beach of the Cathedrals - Famous for its natural rock arches',
          category: 'Beach',
          match: 98,
          image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'Cala Macarella',
          description: 'Stunning turquoise cove beach in Menorca',
          category: 'Beach',
          match: 95,
          image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'Playa de Bolonia',
          description: 'Beautiful beach with sand dunes in Andalusia',
          category: 'Beach',
          match: 92,
          image: 'https://images.unsplash.com/photo-1520942702018-0862200e6873?w=400&h=300&auto=format&fit=crop'
        },
        {
          name: 'Costa del Sol',
          description: 'Sun Coast - Popular Mediterranean coastal region',
          category: 'Region',
          match: 89,
          image: 'https://images.unsplash.com/photo-1504681869696-d977211a5f4c?w=400&h=300&auto=format&fit=crop'
        }
      ];
    }
    
    return recommendations;
  }
  
  // Actions
  async function processTasteInput(input) {
    tasteInput.value = input;
    
    try {
      let parsed;
      let recs;
      
      if (ENABLE_MOCK_API) {
        // Use mock API for development
        parsed = await parseWithGPT(input);
        recs = await getQlooRecommendations(parsed);
      } else {
        try {
          // Use real API endpoints (Netlify Edge Functions) for production
          console.log('Calling parse-taste API endpoint with input:', input);
          
          // Parse the input with Gemini via Edge Function
          const parseResponse = await api.post(apiEndpoints.parseText, { input });
          console.log('Parse response:', parseResponse.data);
          parsed = parseResponse.data;
          
          // Get recommendations from Qloo via Edge Function
          console.log('Calling recommendations API endpoint with parsed taste:', parsed);
          const recsResponse = await api.post(apiEndpoints.getRecommendations, { parsedTaste: parsed });
          console.log('Recommendations response:', recsResponse.data);
          recs = recsResponse.data;
        } catch (apiError) {
          console.error('API Error:', apiError);
          // Fallback to mock API if real API fails
          console.log('Falling back to mock API');
          parsed = await parseWithGPT(input);
          recs = await getQlooRecommendations(parsed);
        }
      }
      
      parsedTaste.value = parsed;
      recommendations.value = recs;
      
      return { parsed, recommendations: recs };
    } catch (error) {
      console.error('Error processing taste input:', error);
      throw error;
    }
  }
  
  async function saveTasteProfile() {
    try {
      // In a real app, this would save to Supabase
      console.log('Saving taste profile to Supabase');
      
      const profile = {
        id: Date.now().toString(),
        tasteInput: tasteInput.value,
        parsedTaste: parsedTaste.value,
        recommendations: recommendations.value,
        createdAt: new Date().toISOString()
      };
      
      // Add to local storage for demo purposes
      const existingProfiles = JSON.parse(localStorage.getItem('tasteProfiles') || '[]');
      existingProfiles.push(profile);
      localStorage.setItem('tasteProfiles', JSON.stringify(existingProfiles));
      
      savedProfiles.value = existingProfiles;
      
      return profile;
    } catch (error) {
      console.error('Error saving taste profile:', error);
      throw error;
    }
  }
  
  async function getUserProfiles() {
    try {
      // In a real app, this would fetch from Supabase
      console.log('Fetching user profiles from storage');
      
      // Get from local storage for demo purposes
      const profiles = JSON.parse(localStorage.getItem('tasteProfiles') || '[]');
      savedProfiles.value = profiles;
      
      return profiles;
    } catch (error) {
      console.error('Error fetching user profiles:', error);
      throw error;
    }
  }
  
  async function deleteProfile(profileId) {
    try {
      // In a real app, this would delete from Supabase
      console.log('Deleting profile:', profileId);
      
      // Delete from local storage for demo purposes
      const existingProfiles = JSON.parse(localStorage.getItem('tasteProfiles') || '[]');
      const updatedProfiles = existingProfiles.filter(profile => profile.id !== profileId);
      localStorage.setItem('tasteProfiles', JSON.stringify(updatedProfiles));
      
      savedProfiles.value = updatedProfiles;
      
      return true;
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw error;
    }
  }
  
  function loadProfile(profile) {
    tasteInput.value = profile.tasteInput;
    parsedTaste.value = profile.parsedTaste;
    recommendations.value = profile.recommendations;
  }
  
  function saveRecommendation(recommendation) {
    // In a real app, this would save to Supabase
    console.log('Saving recommendation:', recommendation);
    
    // Add to local storage for demo purposes
    const existingRecommendations = JSON.parse(localStorage.getItem('savedRecommendations') || '[]');
    existingRecommendations.push({
      ...recommendation,
      savedAt: new Date().toISOString()
    });
    localStorage.setItem('savedRecommendations', JSON.stringify(existingRecommendations));
    
    savedRecommendations.value = existingRecommendations;
  }
  
  return {
    // State
    tasteInput,
    parsedTaste,
    recommendations,
    isAuthenticated,
    user,
    savedProfiles,
    savedRecommendations,
    
    // Actions
    processTasteInput,
    saveTasteProfile,
    getUserProfiles,
    deleteProfile,
    loadProfile,
    saveRecommendation
  };
});