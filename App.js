import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
} from "react-native";
import Header from "./components/Header";
import Todos from "./components/Todos";
import Footer from "./components/Footer";

export default function App() {
 
  return (
    <View style={styles.container}>
      <Header/>
      <Todos/>
      <Footer/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingBottom: 25,
    backgroundColor: "#888",
    alignItems: "center",
  },
  scroll: {
    width: "100%",
  },
 
 
 
});
