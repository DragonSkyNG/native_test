import { View,Text,StyleSheet } from "react-native";
export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={{ textAlign: "center" }}>Footer section</Text>
    </View>
  );
}

const styles= StyleSheet.create({
    footer: {
        borderTopColor: "#fff",
        borderTopWidth: 1,
        width: "100%",
        paddingTop: 15,
      },
})