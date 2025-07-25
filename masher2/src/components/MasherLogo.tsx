import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";

import React from "react";

export default function MasherLogo() {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 0,
        marginLeft: 10,
      }}
    >
      <Image
        style={{ width: 50, height: 50 }}
        // source={require("../../assets/icons/smileIcon.jpg")}
        source={require("../../assets/icons/smileIconTransparent.png")}
      />
      <Text
        style={{
          fontSize: 25,
          fontWeight: 600,
          color: "white",
          // marginLeft: 20,
          fontFamily: "Dosis_700Bold",
        }}
      >
        {/* Chats */}
        Masher
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
