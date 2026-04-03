import { useEffect, useRef } from 'react';
import { Viewer, Ion, Cartesian3, Cartesian2, Color, PointGraphics, Entity, LabelGraphics, ScreenSpaceEventHandler, ScreenSpaceEventType } from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import './App.css';
import { mockNews } from './services/mockNews';

// Color mapping for news categories
const categoryColorMap = {
  Technology: Color.BLUE,
  Environment: Color.GREEN,
  Sports: Color.YELLOW,
  History: Color.ORANGE,
  Politics: Color.RED,
  Business: Color.PURPLE,
  Entertainment: Color.MAGENTA,
  Science: Color.CYAN,
};

/**
 * Get color for a given category
 * @param {string} category - News category
 * @returns {Color} Cesium Color object
 */
function getCategoryColor(category) {
  return categoryColorMap[category] || Color.WHITE;
}

/**
 * Detect and apply jitter to duplicate or very close coordinates
 * @param {Array<Array<number>>} coordinatesList - Array of [longitude, latitude] pairs
 * @param {number} toleranceDegrees - Distance threshold to consider coords as duplicates (default: 0.01 degrees ≈ 1km)
 * @returns {Array<Array<number>>} Jittered coordinates
 */
function jitterDuplicateCoordinates(coordinatesList, toleranceDegrees = 0.01) {
  const jittered = coordinatesList.map(coords => [...coords]);
  const maxJitter = toleranceDegrees * 0.5; // Max offset per coordinate
  
  for (let i = 0; i < jittered.length; i++) {
    for (let j = i + 1; j < jittered.length; j++) {
      const [lon1, lat1] = jittered[i];
      const [lon2, lat2] = jittered[j];
      
      // Calculate distance between coordinates
      const distance = Math.sqrt((lon1 - lon2) ** 2 + (lat1 - lat2) ** 2);
      
      if (distance < toleranceDegrees) {
        // Apply random jitter to the second coordinate
        jittered[j][0] += (Math.random() - 0.5) * maxJitter;
        jittered[j][1] += (Math.random() - 0.5) * maxJitter;
      }
    }
  }
  
  return jittered;
}

/**
 * Add news data as Point entities to the Cesium viewer
 * @param {Viewer} viewer - Cesium Viewer instance
 * @param {Object} geoJsonData - GeoJSON FeatureCollection
 */
function addNewsPointsToViewer(viewer, geoJsonData) {
  if (!geoJsonData.features || geoJsonData.features.length === 0) {
    console.warn('No features in GeoJSON data');
    return;
  }

  // Extract all coordinates for jitter detection
  const allCoordinates = geoJsonData.features.map(feature => 
    feature.geometry.coordinates
  );

  // Apply jitter to identical or very close coordinates
  const jitteredCoords = jitterDuplicateCoordinates(allCoordinates);

  geoJsonData.features.forEach((feature, index) => {
    const { geometry, properties } = feature;
    
    if (geometry.type !== 'Point') {
      console.warn('Skipping non-Point geometry');
      return;
    }

    // Use jittered coordinates instead of original
    const [longitude, latitude] = jitteredCoords[index];
    const { headline, summary, category, imageUrl } = properties;

    // Create point entity
    const pointColor = getCategoryColor(category);

    viewer.entities.add({
      position: Cartesian3.fromDegrees(longitude, latitude),
      point: new PointGraphics({
        pixelSize: 12,
        color: pointColor,
        outlineColor: Color.WHITE,
        outlineWidth: 2,
      }),
      label: new LabelGraphics({
        text: headline,
        font: '12px sans-serif',
        fillColor: Color.WHITE,
        showBackground: true,
        backgroundColor: Color.fromAlpha(Color.BLACK, 0.7),
        backgroundPadding: new Cartesian2(8, 4),
        pixelOffset: new Cartesian2(0, -20),
      }),
      description: `
        <div style="max-width: 300px;">
          <h3>${headline}</h3>
          <p><strong>Category:</strong> ${category}</p>
          <p>${summary}</p>
          ${imageUrl ? `<img src="${imageUrl}" style="width: 100%; margin-top: 10px;" />` : ''}
        </div>
      `,
      properties: {
        ...properties,
      },
    });
  });

  console.log(`Added ${geoJsonData.features.length} news entities to globe`);
}

// Your Cesium Ion access token
const CESIUM_ION_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZTk1YzBkOC1mZTNmLTQ2YTgtOTY2OC1lMTY4M2NkMGM0NWQiLCJpZCI6NDEzNDAyLCJpYXQiOjE3NzUyMzE5Mjd9.h1Q82J0rybeTjLEdSZS-o3rReaz3AbH18ZQOUdyIJAY';

function App() {
  const cesiumContainer = useRef(null);

  useEffect(() => {
    if (cesiumContainer.current) {
      Ion.defaultAccessToken = CESIUM_ION_TOKEN;
      
      // Create viewer with default imagery (Bing Maps via Ion)
      const viewer = new Viewer(cesiumContainer.current);

      viewer.camera.setView({
        destination: Cartesian3.fromDegrees(0, 20, 25000000),
      });

      // Add news data points to the globe
      addNewsPointsToViewer(viewer, mockNews);

      // Add click handler for news points
      let isAnimating = false;
      const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
      
      handler.setInputAction((click) => {
        // Prevent multiple clicks during animation
        if (isAnimating) return;

        const pickedObject = viewer.scene.pick(click.position);

        if (pickedObject && pickedObject.id && pickedObject.id.properties) {
          const newsData = pickedObject.id.properties;
          console.log('Clicked News Object:', {
            headline: newsData.headline,
            summary: newsData.summary,
            category: newsData.category,
            sourceUrl: newsData.sourceUrl,
            imageUrl: newsData.imageUrl,
            coordinates: [newsData.properties?.coordinates?.longitude || newsData.geometry?.coordinates[0], 
                         newsData.properties?.coordinates?.latitude || newsData.geometry?.coordinates[1]],
          });

          // Mark animation as in progress
          isAnimating = true;

          // Fly camera to clicked entity
          viewer.camera.flyTo({
            destination: pickedObject.id.position,
            duration: 1.5,
            offset: new Cartesian3(0, 0, 50000), // Zoom in 50km above
            complete: () => {
              // Re-enable interactions after animation completes
              isAnimating = false;
              viewer.scene.requestRender();
            },
          });
        }
      }, ScreenSpaceEventType.LEFT_CLICK);

      return () => {
        handler.destroy();
        if (!viewer.isDestroyed()) {
          viewer.destroy();
        }
      };
    }
    return undefined;
  }, []);

  return (
    <div className="App">
      <div ref={cesiumContainer} className="cesium-container" />
    </div>
  );
}

export default App;
