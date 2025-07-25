import { StyleSheet, View } from "react-native";
import React from "react";

import ContentLoader, { Rect, Circle } from "react-content-loader/native";

export default function MessagingScreenMessagesLoader() {
  const ContentLoaderSenderMessElem = () => {
    return (
      <ContentLoader
        height={100}
        width={"50%"}
        speed={1}
        style={{borderRadius: 100, borderBottomRightRadius: 0, backgroundColor: '#f7d992', alignSelf: 'flex-end', margin: 5}}
        backgroundColor={"#fdbe00"}
        foregroundColor={"whitesmoke"}
        viewBox="0 0 380 70"
      >
        {/* <Circle cx="30" cy="30" r="30" /> */}
        <Rect x="80" y="17" rx="3" ry="4" width="70%" height="13" />
        <Rect x="80" y="50" rx="3" ry="3" width="50" height="13" />
        <Rect x="65%" y="80" rx="3" ry="3" width="80" height="13" />
      </ContentLoader>
    );
  };
  const ContentLoaderReceiverMessElem = () => {
    return (
      <ContentLoader
        height={100}
        width={"50%"}
        speed={1}
        style={{borderRadius: 100, borderBottomLeftRadius: 0, backgroundColor: '#F7F7F7', alignSelf: 'flex-start', margin: 5}}
        backgroundColor={"gainsboro"}
        foregroundColor={"whitesmoke"}
        viewBox="0 0 380 70"
      >
        {/* <Circle cx="30" cy="30" r="30" /> */}
        <Rect x="40" y="17" rx="3" ry="4" width="70%" height="13" />
        <Rect x="40" y="50" rx="3" ry="3" width="50" height="13" />
        <Rect x="65%" y="80" rx="3" ry="3" width="80" height="13" />
      </ContentLoader>
    );
  };

  return (
    <View style={styles.container}>
      <ContentLoaderReceiverMessElem />
      <ContentLoaderSenderMessElem />
      <ContentLoaderReceiverMessElem />
      <ContentLoaderSenderMessElem />
      <ContentLoaderReceiverMessElem />
      <ContentLoaderSenderMessElem />
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