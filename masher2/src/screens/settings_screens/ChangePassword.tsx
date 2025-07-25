// First verify if user's entered password matches to actual password and provide a forgot password option which will show a new page in which add a get otp to change password and when user clicks on it, the user will receiver otp on his/her phone number/email and if otp entered by user matches then allow user to enter a new password then update password.

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import React, { useState } from "react";
// import { TextInput } from 'react-native-paper';
import { Ionicons } from "@expo/vector-icons";
import { axiosInstance } from "../../utilities/axiosInstance";
import { useAppTheme } from "../../ThemeContext";
import AppText from "../../components/AppText";


import { Formik } from "formik";
import * as Yup from "yup";
import CustomButton from "../../components/CustomButton";
import { set } from "date-fns";
import Toast from "react-native-toast-message";
import TabBarIcon from "../../components/TabBarIcon";

const validationSchema = Yup.object().shape({
 oldPassword: Yup.string()
    .trim()
    .matches(/^\S+$/, "Password should not contain spaces")
    .min(6, "Password must be at least 6 characters")
    .required("Old Password is required"),

  newPassword: Yup.string()
    .trim()
    .matches(/^\S+$/, "Password should not contain spaces")
    .min(6, "Password must be at least 6 characters")
    .required("New Password is required"),

  confirmNewPassword: Yup.string()
    .trim()
    .oneOf([Yup.ref("newPassword")], "New Password must match")
    .required("Confirm Password is required"),
});


export default function ChangePassword() {
  const { isDark, colors } = useAppTheme();
  // const [oldPassword, setOldPassword] = useState("");
  // const [newPassword, setNewPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  // const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const [clickedOnUpdate, setClickedOnUpdate] = useState(false);
  
  // const validatePassword = () => {
  //   if (newPassword.length < 6) {
  //     Alert.alert(
  //       "Weak Password",
  //       "Password should be at least 6 characters long."
  //     );
  //     return false;
  //   }
  //   if (newPassword !== confirmPassword) {
  //     Alert.alert("Mismatch", "New password and confirmation do not match.");
  //     return false;
  //   }
  //   return true;
  // };

  const updatePassword = async ( values: { oldPassword: string; newPassword: string; confirmNewPassword: string },
    { setSubmitting }: any
  ) => {
    // if (!validatePassword()) return;

    setClickedOnUpdate(true);

    // setLoading(true);
    try {
      const response = await axiosInstance.post(
        "/api/users/updatePassword",
        {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
          confirmNewPassword: values.confirmNewPassword,
         },
        { withCredentials: true }
      );

      if (response.data === "password_updated_successfully") {
        // Alert.alert("Success", "Your password has been updated!");
        Toast.show({
        type: "success",
        text1: "Password Updated! 🎉",
        text2: "Your password has been updated successfully.",
        position: "bottom",
        visibilityTime: 3000,
        autoHide: true,
      });

      } else {
        // Alert.alert("Error", "Incorrect old password.");
          Toast.show({
        type: "error",
        text1: "Password not updated! ❌",
        text2: "Please try again later!.",
        position: "bottom",
        visibilityTime: 3000,
        autoHide: true,
      });
      }
    } catch (error) {
      console.error("Password update error:", error);
      Toast.show({
        type: "error",
        text1: "Password not updated! ❌",
        text2: "Please try again.",
        position: "bottom",
        visibilityTime: 3000,
        autoHide: true,
      });
    } finally {
       setClickedOnUpdate(false);
      setSubmitting(false);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: isDark ? '#343A46' : '#ffffff' }]}
    >

      <View style={[styles.infoBox, { backgroundColor: isDark ? '#343A46' : '#fff' }]}> 
        <TabBarIcon name="infocirlceo" size={20} color={colors.text} />
        <AppText
          style={{ color: colors.text, marginHorizontal: 10 }}
        >
          To keep your account secure, we recommend using a strong, unique password that you don’t use anywhere else

        </AppText>
       
        
      </View>
      <View>
         <AppText
          style={{ color: colors.text, fontSize: 16 }}
    >

          Your new password should: {'\n\n'}

          1. Be at least 8 characters long{'\n'}

          2. Include a mix of letters, numbers, and symbols{'\n'}

          3. Avoid common words or easily guessed info {'\n'} (like your name or birthdate){'\n'}

        </AppText>
      </View>

            {/* Formik Wrapper */}
                <Formik
                  initialValues={{ oldPassword: '', newPassword: '', confirmNewPassword: '' }}
                  validationSchema={validationSchema}
                  onSubmit={updatePassword}
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

      {/* Old Password */}
      <View style={[styles.inputContainer, { backgroundColor:'whitesmoke' }]}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Old Password"
          placeholderTextColor="#999"
          secureTextEntry={!showOldPassword}
          value={values.oldPassword}
           onChangeText={handleChange("oldPassword")}
        />
        <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)}>
          <Ionicons
            name={!showOldPassword ? "eye-off" : "eye"}
            size={22}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>

      
           {touched.oldPassword && errors.oldPassword && (
                        <Text style={styles.errorText}>{errors.oldPassword}</Text>
                      )}

      {/* New Password */}
      <View style={[styles.inputContainer, { backgroundColor: 'whitesmoke' }]}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="New Password"
          placeholderTextColor="#999"
          secureTextEntry={!showNewPassword}
            value={values.newPassword}
           onChangeText={handleChange("newPassword")}
        />
        <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
          <Ionicons
            name={!showNewPassword ? "eye-off" : "eye"}
            size={22}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>

           {touched.newPassword && errors.newPassword && (
                        <Text style={styles.errorText}>{errors.newPassword}</Text>
                      )}

      {/* Confirm New Password */}
      <View style={[styles.inputContainer, { backgroundColor: 'whitesmoke'}]}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Confirm New Password"
          placeholderTextColor="#999"
          secureTextEntry={!showConfirmPassword}
          value={values.confirmNewPassword}
           onChangeText={handleChange("confirmNewPassword")}

        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <Ionicons
            name={!showConfirmPassword ? "eye-off" : "eye"}
            size={22}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>

        {touched.confirmNewPassword && errors.confirmNewPassword && (
                        <Text style={styles.errorText}>{errors.confirmNewPassword}</Text>
                      )}

  {/* Update Password Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }, !isValid && { opacity: 0.6 }]}
        // onPress={updatePassword}
                    //  onClick={handleSubmit}
                      onPress={() => {
                        // if(isValid) {
                        // setClickedOnUpdate(true);
                        handleSubmit();
                        // }

                      }}
        // disabled={loading}
                     disabled={!isValid}
        activeOpacity={0.7}
      >
        {clickedOnUpdate || isSubmitting ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <AppText style={[styles.buttonText, { color: '#fff' }]}>Update Password</AppText>
        )}
      </TouchableOpacity>

      {/* {clickedOnUpdate || isSubmitting ? (
                   <ActivityIndicator
                     size={50}
                     color={"#193088"}
                     style={{ marginTop: 10 }}
                   />
                 ) : (
                   <CustomButton
                     name="Update Password"
                     bgColor="#193088"
                     borRadius={10}
                     pressedColor="#142666"
                     onClick={handleSubmit}
                     customStyle={{ backgroundColor: "#193088", width: 200, marginTop: 20, border }}
                     disabled={!isValid}
                   />
               )} */}
                         </>
                       )}
                     </Formik>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    // justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    borderRadius: 12,
    // borderWidth: 1,
    borderColor: "#ddd",
    width: "90%",
    // marginBottom: 10,
    marginVertical: 10,
    height: 50,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    paddingHorizontal: 10,
    color: "#333",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
   errorText: {
    color: "crimson",
    fontSize: 14,
    fontFamily: "Dosis_400Regular",
    marginBottom: 5,
  },
   infoBox: {
    flexDirection: "row",
    // alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    // elevation: 4,
    // width: "90%",
  },
});
