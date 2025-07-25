import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import React from "react";
import TabBarIcon from "./TabBarIcon";
import addPathToGroupImages from "../utilities/addPathToGroupImages";
import { maxLengthNameWithSuffix } from "../utilities/maxLengthNameWithSuffix";
import { useAppTheme } from "../ThemeContext";

type GroupCardElementProps = {
  conversationId: string;
  isGroup: string;
  groupName: string;
  groupIcon: string;
  lastUpdated: string;
  lastMessage: string;
  unreadMessagesCount: number;
  // conversationFieldElementId: string;

  onClick: () => void;
  onLongPress: () => void;
  //   bgColor: string | undefined;
  //   pressedColor: string | 'black';
  customStyle: object | undefined;
};

export default function GroupCardElement({
    conversationId,
    isGroup,
    groupName,
    groupIcon,
    lastUpdated,
    lastMessage,
    unreadMessagesCount,
    // conversationFieldElementId,
    onClick,
    onLongPress,
    //   bgColor,
    //   pressedColor,
    customStyle,
  }: GroupCardElementProps) {

    const {isDark, colors} = useAppTheme()
      const android_ripple={ color: isDark ? '#ffffff22' : '#00000011'}


    // console.log('groupIcon')
    // console.log(lastMessage)

  return (
    <Pressable
      key={conversationId}
      android_ripple={android_ripple}
      onPress={onClick}
      // style={({ pressed }) => [
      style={
        {
          ...customStyle,
          // justifyContent: "center",
          justifyContent: "space-between",
          // backgroundColor: pressed ? 'orange' : 'white',
          // backgroundColor: 'white',
          // backgroundColor: customStyle.backgroundColor,
          // borderColor: pressed ? 'whitesmoke' : 'whitesmoke',
          borderColor: !isDark ? "whitesmoke": "#444E60",
          borderWidth: 1,
          borderRightWidth: 0,
          borderLeftWidth: 0,
          // transform: pressed ? [{scale: 0.98}]: []
          flexDirection: "row",
          padding: 5,
          alignItems: "center",
        }
        // ]}
      }
      onLongPress={onLongPress}
      // onPressOut={handlePressOut}
    >
      <View style={styles.contactsItems}>
        <View style={styles.profileImgView}>
          {groupIcon !== "default_group_icon" ? (
            <Image
              style={styles.profileImg}
              source={{
                // uri: addPathToProfileImages(imageUrl),
                uri: addPathToGroupImages(groupIcon),
              }}
              placeholder={require("../../assets/icons/skeletonLoadingPlaceholder.gif")}
              placeholderContentFit="cover"
            contentFit="cover"
            />
          ) : (
            <TabBarIcon name="defaultGroupIcon" size={30} color="#193088" />
          )}
        </View>

        <View style={styles.nameOccDiv}>
          <Text style={[styles.name, {color: colors.text}]}>{maxLengthNameWithSuffix(groupName, 22, 22)}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {lastMessage}
          </Text>
        </View>
      </View>

      {/* <Text style={styles.newMessagesCount}>{lastUpdated}</Text> */}
      {/* <Text style={styles.newMessagesCount}>{unreadMessagesCount}</Text> */}
          <View
                style={{
                  // justifyContent: "space-evenly",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                {/* <Text style={styles.newMessagesCount}>{unreadMessagesCount}</Text> */}
                {unreadMessagesCount && unreadMessagesCount !== 0 && <Text style={styles.newMessagesCount}>{unreadMessagesCount}</Text>} 
                <Text style={styles.lastUpdated}>{lastUpdated}</Text>
              </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
    contactsItems: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      maxWidth: "80%",
      margin: 1,
      borderRadius: 10,
      // padding: 5,
      // backgroundColor: "whitesmoke",
    },
    nameOccDiv: {
      flex: 1,
      flexDirection: "column",
      alignItems: "flex-start",
      marginLeft: 20,
      fontFamily: "Dosis_400Regular",
    },
    name: {
      fontSize: 18,
      fontFamily: "Dosis_500Medium",
    },
    lastMessage: {
      fontSize: 14,
      color: "gray",
      fontFamily: "Dosis_400Regular",
      width: "80%",
    },
    profileImgView: {
      width: 56,
      height: 56,
      // borderRadius: 100,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "#b38702",
      // backgroundColor: "red",
      backgroundColor: "#ffde7a",
      // backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
      overflow: 'hidden',
    },
    profileImg: {
      // width: 55,
      // height: 55,
      width: 50,
      height: 50,
      // borderRadius: 100,
      borderRadius: 20,
      // margin: 5
    },
    newMessagesCount: {
      fontSize: 12,
      backgroundColor: "#fdbe00",
      padding: 3,
      borderRadius: 30,
      fontFamily: "Dosis_600SemiBold",
      maxHeight: 30,
      minWidth: 30,
      textAlign: "center",
      margin: 'auto'
    },
    lastUpdated: {
      color: "gray",
      fontFamily: "Dosis_500Medium",
      fontSize: 13,
    },
  });
  