import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import styles from "./styles.js";
import Direction from "../Direction/";
import Distance from "../Distance/";
const HintBox = (props) => {
  const { destination, location, distance, arrived } = props;

  if (arrived) {
    return (
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcome}>Welcome to </Text>
        <Text style={styles.arrived}>{destination.name}!</Text>
      </View>
    );
  } else if (destination != null) {
    return (
      <View style={styles.hintsContainer}>
        <Direction
          destination={destination}
          location={location}
          distance={distance}
        />
        <Distance distance={distance} />
      </View>
    );
  } else {
    return (
      <View style={styles.welcomeContainer}>
        <Text style={styles.choose}>No destination selected</Text>
      </View>
    );
  }
};

export default HintBox;
