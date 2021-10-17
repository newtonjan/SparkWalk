import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import styles from "./styles.js";
import Direction from "../Direction/";
import Distance from "../Distance/";
const HintBox = (props) => {
  const { destination, location, distance, arrived } = props;

  if (arrived) {
    return (
      <View>
        <Text>Welcome to {destination.name}!</Text>
      </View>
    );
  } else if (destination != null) {
    return (
      <View>
        <Distance distance={distance} />
        <Direction
          destination={destination}
          location={location}
          distance={distance}
        />
      </View>
    );
  } else {
    return <Text>Choose a destination!</Text>;
  }
};

export default HintBox;
