import React, { useEffect } from "react";

import { Provider } from "react-redux";

import { store } from "./store";

import MainComponent from "./MainComponent"; // Your main component
// import { PaperProvider } from "react-native-paper";

// import { RealmProvider } from "@realm/react";
// import { UserDataSchema } from "./database/schema/UserDataSchema";
// import { ConversationSchema } from "./database/schema/ConversationSchema";
// import { SearchSchema } from "./database/schema/SearchSchema";
// import { NotificationsSchema } from "./database/schema/NotificationsSchema";
// import { MessageSchema } from "./database/schema/MessageSchema";
// import { OtherUsersDataSchema } from "./database/schema/OtherUsersDataSchema";
import { enableScreens } from "react-native-screens";
// import * as SplashScreen from 'expo-splash-screen';
import Toast from "react-native-toast-message";
import "react-native-reanimated";
import { Provider as PaperProvider } from "react-native-paper";
import { ThemeProvider, useAppTheme } from "./ThemeContext";

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { usePushNotifications } from "./hooks/usePushNotfications";
import { axiosInstance } from "./utilities/axiosInstance";

enableScreens(true);
// enableScreens(false);

// Keep the splash screen visible while we fetch resources
// SplashScreen.preventAutoHideAsync();

// export default function App() {
//   return (
//     // <RealmProvider
//     //   schema={[
//     //     UserDataSchema,
//     //     ConversationSchema,
//     //     SearchSchema,
//     //     NotificationsSchema,
//     //     MessageSchema,
//     //     OtherUsersDataSchema,
//     //   ]}
//     // >
//     //   <Provider store={store}>
//     //     <PaperProvider>
//     //       <MainComponent />
//     //     </PaperProvider>
//     //   </Provider>
//     // </RealmProvider>
//     // <RealmProvider
//     //   schema={[
//     //     UserDataSchema,
//     //     ConversationSchema,
//     //     SearchSchema,
//     //     NotificationsSchema,
//     //     MessageSchema,
//     //     OtherUsersDataSchema,
//     //   ]}
//     // >
//       <Provider store={store}>
//         <PaperProvider>
//           <MainComponent />
//           <Toast />
//         </PaperProvider>
//       </Provider>
//   //  </RealmProvider>
//   );
// }

// 1. Configure notification behavior and Android channel
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: false,
  }),
});

if (Platform.OS === "android") {
  Notifications.setNotificationChannelAsync("default", {
    name: "default",
    importance: Notifications.AndroidImportance.MAX,
    // sound: "default",
    sound: "longpop.wav",
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#FF231F7C",
  });
}

export default function App() {
  const expoPushToken = usePushNotifications();

  useEffect(() => {
    if (expoPushToken) {
      // Send token to your backend to save
      console.log("📱 Token ready to register on server:", expoPushToken);

      // axiosInstance.post('/api/register-push-token', {
      //   token: expoPushToken,
      // }).then(response => {
      //   console.log('Push token registered successfully:', response.data);
      // }

      axiosInstance
        .post(
          "/api/users/registerPushToken",
          {
            token: expoPushToken,
          },
          { withCredentials: true }
        )
        .then((response) => {
          console.log(response);
          if (response.data.message === "registered") {
            console.log("Push token registered successfully:", response.data);
          }
        })
        .catch((error) => {
          console.error("Error registering push token:", error);
        });
    }
  }, [expoPushToken]);

  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

function ThemedApp() {
  const { theme } = useAppTheme();
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <MainComponent />
        <Toast />
      </PaperProvider>
    </Provider>
  );
}
