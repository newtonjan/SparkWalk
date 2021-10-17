import React, { useState, useEffect } from "react";
import MapView from "react-native-maps";
import styles from "./styles.js";

const MainMap = (props) => {
  const { location } = props;

  const [region, setRegion] = useState({
    latitude: 43.66872,
    longitude: -79.39516,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  // Update map region when location changes
  useEffect(() => {
    if (location != null) {
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  }, [location]);

  return (
    <MapView
      showsUserLocation={true}
      style={styles.map}
      provider={MapView.PROVIDER_GOOGLE}
      region={region}
    />
  );
};

export default MainMap;
