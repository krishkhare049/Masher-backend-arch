import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import TabBarIcon from "./TabBarIcon";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../MainComponent";
import { Appbar, Surface } from "react-native-paper";

// export default function CustomHeader({
function CustomHeader({
  name,
  headerBackgroundColor,
  textColor,
}: {
  name: string;
  headerBackgroundColor: string;
  textColor: string;
}) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Home">>();

  return (
    // <Surface
    //   elevation={3}
    //   style={{
    //     flexDirection: "row",
    //     alignItems: "center",
    //     backgroundColor: headerBackgroundColor,
    //   }}
    // >
    <View
      // elevation={3}
      style={{
        // iOS shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        // Android shadow
        elevation: 5,

        flexDirection: "row",
        alignItems: "center",
        backgroundColor: headerBackgroundColor,
      }}
    >
      <Appbar.BackAction
        color={textColor}
        onPress={() => navigation.goBack()}
        style={{ marginLeft: 10 }}
      />

      <Text
        style={{
          fontSize: 20,
          // color: "white",
          color: textColor,
          marginLeft: 10,
          // fontFamily: "Dosis_700Bold",
          fontFamily: "Dosis_600SemiBold",
          // fontFamily: "Dosis_500Medium",
        }}
      >
        {name}
      </Text>
    </View>
  );
}

export default React.memo(CustomHeader, (prevProps, nextProps) => {
  return (
    prevProps.name === nextProps.name &&
    prevProps.headerBackgroundColor === nextProps.headerBackgroundColor &&
    prevProps.textColor === nextProps.textColor
  );
});

const styles = StyleSheet.create({});
