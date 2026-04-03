import axios from 'axios';

// --- CONFIGURATION ---
// IMPORTANT: Replace with your actual NewsAPI.org API key
const NEWS_API_KEY = '2435d3fe189546218e1e5499510da09a';
const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

/**
 * Geocodes a location string (e.g., "New York", "BBC News") into coordinates.
 * @param {string} location The location string to geocode.
 * @returns {Promise<object|null>} A promise that resolves to a coordinates object or null.
 */
async function getCoordinatesForLocation(location) {
  if (!location) return null;

  try {
    // This is a free, public API. Be mindful of rate limits.
    const response = await axios.get(NOMINATIM_URL, {
      params: {
        q: location,
        format: 'json',
        limit: 1,
      },
      headers: {
        'User-Agent': '3DGlobeNewsApp/1.0 (your-email@example.com)' // Recommended by Nominatim
      }
    });

    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      };
    }
    return null; // No coordinates found for the location
  } catch (error) {
    console.error(`Error geocoding location "${location}":`, error.message);
    return null;
  }
}

/**
 * Fetches top headlines for a country, geocodes their source, and formats them.
 * @param {string} country The two-letter ISO 3166-1 code for the country (e.g., 'us', 'gb').
 * @returns {Promise<Array>} A promise that resolves to an array of news articles in GeoJSON format.
 */
export async function fetchAndProcessNews(country = 'us') {
  try {
    const newsResponse = await axios.get(NEWS_API_URL, {
      params: {
        country,
        apiKey: NEWS_API_KEY,
      },
    });

    const articles = newsResponse.data.articles;
    const processedNews = [];

    for (const article of articles) {
      // Assumption: The `source.name` might be a geocodable location.
      // This is often not the case, but it's the best available field from this API.
      // For example, "CNN" won't geocode, but "New York Times" might.
      const locationString = article.source.name;
      const coordinates = await getCoordinatesForLocation(locationString);

      if (coordinates) {
        processedNews.push({
          id: article.url, // URL is a good unique ID
          headline: article.title,
          summary: article.description || 'No summary available.',
          sourceUrl: article.url,
          imageUrl: article.urlToImage || 'https://example.com/images/default.jpg',
          coordinates,
        });
      }
    }

    return processedNews;
  } catch (error) {
    console.error(`Error fetching news for ${country}:`, error.message);
    return [];
  }
}

// Example of how to run this script with Node.js
// To run: node src/services/newsApi.js
if (typeof require !== 'undefined' && require.main === module) {
  (async () => {
    console.log("Fetching and processing news for the US...");
    const newsData = await fetchAndProcessNews('us');
    console.log(JSON.stringify(newsData, null, 2));

    console.log("\nFetching and processing news for Great Britain...");
    const gbNewsData = await fetchAndProcessNews('gb');
    console.log(JSON.stringify(gbNewsData, null, 2));
  })();
}
