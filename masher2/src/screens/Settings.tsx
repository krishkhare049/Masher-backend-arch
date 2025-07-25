import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import TabBarIcon from "../components/TabBarIcon";
import { RootStackParamList } from "../MainComponent";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Animated from "react-native-reanimated";
import { useAppTheme } from "../ThemeContext";

import { Image } from "expo-image";
import AppText from "../components/AppText";
import NativeAdCardSettings from "../../ads/NativeAdCardSettings";


type SettingsProps = NativeStackScreenProps<RootStackParamList, "Settings">;

export default function Settings({ navigation }: SettingsProps) {
    // const { colors } = useAppTheme();
    const {colors, isDark} = useAppTheme()

  const android_ripple = {
    color: !isDark ? "whitesmoke": "#282C35",
  };
  return (
    <>
      {/* <StatusBar backgroundColor={"#FFFFFF"} barStyle={"dark-content"} /> */}
      <StatusBar backgroundColor={!isDark ? "#FFFFFF": colors.background} barStyle={!isDark ?"dark-content": "light-content"} />
      {/* <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}> */}
      {/* <Animated.View
        sharedTransitionTag="sharedkk"
        style={{ backgroundColor: "#ffffff", flex: 1 }}
      > */}

        <ScrollView style={{ flex: 1, backgroundColor: !isDark ? "#FFFFFF": "#343A46" }}>

        {/* <NativeAdCardSettings/> */}

          <Pressable
            android_ripple={android_ripple}
            style={[styles.settingsItem, {backgroundColor: !isDark ? "#FFFFFF": "#343A46", borderColor: !isDark ? "gainsboro": "#000000"}]}
            onPress={() => {
              navigation.navigate("Customization");
            }}
          >
            <TabBarIcon name="leafMaple" size={25} color={colors.text} />
            <Text style={[styles.settingsItemText, {color: colors.text}]}>Customization</Text>
          </Pressable>
          <Pressable
            android_ripple={android_ripple}
            style={[styles.settingsItem, {backgroundColor: !isDark ? "#FFFFFF": "#343A46", borderColor: !isDark ? "gainsboro": "#000000"}]}
            onPress={() => {
              navigation.navigate("Privacy");
            }}
          >
            <TabBarIcon name="privacy" size={25} color={colors.text} />
            <Text style={[styles.settingsItemText, {color: colors.text}]}>Privacy</Text>
          </Pressable>
          <Pressable
            android_ripple={android_ripple}
            style={[styles.settingsItem, {backgroundColor: !isDark ? "#FFFFFF": "#343A46", borderColor: !isDark ? "gainsboro": "#000000"}]}
            onPress={() => {
              navigation.navigate("Payments");
            }}
          >
            <TabBarIcon name="payments" size={25} color={colors.text} />
            <Text style={[styles.settingsItemText, {color: colors.text}]}>Payments</Text>
          </Pressable>
          {/* <Pressable
            android_ripple={android_ripple}
            style={[styles.settingsItem, {backgroundColor: !isDark ? "#FFFFFF": "#343A46", borderColor: !isDark ? "whitesmoke": "#000000"}]}
            onPress={() => {
              navigation.navigate("Theme");
            }}
          >
            <TabBarIcon name="theme" size={25} color={colors.text} />
            <Text style={[styles.settingsItemText, {color: colors.text}]}>Theme</Text>
          </Pressable> */}
          <Pressable
            android_ripple={android_ripple}
            style={[styles.settingsItem, {backgroundColor: !isDark ? "#FFFFFF": "#343A46", borderColor: !isDark ? "gainsboro": "#000000"}]}
            onPress={() => {
              navigation.navigate("ChangeUsername");
            }}
          >
            <TabBarIcon name="edit" size={25} color={colors.text} />
            <Text style={[styles.settingsItemText, {color: colors.text}]}>Change username</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.navigate("ChangePassword");
            }}
            android_ripple={android_ripple}
            style={[styles.settingsItem, {backgroundColor: !isDark ? "#FFFFFF": "#343A46", borderColor: !isDark ? "gainsboro": "#000000"}]}
          >
            <TabBarIcon name="password" size={25} color={colors.text} />
            <Text style={[styles.settingsItemText, {color: colors.text}]}>Change password</Text>
          </Pressable>
          <Pressable
            android_ripple={android_ripple}
            style={[styles.settingsItem, {backgroundColor: !isDark ? "#FFFFFF": "#343A46", borderColor: !isDark ? "gainsboro": "#000000"}]}
            onPress={() => {
              navigation.navigate("SearchHistory");
            }}
          >
            <TabBarIcon name="search" size={25} color={colors.text} />
            <Text style={[styles.settingsItemText, {color: colors.text}]}>Search history</Text>
          </Pressable>
          <Pressable
            android_ripple={android_ripple}
            style={[styles.settingsItem, {backgroundColor: !isDark ? "#FFFFFF": "#343A46", borderColor: !isDark ? "gainsboro": "#000000"}]}
            onPress={() => {
              navigation.navigate("Blocked");
            }}
          >
            <TabBarIcon name="blocked" size={25} color={colors.text} />
            <Text style={[styles.settingsItemText, {color: colors.text}]}>Blocked</Text>
          </Pressable>
          <Pressable
            android_ripple={android_ripple}
            style={[styles.settingsItem, {backgroundColor: !isDark ? "#FFFFFF": "#343A46", borderColor: !isDark ? "gainsboro": "#000000"}]}
            onPress={() => {
              navigation.navigate("Security");
            }}
          >
            <TabBarIcon name="security" size={25} color={colors.text} />
            <Text style={[styles.settingsItemText, {color: colors.text}]}>Security</Text>
          </Pressable>
          <Pressable
            android_ripple={android_ripple}
            style={[styles.settingsItem, {backgroundColor: !isDark ? "#FFFFFF": "#343A46", borderColor: !isDark ? "gainsboro": "#000000"}]}
            onPress={() => {
              navigation.navigate("CustomerService");
            }}
          >
            <TabBarIcon name="customerservice" size={25} color={colors.text} />
            <Text style={[styles.settingsItemText, {color: colors.text}]}>Customer Service</Text>
          </Pressable>
          <Pressable
            android_ripple={android_ripple}
            style={[styles.settingsItem, {backgroundColor: !isDark ? "#FFFFFF": "#343A46", borderColor: !isDark ? "gainsboro": "#000000"}]}
            onPress={() => {
              navigation.navigate("MyAccount");
            }}
          >
            <TabBarIcon name="defaultProfileIcon" size={25} color={colors.text} />
            <Text style={[styles.settingsItemText, {color: colors.text}]}>My Account</Text>
          </Pressable>
          <Pressable
            android_ripple={android_ripple}
            style={[styles.settingsItem, {backgroundColor: !isDark ? "#FFFFFF": "#343A46", borderColor: !isDark ? "gainsboro": "#000000"}]}
            onPress={() => {
              navigation.navigate("Info");
            }}
          >
            <TabBarIcon name="infocirlceo" size={25} color={colors.text} />
            <Text style={[styles.settingsItemText, {color: colors.text}]}>Info</Text>
          </Pressable>

            <View style={{flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 20, width: "100%", marginTop: 20, backgroundColor: !isDark ? "whitesmoke": colors.background}}>

          <Image
        style={{ width: 40, height: 40, marginRight: 10 }}
        // source={require("../assets/smileIcon.jpg")}
        source={require("../../assets/icons/masherlogo2.png")}
        />

        <View style={{flexDirection: "column"}}>
        <AppText style={{fontSize: 15, color: colors.text, fontFamily: "Dosis_600SemiBold"}}>Masher</AppText>
        <AppText style={{fontSize: 13, color: colors.text, fontFamily: "Dosis_500Medium",}}>v 1.0</AppText>
        </View>
        </View>

        </ScrollView>
        {/* </SafeAreaView> */}
      {/* </Animated.View> */}
    </>
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
    // borderColor: "whitesmoke",
  },
  settingsItemText: {
    fontFamily: "Dosis_400Regular",
    fontSize: 20,
    marginLeft: 20,
  },
});
