import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import * as geolib from "geolib";
import styles from "./styles.js";

const Direction = (props) => {
  const [direction, setDirection] = useState("unknown");
  const { destination, location, distance } = props;

  // Set compass direction when distance, location, or destination change
  useEffect(() => {
    if (location != null && destination != null) {
      const newDirection = geolib.getCompassDirection(
        {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        { latitude: destination.latitude, longitude: destination.longitude }
      );
      setDirection(newDirection);
    }
  }, [distance, location, destination]);

  return (
    <View>
      <Text>Direction: {direction}</Text>
    </View>
  );
};

export default Direction;
