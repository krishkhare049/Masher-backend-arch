import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React, { useState } from "react";
import { Button, Dialog, Portal } from "react-native-paper";
import TabBarIcon from "../../components/TabBarIcon";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../../utilities/axiosInstance";
import { setLoggedOut } from "../../loggedSlice";
import * as SecureStore from "expo-secure-store";
// import { useRealm } from "@realm/react";
import database from "../../../index.native";
import { navigationRef } from "../../navigationRef";
import { useAppTheme } from "../../ThemeContext";
import AppText from "../../components/AppText";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MyAccount() {
  const dispatch = useDispatch();
  // const realm = useRealm()
  const { isDark, colors, resetToDefaultTheme } = useAppTheme();

  const [visible, setVisible] = useState(false);

  const hideDialog = () => setVisible(false);

  const logOutUser = async () => {
    console.log("Log out user");
    SecureStore.deleteItemAsync("secure_token");
    setVisible(false);

    // Remove global authorization header-
    // Set the global authorization header
    // axiosInstance.defaults.headers.common["Authorization"] = undefined;

    delete axiosInstance.defaults.headers.common["Authorization"];

    try {
      // realm.write(()=>{
      //   realm.deleteAll()
      // })

      await database.write(async () => {
        await database.unsafeResetDatabase();
      });

      resetToDefaultTheme();
      
      console.log("Database fully reset on logout!");

      if (navigationRef.isReady()) {
        navigationRef.reset({
          index: 0,
          routes: [{ name: "SignedOutStack" }],
        });
      }
    } catch (error) {
      console.log("Log out error: ", error);
    }

    dispatch(setLoggedOut());
    // navigation.popToTop()
  };

  return (
    <View style={{ backgroundColor: isDark ? '#343A46' : '#ffffff', flex: 1 }}>
      <View
        style={{
          justifyContent: "space-evenly",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        {/* <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "80%",
            padding: 5,
          }}
        >
          <Text
            style={{
              color: "gray",
              alignSelf: "flex-start",
              fontFamily: "Dosis_400Regular",
              fontSize: 18,
            }}
          >
            My account
          </Text>
        </View> */}

        <View
          style={{
            width: "80%",
            margin: 15,
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "flex-start",
          }}
        >
          <TabBarIcon name="infocirlceo" size={20} color={colors.text} />
          <AppText
            style={{
              color: colors.text,
              textAlign: "center",
              marginHorizontal: 10,
            }}
          >
            All your account related actions will appear here
          </AppText>
        </View>

        <View
          style={{
            // flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            // width: "80%",
            padding: 5,
            overflow: "hidden",
            borderRadius: 15,
            // backgroundColor: 'red',
            width: 150,
          }}
        >
          <Pressable
            // activeOpacity={0.4}
            android_ripple={{ color: isDark ? "#282C35" : "whitesmoke" }}
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
              padding: 5,
              // borderRadius: 15,
              // backgroundColor: '#ff0026',
              width: 150,
            }}
            onPress={() => {
              setVisible(true);
            }}
          >
            <TabBarIcon name="logout" size={30} color="#ff0026" />
            <AppText
              style={{
                color: "#ff0026",
                fontFamily: "Dosis_500Medium",
                fontSize: 25,
                alignSelf: "flex-start",
              }}
            >
              Log out
            </AppText>
          </Pressable>
        </View>
      </View>

      <Portal>
        <Dialog
          visible={visible}
          onDismiss={hideDialog}
          style={{ backgroundColor: colors.background, borderRadius: 20 }}
        >
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <TabBarIcon name="logout" color={colors.text} size={30} />
          </View>

          <Dialog.Title
            style={{
              fontFamily: "Dosis_700Bold",
              color: colors.text,
              textAlign: "center",
            }}
          >
            Log out
          </Dialog.Title>
          <Dialog.Content>
            <AppText
              style={{
                fontFamily: "Dosis_400Regular",
                color: colors.text,
                textAlign: "center",
                fontSize: 17,
              }}
            >
              Are you sure!.
            </AppText>
            <AppText
              style={{
                fontFamily: "Dosis_400Regular",
                color: colors.text,
                textAlign: "center",
                fontSize: 17,
              }}
            >
              You are going to log out from current account. All your messages
              and conversations will be deleted permanently...
            </AppText>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              style={{ backgroundColor: colors.primary, borderRadius: 10 }}
              onPress={() => {
                console.log("Cancel");
                setVisible(false);
              }}
            >
              <AppText style={{ color: "#FFFFFF" }}>Cancel</AppText>
            </Button>
            <Button
              style={{ backgroundColor: "crimson", borderRadius: 10 }}
              onPress={logOutUser}
            >
              <AppText style={{ color: "#FFFFFF" }}>Log out!</AppText>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({});
