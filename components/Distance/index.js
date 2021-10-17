import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import * as geolib from "geolib";
import styles from "./styles.js";

const Distance = (props) => {
  const { distance } = props;
  const [walkingTime, setWalkingTime] = useState(0);

  // Update walking time when distance changes
  useEffect(() => {
    if (distance != null) {
      const newWalkingTime = Math.round(distance / 84);
      setWalkingTime(newWalkingTime);
    }
  }, [distance]);

  return (
    <View>
      <Text>You're about {walkingTime} minutes away!</Text>
    </View>
  );
};

export default Distance;
