import {
  BackHandler,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import MasherLogo from "./MasherLogo";
import PressableIcon from "./PressableIcon";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../MainComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsConvMenuVisible,
  selectMoreIconMenuVisible,
  selectSelectedConversationIds,
  setIsConvMenuVisible,
  setMoreIconMenuVisible,
  setSelectedConversationIds,
} from "../chatScreenStatesSlice";
import DeleteConvMenu from "./DeleteConvMenu";
import { Button, Dialog, Portal, useTheme } from "react-native-paper";
import TabBarIcon from "./TabBarIcon";
import { axiosInstance } from "../utilities/axiosInstance";
import deleteBulkConversations from "../database/deleteBulkConversations";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import { Image } from "expo-image";
import { useAppTheme } from "../ThemeContext";

export default function ChatScreenCustomHeader() {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, "MessagingScreen">
    >();
  const { colors, isDark } = useAppTheme();
  const dispatch = useDispatch();

  const isConvMenuVisible = useSelector(selectIsConvMenuVisible);

  //   console.log(isConvMenuVisible, "kk")
  const selectedConversationsIds = useSelector(selectSelectedConversationIds);
  const moreIconMenuVisible = useSelector(selectMoreIconMenuVisible);
  const [askConvVisible, setAskConvVisible] = useState(false);

  useEffect(() => {
    // console.log(selectedConversationsIds);
    if (selectedConversationsIds.length === 0) {
      handleHideConversationMenu();
    }
  }, [selectedConversationsIds]);

  const deleteConversation = () => {
    // console.log(selectedConversationId);

    axiosInstance
      .post(
        "/api/conversations/deleteConversation",
        {
          conversationIds: selectedConversationsIds,
        },
        { withCredentials: true }
      )

      .then((response) => {
        // console.log(response.data);
        if (response.data === "conversation_deleted_successfully") {
          console.log("Conversation deleted");

          deleteBulkConversations(selectedConversationsIds);

          // setConversationsData((prev) =>
          //   prev.filter(
          //     (conv) =>
          //       conv.conversations.conversationId !== selectedConversationId
          //   )
          // );
          // setSelectedConversationId(null);
          // setIsConvMenuVisible(false);
        } else {
        }
      })
      .catch((error) => console.log("Error" + error))
      .finally(() => [handleHideConversationMenu()]);
  };

  const handleHideConversationMenu = () => {
    if (isConvMenuVisible) {
      // If the menu is visible, hide it and prevent the default back action
      dispatch(setIsConvMenuVisible(false));
      setAskConvVisible(false);
      // setSelectedConversationId(null);
      dispatch(setSelectedConversationIds([]));
      return true; // Prevent the default back action
    }
    return false; // Allow the default back action if the menu is not visible
  };

  const hideMoreIconMenu = () => {
    if (moreIconMenuVisible) {
      dispatch(setMoreIconMenuVisible(false));
      return true;
    }
    return false;
  };

  useEffect(() => {
    // Add event listener for back button
    // const backHandler = BackHandler.addEventListener(
    //   "hardwareBackPress",
    //   handleHideConversationMenu,
    // );

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        const handledConvMenu = handleHideConversationMenu();
        const handledMoreIcon = hideMoreIconMenu();

        // If either menu was visible and handled, prevent default back action
        return handledConvMenu || handledMoreIcon;
      }
    );

    // Cleanup the event listener on component unmount
    return () => backHandler.remove();
    // }, [isConvMenuVisible, moreIconMenuVisible]);
  }, [isConvMenuVisible, moreIconMenuVisible]);

  if (!isConvMenuVisible) {
    return (
      <>
        <View
          style={{
            // flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 7,
            paddingRight: 10,
            // backgroundColor: "#fdbe00",
            backgroundColor: colors.background,
          }}
        >
          <MasherLogo />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
              // width: 50,
            }}
          >
            <PressableIcon
              iconName="search"
              iconColor="#FFFFFF"
              iconSize={25}
              customStyle={{ padding: 8, borderRadius: 100 }}
              onClick={() => {}}
              disabled={false}
              rippleColor=""
              // rippleColor="#e8ae00"
            />
            <PressableIcon
              iconName="notifications"
              iconSize={25}
              // rippleColor="#e8ae00"
              rippleColor=""
              iconColor="white"
              onClick={() => {
                // navigation.push("Notifications");
                navigation.navigate("Notifications");
              }}
              customStyle={{
                padding: 8,
                borderRadius: 100,
              }}
              disabled={false}
            />
            <Menu
              opened={moreIconMenuVisible}
              onBackdropPress={() => {
                dispatch(setMoreIconMenuVisible(false));
              }}
              style={{ borderRadius: 30, overflow: "hidden" }}
            >
              <MenuTrigger
                onPress={() => {
                  dispatch(setMoreIconMenuVisible(true));
                }}
                style={{ padding: 8 }}
              >
                <TouchableNativeFeedback
                  background={TouchableNativeFeedback.Ripple("#FF5722", true)} // Custom ripple color
                  useForeground={true} // Ensure ripple effect appears inside the view
                >
                  <TabBarIcon name="moreHorizontal" size={25} color="#FFFFFF" />
                </TouchableNativeFeedback>
              </MenuTrigger>
              <MenuOptions
                optionsContainerStyle={{ borderRadius: 10, padding: 5,  backgroundColor: !isDark ? '#FFFFFF' : '#343A46' }}
              >
                <MenuOption
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    padding: 10,
                    borderRadius: 100,
                  }}
                  onSelect={() => {
                    dispatch(setMoreIconMenuVisible(false));
                    navigation.navigate("CreateGroup");
                  }}
                >
                  <TabBarIcon
                    name="defaultGroupIcon"
                    size={20}
                    // color="#000000"
                    color={colors.text}
                  />
                  <Text
                    style={{ fontFamily: "Dosis_500Medium", marginLeft: 10, color: colors.text }}
                  >
                    Create Group
                  </Text>
                </MenuOption>
                <MenuOption
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    padding: 10,
                  }}
                  onSelect={() => dispatch(setMoreIconMenuVisible(false))}
                >
                  <Image
                    style={{ width: 20, height: 20 }}
                    source={require("../../assets/icons/anonymous.png")}
                    // placeholder={require("../../assets/icons/skeletonLoadingPlaceholder.gif")}
                    placeholderContentFit="cover"
                    contentFit="cover"
                  />
                  <Text
                    style={{ fontFamily: "Dosis_500Medium", marginLeft: 10, color: colors.text }}
                  >Anonymous...</Text>
                </MenuOption>
                <MenuOption
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    padding: 10,
                  }}
                  onSelect={() => dispatch(setMoreIconMenuVisible(false))}
                >
                  <TabBarIcon name="cancel" size={20}                     color={colors.text}
 />
                  <Text
                    style={{ fontFamily: "Dosis_500Medium", marginLeft: 10, color: colors.text }}
                  >
                    Close
                  </Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
        </View>
      </>
    );
  } else {
    return (
      <>
        <DeleteConvMenu
          onDelete={() => setAskConvVisible(true)}
          // onBack={() => setIsConvMenuVisible(false)}
          onBack={() => handleHideConversationMenu()}
          selectedCount={selectedConversationsIds.length}
          isPinned={false}
        />
        <Portal>
          <Dialog
            visible={askConvVisible}
            onDismiss={handleHideConversationMenu}
            style={{ backgroundColor: "#FFFFFF", borderRadius: 20 }}
          >
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <TabBarIcon name="delete" color="#000000" size={30} />
            </View>

            <Dialog.Title
              style={{
                fontFamily: "Dosis_700Bold",
                color: "#000000",
                textAlign: "center",
              }}
            >
              Delete Conversation{selectedConversationsIds.length > 1 && "s"}
            </Dialog.Title>
            <Dialog.Content>
              <Text
                style={{
                  fontFamily: "Dosis_400Regular",
                  color: "#000000",
                  textAlign: "center",
                  fontSize: 17,
                }}
              >
                Are you sure!.
              </Text>
              <Text
                style={{
                  fontFamily: "Dosis_400Regular",
                  color: "#000000",
                  textAlign: "center",
                  fontSize: 17,
                }}
              >
                {/* This conversation will be deleted permanently... */}
                {selectedConversationsIds.length > 1
                  ? "These conversations"
                  : "This conversation"}{" "}
                will be deleted permanently...
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                style={{ backgroundColor: "white", borderRadius: 10 }}
                onPress={() => {
                  // console.log("Cancel");
                  setAskConvVisible(false);
                  handleHideConversationMenu();
                }}
              >
                <Text style={{ color: "#000000" }}>Cancel</Text>
              </Button>
              <Button
                style={{ backgroundColor: "red", borderRadius: 10 }}
                onPress={deleteConversation}
              >
                <Text style={{ color: "#FFFFFF" }}>Delete!</Text>
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </>
    );
  }
}

const styles = StyleSheet.create({});
