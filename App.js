import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import * as Location from "expo-location";
import * as geolib from "geolib";
import DestinationList from "./components/DestinationList/";
import MainMap from "./components/MainMap/";
import Direction from "./components/Direction/";
import Distance from "./components/Distance/";

export default function App() {
  const [destination, setDestination] = useState(null);
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

  const [locationText, setLocationText] = useState("unknown");
  const [cheating, setCheating] = useState(false);

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

  // Check if arrived when location, distance, or destination change
  useEffect(() => {
    if (distance != null && location != null && destination != null) {
      if (distance < 50) {
        setArrived(true);
      } else {
        setArrived(false);
      }
    }
  }, [location, distance, destination]);

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

  const updateDistance = (newDistance) => {
    setDistance(newDistance);
  };

  // Set destination
  const setDest = (newDestination) => {
    setDestination(newDestination);
    watchPosition();
  };

  // Turn on cheat mode
  const cheatMode = async () => {
    if (destination != null) {
      // Unsubscribe from position updates
      await subscription.remove();

      // Spoof location
      const newLocation = location;
      newLocation.coords.latitude = destination.latitude;
      newLocation.coords.longitude = destination.longitude;
      updateLocation(newLocation);

      // Update map and distance
      setRegion({
        latitude: destination.latitude,
        longitude: destination.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

      setDistance(0);
    }
  };

  return (
    <View style={styles.container}>
      <DestinationList setDest={setDest} />
      <MainMap region={region} />
      <Text>Current location is {locationText}</Text>

      <Distance
        location={location}
        destination={destination}
        distance={distance}
        updateDistanceHandler={updateDistance}
      />
      <Direction
        destination={destination}
        location={location}
        distance={distance}
      />

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
});
