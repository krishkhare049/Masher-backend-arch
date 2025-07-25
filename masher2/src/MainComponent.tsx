import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import * as NavigationBar from "expo-navigation-bar";

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  SignedInStack: undefined;
  SignedOutStack: undefined;
  SplashScreen: undefined;

  Home: undefined;
  Me: undefined;
  Notifications: { userId: string; message: string } | undefined;
  Profile: { userId: string };
  User: { userId: string } | undefined;
  ConversationPage: undefined;
  Chats: undefined;
  CreateGroup: undefined;
  SelectUsersSearchComponent:
    | {
        headerText: string;
        conversationId?: string;
        info?: string;
      }
    | undefined;
  MessagingScreen:
    | {
        conversationId: string;
        otherParticipantId: string;
        otherParticipantName: string;
        imageUrl: string;
        isGroup: boolean;
      }
    | undefined;
  GroupMessagingScreen:
    | {
        conversationId: string;
        groupName: string;
        imageUrl: string;
        isGroup: boolean;
      }
    | undefined;
  Search: undefined;
  GroupEditPage:
    | {
        conversationId: string;
        groupName: string;
        imageUrl: string;
        adminsApproveMembers: boolean;
        editPermissionsMembers: boolean;
      }
    | undefined;

  Notes: undefined;

  Intro: undefined;
  Login: undefined;
  Signup: undefined;
  AddDetailsOnFirstTime: undefined;
  AuthenticateOTP: undefined;

  EditProfile: undefined;
  Settings: undefined;

  // Settings Page-
  Customization: undefined;
  Privacy: undefined;
  Payments: undefined;
  Theme: undefined;
  Fonts: undefined;
  ChangeUsername: undefined;
  ChangePassword: undefined;
  SearchHistory: undefined;
  Security: undefined;
  Blocked: undefined;
  CustomerService: undefined;
  FAQ: undefined;
  LiveChat: undefined;
  MyAccount: undefined;
  Info: undefined;
};

import SignedOutStack from "./stack/SignedOutStack";
import SplashScreen from "./stack/SplashScreen";
import SignedInStack from "./stack/SignedInStack";
import { SocketProvider } from "./SocketProvider";
import { navigationRef } from "./navigationRef";
import { MenuProvider } from "react-native-popup-menu";
import { useAppTheme } from "./ThemeContext";

export default function MainComponent() {
  const {isDark} = useAppTheme();

  console.log("isDark", isDark);

  if (!isDark){

    NavigationBar.setBackgroundColorAsync("white");
    NavigationBar.setButtonStyleAsync("dark");
  }
  else{
    NavigationBar.setBackgroundColorAsync("#222831");
    NavigationBar.setButtonStyleAsync("light");

  }

  return (
    <SocketProvider>
      <MenuProvider>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator screenOptions={{}} initialRouteName="SplashScreen">
            <Stack.Screen
              name="SplashScreen"
              // component={SignedInStack}
              component={SplashScreen}
              options={{ headerShown: false, animationTypeForReplace: "pop", animation: "slide_from_left" }}
            />
            <Stack.Screen
              name="SignedInStack"
              component={SignedInStack}
              options={{
                headerShown: false,
                animationTypeForReplace: "pop",
                // animation: "slide_from_right",
                animationDuration: 100,
              }}
            />
            <Stack.Screen
              name="SignedOutStack"
              component={SignedOutStack}
              options={{
                headerShown: false,
                animationTypeForReplace: "push",
                animation: "flip",
                animationDuration: 100,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </MenuProvider>
    </SocketProvider>
  );
}

const styles = StyleSheet.create({});
