// Generative Taste Art - AI-created visual representations of taste
const fetch = require('node-fetch');

// Art generation algorithms
const ART_ALGORITHMS = {
  'dna_helix': {
    name: 'Cultural DNA Helix',
    description: 'Spiral visualization representing taste evolution',
    complexity: 'high',
    colors: 'gradient',
    style: 'organic'
  },
  'taste_mandala': {
    name: 'Taste Mandala',
    description: 'Circular pattern reflecting taste harmony',
    complexity: 'medium',
    colors: 'harmonic',
    style: 'geometric'
  },
  'cultural_constellation': {
    name: 'Cultural Constellation',
    description: 'Star map of cultural connections',
    complexity: 'high',
    colors: 'cosmic',
    style: 'abstract'
  },
  'flavor_waves': {
    name: 'Flavor Waves',
    description: 'Flowing patterns representing taste dynamics',
    complexity: 'medium',
    colors: 'flowing',
    style: 'fluid'
  },
  'heritage_tree': {
    name: 'Heritage Tree',
    description: 'Branching structure showing cultural roots',
    complexity: 'high',
    colors: 'natural',
    style: 'organic'
  }
};

// Color palettes based on taste characteristics
const COLOR_PALETTES = {
  traditional: {
    primary: ['#8B4513', '#CD853F', '#DEB887', '#F5DEB3'],
    accent: ['#A0522D', '#D2691E'],
    description: 'Warm earth tones representing heritage'
  },
  experimental: {
    primary: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
    accent: ['#FECA57', '#FF9FF3'],
    description: 'Vibrant colors representing innovation'
  },
  sophisticated: {
    primary: ['#2C3E50', '#34495E', '#7F8C8D', '#BDC3C7'],
    accent: ['#E74C3C', '#F39C12'],
    description: 'Elegant grays with refined accents'
  },
  energetic: {
    primary: ['#FF5722', '#FF9800', '#FFC107', '#FFEB3B'],
    accent: ['#E91E63', '#9C27B0'],
    description: 'High-energy warm colors'
  },
  peaceful: {
    primary: ['#E8F5E8', '#C8E6C9', '#A5D6A7', '#81C784'],
    accent: ['#66BB6A', '#4CAF50'],
    description: 'Calming greens and soft tones'
  },
  cosmic: {
    primary: ['#1A1A2E', '#16213E', '#0F3460', '#533483'],
    accent: ['#E94560', '#F5F5F5'],
    description: 'Deep space colors with bright accents'
  }
};

// Generate SVG art based on taste profile
function generateTasteArt(tasteProfile, algorithm = 'dna_helix', options = {}) {
  const artConfig = ART_ALGORITHMS[algorithm];
  const palette = selectColorPalette(tasteProfile);
  
  const artData = {
    algorithm: artConfig,
    palette,
    dimensions: options.dimensions || { width: 800, height: 600 },
    elements: generateArtElements(tasteProfile, algorithm, palette),
    metadata: {
      generated_at: new Date().toISOString(),
      taste_signature: generateTasteSignature(tasteProfile),
      artistic_style: artConfig.style,
      complexity_level: artConfig.complexity
    }
  };

  const svg = renderSVGArt(artData);
  
  return {
    svg_code: svg,
    art_data: artData,
    download_formats: ['svg', 'png', 'jpg'],
    sharing_text: generateSharingText(tasteProfile, artConfig),
    art_interpretation: interpretArt(tasteProfile, artData)
  };
}

function selectColorPalette(tasteProfile) {
  // Analyze taste profile to select appropriate palette
  const characteristics = analyzeTasteCharacteristics(tasteProfile);
  
  if (characteristics.traditional > 0.7) return COLOR_PALETTES.traditional;
  if (characteristics.experimental > 0.7) return COLOR_PALETTES.experimental;
  if (characteristics.sophisticated > 0.7) return COLOR_PALETTES.sophisticated;
  if (characteristics.energetic > 0.7) return COLOR_PALETTES.energetic;
  if (characteristics.peaceful > 0.7) return COLOR_PALETTES.peaceful;
  
  return COLOR_PALETTES.cosmic; // Default
}

function analyzeTasteCharacteristics(tasteProfile) {
  const characteristics = {
    traditional: 0,
    experimental: 0,
    sophisticated: 0,
    energetic: 0,
    peaceful: 0
  };

  // Analyze recommendations for characteristics
  Object.values(tasteProfile.recommendations || {}).forEach(category => {
    if (Array.isArray(category)) {
      category.forEach(item => {
        const text = `${item.name} ${item.description}`.toLowerCase();
        
        // Traditional indicators
        if (text.includes('classic') || text.includes('traditional') || text.includes('heritage')) {
          characteristics.traditional += 0.2;
        }
        
        // Experimental indicators
        if (text.includes('experimental') || text.includes('fusion') || text.includes('innovative')) {
          characteristics.experimental += 0.2;
        }
        
        // Sophisticated indicators
        if (text.includes('refined') || text.includes('elegant') || text.includes('sophisticated')) {
          characteristics.sophisticated += 0.2;
        }
        
        // Energetic indicators
        if (text.includes('energetic') || text.includes('vibrant') || text.includes('dynamic')) {
          characteristics.energetic += 0.2;
        }
        
        // Peaceful indicators
        if (text.includes('calm') || text.includes('peaceful') || text.includes('serene')) {
          characteristics.peaceful += 0.2;
        }
      });
    }
  });

  // Normalize values
  Object.keys(characteristics).forEach(key => {
    characteristics[key] = Math.min(1, characteristics[key]);
  });

  return characteristics;
}

function generateArtElements(tasteProfile, algorithm, palette) {
  const elements = [];
  
  switch (algorithm) {
    case 'dna_helix':
      elements.push(...generateDNAHelixElements(tasteProfile, palette));
      break;
    case 'taste_mandala':
      elements.push(...generateMandalaElements(tasteProfile, palette));
      break;
    case 'cultural_constellation':
      elements.push(...generateConstellationElements(tasteProfile, palette));
      break;
    case 'flavor_waves':
      elements.push(...generateWaveElements(tasteProfile, palette));
      break;
    case 'heritage_tree':
      elements.push(...generateTreeElements(tasteProfile, palette));
      break;
  }

  return elements;
}

function generateDNAHelixElements(tasteProfile, palette) {
  const elements = [];
  const categories = Object.keys(tasteProfile.recommendations || {});
  
  // Generate helix structure
  for (let i = 0; i < 100; i++) {
    const angle = (i / 100) * Math.PI * 8; // 4 full rotations
    const y = i * 5;
    const radius = 50 + Math.sin(angle * 0.5) * 20;
    
    const x1 = 400 + Math.cos(angle) * radius;
    const x2 = 400 + Math.cos(angle + Math.PI) * radius;
    
    // Color based on category
    const categoryIndex = i % categories.length;
    const color = palette.primary[categoryIndex % palette.primary.length];
    
    elements.push({
      type: 'circle',
      x: x1,
      y: y + 50,
      radius: 3 + Math.sin(angle) * 2,
      fill: color,
      opacity: 0.8
    });
    
    elements.push({
      type: 'circle',
      x: x2,
      y: y + 50,
      radius: 3 + Math.cos(angle) * 2,
      fill: color,
      opacity: 0.8
    });
    
    // Connection lines
    if (i % 10 === 0) {
      elements.push({
        type: 'line',
        x1: x1,
        y1: y + 50,
        x2: x2,
        y2: y + 50,
        stroke: palette.accent[0],
        strokeWidth: 1,
        opacity: 0.4
      });
    }
  }

  return elements;
}

function generateMandalaElements(tasteProfile, palette) {
  const elements = [];
  const centerX = 400;
  const centerY = 300;
  const categories = Object.keys(tasteProfile.recommendations || {});
  
  // Generate concentric circles
  for (let ring = 1; ring <= 5; ring++) {
    const radius = ring * 60;
    const pointsInRing = ring * 8;
    
    for (let i = 0; i < pointsInRing; i++) {
      const angle = (i / pointsInRing) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      const colorIndex = (ring + i) % palette.primary.length;
      const color = palette.primary[colorIndex];
      
      elements.push({
        type: 'circle',
        x: x,
        y: y,
        radius: 4 + ring,
        fill: color,
        opacity: 0.7
      });
      
      // Connecting lines to center
      if (ring === 1) {
        elements.push({
          type: 'line',
          x1: centerX,
          y1: centerY,
          x2: x,
          y2: y,
          stroke: palette.accent[0],
          strokeWidth: 1,
          opacity: 0.3
        });
      }
    }
  }

  return elements;
}

function generateConstellationElements(tasteProfile, palette) {
  const elements = [];
  const categories = Object.keys(tasteProfile.recommendations || {});
  
  // Generate star clusters for each category
  categories.forEach((category, categoryIndex) => {
    const clusterX = 200 + (categoryIndex % 3) * 200;
    const clusterY = 150 + Math.floor(categoryIndex / 3) * 200;
    const items = tasteProfile.recommendations[category] || [];
    
    items.forEach((item, itemIndex) => {
      const angle = (itemIndex / items.length) * Math.PI * 2;
      const distance = 50 + Math.random() * 80;
      
      const x = clusterX + Math.cos(angle) * distance;
      const y = clusterY + Math.sin(angle) * distance;
      
      const starSize = 2 + (item.match || 80) / 20;
      const color = palette.primary[categoryIndex % palette.primary.length];
      
      elements.push({
        type: 'star',
        x: x,
        y: y,
        size: starSize,
        fill: color,
        opacity: 0.9
      });
      
      // Connection lines between related items
      if (itemIndex > 0) {
        const prevAngle = ((itemIndex - 1) / items.length) * Math.PI * 2;
        const prevX = clusterX + Math.cos(prevAngle) * (50 + Math.random() * 80);
        const prevY = clusterY + Math.sin(prevAngle) * (50 + Math.random() * 80);
        
        elements.push({
          type: 'line',
          x1: x,
          y1: y,
          x2: prevX,
          y2: prevY,
          stroke: palette.accent[0],
          strokeWidth: 0.5,
          opacity: 0.4
        });
      }
    });
  });

  return elements;
}

function generateWaveElements(tasteProfile, palette) {
  const elements = [];
  const categories = Object.keys(tasteProfile.recommendations || {});
  
  categories.forEach((category, categoryIndex) => {
    const baseY = 100 + categoryIndex * 120;
    const color = palette.primary[categoryIndex % palette.primary.length];
    
    // Generate wave path
    let pathData = `M 0 ${baseY}`;
    
    for (let x = 0; x <= 800; x += 10) {
      const frequency = 0.02 + categoryIndex * 0.005;
      const amplitude = 30 + categoryIndex * 10;
      const y = baseY + Math.sin(x * frequency) * amplitude;
      pathData += ` L ${x} ${y}`;
    }
    
    elements.push({
      type: 'path',
      d: pathData,
      stroke: color,
      strokeWidth: 3,
      fill: 'none',
      opacity: 0.8
    });
    
    // Add flowing particles
    for (let i = 0; i < 20; i++) {
      const x = (i / 20) * 800;
      const frequency = 0.02 + categoryIndex * 0.005;
      const amplitude = 30 + categoryIndex * 10;
      const y = baseY + Math.sin(x * frequency) * amplitude;
      
      elements.push({
        type: 'circle',
        x: x,
        y: y,
        radius: 2 + Math.random() * 3,
        fill: color,
        opacity: 0.6
      });
    }
  });

  return elements;
}

function generateTreeElements(tasteProfile, palette) {
  const elements = [];
  const trunkX = 400;
  const trunkY = 500;
  
  // Generate trunk
  elements.push({
    type: 'rect',
    x: trunkX - 15,
    y: trunkY - 100,
    width: 30,
    height: 100,
    fill: palette.primary[0],
    opacity: 0.9
  });
  
  // Generate branches for each category
  const categories = Object.keys(tasteProfile.recommendations || {});
  
  categories.forEach((category, categoryIndex) => {
    const angle = (categoryIndex / categories.length) * Math.PI * 2 - Math.PI / 2;
    const branchLength = 80 + Math.random() * 40;
    
    const endX = trunkX + Math.cos(angle) * branchLength;
    const endY = trunkY - 50 + Math.sin(angle) * branchLength;
    
    elements.push({
      type: 'line',
      x1: trunkX,
      y1: trunkY - 50,
      x2: endX,
      y2: endY,
      stroke: palette.primary[1],
      strokeWidth: 5,
      opacity: 0.8
    });
    
    // Add leaves (recommendations)
    const items = tasteProfile.recommendations[category] || [];
    items.forEach((item, itemIndex) => {
      const leafAngle = angle + (itemIndex - items.length / 2) * 0.3;
      const leafDistance = branchLength + 20;
      
      const leafX = trunkX + Math.cos(leafAngle) * leafDistance;
      const leafY = trunkY - 50 + Math.sin(leafAngle) * leafDistance;
      
      const leafColor = palette.primary[(categoryIndex + 2) % palette.primary.length];
      
      elements.push({
        type: 'ellipse',
        cx: leafX,
        cy: leafY,
        rx: 8,
        ry: 12,
        fill: leafColor,
        opacity: 0.7,
        transform: `rotate(${leafAngle * 180 / Math.PI} ${leafX} ${leafY})`
      });
    });
  });

  return elements;
}

function renderSVGArt(artData) {
  const { dimensions, elements, palette } = artData;
  
  let svg = `<svg width="${dimensions.width}" height="${dimensions.height}" xmlns="http://www.w3.org/2000/svg">`;
  
  // Add gradient definitions
  svg += `<defs>`;
  palette.primary.forEach((color, index) => {
    svg += `<linearGradient id="grad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${palette.accent[0]};stop-opacity:0.8" />
    </linearGradient>`;
  });
  svg += `</defs>`;
  
  // Add background
  svg += `<rect width="100%" height="100%" fill="url(#grad0)" opacity="0.1"/>`;
  
  // Render elements
  elements.forEach(element => {
    switch (element.type) {
      case 'circle':
        svg += `<circle cx="${element.x}" cy="${element.y}" r="${element.radius}" 
                fill="${element.fill}" opacity="${element.opacity}"/>`;
        break;
      case 'line':
        svg += `<line x1="${element.x1}" y1="${element.y1}" x2="${element.x2}" y2="${element.y2}" 
                stroke="${element.stroke}" stroke-width="${element.strokeWidth}" opacity="${element.opacity}"/>`;
        break;
      case 'path':
        svg += `<path d="${element.d}" stroke="${element.stroke}" stroke-width="${element.strokeWidth}" 
                fill="${element.fill}" opacity="${element.opacity}"/>`;
        break;
      case 'rect':
        svg += `<rect x="${element.x}" y="${element.y}" width="${element.width}" height="${element.height}" 
                fill="${element.fill}" opacity="${element.opacity}"/>`;
        break;
      case 'ellipse':
        svg += `<ellipse cx="${element.cx}" cy="${element.cy}" rx="${element.rx}" ry="${element.ry}" 
                fill="${element.fill}" opacity="${element.opacity}" transform="${element.transform || ''}"/>`;
        break;
      case 'star':
        svg += generateStarSVG(element);
        break;
    }
  });
  
  svg += `</svg>`;
  return svg;
}

function generateStarSVG(element) {
  const { x, y, size, fill, opacity } = element;
  const points = [];
  
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5;
    const radius = i % 2 === 0 ? size : size / 2;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    points.push(`${px},${py}`);
  }
  
  return `<polygon points="${points.join(' ')}" fill="${fill}" opacity="${opacity}"/>`;
}

function generateTasteSignature(tasteProfile) {
  // Create a unique signature based on taste profile
  const categories = Object.keys(tasteProfile.recommendations || {});
  const signature = categories.map(cat => {
    const items = tasteProfile.recommendations[cat] || [];
    return items.length.toString(36);
  }).join('');
  
  return signature + Date.now().toString(36);
}

function generateSharingText(tasteProfile, artConfig) {
  return `🎨 I just created my unique ${artConfig.name} representing my cultural taste profile! Each element reflects my personal preferences across music, food, travel, and books. #TastePulse #CulturalDNA`;
}

function interpretArt(tasteProfile, artData) {
  const interpretation = {
    overall_meaning: `This ${artData.algorithm.name} represents your unique cultural identity`,
    color_meaning: `The ${artData.palette.description.toLowerCase()} reflect your taste characteristics`,
    element_meanings: [],
    artistic_insights: []
  };

  // Add specific interpretations based on algorithm
  switch (artData.algorithm.name) {
    case 'Cultural DNA Helix':
      interpretation.element_meanings.push('The spiral structure shows how your tastes evolve and interconnect');
      interpretation.element_meanings.push('Each color represents a different cultural category in your profile');
      break;
    case 'Taste Mandala':
      interpretation.element_meanings.push('The circular pattern represents harmony in your cultural preferences');
      interpretation.element_meanings.push('Concentric rings show the depth of your taste exploration');
      break;
  }

  interpretation.artistic_insights.push('Your art is as unique as your cultural fingerprint');
  interpretation.artistic_insights.push('The complexity reflects the sophistication of your taste profile');

  return interpretation;
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
    const { 
      taste_profile, 
      algorithm = 'dna_helix',
      options = {}
    } = JSON.parse(event.body);

    if (!taste_profile) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing taste profile data" })
      };
    }

    console.log('[GenerativeTasteArt] Creating art with', algorithm, 'algorithm');

    // Generate the art
    const artResult = generateTasteArt(taste_profile, algorithm, options);
    
    const response = {
      ...artResult,
      available_algorithms: Object.keys(ART_ALGORITHMS),
      color_palettes: Object.keys(COLOR_PALETTES),
      metadata: {
        timestamp: new Date().toISOString(),
        algorithm_used: algorithm,
        generation_version: 'generative-art-v1'
      }
    };

    console.log(`[GenerativeTasteArt] Generated ${algorithm} art with ${artResult.art_data.elements.length} elements`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error('[GenerativeTasteArt] Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        message: 'Failed to generate taste art'
      })
    };
  }
};