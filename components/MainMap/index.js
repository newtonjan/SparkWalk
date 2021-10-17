import React from "react";
import MapView from "react-native-maps";
import styles from "./styles.js";

const MainMap = (props) => {
  const { region } = props;
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
