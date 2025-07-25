import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { selectUserData, setUserData } from "../../userDataSlice";
import { axiosInstance } from "../../utilities/axiosInstance";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "react-native-svg";
import Toast from "react-native-toast-message";
import { useAppTheme } from "../../ThemeContext";
import AppText from "../../components/AppText";
import TabBarIcon from "../../components/TabBarIcon";

export default function ChangeUsername() {
  const { isDark, colors } = useAppTheme();
  const [userName, setUserName] = useState("");
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);
  const [loading, setLoading] = useState(false);

  const userData = useSelector(selectUserData);
  const dispatch = useDispatch();

  useEffect(() => {
    setUserName(userData.username);
  }, [userData.username]);

  const updateUsername = () => {
    if (!userName.trim()) {
      // Alert.alert("Invalid Input", "Username cannot be empty.");
       Toast.show({
            type: "error",
            text1: "Invalid username!",
            text2: "Username cannot be empty.",
            visibilityTime: 2000,
          });
      return;
    }

    setLoading(true);

    axiosInstance
      .post(
        "/api/users/updateUsername",
        { username: userName },
        { withCredentials: true }
      )
      .then((response) => {
        if (response.data === "username_updated_successfully") {
          dispatch(setUserData({ ...userData, username: userName }));
          // Alert.alert("Success", "Your username has been updated!");
          Toast.show({
            type: "success",
            text1: "Updated!",
            text2: "Your username has been updated! ✏️",
            visibilityTime: 2000,
          });
        } else if (
          response.data === "another_user_already_exist_with_username"
        ) {
           Toast.show({
            type: "error",
            text1: "Error updating username!",
            text2: "Something went wrong. Please try again.",
            visibilityTime: 2000,
          });
          setIsUsernameTaken(true);
        }
      })
      .catch((error) => {
        console.error("Error updating username:", error);
        // Alert.alert("Error", "Something went wrong. Please try again.");
           Toast.show({
            type: "error",
            text1: "Error updating username!",
            text2: "Something went wrong. Please try again.",
            visibilityTime: 2000,
          });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: isDark ? '#343A46' : '#FFFFFF' }]}
    >
      <View style={[styles.infoBox, { backgroundColor: isDark ? '#343A46' : '#fff' }]}> 
        <TabBarIcon name="infocirlceo" size={20} color={colors.text} />
        <AppText
          style={{ color: colors.text, textAlign: "center", marginHorizontal: 10 }}
        >
          Your friends, family and someone you know can find you using this username.
        </AppText>
      </View>
      <View style={[styles.inputContainer, { backgroundColor: isDark ? '#343A46' : '#fff', borderColor: isDark ? '#444E60' : '#ddd' }]}> 
        <AppText
          style={{
            fontSize: 20,
            backgroundColor: isDark ? "#222831" : "whitesmoke",
            padding: 17,
            borderRadius: 45,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            color: colors.text,
          }}
        >
          @
        </AppText>
        <TextInput
          style={[styles.input, { color: isDark ? '#fff' : '#000' }]}
          value={userName}
          onChangeText={(text) => {
            setUserName(text);
            setIsUsernameTaken(false);
          }}
          placeholder="Enter username"
          placeholderTextColor={isDark ? '#B1B9C8' : '#999'}
        />
      </View>
      {isUsernameTaken && (
        <AppText style={styles.errorText}>Username not available</AppText>
      )}
      <Pressable
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={updateUsername}
        disabled={loading}
        android_ripple={{ color: isDark ? '#444E60' : 'gainsboro', borderless: false }}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <AppText style={styles.buttonText}>Update</AppText>
        )}
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#f9f9f9",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    // justifyContent: "center",
    padding: 20,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
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
  infoText: {
    color: "gray",
    marginLeft: 10,
    fontSize: 15,
    fontFamily: "Dosis_500Medium",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    // paddingHorizontal: 15,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    width: "90%",
  },
  atSymbol: {
    fontSize: 23,
    fontFamily: "Dosis_500Medium",
    color: "#000000",
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 20,
    paddingHorizontal: 10,
    color: "#000000",
    fontFamily: "Dosis_500Medium",
  },
  errorText: {
    color: "crimson",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
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
    fontSize: 20,
    fontFamily: "Dosis_700Bold",
  },
});
