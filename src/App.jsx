import { useEffect, useRef } from 'react';
import { Viewer, Ion } from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import './App.css';

// Your Cesium Ion access token
const CESIUM_ION_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZTk1YzBkOC1mZTNmLTQ2YTgtOTY2OC1lMTY4M2NkMGM0NWQiLCJpZCI6NDEzNDAyLCJpYXQiOjE3NzUyMzE5Mjd9.h1Q82J0rybeTjLEdSZS-o3rReaz3AbH18ZQOUdyIJAY';

function App() {
  const cesiumContainer = useRef(null);

  useEffect(() => {
    if (cesiumContainer.current) {
      Ion.defaultAccessToken = CESIUM_ION_TOKEN;
      const viewer = new Viewer(cesiumContainer.current, {
        terrainProvider: false,
      });
    }
  }, []);

  return (
    <div className="App">
      <div ref={cesiumContainer} className="cesium-container" />
    </div>
  );
}

export default App;
