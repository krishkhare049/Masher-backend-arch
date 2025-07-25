import { Text, View } from "react-native";
import React from "react";
import TabBarIcon from "./TabBarIcon";
import { Image } from "expo-image";
import { useAppTheme } from "../ThemeContext";

export default function NoSearchesFound() {
  const { colors } = useAppTheme();
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
      {/* <TabBarIcon name="search" color="#000000" size={50} /> */}
      <Image
              style={{ width: 150, height: 100, borderRadius: 50 }}
              source={require("../../assets/icons/friends.jpg")}
              // placeholder={require("../../assets/icons/skeletonLoadingPlaceholder.gif")}
              placeholderContentFit="cover"
              contentFit="cover"
            />
      <Text
        style={{ fontSize: 17, fontFamily: "Dosis_500Medium", marginTop: 20, color: colors.text }}
      >
        {/* Not found! Try finding someone else... */}
        Try finding someone else...
      </Text>

      {/* or any images, videos or people suggestions */}
    </View>
  );
}
