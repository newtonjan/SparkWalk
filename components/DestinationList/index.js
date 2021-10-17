import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import styles from "./styles.js";

const DestinationList = (props) => {
  const destinations = [
    {
      id: 0,
      latitude: 43.64252041015123,
      longitude: -79.46687609655802,
      name: "High Park",
      description: "See some trees",
    },
    {
      id: 1,
      latitude: 43.66445135945543,
      longitude: -79.39942208809704,
      name: "Robarts Library",
      description: "Stay up all night",
    },
    {
      id: 2,
      latitude: 43.67799144407594,
      longitude: -79.409750566712,
      name: "Casa Loma",
      description: "Fancy house",
    },
  ];

  const buttonColors = ["#F5C151", "#F38D2C", "#F3722C"];

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>Choose a Mystery Walk!</Text>
      {destinations.map((dest) => {
        return (
          <TouchableOpacity
            key={dest.id}
            style={[styles.button, { backgroundColor: buttonColors[dest.id] }]}
            onPress={() => props.setDest(dest)}
          >
            <Text style={styles.buttonText}>{dest.description}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default DestinationList;
