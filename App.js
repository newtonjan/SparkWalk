import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import * as geolib from "geolib";

export default function App() {
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
  const [destination, setDestination] = useState(destinations[0]);
  const [distance, setDistance] = useState(null);
  const [location, setLocation] = useState(null);
  const [arrived, setArrived] = useState(null);
  const [region, setRegion] = useState({
    latitude: 43.66872,
    longitude: -79.39516,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const [subscription, setSubscription] = useState(null);

  const [distanceText, setDistanceText] = useState("unknown");
  const [locationText, setLocationText] = useState("unknown");
  const [direction, setDirection] = useState("unknown");

  // Get permission and watch location
  useEffect(() => {
    const getPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      } else {
        await watchPosition();
      }
    };
    getPermission();
  }, []);

  // Subscribe to position updates
  const watchPosition = async () => {
    const subscriptionID = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 0,
      },
      (location) => {
        updateLocation(location);
        setSubscription(subscriptionID);
      }
    );
  };

  // Set location and location text
  const updateLocation = (newLocation) => {
    setLocation(newLocation);
    setLocationText(
      `(${newLocation.coords.latitude.toFixed(
        4
      )}, ${newLocation.coords.longitude.toFixed(4)})`
    );
  };

  // Update map region
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

  // Determine distance from destination
  useEffect(() => {
    if (location != null) {
      const dis = geolib.getPreciseDistance(
        { latitude: destination.latitude, longitude: destination.longitude },
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }
      );
      setDistance(dis);
      setDistanceText(`${dis}m`);
    }
  }, [location, destination]);

  // If near destination, reward user
  useEffect(() => {
    if (distance != null) {
      if (distance < 50) {
        setArrived(true);
      } else {
        setArrived(false);
      }
    }
  }, [location, distance, destination]);

  // Set destination
  const setDest = (destNum) => {
    setDestination(destinations[destNum]);
    watchPosition();
  };

  // Set compass direction
  useEffect(() => {
    if (location != null) {
      const newDirection = geolib.getCompassDirection(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        { latitude: destination.latitude, longitude: destination.longitude }
      );
      setDirection(newDirection);
    }
  }, [distance]);

  // Turn on cheat mode
  const cheatMode = async () => {
    await subscription.remove();
    const newLocation = location;
    newLocation.coords.latitude = destination.latitude;
    newLocation.coords.longitude = destination.longitude;

    updateLocation(newLocation);
    setRegion({
      latitude: destination.latitude,
      longitude: destination.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });

    setDistance(0);
    setDistanceText("0m");
  };

  return (
    <View style={styles.container}>
      <Text> Choose a mystery destination: </Text>
      <Button title={destinations[0].description} onPress={() => setDest(0)} />
      <Button title={destinations[1].description} onPress={() => setDest(1)} />
      <Button title={destinations[2].description} onPress={() => setDest(2)} />

      <MapView
        showsUserLocation={true}
        style={styles.map}
        provider={MapView.PROVIDER_GOOGLE}
        region={region}
      />
      <Text>Current location is {locationText}</Text>
      <Text>Distance from destination is {distanceText} </Text>
      <Text>{arrived ? "" : `Direction: ${direction}`}</Text>
      <Text>{arrived ? `Welcome to ${destination.name}!` : ""}</Text>
      <Button title="Cheat" onPress={cheatMode} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  map: {
    width: "60%",
    height: "40%",
  },
});
