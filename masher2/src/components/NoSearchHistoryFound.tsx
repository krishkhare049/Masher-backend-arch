import { Text, View } from "react-native";
import React from "react";
import TabBarIcon from "./TabBarIcon";
import { Image } from "expo-image";
import { useAppTheme } from "../ThemeContext";

export default function NoSearchHistoryFound() {
  const { isDark } = useAppTheme();
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
        style={{ fontSize: 18, fontFamily: "Dosis_600SemiBold", marginTop: 20, color: isDark ? "#FFFFFF" : "#000000" }}
      >
        Search your friends, family...
      </Text>
      {/* or any images, videos or people suggestions */}
    </View>
  );
}
