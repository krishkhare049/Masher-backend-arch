import { Dimensions, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import React, { useRef } from "react";
import TabBarIcon from "../components/TabBarIcon";
import { Button, Surface } from "react-native-paper";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../MainComponent";
import { useDispatch, useSelector } from "react-redux";
import { selectUserData } from "../userDataSlice";
import addPathToProfileImages from "../utilities/addPathToProfileImages";
import { maxLengthNameWithSuffix } from "../utilities/maxLengthNameWithSuffix";
import { useAppTheme } from "../ThemeContext";
import PinProfileBox from "../components/PinProfileBox";
// import { InterstitialAd, AdEventType, TestIds, BannerAd, useForeground, BannerAdSize } from 'react-native-google-mobile-ads';
type ProfileProps = NativeStackScreenProps<RootStackParamList, "Profile">;

// const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

// const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
//   keywords: ['fashion', 'clothing'],
// });
// const adUnitId2 = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';


export default function Profile({ navigation }: ProfileProps) {
console.log(__DEV__)

// 
// const bannerRef = useRef<BannerAd>(null);

  // (iOS) WKWebView can terminate if app is in a "suspended state", resulting in an empty banner when app returns to foreground.
  // Therefore it's advised to "manually" request a new ad when the app is foregrounded (https://groups.google.com/g/google-admob-ads-sdk/c/rwBpqOUr8m8).
  // useForeground(() => {
  //   Platform.OS === 'ios' && bannerRef.current?.load();
  // });
// 


  const userData = useSelector(selectUserData);
        const { colors, isDark } = useAppTheme();
    const android_ripple = {
    color: !isDark ? "whitesmoke": "#282C35",
  };

  console.log(userData);

  // Get the screen width (in dp)
const screenWidth = Dimensions.get('window').width; 

// Calculate the percentage
const percentage = (120 / screenWidth) * 100;

console.log(`120dp is ${percentage}% of the screen width (${screenWidth}dp)`);

  return (
    // <View style={{ flex: 1, backgroundColor: "white" }}>
    <View style={{ flex: 1, backgroundColor: !isDark ?"white": '#343A46',}}>
      {/* <Surface
        elevation={5}
        style={{
          alignItems: "center",
          width: "100%",
          backgroundColor: "#fdbe00",
          // backgroundColor: "#6A5BC2",
          padding: 10,
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
        }}
      > */}
       {/* <BannerAd ref={bannerRef} unitId={adUnitId2} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} /> */}
      <View
        // elevation={5}
        style={{
          // iOS shadow
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          // Android shadow
          elevation: 5,

          alignItems: "center",
          width: "100%",
          // backgroundColor: "#fdbe00",
          backgroundColor: colors.background,
          // backgroundColor: "#6A5BC2",
          padding: 10,
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            width: "80%",
          }}
        >
          {userData.profileImgFilename !== "default_profile_image" ? (
            // <Image
            // source={require("../assets/pexels-prateekkatyal-7389639.jpg")}
            // // source={require(`/MasherStorage/profile_images/${userData.profileImgFilename}`)}
            // // source={require(`/profile_images/masherProfileImg-1733121399208-984054749.jpg`)}
            // style={styles.myProfileImg}
            // />

            // or by url like for production-

            <Image
              style={styles.myProfileImg}
              // source={{ uri: API_URL + '/static/profile_images/' + userData.profileImgFilename }}
              source={{
                uri: addPathToProfileImages(userData.profileImgFilename),
              }}
              placeholder={require("../../assets/icons/skeletonLoadingPlaceholder.gif")}
              placeholderContentFit="cover"
              contentFit="cover"
            />
          ) : (
            <View style={styles.defaultProfileImg}>
              <TabBarIcon name="defaultProfileIcon" size={55} color="#007bff" />
            </View>
          )}

          <Text
            style={{
              textAlign: "center",
              fontFamily: "Dosis_700Bold",
              fontSize: 18,
                  backgroundColor: !isDark ? "#FFFFFF": "#444E60",
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 20,
              color: colors.text,
            }}
          >
            {/* @username */}@{/* {userData.username} */}
            {/* {userData.username.length > 15
              ? userData.username.slice(0, 15) + "..."
              : userData.username} */}
              {maxLengthNameWithSuffix(userData.username, 15, 15)}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            width: "100%",
            marginTop: 15,
            marginBottom: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
              // borderRadius: 10,
              // overflow: "hidden",
              // backgroundColor: 'red'
            }}
          >
            <View
              style={{
                borderRadius: 10,
                overflow: "hidden",
                height: 45,
                width: 130,
                justifyContent: "center",
                alignItems: "center",
                marginHorizontal: 5,
              }}
            >
              <Pressable
                android_ripple={android_ripple}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  height: 45,
                  width: 130,
                  // backgroundColor: "#FFFFFF",
                  backgroundColor: !isDark ? "#FFFFFF": "#444E60",

                  padding: 5,
                  // borderRadius: 10,
                  // marginHorizontal: 5,
                }}
                onPress={() => {
                  navigation.navigate("EditProfile");
                }}
              >
                <TabBarIcon name="pencil" size={18} color={!isDark ? "#000000": "#FFFFFF"} />
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "Dosis_600SemiBold",
                    // color: "#000000",
                    color: colors.text,
                  }}
                >
                  Edit Profile
                </Text>
              </Pressable>
            </View>
            <View
              style={{
                borderRadius: 10,
                overflow: "hidden",
                height: 45,
                width: 130,
                justifyContent: "center",
                alignItems: "center",
                marginHorizontal: 5,
              }}
            >
              <Pressable
                android_ripple={android_ripple}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  height: 45,
                  width: 130,
                  backgroundColor: !isDark ? "#FFFFFF": "#444E60",
                  padding: 5,
                  // borderRadius: 10,
                  // marginHorizontal: 5,
                }}
                onPress={() => {
                  navigation.navigate("Settings");
                }}
              >
                <TabBarIcon name="settings" size={25} color="#007bff" />
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "Dosis_600SemiBold",
                    // color: "#000000",
                    color: colors.text,

                  }}
                >
                  Settings
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      <PinProfileBox/>

      {/* <View
        style={{
          justifyContent: "space-evenly",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "80%",
            padding: 5,
          }}
        >
          <Text
            style={{
              color: "gray",
              alignSelf: "flex-start",
              fontFamily: "Dosis_400Regular",
              fontSize: 18,
            }}
          >
            Dashboard
          </Text>
        </View>

        <Pressable
          style={{ margin: 5 }}
          android_ripple={{ color: "lightred" }}
          onPress={() => {
            navigation.navigate("Privacy");
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "rgba(245, 66, 93, 0.4)",
              width: "80%",
              borderRadius: 10,
              padding: 5,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
                width: "60%",
              }}
            >
              <TabBarIcon name="privacy" size={40} color="#ff0026" />
              <Text
                style={{
                  color: "#ff0026",
                  fontSize: 20,
                  fontWeight: 600,
                  fontFamily: "Dosis_700Bold",
                }}
              >
                Privacy
              </Text>
            </View>

            <TabBarIcon name="right" color="#ff0026" size={30} />
          </View>
        </Pressable>
        <Pressable
          style={{ margin: 5 }}
          android_ripple={{ color: "lightgreen" }}
          onPress={() => {
            navigation.navigate("Payments");
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "rgba(18, 153, 83, 0.4)",
              width: "80%",
              borderRadius: 10,
              padding: 5,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
                width: "60%",
              }}
            >
              <TabBarIcon name="payments" size={40} color="#129953" />
              <Text
                style={{
                  color: "#129953",
                  fontSize: 20,
                  fontWeight: 600,
                  fontFamily: "Dosis_700Bold",
                }}
              >
                Payments
              </Text>
            </View>

            <TabBarIcon name="right" color="#129953" size={30} />
          </View>
        </Pressable>
        <Pressable
          style={{ margin: 5 }}
          android_ripple={{ color: "lightblue" }}
          onPress={() => {
            navigation.navigate("Settings");
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "rgba(0, 123, 255, 0.4)",
              width: "80%",
              borderRadius: 10,
              padding: 5,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
                width: "60%",
              }}
            >
              <TabBarIcon name="settings" size={40} color="#007bff" />
              <Text
                style={{
                  color: "#007bff",
                  fontSize: 20,
                  fontWeight: 600,
                  fontFamily: "Dosis_700Bold",
                }}
              >
                Settings
              </Text>
            </View>

            <TabBarIcon name="right" color="#007bff" size={30} />
          </View>
        </Pressable>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  myProfileImg: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "white",
    padding: 10,
  },
  defaultProfileImg: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    // borderWidth: 3,
    borderColor: "white",
    backgroundColor: "white",
    width: 60,
    height: 60,
  },
    container: {
    padding: 20,
    alignItems: 'center',
    // flex: 1,
    justifyContent: 'center',
    margin: 40,
    borderRadius: 30,
  },
  title: {
    fontSize: 22,
    marginVertical: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  button: {
    marginTop: 20,
    borderRadius: 10,
  },
});
