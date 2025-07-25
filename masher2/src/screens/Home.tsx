// import {
//   StyleSheet,
// } from "react-native";
import React, { useRef } from "react";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { RootStackParamList } from "../MainComponent";

import { useScrollToTop } from "@react-navigation/native";

import Notifications from "./Notifications";
import Chats from "./Chat";
import Search from "./Search";
import CustomHeader from "../components/CustomHeader";
import MessagingScreen from "./MessagingScreen";
import User from "./User";
import CreateGroup from "./CreateGroup";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Pressable, View } from "react-native";
import TabBarIcon from "../components/TabBarIcon";
// import Me from "./Me";
import MeIconComponent from "../components/MeIconComponent";
import Profile from "./Profile";
import ChatsIconComponent from "../components/ChatsIconComponent";
import { useAppTheme } from "../ThemeContext";

// import { StatusBar } from "expo-status-bar";

// const Tab = createBottomTabNavigator<RootStackParamList>();
// const HomeStack = createNativeStackNavigator<RootStackParamList>();

type HomeProps = NativeStackScreenProps<RootStackParamList, "Home">;

const BottomTab = createBottomTabNavigator<RootStackParamList>();

export default function Home({ navigation }: HomeProps) {
  const ScrollRef = useRef(null);
        const { colors, isDark } = useAppTheme();
  
  
  // console.log('HOME')

  // The expected native behavior of scrollable components is to respond to events from navigation that will scroll to top when tapping on the active tab as you would expect from native tab bars.
  // In order to achieve it we export useScrollToTop which accept ref to scrollable component (e,g. ScrollView or FlatList).
  useScrollToTop(ScrollRef);

  return (
    <>
    {/* <View style={{ flex: 1, backgroundColor: "white" }}> */}
    <View style={{ flex: 1, backgroundColor: !isDark? '#FFFFFF': '#343A46' }}>

      <BottomTab.Navigator
        initialRouteName="Chats"
        screenOptions={{
          headerShown: false,
          // lazy: true,
          
          // tabBarStyle: isTabBarVisible
          //   ? {
            tabBarStyle: {
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              // backgroundColor: "white",
              backgroundColor: !isDark ? "white": colors.background,
              overflow: "hidden",
              elevation: 30,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -6 },
              shadowOpacity: 0.9,
              shadowRadius: 12,
              borderTopWidth: 0,
            },
            // : { display: "none" },
            tabBarLabelStyle: { fontFamily: "Dosis_600SemiBold"},
            tabBarInactiveTintColor: '#B1B9C8',

            
            tabBarButton: (props) => (
              <Pressable
              {...props}
              // android_ripple={{ color: "#fdbe00", borderless: false }} // Change ripple color here
              android_ripple={{
                // color: "whitesmoke",
                color: !isDark ? "whitesmoke": "gray",
                borderless: false,
              }} // Change ripple color here
              />
            ),
          }}
          >
        <BottomTab.Screen
          name="Chats"
          component={Chats}
          options={{
            // options={({ route }) => ({
              tabBarIcon: ({ color, focused }) => (
                // <TabBarIcon
                // name={focused ? "chats" : "chatsOutline"}
                // color={focused ? "#fdbe00" : "gainsboro"}
                // size={30}
                // />
                <ChatsIconComponent focused={focused} />
              ),
              // tabBarActiveTintColor: "#fdbe00",
              tabBarActiveTintColor: !isDark ? colors.background: '#B1B9C8',
            }}
            />
        <BottomTab.Screen
        
          name="Search"
          component={Search}
          options={{
            title: 'Explore',
            // options={({ route }) => ({
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon
                name={focused ? "searchOutline":"search"}
                // color={focused ? "#fdbe00" : "gainsboro"}
                // color={focused ? colors.background : "gainsboro"}
                 color={focused ? (!isDark ?colors.background: '#B1B9C8') : "#B1B9C8"}
                size={26}
                />
              ),

              // tabBarActiveTintColor: "#fdbe00",
              // tabBarActiveTintColor: colors.background,
            tabBarActiveTintColor: !isDark ? colors.background: '#B1B9C8',
            tabBarLabelStyle: { fontFamily: "Dosis_600SemiBold" }
            }}
            />
        <BottomTab.Screen
          // name="Dashboard"
          // name="Me"
          // component={Me}
          name="Profile"
          component={Profile}
          options={{
            // options={({ route }) => ({
              tabBarIcon: ({ color, focused }) => (
                <MeIconComponent focused={focused} />
              ),
              tabBarLabel: "My Space",
              // tabBarActiveTintColor: "#193088",
              // tabBarActiveTintColor: colors.background,
              tabBarActiveTintColor: !isDark ? colors.background: '#B1B9C8',

            }}
            />
      </BottomTab.Navigator>

      </View>
      {/* <HomeStack.Navigator initialRouteName="Chats" screenOptions={{}}>
        <HomeStack.Screen
        name="Chats"
        component={Chats}
        options={{ headerShown: false }}
        />
        <HomeStack.Screen
          name="MessagingScreen"
          component={MessagingScreen}
          initialParams={{ conversationId: "", otherParticipantId: "" }}
          options={{
            headerShown: false,

            presentation: "modal", // Uses native modal presentation
            animation: "simple_push", // Smooth animation
          }}
        />
        <HomeStack.Screen
          name="Search"
          component={Search}
          options={{
            headerShown: false,
          }}
        />
        <HomeStack.Screen
          name="Notifications"
          component={Notifications}
          options={{
            header(props) {
              return (
                <CustomHeader
                  name="Notifications"
                  headerBackgroundColor="#fdbe00"
                  textColor="white"
                />
              );
            },
          }}
        />
        <HomeStack.Screen
          name="CreateGroup"
          component={CreateGroup}
          options={{
            header(props) {
              return (
                <CustomHeader
                  name="Create a Group"
                  headerBackgroundColor="#FFFFFF"
                  textColor="#000000"
                />
              );
            },
          }}
        />
        <HomeStack.Screen
          name="User"
          component={User}
          initialParams={{ userId: "" }}
          options={{
            headerShown: false,
          }}
        />
      </HomeStack.Navigator> */}
    </>
  );
}

// const styles = StyleSheet.create({});
