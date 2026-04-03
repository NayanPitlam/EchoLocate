import axios from 'axios';

// --- CONFIGURATION ---
const NEWS_API_KEY = '2435d3fe189546218e1e5499510da09a';
const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

/**
 * Geocodes a location string into coordinates using OpenStreetMap's Nominatim service.
 * @param {string} location The location string to geocode.
 * @returns {Promise<Array<number>|null>} A promise that resolves to [longitude, latitude] or null.
 */
async function geocodeLocation(location) {
  if (!location || location.trim() === '') return null;

  try {
    console.log(`Geocoding location: "${location}"`);

    const response = await axios.get(NOMINATIM_URL, {
      params: {
        q: location,
        format: 'json',
        limit: 1,
      },
      timeout: 5000 // 5 second timeout
    });

    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      const coordinates = [parseFloat(lon), parseFloat(lat)];
      console.log(`✓ Found coordinates for "${location}": [${coordinates[0]}, ${coordinates[1]}]`);
      return coordinates;
    }

    console.log(`✗ No coordinates found for "${location}"`);
    return null;
  } catch (error) {
    console.error(`Error geocoding "${location}":`, error.message);
    return null;
  }
}

/**
 * Fetches top headlines from NewsAPI.org and converts them to GeoJSON format.
 * @param {string} country The two-letter ISO 3166-1 code for the country (e.g., 'us', 'gb').
 * @param {number} maxArticles Maximum number of articles to process (default: 10).
 * @returns {Promise<Object>} A promise that resolves to a GeoJSON FeatureCollection.
 */
async function fetchNewsGeoJSON(country = 'us', maxArticles = 10) {
  try {
    console.log(`\n📡 Fetching top headlines for country: ${country.toUpperCase()}`);

    const response = await axios.get(NEWS_API_URL, {
      params: {
        country,
        apiKey: NEWS_API_KEY,
        pageSize: maxArticles
      },
      timeout: 10000 // 10 second timeout
    });

    const articles = response.data.articles;
    console.log(`📄 Retrieved ${articles.length} articles from NewsAPI`);

    const features = [];

    for (let i = 0; i < Math.min(articles.length, maxArticles); i++) {
      const article = articles[i];
      console.log(`\n📰 Processing article ${i + 1}/${Math.min(articles.length, maxArticles)}: "${article.title}"`);

      // Try to extract location from source name
      const locationString = article.source?.name || '';

      // Skip if no source name
      if (!locationString) {
        console.log(`⚠️  Skipping article - no source name`);
        continue;
      }

      const coordinates = await geocodeLocation(locationString);

      if (coordinates) {
        const feature = {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": coordinates
          },
          "properties": {
            "id": article.url,
            "headline": article.title || 'No title',
            "summary": article.description || 'No summary available',
            "sourceUrl": article.url,
            "imageUrl": article.urlToImage || 'https://example.com/images/default.jpg',
            "source": locationString,
            "publishedAt": article.publishedAt
          }
        };

        features.push(feature);
        console.log(`✅ Added article to GeoJSON: "${article.title}"`);
      } else {
        console.log(`⚠️  Skipping article - could not geocode "${locationString}"`);
      }

      // Small delay to be respectful to the geocoding API
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
    }

    const geoJsonData = {
      "type": "FeatureCollection",
      "features": features,
      "metadata": {
        "country": country,
        "totalArticles": articles.length,
        "geocodedArticles": features.length,
        "fetchedAt": new Date().toISOString()
      }
    };

    console.log(`\n🎯 Successfully processed ${features.length} articles with coordinates`);
    return geoJsonData;

  } catch (error) {
    console.error(`❌ Error fetching news for ${country}:`, error.message);
    return {
      "type": "FeatureCollection",
      "features": [],
      "metadata": {
        "country": country,
        "error": error.message,
        "fetchedAt": new Date().toISOString()
      }
    };
  }
}

// --- MAIN EXECUTION ---
async function main() {
  const args = process.argv.slice(2);
  const country = args[0] || 'us';
  const maxArticles = parseInt(args[1]) || 5;

  console.log('🌍 NewsAPI to GeoJSON Converter');
  console.log('================================');
  console.log(`Country: ${country.toUpperCase()}`);
  console.log(`Max articles: ${maxArticles}`);
  console.log('');

  try {
    const geoJsonData = await fetchNewsGeoJSON(country, maxArticles);

    // Output the GeoJSON data
    console.log('\n📤 Final GeoJSON Output:');
    console.log('========================');
    console.log(JSON.stringify(geoJsonData, null, 2));

    // Save to file option
    const fs = await import('fs');
    const filename = `news-${country}-${new Date().toISOString().split('T')[0]}.geojson`;
    fs.writeFileSync(filename, JSON.stringify(geoJsonData, null, 2));
    console.log(`\n💾 Saved to file: ${filename}`);

  } catch (error) {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  }
}

// Run the script if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { fetchNewsGeoJSON, geocodeLocation };