import { Alert, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import TabBarIcon from "../../components/TabBarIcon";
import { Button, Dialog, Portal, Switch } from "react-native-paper";
import PressableIcon from "../../components/PressableIcon";
import { axiosInstance } from "../../utilities/axiosInstance";
import Toast from "react-native-toast-message";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../../store";
import { useAppTheme } from "../../ThemeContext";
import AppText from "../../components/AppText";

export default function SearchHistory() {
  const { isDark, colors } = useAppTheme();
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [visible, setVisible] = useState(false);



  const storePauseSearchHistory = async (value: string) => {
    try {
      await AsyncStorage.setItem("pauseSearchHistory", value);
    } catch (e) {
      // saving error
      console.log("Error storing pauseSearchHistory: " + e);
    }
  };

  const getPauseSearchHistory = async () => {
    try {
      const value = await AsyncStorage.getItem("pauseSearchHistory");
      if (value !== null) {

        console.log("pauseSearchHistory value: " + value);
        // value previously stored

        if (value === "true") {
          setIsSwitchOn(true);
        } else {
          setIsSwitchOn(false);
        }
      }
    } catch (e) {
      // error reading value
      console.log("Error reading pauseSearchHistory: " + e);
    }
  };

  const hideDialog = () => setVisible(false);
  const onToggleSwitch = () => {
    console.log("Switch toggled: " + !isSwitchOn);
    storePauseSearchHistory(!isSwitchOn ? "true" : "false");
    setIsSwitchOn(!isSwitchOn);

     Toast.show({
          type: "success",
          text1: isSwitchOn ? "Resumed searches!": "Paused searches!",
          text2: isSwitchOn ? "Your search history resumed": "Your search history paused",
          visibilityTime: 2000,
        });
  };

  
  useEffect(() => {
    getPauseSearchHistory();
  }, []);

  const handleDeleteSearchHistory = async () => {
    try {
      const response = await axiosInstance.post(
        "/api/users/deleteFullSearchHistory",
        { withCredentials: true }
      );

      // console.log(response.data);
      hideDialog();
      if (response.data === "search_history_deleted_successfully") {
        // Alert.alert('All your searches are cleared')
        console.log("Deleted all searches");
        Toast.show({
          type: "success",
          text1: "Cleared searches!",
          text2: "All search history deleted 🗑️",
          visibilityTime: 2000,
        });
      }
    } catch (error) {
      console.log("Search history delete error: " + error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#343A46' : '#ffffff' }}>
      <View
        style={{
          // width: "80%",
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
          All your search related information will appear here
        </AppText>
      </View>
      <View
        style={{
          margin: 10,
          justifyContent: "center",
          backgroundColor: isDark ? "#222831" : "whitesmoke",
          padding: 15,
          borderRadius: 10,
        }}
      >
        <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <AppText
            style={{
              textAlign: "center",
              // marginHorizontal: 10,
              fontSize: 17,
              color: colors.text,
            }}
          >
            Clear search history
          </AppText>
          <PressableIcon
            iconName="delete"
            iconSize={25}
            iconColor={colors.text}
            rippleColor={""}
            disabled={false}
            onClick={() => {
              setVisible(true);
            }}
            customStyle={{ padding: 10 }}
          />
        </View>
        <AppText style={{ fontSize: 14, color: colors.text }}>
          All your searches will be deleted
        </AppText>
      </View>
      <View
        style={{
          margin: 10,
          justifyContent: "center",
          backgroundColor: isDark ? "#222831" : "whitesmoke",
          padding: 15,
          borderRadius: 10,
        }}
      >
        <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <AppText
            style={{
              textAlign: "center",
              // marginHorizontal: 10,
              fontSize: 17,
              color: colors.text,
            }}
          >
            Pause search history
          </AppText>
          <Switch
            color={colors.primary}
            value={isSwitchOn}
            onValueChange={onToggleSwitch}
            style={{ padding: 10 }}
          />
        </View>
        <AppText style={{ fontSize: 14, color: colors.text }}>
          Your further searches will not be saved
        </AppText>
      </View>

      <Portal>
        <Dialog
          visible={visible}
          onDismiss={hideDialog}
          style={{ backgroundColor: colors.background, borderRadius: 20 }}
        >
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <TabBarIcon name="search" color={colors.text} size={30} />
          </View>

          <Dialog.Title
            style={{
              fontFamily: "Dosis_700Bold",
              color: colors.text,
              textAlign: "center",
            }}
          >
            Clear search history
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
              Are you sure you want to delete all your search history?
            </AppText>
            <AppText
              style={{
                fontFamily: "Dosis_400Regular",
                color: colors.text,
                textAlign: "center",
                fontSize: 17,
              }}
            >
              All your searches will be deleted permanently...
            </AppText>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              style={{ backgroundColor: colors.primary, borderRadius: 10 }}
              onPress={hideDialog}
            >
              <AppText style={{ color: "#FFFFFF" }}>Cancel</AppText>
            </Button>
            <Button
              style={{ backgroundColor: "crimson", borderRadius: 10 }}
              onPress={handleDeleteSearchHistory}
            >
              <AppText style={{ color: "#FFFFFF" }}>Delete</AppText>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({});
