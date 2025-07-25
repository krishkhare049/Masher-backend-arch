import { BackHandler, Pressable, StyleSheet, Text, TouchableNativeFeedback, View } from "react-native";
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
  selectIsMessMenuVisible,
  selectSelectedMessageIds,
  setIsMessMenuVisible,
  setSelectedMessageIds,
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

// export default function GroupMessagingScreenCustomHeader({
function GroupMessagingScreenCustomHeader({
  // userId,
  name,
  imageUrl,
  isGroup,
}: // selectedCount,
// lastSeen,
// isOnline,
{
  // userId: string;
  name: string;
  imageUrl: string;
  isGroup: boolean;
  // selectedCount: number;
  // lastSeen: string;
  // isOnline: boolean;
}) {
  const dispatch = useDispatch();
  const isMessMenuVisible = useSelector(selectIsMessMenuVisible);
  const selectedMessageIds = useSelector(selectSelectedMessageIds);
  const [showMoreIconMenu, setShowMoreIconMenu] = useState(false);

  const {isDark, colors} = useAppTheme()

  // console.log(selectedMessageIds.length)

  const currentConversationId = useSelector(selectCurrentConversationId);
  const [askMessVisible, setAskMessVisible] = useState(false);

  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState("");

  const hideAskDeleteMessDialog = () => setAskMessVisible(false);

  const deleteMessage = () => {
    //But only if i am sender else just remove the message from the realm-

    let myMessages: string[] = [];
    let othersMessages: string[] = [];
    selectedMessageIds.filter(
      (message: { isSender: boolean; messageId: string }) => {
        if (message.isSender === false) {
          othersMessages.push(message.messageId);
        } else {
          myMessages.push(message.messageId);
        }
      }
    );

    // Delete other people messages-

    if (!othersMessages || othersMessages.length === 0) {
      return;
    } else {
      try {
        deleteBulkMessages(othersMessages, true);
      } catch (error) {
        console.error("Error deleting messages:", error);
      }
    }

    // Unsend my messages-
    axiosInstance
      .post(
        `/api/messages/unsendMessages`,
        {
          conversationId: currentConversationId,
          messageIds: myMessages,
        },
        { withCredentials: true }
      )

      .then((response) => {
        // console.log(response.data);
        if (response.data === "message_deleted_successfully") {
          console.log("Message deleted");

          // Remove message from realm-
          try {
            deleteBulkMessages(myMessages, false);
          } catch (error) {
            console.error("Error deleting messages:", error);
          }
        } else {
        }
      })
      .catch((error) => console.log("Error" + error))
      .finally(() => {
        handleHideMessageMenu();
      });
  };

  const handleHideMessageMenu = () => {
    if (isMessMenuVisible) {
      // If the menu is visible, hide it and prevent the default back action
      // setIsMessMenuVisible(false);
      dispatch(setIsMessMenuVisible(false));
      setAskMessVisible(false);
      // setSelectedMessageId(null);
      dispatch(setSelectedMessageIds([]));

      return true; // Prevent the default back action
    }

    if(showMoreIconMenu){
      setShowMoreIconMenu(false)
      return true
    }

    return false; // Allow the default back action if the menu is not visible
  };

  // Handle back functionality by using removing any state from here and chat conversations pages and use redux store for global states and use useEffect and pass both dependencies of isConvMenuVisible and isMessMenuVisible.
  useEffect(() => {
    // Add event listener for back button
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleHideMessageMenu
    );

    // Cleanup the event listener on component unmount
    return () => backHandler.remove();
  }, [isMessMenuVisible, showMoreIconMenu]);

  useEffect(() => {
    if (selectedMessageIds.length === 0) {
      handleHideMessageMenu();
    }
  }, [selectedMessageIds]);

  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, "MessagingScreen">
    >();

  if (isMessMenuVisible === false) {
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

          <View style={{ marginLeft: 0, borderRadius: 10, overflow: "hidden" }}>
            <Pressable
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                padding: 5,
                borderRadius: 10,
              }}
              // android_ripple={{ color: "#e8ae00" }}
              android_ripple={{ color: "#0000001A" }}
              onPress={() => {
                navigation.navigate("ConversationPage");
              }}
            >
              {imageUrl !== "default_group_icon" ? (
                <Image
                  style={styles.img}
                  source={{
                    uri: addPathToGroupImages(imageUrl),
                  }}
                  placeholder={require("../../assets/icons/skeletonLoadingPlaceholder.gif")}
                  placeholderContentFit="cover"
                  contentFit="cover"
                />
              ) : (
                <TabBarIcon name="defaultGroupIcon" size={30} color="white" />
              )}

              <View style={{ marginHorizontal: 10 }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    color: "white",
                    // marginHorizontal: 10,
                    fontFamily: "Dosis_700Bold",
                  }}
                >
                  {name}
                </Text>

                  <Text
                    style={{
                      fontFamily: "Dosis_700Bold",
                      color: "#FFFFFF",
                      fontSize: 11,
                    }}
                  >
                    View group {""}
                    <TabBarIcon name="right" size={10} color="#FFFFFF" />
                  </Text>
              </View>
            </Pressable>
          </View>
        </View>

        <Menu opened={showMoreIconMenu} onBackdropPress={()=>{setShowMoreIconMenu(false)}} style={{borderRadius: 30, overflow: 'hidden'}}>
          {/* <MenuTrigger text='Select action' /> */}
          <MenuTrigger onPress={()=>{setShowMoreIconMenu(true)}} style={{padding: 5}}>
            <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple('#ffffff4d', true)} // Custom ripple color
          useForeground={true} // Ensure ripple effect appears inside the view
        >
           <TabBarIcon name="moreHorizontal" size={30} color="#FFFFFF"/>
        </TouchableNativeFeedback>
          </MenuTrigger>
          <MenuOptions optionsContainerStyle={{borderRadius: 10, padding: 5, backgroundColor: !isDark ? '#FFFFFF' : '#343A46'}}>
            <MenuOption style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10, borderRadius: 100,}} onSelect={() => {
              setShowMoreIconMenu(false)
              navigation.navigate('FAQ')
              }}>
            <TabBarIcon name="infocirlceo" size={20} color={!isDark ?"#000000": "#FFFFFF"}/>
              <Text style={{ fontFamily: 'Dosis_500Medium', marginLeft: 10, color: colors.text}}>Info</Text>
            </MenuOption>
            <MenuOption style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10}} onSelect={() => setShowMoreIconMenu(false)}>
            <TabBarIcon name="cancel" size={20} color={!isDark ?"#000000": "#FFFFFF"}/>
              <Text style={{ fontFamily: 'Dosis_500Medium', marginLeft: 10, color: colors.text}}>Close</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>
    );
  } else {
    return (
      <>
        <DeleteMessMenu
          selectedCount={selectedMessageIds.length}
          // selectedCount={selectSelectedMessageIds.length}
          onDelete={() => setAskMessVisible(true)}
          isPinned={false}
          onBack={() => handleHideMessageMenu()}
        />
        {askMessVisible && (
          <DeleteMessageConfirmationDialog
            onCancel={() => {
              setAskMessVisible(false);
              handleHideMessageMenu();
            }}
            hideAskDeleteMessDialog={hideAskDeleteMessDialog}
            deleteMessage={() => {}}
            selectedMessageIdsLength={selectedMessageIds.length}
          />
        )}
      </>
    );
  }
}

export default React.memo(
  GroupMessagingScreenCustomHeader,
  (prevProps, nextProps) => {
    return (
      // prevProps.userId === nextProps.userId &&
      prevProps.name === nextProps.name &&
      prevProps.imageUrl === nextProps.imageUrl &&
      prevProps.isGroup === nextProps.isGroup
      // prevProps.selectedCount === nextProps.selectedCount
    );
  }
);

const styles = StyleSheet.create({
  img: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    marginLeft: 10,
  },
});
