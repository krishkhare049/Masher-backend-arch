import { StatusBar, StyleSheet, View } from "react-native";
import { Image } from 'expo-image'
import React, { useEffect } from "react";
// import Animated, {
//   useSharedValue,
//   withTiming,
//   Easing,
//   useAnimatedStyle,
//   withRepeat,
//   withSequence,
// } from "react-native-reanimated";

// const ANGLE = 100;
const ANGLE = 100;
// const TIME = 100;
const TIME = 400;
// const EASING = Easing.elastic(1.5);
const EASING = Easing.elastic(1);

// import LottieView from "lottie-react-native";
import { useDispatch, useSelector } from "react-redux";
import { selectLogged, setLoggedIn, setLoggedOut } from "../loggedSlice";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../MainComponent";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { useFonts } from "expo-font";
import { axiosInstance } from "../utilities/axiosInstance";
import * as SecureStore from "expo-secure-store";
import {
  useFonts,
  Dosis_200ExtraLight,
  Dosis_300Light,
  Dosis_400Regular,
  Dosis_500Medium,
  Dosis_600SemiBold,
  Dosis_700Bold,
  Dosis_800ExtraBold,
} from "@expo-google-fonts/dosis";
// import * as NavigationBar from "expo-navigation-bar";


// import * as NavigationBar from "expo-navigation-bar";

//   NavigationBar.setBackgroundColorAsync("#fdbe00");
// NavigationBar.setVisibilityAsync("hidden");

// export default function SplashScreen({onAnimationEnd}: { onAnimationEnd: () => void}) {
// export default function SplashScreen() {

//
//
//
//
//
export async function saveToExpoSec(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

export const getLogSave = (key: any) => {
  let result = SecureStore.getItemAsync(key);
  if (result) {
    // alert("🔐 Here's your value 🔐 \n" + result);
    // return { key: result };
    return result;
  } else {
    // alert("No values stored under that key.");
    return result;
  }
};

// import * as SecureStore from 'expo-secure-store';

// export const setToken = (token: string) => {
//   return SecureStore.setItemAsync("secure_token", token);
// };

// export const getToken = () => {
//   return SecureStore.getItemAsync("secure_token");
// };

// setToken('#your_secret_token');
// getToken().then(token => console.log(token)); // output '#your_secret_token'
// console.log(getToken().then(token => {return token})) // output '#your_secret_token'

// const loggedUser = getLogSave("logsave");

const checkToken = async () => {
  try {
    const token = await SecureStore.getItemAsync("secure_token");

    console.log("Token:" + token);

    if (token) {
      // Set the global authorization header
      // axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      axiosInstance.defaults.headers.common["Authorization"] =
        "Bearer " + token;
    }

    return token !== null;
  } catch (error) {
    console.error(error);
    return false; // Return false in case of error
  }
};
//
import NetInfo from "@react-native-community/netinfo";
import { setNetworkInfo } from "../networkInfoSlice";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { useAppTheme } from "../ThemeContext";
import AppText from "../components/AppText";
//
//
//
//
//

export default function SplashScreen() {
    const { colors, isDark } = useAppTheme();
  // const opacity = new Animated.Value(1); // Initial opacity

  //
  //
  //
  //
  //

  const dispatch = useDispatch();
  // const [isConnected, setIsConnected] = useState<any>(null);

  let [fontsLoaded] = useFonts({
    Dosis_200ExtraLight,
    Dosis_300Light,
    Dosis_400Regular,
    Dosis_500Medium,
    Dosis_600SemiBold,
    Dosis_700Bold,
    Dosis_800ExtraBold,
  });

  // Check network connection-
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkInfo(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  // const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // Use null to indicate loading

  //

  // const [showSplash, setShowSplash] = useState(true); // State to control splash screen visibility

  useEffect(() => {
    const verifyToken = async () => {
      const tokenExists = await checkToken();

      setTimeout(() => {
        // First check if fonts loaded or not-
        if (fontsLoaded) {
          if (tokenExists) {
            dispatch(setLoggedIn());
          } else {
            dispatch(setLoggedOut());
          }
        }
        // setIsLoggedIn(tokenExists);
        // setLoading(false); // Set loading to false after token check
      // }, 500);
      }, 800);
    };

    verifyToken();
  }, [fontsLoaded]);
  //
  //
  //
  //
  //
  //
  //
  //
  //

  const isLoggedIn = useSelector(selectLogged);

  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, "SplashScreen">
    >();

  useEffect(() => {
    // if (isLoggedIn === true) {
    //   navigation.navigate("SignedInStack");
    // } else if (isLoggedIn === false) {
    //   navigation.navigate("SignedOutStack");
    // }

    if (isLoggedIn !== null) {
      console.log("isLoggedIn:", isLoggedIn); // Log the value of isLoggedIn
      navigation.replace(isLoggedIn ? "SignedInStack" : "SignedOutStack");
    }
  }, [isLoggedIn]);

  // useEffect(() => {
  //   Animated.timing(opacity, {
  //     toValue: 0, // Fade out to transparent

  //     duration: 500, // Duration of the animation

  //     useNativeDriver: true, // Use native driver for better performance
  //   }).start(() => {
  //     onAnimationEnd(); // Call the callback function after animation ends
  //   });
  // }, [opacity, onAnimationEnd]);

  // const translateY = useSharedValue(0)

  // useEffect(()=>{
  //   translateY.value = withRepeat(withSpring(30, {damping:5, stiffness: 100}), -1, true)
  // }, [])

  const rotation = useSharedValue<number>(0);

  const animatedStyle = useAnimatedStyle(() => ({
    // transform: [{ rotateZ: `${rotation.value}deg` }],
    width: rotation.value + 40,
    height: rotation.value + 40,
  }));

  setTimeout(() => {
    rotation.value = withSequence(
      // deviate left to start from -ANGLE
      // withTiming(-ANGLE, { duration: TIME / 2, easing: EASING }),
      // wobble between -ANGLE and ANGLE 7 times
      withRepeat(
        withTiming(ANGLE, {
          duration: TIME,
          easing: EASING,
        }),
        1,
        true
      )
      // go back to 0 at the end
      // withTiming(100, { duration: TIME / 2, easing: EASING })
    );
  }, 100);

  return (
    <>
      {/* <StatusBar backgroundColor={"#fdbe00"} barStyle={"light-content"} /> */}
      <StatusBar backgroundColor={colors.background} barStyle={"light-content"} />
      {/* <Animated.View style={[styles.container, { opacity }]}> */}
      <View style={[styles.container, {backgroundColor: colors.background}]}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Animated.Image
            style={[{ width: 100, height: 100, margin: "auto" }, animatedStyle]}
            // style={[{ width: 100, height: 100, margin: "auto" }]}
            source={require("../../assets/icons/masherlogo2.png")}
          />

          <AppText
            style={[
              {
                fontSize: 30,
                fontFamily: "Dosis_700Bold",
                color: colors.text,
                textAlign: "center",
              },
            ]}
          >
            Masher
          </AppText>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            bottom: 0,
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            // backgroundColor: !isDark ? "white": colors.background,
            backgroundColor: !isDark ? "white": colors.background,
            elevation: 5,
            width: "100%",
            height: 50,
          }}
        >
          <Image
            // style={[{ width: 25, height: 25, marginRight: 10 }, animatedStyle]}
            style={[{ width: 25, height: 25, marginRight: 10 }]}
            source={require("../../assets/icons/khareindustrieslogo.png")}
          />

          <AppText style={[{ fontSize: 13, fontFamily: "Dosis_600SemiBold", color: colors.text }]}>
            Fast. Secure. Reliable.
          </AppText>
        </View>
      </View>

      {/* <LottieView
        // source={require("../assets/animations/splash.json")} // Path to your file
        source={require("../assets/animations/kk.lottie")} // Path to your file
        // source={require("../assets/animations/a.json")} // Path to your file
        autoPlay
        loop={true} // Set to true if you want it to repeat
        // style={{width: 200, height: 200, margin: 'auto'}}
        style={{width: '100%', height: '110%', flex: 1, justifyContent: 'center', alignItems: 'center'}}
      /> */}

      {/* </Animated.View> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#fdbe00",
  },
  img: {
    // width: "100%",
    width: 200,
    height: 200,
    margin: "auto",
  },
});
