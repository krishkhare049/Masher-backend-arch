import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";

import ContentLoader, { Rect, Circle } from "react-content-loader/native";
import { useAppTheme } from "../ThemeContext";
import { lightenHexColor } from "../utilities/lightenHexColor";

export default function MessageCardElementsLoader() {
  

  const {colors} = useAppTheme()
  const ContentLoaderElems = () => {
    return (
      <ContentLoader
        height={100}
        width={"95%"}
        speed={1}
        // style={{borderRadius: 100, backgroundColor: 'red'}}
        // backgroundColor={"#ffe494"}
        backgroundColor={lightenHexColor(colors.background, 0.5)}
        foregroundColor={"whitesmoke"}
        viewBox="0 0 380 70"
      >
        <Circle cx="30" cy="30" r="30" />
        <Rect x="80" y="17" rx="" ry="4" width="300" height="13" />
        <Rect x="80" y="40" rx="3" ry="3" width="250" height="10" />
      </ContentLoader>
    );
  };

  return (
    <View style={styles.container}>
      <ContentLoaderElems />
      <ContentLoaderElems />
      <ContentLoaderElems />
      <ContentLoaderElems />
      {/* <ContentLoaderElems /> */}
      {/* <ContentLoaderElems /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // marginVertical: 10,
  },
});
