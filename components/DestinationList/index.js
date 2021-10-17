import React from "react";
import { Text, View, Button } from "react-native";

const DestinationList = (props) => {
  const destinations = [
    {
      latitude: 43.64252041015123,
      longitude: -79.46687609655802,
      name: "High Park",
      description: "See some trees",
    },
    {
      latitude: 43.66445135945543,
      longitude: -79.39942208809704,
      name: "Robarts Library",
      description: "Stay up all night",
    },
    {
      latitude: 43.67799144407594,
      longitude: -79.409750566712,
      name: "Casa Loma",
      description: "Fancy house",
    },
  ];
  return (
    <View>
      <Text> Choose a mystery destination: </Text>
      <Button
        title={destinations[0].description}
        onPress={() => props.setDest(destinations[0])}
      />
      <Button
        title={destinations[1].description}
        onPress={() => props.setDest(destinations[1])}
      />
      <Button
        title={destinations[2].description}
        onPress={() => props.setDest(destinations[2])}
      />
    </View>
  );
};

export default DestinationList;
