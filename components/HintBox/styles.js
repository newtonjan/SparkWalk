import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  hintsContainer: {
    position: "absolute",
    top: 525,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  welcomeContainer: {
    position: "absolute",
    top: 520,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  choose: {
    color: "#fff",
    fontSize: 20,
  },
  welcome: {
    color: "#fff",
    fontSize: 30,
  },
  arrived: {
    color: "#fff",
    fontSize: 50,
    fontWeight: "bold",
  },
});

export default styles;
