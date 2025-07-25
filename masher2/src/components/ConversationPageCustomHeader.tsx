import {
  BackHandler,
  Pressable,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from "react-native";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import TabBarIcon from "./TabBarIcon";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../MainComponent";
import addPathToProfileImages from "../utilities/addPathToProfileImages";
import { Appbar } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentConversationId,
} from "../messageScreenStatesSlice";
import DeleteMessMenu from "./DeleteMessMenu";
import DeleteMessageConfirmationDialog from "./DeleteMessageConfirmationDialog";
import deleteBulkMessages from "../database/deleteBulkMessages";
import { axiosInstance } from "../utilities/axiosInstance";

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import addPathToGroupImages from "../utilities/addPathToGroupImages";
import { useAppTheme } from "../ThemeContext";

// export default function ConversationPageCustomHeader({
function ConversationPageCustomHeader({
  // userId,
  isAdmin,
  conversationId,
  groupName,
  groupIconFilePath,
  adminsApproveMembers,
  editPermissionsMembers,
}: // selectedCount,
// lastSeen,
// isOnline,
{
  isAdmin: boolean;
  conversationId: string;
  groupName: string;
  groupIconFilePath: string;
  adminsApproveMembers: boolean;
  editPermissionsMembers: boolean;
}) {
  const [showMoreIconMenu, setShowMoreIconMenu] = useState(false);
  const {isDark, colors} = useAppTheme();

  // console.log(isAdmin, conversationId, groupName, groupIconFilePath);

  const handleHideMoreIconMenu = () => {
    if (showMoreIconMenu) {
      setShowMoreIconMenu(false);
      return true;
    }

    return false; // Allow the default back action if the menu is not visible
  };

  // Handle back functionality by using removing any state from here and chat conversations pages and use redux store for global states and use useEffect and pass both dependencies of isConvMenuVisible and isMessMenuVisible.
  useEffect(() => {
    // Add event listener for back button
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleHideMoreIconMenu
    );

    // Cleanup the event listener on component unmount
    return () => backHandler.remove();
  }, [showMoreIconMenu]);

  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, "ConversationPage">
    >();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        width: "100%",
        zIndex: 5,
        justifyContent: "space-between",
        paddingHorizontal: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          marginLeft: -5,
        }}
      >
        <Appbar.BackAction
          color={"#FFFFFF"}
          onPress={() => navigation.goBack()}
          // style={{ marginLeft: 10 }}
        />
      </View>

      {isAdmin && (
        <Menu
          opened={showMoreIconMenu}
          onBackdropPress={() => {
            setShowMoreIconMenu(false);
          }}
          style={{ borderRadius: 30, overflow: "hidden" }}
        >
          {/* <MenuTrigger text='Select action' /> */}
          <MenuTrigger
            onPress={() => {
              setShowMoreIconMenu(true);
            }}
            style={{ padding: 5 }}
          >
            <TouchableNativeFeedback
              background={TouchableNativeFeedback.Ripple("#ffffff4d", true)} // Custom ripple color
              useForeground={true} // Ensure ripple effect appears inside the view
            >
              <TabBarIcon name="moreHorizontal" size={30} color="#FFFFFF" />
            </TouchableNativeFeedback>
          </MenuTrigger>
          <MenuOptions 
                optionsContainerStyle={{ borderRadius: 10, padding: 5,  backgroundColor: !isDark ? '#FFFFFF' : '#343A46' }}>
            <MenuOption
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                padding: 10,
                borderRadius: 100,
              }}
              onSelect={() => {
                setShowMoreIconMenu(false);
                navigation.navigate("GroupEditPage", {
                  conversationId: conversationId,
                  groupName: groupName,
                  imageUrl: groupIconFilePath,
                  adminsApproveMembers: adminsApproveMembers,
                  editPermissionsMembers: editPermissionsMembers,
                });
              }}
            >
              <TabBarIcon name="defaultGroupIcon" size={20} color={colors.text} />
              <Text style={{ fontFamily: "Dosis_500Medium", marginLeft: 10, color: colors.text }}>
                Change group settings
              </Text>
            </MenuOption>
            <MenuOption
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                padding: 10,
              }}
              onSelect={() => setShowMoreIconMenu(false)}
            >
              <TabBarIcon name="cancel" size={20} color={colors.text} />
              <Text style={{ fontFamily: "Dosis_500Medium", marginLeft: 10, color: colors.text }}>
                Close
              </Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      )}
    </View>
  );
}

export default React.memo(
  ConversationPageCustomHeader,
  (prevProps, nextProps) => {
    return (
      prevProps.isAdmin === nextProps.isAdmin &&
      prevProps.conversationId === nextProps.conversationId &&
      prevProps.groupName === nextProps.groupName &&
      prevProps.groupIconFilePath === nextProps.groupIconFilePath &&
      prevProps.adminsApproveMembers === nextProps.adminsApproveMembers &&
      prevProps.editPermissionsMembers === nextProps.editPermissionsMembers
    );
  }
);

const styles = StyleSheet.create({});
