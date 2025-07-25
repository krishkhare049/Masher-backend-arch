import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useAppTheme } from "../ThemeContext";

export default function NoNotifications() {
    const {isDark, colors} = useAppTheme();
  
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        marginVertical: 150,
      }}
    >
      <Text
        style={{ fontSize: 20, fontFamily: "Dosis_600SemiBold", marginTop: 20, color: colors.text }}
      >
        No Notifications
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
