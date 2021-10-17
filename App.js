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
  const [cheating, setCheating] = useState(false);

  // Get permission and watch location
  useEffect(() => {
    const getPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      } else {
        const newSubscription = await watchPosition();
        setSubscription(newSubscription);
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
          latitude: location.latitude,
          longitude: location.longitude,
        }
      );

      // Update distance
      setDistance(dis);
    }
  }, [location, destination, cheating]);

  // Subscribe to position updates
  const watchPosition = async () => {
    const newSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 0,
      },
      (location) => {
        updateLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    );
    return newSubscription;
  };

  // Set location and location text
  const updateLocation = (newLocation) => {
    setLocation(newLocation);
    setLocationText(
      `(${newLocation.latitude.toFixed(4)}, ${newLocation.longitude.toFixed(
        4
      )})`
    );
  };

  // Set destination
  const setDest = (newDestination) => {
    setCheating(false);
    setDestination(newDestination);
  };

  // Turn on cheat mode
  const cheatMode = () => {
    if (destination != null) {
      setCheating(true);

      // Unsubscribe from position updates
      subscription.remove();

      // Spoof location
      updateLocation({
        latitude: destination.latitude,
        longitude: destination.longitude,
      });

      // setArrived(true);
    }
  };

  return (
    <View style={styles.container}>
      <DestinationList setDest={setDest} />
      <MainMap location={cheating ? destination : location} />
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
