import { View, Text, StyleSheet } from "react-native";
export default function Header() {
  return (
    <View style={styles.header}>
      <Text>App for all your "TODO" needs!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    width: "100%",
    paddingBottom: 15,
    alignItems: "center",
    gap: 10,
  },
});
