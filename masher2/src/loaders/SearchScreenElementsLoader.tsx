import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from 'expo-image'
import React from "react";

import ContentLoader, { Rect, Circle } from "react-content-loader/native";
import { lightenHexColor } from "../utilities/lightenHexColor";
import { useAppTheme } from "../ThemeContext";

export default function SearchScreenElementsLoader() {
  const { colors, isDark } = useAppTheme();
  const ContentLoaderElems = () => {
    return (
      <ContentLoader
        height={100}
        width={"95%"}
        speed={1}
        // backgroundColor={"#e3e3e3"}
                backgroundColor={ !isDark ? "#e3e3e3" :lightenHexColor(colors.background, 0.5)}
        
        foregroundColor={"white"}
        viewBox="0 0 380 95"
      >
        <Circle cx="30" cy="25" r="25" />
        <Rect x="80" y="17" rx="" ry="4" width="70%" height="15" />
        <Rect x="80" y="40" rx="3" ry="3" width="50" height="10" />
      </ContentLoader>
    );
  };

  return (
    <View style={styles.container}>
      <ContentLoaderElems />
      <ContentLoaderElems />
      <ContentLoaderElems />
      <ContentLoaderElems />
      <ContentLoaderElems />
      <ContentLoaderElems />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
});
