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
  Pressable,
  FlatList,
} from "react-native";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import CustomButton from "../../components/CustomButton";
// import { Link } from "@react-navigation/native";
// import { RootStackParamList } from "../../App";
import { RootStackParamList } from "../../MainComponent";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { Surface } from "react-native-paper";
// import axios from "axios";

// const env = process.env.NODE_ENV;
// let API_URL = process.env.EXPO_PUBLIC_API_URL;

// if(env==='development' && Platform.OS === 'android'){
//   API_URL = 'http://10.0.2.2:5000'
// }

import * as SecureStore from "expo-secure-store";
import { useDispatch } from "react-redux";
import { setLoggedIn } from "../../loggedSlice";
import { axiosInstance } from "../../utilities/axiosInstance";
// import axios from "axios";
import { Checkbox, HelperText, TextInput } from "react-native-paper";

import { Formik } from "formik";
import * as Yup from "yup";
import { navigationRef } from "../../navigationRef";
import { FlashList } from "@shopify/flash-list";
import axios from "axios";

type LoginProps = NativeStackScreenProps<RootStackParamList, "Login">;

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  loginEmail: Yup.string()
    .matches(/^\S+$/, "Email should not contain spaces") // No spaces allowed
    .email("Invalid email address")

    // will do it later when we have our own email architecture
    // .matches(/@kimail.com$/, "Email must end with @kimail.com")
    .required("Email is required"),
  loginPassword: Yup.string()
    .matches(/^\S+$/, "Password should not contain spaces") // No spaces allowed
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

type searchResultsProps = {
  id: string;
  title: string;
};


export default function Login({ navigation }: LoginProps) {
  const dispatch = useDispatch();

  // const [isFocused, setIsFocused] = useState(false);
  // const [loginEmail, setLoginEmail] = useState("");
  // const [loginPassword, setLoginPassword] = useState("");

  const [clickedOnLogin, setClickedOnLogin] = useState(false);

  const [showPasswordChecked, setShowPasswordChecked] = useState(false);

  const [invalidCredentials, setInvalidCredentials] = useState(false); // Invalid Credentials

  // const loginAccount2 = () => {
  //   axiosInstance
  //     .post(
  //       // "http://localhost:5000/createAccount",
  //       // API_URL + "/logInToAccount",
  //       // "http://192.168.194.88:5000/api/auth/login",
  //       "/api/auth/login",
  //       {
  //         login_email: loginEmail,
  //         login_password: loginPassword,
  //       },
  //       { withCredentials: true }
  //     )
  //     .then((response) => {
  //       console.log(response.data);
  //       if (response.data.message === "user_not_found") {
  //         console.log(
  //           "No user found with these credentials. Invalid email and password!"
  //         );
  //         setClickedOnLogin(false);
  //         // Swal.fire({
  //         //   title: "Email is taken already!",
  //         //   text: "Try again with different email. If you are the user of this email, please login...",
  //         //   icon: "error",
  //         // });
  //       } else if (response.data.message === "logged_in_successfully") {
  //         // setLog(true);
  //         // setToken(response.data.token)
  //         SecureStore.setItemAsync("secure_token", response.data.token);
  //         setClickedOnLogin(false);
  //         // navigation.popToTop()
  //         dispatch(setLoggedIn());
  //       } else {
  //       }
  //     })

  //     .catch((error) => console.log("Error" + error));
  // };

  // const loginAccount = async (values: { loginEmail: string; loginPassword: string }, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
  const loginAccount = async (
    values: { loginEmail: string; loginPassword: string },
    { setSubmitting }: any
  ) => {
    setClickedOnLogin(true);
    setInvalidCredentials(false); // Reset Invalid Credentials Error
    try {
      const response = await axiosInstance.post(
        "/api/auth/login",
        {
          login_email: values.loginEmail,
          login_password: values.loginPassword,
        },
        { withCredentials: true }
      );

      // console.log(response.data);

      if (response.data.message === "logged_in_successfully") {
        await SecureStore.setItemAsync("secure_token", response.data.token);

        // Set the global authorization header
        axiosInstance.defaults.headers.common["Authorization"] =
          "Bearer " + response.data.token;

        dispatch(setLoggedIn());

        // navigation.navigate('SignedInStack')
        if (navigationRef.isReady()) {
          navigationRef.reset({
            index: 0,
            routes: [{ name: "SignedInStack" }],
          });
        }
      } else {
        setInvalidCredentials(true); // Show invalid credentials error on network failure
        console.log("Invalid login credentials");
      }
    } catch (error) {
      console.log("Error:", error);
      setInvalidCredentials(true); // Show invalid credentials error on network failure
    } finally {
      setClickedOnLogin(false);
      setSubmitting(false);
    }
  };

//   const [data, setData] = useState<searchResultsProps[]>([])

//   const fetchProducts = async () => {
//   const res = await axios.get("https://dummyjson.com/products?limit=10&skip=0");
//   console.log(data)
//   setData(res.data.products);
// };

// useEffect(()=>{
//   fetchProducts()
// }, [])


  return (
    <>
      <StatusBar backgroundColor={"#FFFFFF"} barStyle={"dark-content"} />

      {/* <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}> */}
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
            Login to your account
          </Text>

{/* <FlatList
  data={data}
  keyExtractor={(item) => item.id.toString()}
  // estimatedItemSize={40}
  renderItem={({ item }) => {
console.log(item.id)
    return(

      <View style={{ padding: 12, flexDirection: 'row', backgroundColor: 'red', width: '100%', height: 100 }}>
      <View style={{ marginLeft: 10 }}>
        <Text>{item.title}</Text>
      </View>
    </View>
    )
    }
  }
/> */}


          {/* Formik Wrapper */}
          <Formik
            initialValues={{ loginEmail: "", loginPassword: "" }}
            validationSchema={validationSchema}
            onSubmit={loginAccount}
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
                  Enter your email address
                </Text>
                {/* <TextInput
            inputMode="email"
            placeholder="Your email !"
            style={styles.inputBar}
            cursorColor={"#193088"}
            caretHidden={!isFocused}
            onFocus={() => {
              setIsFocused(true);
            }}
            value={loginEmail}
            onChangeText={setLoginEmail}
          /> */}

                <TextInput
                  style={styles.inputBar}
                  underlineStyle={{ display: "none" }}
                  // value={loginEmail}
                  value={values.loginEmail}
                  // onChangeText={setLoginEmail}
                  onChangeText={handleChange("loginEmail")}
                  onBlur={handleBlur("loginEmail")}
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
                {touched.loginEmail && errors.loginEmail && (
                  <Text style={styles.errorText}>{errors.loginEmail}</Text>
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

                {/*  */}
                {/* <TextInput
            inputMode="text"
            placeholder="Your password !"
            style={styles.inputBar}
            cursorColor={"#193088"}
            caretHidden={!isFocused}
            onFocus={() => {
              setIsFocused(true);
            }}
            value={loginPassword}
            onChangeText={setLoginPassword}
          /> */}
                <TextInput
                  style={styles.inputBar}
                  underlineStyle={{ display: "none" }}
                  // value={loginPassword}
                  value={values.loginPassword}
                  secureTextEntry={!showPasswordChecked}
                  // onChangeText={setLoginPassword}
                  onChangeText={handleChange("loginPassword")}
                  onBlur={handleBlur("loginPassword")}
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

                {touched.loginPassword && errors.loginPassword && (
                  <Text style={styles.errorText}>{errors.loginPassword}</Text>
                )}

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

                {/*  */}

                {/* Invalid Credentials Error */}
                {invalidCredentials && (
                  <HelperText type="error">
                    Invalid email or password
                  </HelperText>
                )}

                {/* <CustomButton name="Get OTP" bgColor="#fdbe00" pressedColor="orange" onClick={()=>{navigation.push('AuthenticateOTP')}} customStyle={{}}/> */}
                {/* {clickedOnLogin ? ( */}
                {clickedOnLogin || isSubmitting ? (
                  <ActivityIndicator
                    size={50}
                    color={"#193088"}
                    style={{ marginTop: 10 }}
                  />
                ) : (
                  <CustomButton
                    name="Log In"
                    bgColor="#193088"
                    borRadius={10}
                    pressedColor="#142666"
                    onClick={handleSubmit}
                    disabled={!isValid}
                    // onClick={() => {
                    //   // storage.set('logsave', 'Marc')
                    //   loginAccount();
                    //   // navigation.push("AddDetailsOnFirstTime");
                    //   setClickedOnLogin(true);
                    // }}
                    // customStyle={{ backgroundColor: "#193088", marginTop: 10 }}
                    customStyle={{ backgroundColor: "#193088" }}
                  />
                )}
              </>
            )}
          </Formik>

          {/* <Button title="Hide bar" onPress={hideNavigation} /> */}
        </View>
        {/* </Surface> */}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  loginInputView: {
    backgroundColor: "#FFFFFF",
    // backgroundColor: "red",
    //   borderTopLeftRadius: 130,
    // borderTopRightRadius: 30,
    paddingTop: 10,
    paddingBottom: 10,
    // borderBottomColor: "white",
    // borderLeftColor: "white",
    // borderRightColor: "white",
    // borderTopColor: "whitesmoke",
    // borderWidth: 3,
    paddingHorizontal: 50,
    //   position: "absolute",
    //   bottom: 110,
    width: "100%",
  },
  inputBar: {
    // paddingHorizontal: 12,
    // paddingVertical: 12,
    borderRadius: 15,
    backgroundColor: "whitesmoke",
    // borderWidth: 2,
    borderColor: "whitesmoke",
    width: 250,
    color: "#193088",
    marginHorizontal: "auto",
    fontSize: 19,
    marginBottom: 10,
    // textAlign: "center",
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
