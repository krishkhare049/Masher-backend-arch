import {
  Button,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  // TextInput,
  View,
  ScrollView,
  ActivityIndicator,
  Platform,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import CustomButton from "../../components/CustomButton";
import { Link } from "@react-navigation/native";
// import { RootStackParamList } from "../../App";
import { RootStackParamList } from "../../MainComponent";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Checkbox, HelperText, Surface, TextInput } from "react-native-paper";
import axios from "axios";

import * as SecureStore from "expo-secure-store";
import { useDispatch } from "react-redux";
import { setLoggedIn } from "../../loggedSlice";
import { axiosInstance } from "../../utilities/axiosInstance";

import { Formik } from "formik";
import * as Yup from "yup";
import { navigationRef } from "../../navigationRef";

type SignupProps = NativeStackScreenProps<RootStackParamList, "Signup">;

// const env = process.env.NODE_ENV;
// let API_URL = process.env.EXPO_PUBLIC_API_URL;

// if(env==='development' && Platform.OS === 'android'){
//   API_URL = 'http://10.0.2.2:5000'
// }

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  newName: Yup.string()
    // .matches(/^\S+$/, "Email should not contain spaces") // No spaces allowed
    // .email("Invalid email address")
    .min(3, "Name is too short")
    .max(15, "Name is too long")
    // will do it later when we have our own email architecture
    // .matches(/@kimail.com$/, "Email must end with @kimail.com")
    .required("Name is required"),
  newEmail: Yup.string()
    .matches(/^\S+$/, "Email should not contain spaces") // No spaces allowed
    .email("Invalid email address")

    // will do it later when we have our own email architecture
    // .matches(/@kimail.com$/, "Email must end with @kimail.com")
    .required("Email is required"),
  newPassword: Yup.string()
    .matches(/^\S+$/, "Password should not contain spaces") // No spaces allowed
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Signup({ navigation }: SignupProps) {
  const dispatch = useDispatch();

  // const [isFocused, setIsFocused] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");

  const [clickedOnCreate, setClickedOnCreate] = useState(false);
  const [showPasswordChecked, setShowPasswordChecked] = useState(false);

  const [userAlreadyExists, setUserAlreadyExists] = useState(false); // User already exists

  const createAccount = async (
    values: { newName: string; newEmail: string; newPassword: string },
    { setSubmitting }: any
  ) => {
    setClickedOnCreate(true);
    setUserAlreadyExists(false); // Reset Invalid Credentials Error
    try {
      const response = await axiosInstance.post(
        "/api/auth/signup",
        {
          full_name: values.newName,
          user_email: values.newEmail,
          user_password: values.newPassword,
        },
        { withCredentials: true }
      );

      // console.log(response.data);

      if (response.data.message === "signed_up_successfully") {
        await SecureStore.setItemAsync("secure_token", response.data.token);

        // Set the global authorization header
        axiosInstance.defaults.headers.common["Authorization"] =
          "Bearer " + response.data.token;

        dispatch(setLoggedIn());

        if (navigationRef.isReady()) {
          navigationRef.reset({
            index: 0,
            routes: [{ name: "SignedInStack" }],
          });
        }
      } else {
        setUserAlreadyExists(true); // Show invalid credentials error on network failure
        console.log("User already exists");
      }
    } catch (error) {
      console.log("Error:", error);
      setUserAlreadyExists(true); // Show invalid credentials error on network failure
    } finally {
      setClickedOnCreate(false);
      setSubmitting(false);
    }
  };

  return (
    <>
      <StatusBar backgroundColor={"#FFFFFF"} barStyle={"dark-content"} />

      <ScrollView
        style={{ flex: 1, backgroundColor: "#FFFFFF" }}
        keyboardShouldPersistTaps="handled"
      >
        {/* <Surface style={styles.loginInputView} elevation={5}> */}

        <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            // marginBottom: 100,
            //   marginBottom: 50,
            marginTop: 100,
          }}
        >
          <Image
            style={styles.img}
            source={require("../../../assets/icons/smile.jpg")}
          />

          <Text
            style={{
              color: "#193088",
              fontFamily: "Dosis_700Bold",
              fontSize: 26,
              marginBottom: 30,
            }}
          >
            Create your account
          </Text>

          {/* Formik Wrapper */}
          <Formik
            initialValues={{ newName: "", newEmail: "", newPassword: "" }}
            validationSchema={validationSchema}
            onSubmit={createAccount}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isValid,
              isSubmitting,
            }) => (
              <>
                <Text
                  style={{
                    fontFamily: "Dosis_400Regular",
                    fontSize: 16,
                    margin: 5,
                  }}
                >
                  What's Your good name?
                </Text>
                {/* <TextInput
            inputMode="email"
            placeholder="Your good name !"
            style={styles.inputBar}
            cursorColor={"#193088"}
            //   caretHidden={!isFocused}
            //   onFocus={() => {
            //     setIsFocused(true);
            //   }}
            value={newName}
            onChangeText={setNewName}
          /> */}

                <TextInput
                  style={styles.inputBar}
                  underlineStyle={{ display: "none" }}
                  // value={newName}
                  value={values.newName}
                  // onChangeText={setNewName}
                  onChangeText={handleChange("newName")}
                  onBlur={handleBlur("newName")}
                  label={
                    <Text
                      style={{
                        color: "gray",
                        // color: "#193088",
                        textAlign: "center",
                        fontFamily: "Dosis_400Regular",
                      }}
                    >
                      Your good name !
                    </Text>
                  }
                  placeholderTextColor={"gainsboro"}
                  outlineStyle={{
                    borderWidth: 0,
                    borderRadius: 15,
                    // borderTopRightRadius: 0,
                    // borderBottomRightRadius: 0,
                    margin: 0,
                    padding: 0,
                  }}
                  mode="outlined"
                  cursorColor="royalblue"
                  contentStyle={{
                    fontFamily: "Dosis_400Regular",
                    color: "#193088",
                  }}
                />

                {touched.newName && errors.newName && (
                  <Text style={styles.errorText}>{errors.newName}</Text>
                )}

                <Text
                  style={{
                    fontFamily: "Dosis_400Regular",
                    fontSize: 16,
                    margin: 5,
                  }}
                >
                  Enter your email address
                </Text>
                {/* <TextInput
            inputMode="email"
            placeholder="Your email !"
            style={styles.inputBar}
            cursorColor={"#193088"}
            //   caretHidden={!isFocused}
            //   onFocus={() => {
            //     setIsFocused(true);
            //   }}
            value={newEmail}
            onChangeText={setNewEmail}
          /> */}

                <TextInput
                  style={styles.inputBar}
                  underlineStyle={{ display: "none" }}
                  // value={newEmail}
                  value={values.newEmail}
                  // onChangeText={setNewEmail}
                  onChangeText={handleChange("newEmail")}
                  onBlur={handleBlur("newEmail")}
                  label={
                    <Text
                      style={{
                        color: "gray",
                        // color: "#193088",
                        textAlign: "center",
                        fontFamily: "Dosis_400Regular",
                      }}
                    >
                      Your email !
                    </Text>
                  }
                  placeholderTextColor={"gainsboro"}
                  outlineStyle={{
                    borderWidth: 0,
                    borderRadius: 15,
                    // borderTopRightRadius: 0,
                    // borderBottomRightRadius: 0,
                    margin: 0,
                    padding: 0,
                  }}
                  mode="outlined"
                  cursorColor="royalblue"
                  contentStyle={{
                    fontFamily: "Dosis_400Regular",
                    color: "#193088",
                  }}
                />

                {touched.newEmail && errors.newEmail && (
                  <Text style={styles.errorText}>{errors.newEmail}</Text>
                )}

                <Text
                  style={{
                    fontFamily: "Dosis_400Regular",
                    fontSize: 16,
                    margin: 5,
                  }}
                >
                  Enter your password
                </Text>
                {/* <TextInput
            inputMode="text"
            placeholder="Your password !"
            style={styles.inputBar}
            cursorColor={"#193088"}
            //   caretHidden={!isFocused}
            //   onFocus={() => {
            //     setIsFocused(true);
            //   }}
            value={newPassword}
            onChangeText={setNewPassword}
          /> */}

                <TextInput
                  style={styles.inputBar}
                  underlineStyle={{ display: "none" }}
                  // value={newPassword}
                  value={values.newPassword}
                  secureTextEntry={!showPasswordChecked}
                  // onChangeText={setNewPassword}
                  onChangeText={handleChange("newPassword")}
                  onBlur={handleBlur("newPassword")}
                  label={
                    <Text
                      style={{
                        color: "gray",
                        // color: "#193088",
                        textAlign: "center",
                        fontFamily: "Dosis_400Regular",
                      }}
                    >
                      Your password !
                    </Text>
                  }
                  placeholderTextColor={"gainsboro"}
                  outlineStyle={{
                    borderWidth: 0,
                    borderRadius: 15,
                    // borderTopRightRadius: 0,
                    // borderBottomRightRadius: 0,
                    margin: 0,
                    padding: 0,
                  }}
                  mode="outlined"
                  cursorColor="royalblue"
                  contentStyle={{
                    fontFamily: "Dosis_400Regular",
                    color: "#193088",
                  }}
                />

                <View>
                  <Pressable
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={() => {
                      setShowPasswordChecked(!showPasswordChecked);
                    }}
                  >
                    <Checkbox
                      status={showPasswordChecked ? "checked" : "unchecked"}
                      onPress={() => {
                        setShowPasswordChecked(!showPasswordChecked);
                      }}
                      color="#193088"
                    />
                    <Text
                      style={{ fontFamily: "Dosis_500Medium", fontSize: 15 }}
                    >
                      Show password
                    </Text>
                  </Pressable>
                </View>

                {touched.newPassword && errors.newPassword && (
                  <Text style={styles.errorText}>{errors.newPassword}</Text>
                )}

                {/* <CustomButton name="Get OTP" bgColor="#fdbe00" pressedColor="orange" onClick={()=>{navigation.push('AuthenticateOTP')}} customStyle={{}}/> */}
                {/* <CustomButton
            name="Create"
            bgColor="#193088"
            pressedColor="#142666"
            onClick={() => {
              // storage.set('logsave', 'Marc')
              // createAccount()
              // navigation.push("AddDetailsOnFirstTime");
            }}
            customStyle={{ backgroundColor: "#193088", marginTop: 10 }}
          /> */}

                {/* User already exists */}
                {userAlreadyExists && (
                  <HelperText type="error">
                    User with this email already exists
                  </HelperText>
                )}

                {clickedOnCreate || isSubmitting ? (
                  <ActivityIndicator
                    size={50}
                    color={"#193088"}
                    style={{ marginTop: 10 }}
                  />
                ) : (
                  <CustomButton
                    name="Create"
                    bgColor="#193088"
                    borRadius={10}
                    pressedColor="#142666"
                    onClick={handleSubmit}
                    customStyle={{ backgroundColor: "#193088" }}
                    disabled={!isValid}
                  />
                )}
              </>
            )}
          </Formik>
        </View>
        {/* </Surface> */}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  inputBar: {
    borderRadius: 15,
    backgroundColor: "whitesmoke",
    width: 250,
    color: "#193088",
    marginHorizontal: "auto",
    fontSize: 19,
    marginBottom: 10,
    fontFamily: "Dosis_400Regular",
  },
  img: {
    width: 80,
    height: 80,
    borderRadius: 100,
  },
  errorText: {
    color: "crimson",
    fontSize: 14,
    fontFamily: "Dosis_400Regular",
    marginBottom: 5,
  },
});
