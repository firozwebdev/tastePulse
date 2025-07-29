// Spotify Integration - Instant taste profiling from music data
const fetch = require('node-fetch');

// Spotify Web API endpoints (would use real credentials in production)
const SPOTIFY_CONFIG = {
  client_id: process.env.SPOTIFY_CLIENT_ID,
  client_secret: process.env.SPOTIFY_CLIENT_SECRET,
  redirect_uri: process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:8888/callback'
};

// Music taste analysis based on Spotify data
function analyzeSpotifyTaste(spotifyData) {
  const {
    top_tracks = [],
    top_artists = [],
    audio_features = [],
    recently_played = [],
    playlists = []
  } = spotifyData;

  const tasteProfile = {
    music_personality: analyzeMusicPersonality(audio_features),
    genre_diversity: analyzeGenreDiversity(top_artists),
    listening_patterns: analyzeListeningPatterns(recently_played),
    cultural_indicators: extractCulturalIndicators(top_artists, top_tracks),
    taste_evolution: analyzeTasteEvolution(recently_played, top_tracks),
    social_indicators: analyzeSocialIndicators(playlists)
  };

  return tasteProfile;
}

function analyzeMusicPersonality(audioFeatures) {
  if (!audioFeatures.length) return null;

  // Calculate average audio features
  const avgFeatures = audioFeatures.reduce((acc, track) => {
    Object.keys(track).forEach(key => {
      if (typeof track[key] === 'number') {
        acc[key] = (acc[key] || 0) + track[key];
      }
    });
    return acc;
  }, {});

  Object.keys(avgFeatures).forEach(key => {
    avgFeatures[key] /= audioFeatures.length;
  });

  // Determine music personality based on audio features
  const personality = {
    energy_level: categorizeLevel(avgFeatures.energy, 'energy'),
    mood_preference: categorizeLevel(avgFeatures.valence, 'mood'),
    complexity_preference: categorizeLevel(avgFeatures.acousticness, 'complexity'),
    social_context: categorizeLevel(avgFeatures.danceability, 'social'),
    adventure_level: categorizeLevel(avgFeatures.instrumentalness, 'adventure')
  };

  return {
    ...personality,
    overall_profile: generateMusicPersonalityDescription(personality),
    audio_signature: avgFeatures
  };
}

function categorizeLevel(value, type) {
  const categories = {
    energy: {
      low: { range: [0, 0.4], label: 'Calm & Relaxed', description: 'Prefers mellow, soothing music' },
      medium: { range: [0.4, 0.7], label: 'Balanced Energy', description: 'Enjoys moderate energy levels' },
      high: { range: [0.7, 1], label: 'High Energy', description: 'Loves energetic, powerful music' }
    },
    mood: {
      low: { range: [0, 0.4], label: 'Melancholic', description: 'Drawn to emotional, introspective music' },
      medium: { range: [0.4, 0.7], label: 'Balanced Mood', description: 'Enjoys varied emotional content' },
      high: { range: [0.7, 1], label: 'Upbeat & Positive', description: 'Prefers happy, uplifting music' }
    },
    complexity: {
      low: { range: [0, 0.4], label: 'Electronic/Produced', description: 'Enjoys electronic and produced sounds' },
      medium: { range: [0.4, 0.7], label: 'Mixed Production', description: 'Likes both acoustic and electronic' },
      high: { range: [0.7, 1], label: 'Acoustic/Organic', description: 'Prefers natural, acoustic sounds' }
    },
    social: {
      low: { range: [0, 0.4], label: 'Contemplative', description: 'Music for reflection and focus' },
      medium: { range: [0.4, 0.7], label: 'Versatile', description: 'Music for various situations' },
      high: { range: [0.7, 1], label: 'Social & Danceable', description: 'Music for parties and dancing' }
    },
    adventure: {
      low: { range: [0, 0.4], label: 'Vocal-Focused', description: 'Loves lyrics and vocal performances' },
      medium: { range: [0.4, 0.7], label: 'Balanced', description: 'Enjoys both vocal and instrumental' },
      high: { range: [0.7, 1], label: 'Instrumental Explorer', description: 'Appreciates complex instrumentals' }
    }
  };

  const category = categories[type];
  if (value <= category.low.range[1]) return { level: 'low', ...category.low };
  if (value <= category.medium.range[1]) return { level: 'medium', ...category.medium };
  return { level: 'high', ...category.high };
}

function generateMusicPersonalityDescription(personality) {
  const traits = [];
  
  if (personality.energy_level.level === 'high') traits.push('energetic');
  if (personality.mood_preference.level === 'high') traits.push('optimistic');
  if (personality.complexity_preference.level === 'high') traits.push('acoustic-loving');
  if (personality.social_context.level === 'high') traits.push('social');
  if (personality.adventure_level.level === 'high') traits.push('instrumental-focused');

  const descriptions = {
    'energetic-optimistic': 'You\'re a high-energy music lover who gravitates toward upbeat, positive sounds',
    'acoustic-loving-social': 'You appreciate organic, acoustic music that brings people together',
    'instrumental-focused': 'You\'re drawn to complex, instrumental music that showcases musical craftsmanship',
    'default': 'You have a diverse musical taste that spans multiple styles and moods'
  };

  const key = traits.slice(0, 2).join('-');
  return descriptions[key] || descriptions.default;
}

function analyzeGenreDiversity(topArtists) {
  if (!topArtists.length) return null;

  const genres = new Set();
  const genreCount = {};

  topArtists.forEach(artist => {
    if (artist.genres) {
      artist.genres.forEach(genre => {
        genres.add(genre);
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      });
    }
  });

  const sortedGenres = Object.entries(genreCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  return {
    total_genres: genres.size,
    diversity_score: Math.min(100, genres.size * 5), // Max 100
    top_genres: sortedGenres.map(([genre, count]) => ({
      genre,
      frequency: count,
      percentage: Math.round((count / topArtists.length) * 100)
    })),
    genre_categories: categorizeGenres(Array.from(genres))
  };
}

function categorizeGenres(genres) {
  const categories = {
    electronic: ['electronic', 'edm', 'house', 'techno', 'dubstep', 'ambient'],
    rock: ['rock', 'alternative', 'indie', 'punk', 'metal', 'grunge'],
    pop: ['pop', 'dance pop', 'electropop', 'synth-pop', 'k-pop'],
    hip_hop: ['hip hop', 'rap', 'trap', 'drill', 'conscious hip hop'],
    jazz: ['jazz', 'smooth jazz', 'bebop', 'fusion', 'contemporary jazz'],
    classical: ['classical', 'orchestral', 'chamber music', 'opera', 'contemporary classical'],
    world: ['world', 'latin', 'reggae', 'afrobeat', 'bossa nova', 'flamenco'],
    folk: ['folk', 'country', 'bluegrass', 'americana', 'singer-songwriter']
  };

  const categorized = {};
  
  Object.entries(categories).forEach(([category, keywords]) => {
    const matchingGenres = genres.filter(genre => 
      keywords.some(keyword => genre.toLowerCase().includes(keyword))
    );
    if (matchingGenres.length > 0) {
      categorized[category] = matchingGenres;
    }
  });

  return categorized;
}

function analyzeListeningPatterns(recentlyPlayed) {
  if (!recentlyPlayed.length) return null;

  // Analyze listening times
  const hourCounts = {};
  const dayOfWeekCounts = {};

  recentlyPlayed.forEach(item => {
    if (item.played_at) {
      const date = new Date(item.played_at);
      const hour = date.getHours();
      const dayOfWeek = date.getDay();

      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      dayOfWeekCounts[dayOfWeek] = (dayOfWeekCounts[dayOfWeek] || 0) + 1;
    }
  });

  return {
    peak_listening_hours: Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour, count]) => ({
        hour: parseInt(hour),
        count,
        period: getPeriodName(parseInt(hour))
      })),
    listening_schedule: generateListeningSchedule(hourCounts),
    weekly_pattern: generateWeeklyPattern(dayOfWeekCounts)
  };
}

function getPeriodName(hour) {
  if (hour >= 6 && hour < 12) return 'Morning';
  if (hour >= 12 && hour < 17) return 'Afternoon';
  if (hour >= 17 && hour < 22) return 'Evening';
  return 'Night';
}

function generateListeningSchedule(hourCounts) {
  const periods = {
    morning: { hours: [6, 7, 8, 9, 10, 11], count: 0 },
    afternoon: { hours: [12, 13, 14, 15, 16], count: 0 },
    evening: { hours: [17, 18, 19, 20, 21], count: 0 },
    night: { hours: [22, 23, 0, 1, 2, 3, 4, 5], count: 0 }
  };

  Object.entries(hourCounts).forEach(([hour, count]) => {
    const h = parseInt(hour);
    Object.entries(periods).forEach(([period, data]) => {
      if (data.hours.includes(h)) {
        data.count += count;
      }
    });
  });

  const totalListens = Object.values(hourCounts).reduce((sum, count) => sum + count, 0);
  
  return Object.entries(periods).map(([period, data]) => ({
    period,
    percentage: Math.round((data.count / totalListens) * 100),
    description: getListeningDescription(period, data.count / totalListens)
  }));
}

function getListeningDescription(period, percentage) {
  const descriptions = {
    morning: percentage > 0.3 ? 'Morning music ritual' : 'Occasional morning listening',
    afternoon: percentage > 0.3 ? 'Afternoon soundtrack lover' : 'Light afternoon listening',
    evening: percentage > 0.3 ? 'Evening wind-down music' : 'Casual evening listening',
    night: percentage > 0.3 ? 'Night owl music explorer' : 'Occasional late-night sessions'
  };
  
  return descriptions[period];
}

function generateWeeklyPattern(dayOfWeekCounts) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const totalListens = Object.values(dayOfWeekCounts).reduce((sum, count) => sum + count, 0);
  
  return days.map((day, index) => ({
    day,
    count: dayOfWeekCounts[index] || 0,
    percentage: Math.round(((dayOfWeekCounts[index] || 0) / totalListens) * 100)
  }));
}

function extractCulturalIndicators(topArtists, topTracks) {
  const indicators = {
    cultural_diversity: analyzeCulturalDiversity(topArtists),
    language_diversity: analyzeLanguageDiversity(topTracks),
    era_preferences: analyzeEraPreferences(topTracks),
    mainstream_vs_indie: analyzeMainstreamVsIndie(topArtists)
  };

  return indicators;
}

function analyzeCulturalDiversity(topArtists) {
  // Mock analysis - in production would use real artist origin data
  const cultures = new Set();
  const mockCultures = ['American', 'British', 'Korean', 'Japanese', 'Latin', 'African', 'European', 'Indian'];
  
  topArtists.forEach(() => {
    // Randomly assign cultures for demo
    const culture = mockCultures[Math.floor(Math.random() * mockCultures.length)];
    cultures.add(culture);
  });

  return {
    total_cultures: cultures.size,
    diversity_score: Math.min(100, cultures.size * 12.5),
    represented_cultures: Array.from(cultures)
  };
}

function analyzeLanguageDiversity(topTracks) {
  // Mock analysis - in production would analyze track languages
  const languages = ['English', 'Spanish', 'Korean', 'Japanese', 'French'];
  const selectedLanguages = languages.slice(0, Math.floor(Math.random() * 3) + 1);
  
  return {
    languages: selectedLanguages,
    multilingual_score: selectedLanguages.length * 25
  };
}

function analyzeEraPreferences(topTracks) {
  // Mock analysis - in production would use release dates
  const eras = {
    '2020s': Math.floor(Math.random() * 40) + 30,
    '2010s': Math.floor(Math.random() * 30) + 20,
    '2000s': Math.floor(Math.random() * 20) + 10,
    '1990s': Math.floor(Math.random() * 15) + 5,
    'Earlier': Math.floor(Math.random() * 10) + 2
  };

  return Object.entries(eras).map(([era, percentage]) => ({
    era,
    percentage
  }));
}

function analyzeMainstreamVsIndie(topArtists) {
  // Mock analysis based on follower counts
  let mainstreamCount = 0;
  let indieCount = 0;

  topArtists.forEach(artist => {
    if (artist.followers && artist.followers.total > 1000000) {
      mainstreamCount++;
    } else {
      indieCount++;
    }
  });

  const total = mainstreamCount + indieCount;
  return {
    mainstream_percentage: Math.round((mainstreamCount / total) * 100),
    indie_percentage: Math.round((indieCount / total) * 100),
    taste_profile: mainstreamCount > indieCount ? 'Mainstream Explorer' : 'Indie Discoverer'
  };
}

function analyzeTasteEvolution(recentlyPlayed, topTracks) {
  // Compare recent listening to all-time favorites
  return {
    evolution_trend: 'Expanding horizons', // Mock analysis
    new_discoveries: Math.floor(Math.random() * 20) + 10,
    consistency_score: Math.floor(Math.random() * 30) + 70,
    exploration_rate: Math.floor(Math.random() * 40) + 30
  };
}

function analyzeSocialIndicators(playlists) {
  if (!playlists.length) return null;

  const publicPlaylists = playlists.filter(p => p.public).length;
  const collaborativePlaylists = playlists.filter(p => p.collaborative).length;

  return {
    total_playlists: playlists.length,
    public_playlists: publicPlaylists,
    collaborative_playlists: collaborativePlaylists,
    sharing_tendency: publicPlaylists > playlists.length * 0.3 ? 'High' : 'Low',
    social_music_score: Math.round(((publicPlaylists + collaborativePlaylists) / playlists.length) * 100)
  };
}

// Generate cross-domain recommendations based on music taste
function generateCrossDomainRecommendations(musicTaste) {
  const recommendations = {
    food: generateFoodRecommendations(musicTaste),
    travel: generateTravelRecommendations(musicTaste),
    books: generateBookRecommendations(musicTaste)
  };

  return recommendations;
}

function generateFoodRecommendations(musicTaste) {
  const recommendations = [];
  
  // Based on energy level
  if (musicTaste.music_personality?.energy_level.level === 'high') {
    recommendations.push({
      name: 'Spicy Korean BBQ',
      description: 'High-energy flavors that match your energetic music taste',
      match: 92,
      reasoning: 'Your love for high-energy music suggests you enjoy bold, intense flavors'
    });
  }

  // Based on cultural diversity
  if (musicTaste.cultural_indicators?.cultural_diversity.diversity_score > 60) {
    recommendations.push({
      name: 'Fusion Cuisine Experience',
      description: 'Multi-cultural dining that reflects your diverse music taste',
      match: 88,
      reasoning: 'Your culturally diverse music taste indicates openness to fusion flavors'
    });
  }

  return recommendations;
}

function generateTravelRecommendations(musicTaste) {
  const recommendations = [];
  
  // Based on genre preferences
  const topGenres = musicTaste.genre_diversity?.top_genres || [];
  
  if (topGenres.some(g => g.genre.includes('electronic'))) {
    recommendations.push({
      name: 'Berlin Electronic Music Scene',
      description: 'Explore the birthplace of electronic music culture',
      match: 94,
      reasoning: 'Your electronic music taste aligns with Berlin\'s legendary club scene'
    });
  }

  return recommendations;
}

function generateBookRecommendations(musicTaste) {
  const recommendations = [];
  
  // Based on mood preferences
  if (musicTaste.music_personality?.mood_preference.level === 'low') {
    recommendations.push({
      name: 'Norwegian Wood by Haruki Murakami',
      description: 'Melancholic literary fiction that matches your introspective music taste',
      match: 90,
      reasoning: 'Your preference for melancholic music suggests you\'d appreciate contemplative literature'
    });
  }

  return recommendations;
}

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
    const { spotify_data } = JSON.parse(event.body);

    if (!spotify_data) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing Spotify data" })
      };
    }

    console.log('[SpotifyTasteProfile] Analyzing Spotify data...');

    // Analyze Spotify taste profile
    const tasteProfile = analyzeSpotifyTaste(spotify_data);
    
    // Generate cross-domain recommendations
    const crossDomainRecs = generateCrossDomainRecommendations(tasteProfile);
    
    const response = {
      music_taste_profile: tasteProfile,
      cross_domain_recommendations: crossDomainRecs,
      spotify_integration: {
        tracks_analyzed: spotify_data.top_tracks?.length || 0,
        artists_analyzed: spotify_data.top_artists?.length || 0,
        audio_features_analyzed: spotify_data.audio_features?.length || 0
      },
      metadata: {
        timestamp: new Date().toISOString(),
        algorithm: 'spotify-taste-v1',
        data_source: 'spotify_web_api'
      }
    };

    console.log(`[SpotifyTasteProfile] Analyzed ${spotify_data.top_tracks?.length || 0} tracks`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error('[SpotifyTasteProfile] Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        message: 'Failed to analyze Spotify taste profile'
      })
    };
  }
};