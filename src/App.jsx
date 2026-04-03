import { useEffect, useRef } from 'react';
import { Viewer, Ion, Cartesian3, Cartesian2, Color, PointGraphics, Entity, LabelGraphics } from 'cesium';
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
 * Add news data as Point entities to the Cesium viewer
 * @param {Viewer} viewer - Cesium Viewer instance
 * @param {Object} geoJsonData - GeoJSON FeatureCollection
 */
function addNewsPointsToViewer(viewer, geoJsonData) {
  if (!geoJsonData.features || geoJsonData.features.length === 0) {
    console.warn('No features in GeoJSON data');
    return;
  }

  geoJsonData.features.forEach((feature) => {
    const { geometry, properties } = feature;
    
    if (geometry.type !== 'Point') {
      console.warn('Skipping non-Point geometry');
      return;
    }

    const [longitude, latitude] = geometry.coordinates;
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

      return () => {
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
