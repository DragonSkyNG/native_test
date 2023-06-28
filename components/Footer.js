import { View, Text, StyleSheet } from "react-native";
export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={{ textAlign: "center" }}>Copyright © 2023 There are none.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    borderTopColor: "#000",
    borderTopWidth: 1,
    width: "100%",
    paddingTop: 15,
  },
});
