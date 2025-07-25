// import {
//   StyleSheet,
//   // Text,
//   // View,
//   // SafeAreaView,
//   // Button,
//   // ScrollView,
//   // StatusBar,
// } from "react-native";
// import React, { useRef } from "react";
// // import { Link } from "@react-navigation/native";
// // import { NavigationContainer } from "@react-navigation/native";
// import {
//   createNativeStackNavigator,
//   NativeStackScreenProps,
// } from "@react-navigation/native-stack";

// // import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// // import { RootStackParamList } from "../App";
// import { RootStackParamList } from "../MainComponent";

// import { useScrollToTop } from "@react-navigation/native";

// import Privacy from "./settings_screens/Privacy";
// import Payments from "./settings_screens/Payments";
// import Settings from "./Settings";
// import Profile from "./Profile";
// import CustomHeader from "../components/CustomHeader";
// import EditProfile from "./EditProfile";
// import Customization from "./settings_screens/Customization";
// import Theme from "./settings_screens/Theme";
// import ChangeUsername from "./settings_screens/ChangeUsername";
// import ChangePassword from "./settings_screens/ChangePassword";
// import SearchHistory from "./settings_screens/SearchHistory";
// import Security from "./settings_screens/Security";
// import CustomerService from "./settings_screens/CustomerService";
// import MyAccount from "./settings_screens/MyAccount";
// import Info from "./settings_screens/Info";
// import Blocked from "./settings_screens/Blocked";
// import FAQ from "./settings_screens/FAQ";
// import LiveChat from "./settings_screens/LiveChat";
// // import Profile from "./Profile";
// // import Notes from "./Notes";
// // import ContactList from "../components/ContactList";
// // import AddDetailsOnFirstTime from "./login_signup_screens/AddDetailsOnFirstTime";
// // import TabBarIcon from "../components/TabBarIcon";

// // import { StatusBar } from "expo-status-bar";

// // const Tab = createBottomTabNavigator<RootStackParamList>();
// const MeStack = createNativeStackNavigator<RootStackParamList>();

// type MeProps = NativeStackScreenProps<RootStackParamList, "Me">;

// export default function Me({ navigation }: MeProps) {
//   const ScrollRef = useRef(null);

//   // The expected native behavior of scrollable components is to respond to events from navigation that will scroll to top when tapping on the active tab as you would expect from native tab bars.
//   // In order to achieve it we export useScrollToTop which accept ref to scrollable component (e,g. ScrollView or FlatList).
//   useScrollToTop(ScrollRef);

//   return (
//     <>
//       <MeStack.Navigator initialRouteName="Profile">
//         {/* <MeStack.Screen name="Notifications" component={Notifications} initialParams={{userId: 'k2', message: 'hi'}}/> */}
//         <MeStack.Screen
//           name="Profile"
//           component={Profile}
//           options={{ headerShown: false }}
//         />
//         <MeStack.Screen
//           name="Settings"
//           component={Settings}
//           options={{
//             header(props) {
//               // return <CustomHeader name="Settings" headerBackgroundColor="#007bff" />;
//               return (
//                 <CustomHeader
//                   name="Settings"
//                   headerBackgroundColor="#FFFFFF"
//                   textColor="#000000"
//                 />
//               );
//             },
//           }}
//         />
//         <MeStack.Screen
//           name="EditProfile"
//           component={EditProfile}
//           options={{
//             header(props) {
//               return (
//                 <CustomHeader
//                   name="Edit Profile"
//                   headerBackgroundColor="#fdbe00"
//                   textColor="white"
//                 />
//               );
//             },
//           }}
//         />

//         {/* Settings pages */}
//         <MeStack.Screen
//           name="Customization"
//           component={Customization}
//           options={{
//             header(props) {
//               return (
//                 <CustomHeader
//                   name="Customization"
//                   headerBackgroundColor="#FFFFFF"
//                   textColor="#000000"
//                 />
//               );
//             },
//           }}
//         />

//         <MeStack.Screen
//           name="Privacy"
//           component={Privacy}
//           options={{
//             header(props) {
//               return (
//                 <CustomHeader
//                   name="Privacy"
//                   // headerBackgroundColor="#ff0026"
//                   headerBackgroundColor="royalblue"
//                   textColor="white"
//                 />
//               );
//             },
//           }}
//         />
//         <MeStack.Screen
//           name="Payments"
//           component={Payments}
//           options={{
//             header(props) {
//               return (
//                 <CustomHeader
//                   name="Payments"
//                   headerBackgroundColor="#129953"
//                   textColor="white"
//                 />
//               );
//             },
//           }}
//         />
//         <MeStack.Screen
//           name="Theme"
//           component={Theme}
//           options={{
//             header(props) {
//               return (
//                 <CustomHeader
//                   name="Theme"
//                   headerBackgroundColor="#FFFFFF"
//                   textColor="#000000"
//                 />
//               );
//             },
//           }}
//         />
//         <MeStack.Screen
//           name="ChangeUsername"
//           component={ChangeUsername}
//           options={{
//             header(props) {
//               return (
//                 <CustomHeader
//                   name="Change Username"
//                   headerBackgroundColor="#FFFFFF"
//                   textColor="#000000"
//                 />
//               );
//             },
//           }}
//         />
//         <MeStack.Screen
//           name="ChangePassword"
//           component={ChangePassword}
//           options={{
//             header(props) {
//               return (
//                 <CustomHeader
//                   name="Change Password"
//                   headerBackgroundColor="#FFFFFF"
//                   textColor="#000000"
//                 />
//               );
//             },
//           }}
//         />
//         <MeStack.Screen
//           name="SearchHistory"
//           component={SearchHistory}
//           options={{
//             header(props) {
//               return (
//                 <CustomHeader
//                   name="Search History"
//                   headerBackgroundColor="#FFFFFF"
//                   textColor="#000000"
//                 />
//               );
//             },
//           }}
//         />
//         <MeStack.Screen
//           name="Blocked"
//           component={Blocked}
//           options={{
//             header(props) {
//               return (
//                 <CustomHeader
//                   name="Blocked"
//                   headerBackgroundColor="#FFFFFF"
//                   textColor="#000000"
//                 />
//               );
//             },
//           }}
//         />
//         <MeStack.Screen
//           name="Security"
//           component={Security}
//           options={{
//             header(props) {
//               return (
//                 <CustomHeader
//                   name="Security"
//                   headerBackgroundColor="#FFFFFF"
//                   textColor="#000000"
//                 />
//               );
//             },
//           }}
//         />
//         <MeStack.Screen
//           name="CustomerService"
//           component={CustomerService}
//           options={{
//             header(props) {
//               return (
//                 <CustomHeader
//                   name="Customer Service"
//                   headerBackgroundColor="#FFFFFF"
//                   textColor="#000000"
//                 />
//               );
//             },
//           }}
//         />
//         <MeStack.Screen
//           name="FAQ"
//           component={FAQ}
//           options={{
//             header(props) {
//               return (
//                 <CustomHeader
//                   name="FAQs"
//                   headerBackgroundColor="#FFFFFF"
//                   textColor="#000000"
//                 />
//               );
//             },
//           }}
//         />
//         <MeStack.Screen
//           name="LiveChat"
//           component={LiveChat}
//           options={{
//             header(props) {
//               return (
//                 <CustomHeader
//                   name="FAQs"
//                   headerBackgroundColor="#FFFFFF"
//                   textColor="#000000"
//                 />
//               );
//             },
//           }}
//         />
//         <MeStack.Screen
//           name="MyAccount"
//           component={MyAccount}
//           options={{
//             header(props) {
//               return (
//                 <CustomHeader
//                   name="My Account"
//                   headerBackgroundColor="#FFFFFF"
//                   textColor="#000000"
//                 />
//               );
//             },
//           }}
//         />
//         <MeStack.Screen
//           name="Info"
//           component={Info}
//           options={{
//             header(props) {
//               return (
//                 <CustomHeader
//                   name="Info"
//                   headerBackgroundColor="#FFFFFF"
//                   textColor="#000000"
//                 />
//               );
//             },
//           }}
//         />



//       </MeStack.Navigator>
//     </>
//   );
// }

// const styles = StyleSheet.create({});
