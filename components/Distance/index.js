import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import * as geolib from "geolib";
import styles from "./styles.js";

const Distance = (props) => {
  const { destination, location, distance } = props;
  const [walkingTime, setWalkingTime] = useState(0);

  // Update distance from destination when location or destination change
  useEffect(() => {
    if (location != null && destination != null) {
      // Calcualte distance
      const dis = geolib.getPreciseDistance(
        { latitude: destination.latitude, longitude: destination.longitude },
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }
      );

      //Update distance state in parent
      props.updateDistanceHandler(dis);

      // Update walking time
      const newWalkingTime = Math.round(distance / 84);
      setWalkingTime(newWalkingTime);
    }
  }, [location, destination]);

  return (
    <View>
      <Text>You're about {walkingTime} minutes away!</Text>
    </View>
  );
};

export default Distance;
