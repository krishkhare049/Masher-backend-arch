import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";

import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from "@react-navigation/native";
import TabBarIcon from "../../components/TabBarIcon";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../MainComponent";
import Animated from "react-native-reanimated";
import { messagesCollection } from "../../../index.native";
import { FlashList } from "@shopify/flash-list";
import Message from "../../components/Message";
import { Card, useTheme, Text, Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppTheme } from "../../ThemeContext";
import AppText from "../../components/AppText";
import Toast from "react-native-toast-message";
import NativeAdCardCust from "../../../ads/NativeAdCardCust";

type CustomizationProps = NativeStackScreenProps<
  RootStackParamList,
  "Customization"
>;

export default function Customization({ navigation }: CustomizationProps) {
  const { isDark, colors, toggleThemeMode, resetToDefaultTheme } = useAppTheme();
  
    const android_ripple = {
      color: !isDark ? "whitesmoke": "#282C35",
    };

  // const navigation = useNavigation();

  // const [isConnected, setIsConnected] = useState<any>(null);

  // useEffect(() => {
  //   const unsubscribe = NetInfo.addEventListener((state) => {
  //     setIsConnected(state.isConnected);
  //   });

  //   return () => unsubscribe();
  // }, []);

  // const android_ripple = {
  //   color: "whitesmoke",
  // };

  return (
    <View
      style={{ flex: 1, backgroundColor: !isDark ? "white": "#343A46" }}
      // sharedTransitionTag="sharedkk"
    >
      <View
        style={{
          borderBottomWidth: 0.5,
          // borderColor: "whitesmoke",
          borderColor: !isDark ? "gainsboro": "#444E60"

        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingVertical: 20,
            paddingHorizontal: 20,
            width: "100%",
          }}
        >
          <TabBarIcon name="theme" size={25} color={colors.text} />
          <Text style={styles.settingsItemText}>Modes</Text>
        </View>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <MaterialCommunityIcons
              name={isDark ? "weather-night" : "white-balance-sunny"}
              size={50}
              color={isDark ? "#ffd700" : "#fdbe00"}
              style={styles.icon}
            />
            <Text
              variant="titleLarge"
              style={[styles.title, { color: colors.primary }]}
            >
              {isDark ? "Dark Mode" : "Light Mode"}
            </Text>
            <Text
              style={[
                styles.description,
                { color: colors.text },
              ]}
            >
              {isDark
                ? "Reduce eye strain and save battery by using dark mode."
                : "Bright and clean theme ideal for daylight viewing."}
            </Text>
            <Button
              mode="contained"
              onPress={toggleThemeMode}
              style={styles.button}
              labelStyle={{ fontSize: 14 }}
            >
              Switch to {isDark ? "Light" : "Dark"} Mode
            </Button>
          </Card.Content>
        </Card>
      </View>

      <View>
        <Pressable
          android_ripple={android_ripple}
          style={[styles.settingsItem, {borderColor: !isDark ? "gainsboro": "#444E60"}]}
          onPress={() => {
            navigation.navigate("Theme");
          }}
        >
          <TabBarIcon name="colorPalette" size={25} color={colors.text} />
          <Text style={styles.settingsItemText}>Themes</Text>
        </Pressable>
        <Pressable
          android_ripple={android_ripple}
          // style={styles.settingsItem}
          style={[styles.settingsItem, {borderColor: !isDark ? "gainsboro": "#444E60"}]}

          onPress={() => {
            navigation.navigate("Fonts");
          }}
        >
          <TabBarIcon name="font" size={25} color={colors.text} />
          <Text style={styles.settingsItemText}>Text</Text>
        </Pressable>

      
        {/* <Text>Customization</Text> */}
        {/* <Text>Network Status: {isConnected ? "Online" : "Offline"}</Text> */}
      </View>
      <View style={{ marginTop: 30, marginBottom: 15}}>
              <Button
                onPress={()=>{
                  Toast.show({
                    type: "success",
                    text1: "Resetting to default theme!"
                    })
                  resetToDefaultTheme()}}
                rippleColor={"#0000001A"}
                style={{ backgroundColor: "whitesmoke", width: 200, alignSelf: "center", borderRadius: 10 }}
              >
                <Text style={{ color: "#000000", fontWeight: '700' }}>Reset to default Theme</Text>
              </Button>
            </View>

                    {/* <NativeAdCardCust/> */}
            
    </View>
  );
}

const styles = StyleSheet.create({
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 20,
    paddingHorizontal: 20,
    width: "100%",
    borderBottomWidth: 0.5,
  },
  settingsItemText: {
    fontFamily: "Dosis_400Regular",
    fontSize: 20,
    marginLeft: 20,
  },
  card: {
    borderRadius: 20,
    margin: 20,
    marginTop: 5,
    elevation: 3,
    // backgroundColor: "#FBFBFB",
  },
  cardContent: {
    alignItems: "center",
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 14,
  },
  button: {
    marginTop: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
