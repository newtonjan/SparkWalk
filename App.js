import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import * as Location from "expo-location";
import * as geolib from "geolib";
import DestinationList from "./components/DestinationList/";
import MainMap from "./components/MainMap/";
import HintBox from "./components/HintBox/";

export default function App() {
  const [destination, setDestination] = useState(null);
  const [distance, setDistance] = useState(null);
  const [location, setLocation] = useState(null);
  const [arrived, setArrived] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [locationText, setLocationText] = useState("unknown");

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

  // Update distance from destination when location or destination change
  useEffect(() => {
    if (location != null && destination != null) {
      // Calculate distance
      const dis = geolib.getPreciseDistance(
        { latitude: destination.latitude, longitude: destination.longitude },
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }
      );

      // Update distance
      setDistance(dis);
    }
  }, [location, destination]);

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
      setArrived(true);
    }
  };

  return (
    <View style={styles.container}>
      <DestinationList setDest={setDest} />
      <MainMap location={location} />
      <Text>Current location is {locationText}</Text>
      <HintBox
        destination={destination}
        location={location}
        distance={distance}
        arrived={arrived}
      />
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
