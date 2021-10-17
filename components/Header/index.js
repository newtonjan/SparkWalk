import React, { useState, useEffect } from "react";
import { Text, View, Image } from "react-native";
import styles from "./styles.js";

const Header = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../../assets/logo1.png")} />
      <Text style={styles.title}>SparkWalk</Text>
    </View>
  );
};

export default Header;
