import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import AuthenticateOTP from "../screens/login_signup_screens/AuthenticateOTP";
import Intro from "../screens/login_signup_screens/Intro";
import Login from "../screens/login_signup_screens/Login";
import AddDetailsOnFirstTime from "../screens/login_signup_screens/AddDetailsOnFirstTime";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { RootStackParamList } from '../App'
import { RootStackParamList } from "../MainComponent";
import Signup from "../screens/login_signup_screens/Signup";

// import * as NavigationBar from 'expo-navigation-bar';

// NavigationBar.setVisibilityAsync('visible')

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function SignedOutStack() {
  return (
    // <NavigationContainer independent={true}>
    <NavigationIndependentTree>
      <NavigationContainer>
        <RootStack.Navigator
          initialRouteName="Intro"
          // screenOptions={{ navigationBarColor: "white" }}
        >
          <RootStack.Screen
            name="Intro"
            component={Intro}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="Login"
            component={Login}
            options={{ headerTitle: "Login", headerTitleStyle:{fontFamily: 'Dosis_600SemiBold'} }}
          />
          <RootStack.Screen
            name="Signup"
            component={Signup}
            options={{ headerTitle: "Create new account", headerTitleStyle:{fontFamily: 'Dosis_600SemiBold'} }}
          />
          <RootStack.Screen
            name="AuthenticateOTP"
            component={AuthenticateOTP}
            // options={{ headerTitle: "Enter OTP" }}
            options={{ headerTitle: "Enter Password" }}
          />
          <RootStack.Screen
            name="AddDetailsOnFirstTime"
            component={AddDetailsOnFirstTime}
            options={{ headerTitle: "Add your details" }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
    // </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
