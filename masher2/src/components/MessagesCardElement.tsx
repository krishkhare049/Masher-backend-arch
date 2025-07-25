import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import React, { memo } from "react";
import TabBarIcon from "./TabBarIcon";
import addPathToProfileImages from "../utilities/addPathToProfileImages";
import { maxLengthNameWithSuffix } from "../utilities/maxLengthNameWithSuffix";
import { useAppTheme } from "../ThemeContext";
import { useSelector } from "react-redux";
import { selectOnlineUsersList } from "../onlineUsersListStatesSlice";

type MessagesCardElementProps = {
  conversationId: string;
  otherParticipantId: string;
  otherParticipantName: string;
  lastUpdated: string;
  imageUrl: string;
  lastMessage: string;
  unreadMessagesCount: number;
  // conversationFieldElementId: string;

  onClick: () => void;
  onLongPress: () => void;
  //   bgColor: string | undefined;
  //   pressedColor: string | 'black';
  customStyle: object | undefined;
  isOnline?: boolean;
};
// export default function MessagesCardElement({
const MessagesCardElement = memo(
  ({
    conversationId,
    otherParticipantId,
    otherParticipantName,
    lastUpdated,
    imageUrl,
    lastMessage,
    unreadMessagesCount,
    // conversationFieldElementId,
    onClick,
    onLongPress,
    //   bgColor,
    //   pressedColor,
    customStyle,
    isOnline = false, // Default to false if not provided
  }: MessagesCardElementProps) => {
    const {colors, isDark} = useAppTheme();
      const android_ripple={ color: isDark ? '#ffffff22' : '#00000011'}

    // console.log(customStyle);

    // const [pressed, setPressed] = useState(false);

    // const handleLongPress = () => {
    //   setPressed(true);
    // };

    // const handlePressOut = () => {
    //   setPressed(false);
    // };

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
            // borderColor: "whitesmoke",
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
            {imageUrl !== "default_profile_image" ? (
              <Image
                style={styles.profileImg}
                source={{
                  uri: addPathToProfileImages(imageUrl),
                }}
                placeholder={require("../../assets/icons/skeletonLoadingPlaceholder.gif")}
                placeholderContentFit="cover"
                contentFit="cover"
              />
            ) : (
              // <TabBarIcon name="defaultProfileIcon" size={56} color="#fdbe00" />
              <TabBarIcon name="defaultProfileIcon" size={56} color={colors.background} />
            )}
            
            {isOnline && (
                        <View
                          style={{
                            borderWidth: 1,
                            width: 12,
                            height: 12,
                            borderRadius: 10,
                            borderColor: "#FFFFFF",
                            backgroundColor: "lightgreen",
                            bottom: 5, // Adjust as needed
                            right: 5, // Adjust as needed
                            position: "absolute",
                          }}
                        ></View>
            )}
          </View>

          <View style={styles.nameOccDiv}>
            <Text style={[styles.name, {color: colors.text}]}>{maxLengthNameWithSuffix(otherParticipantName, 20, 20)}</Text>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {lastMessage}
            </Text>
          </View>
        </View>

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
    );
  },
  (
    prevProps: { customStyle: any; lastMessage: any; unreadMessagesCount: any },
    nextProps: { customStyle: any; lastMessage: any; unreadMessagesCount: any }
  ) =>
    prevProps.customStyle === nextProps.customStyle &&
    prevProps.unreadMessagesCount === nextProps.unreadMessagesCount &&
    prevProps.lastMessage === nextProps.lastMessage
);

export default MessagesCardElement;

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
    borderRadius: 100,
    // borderWidth: 1,
    borderColor: "gainsboro",
    // backgroundColor: "red",
    backgroundColor: "whitesmoke",
    // backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    // overflow: 'hidden',
  },
  profileImg: {
    // width: 55,
    // height: 55,
    width: 50,
    height: 50,
    borderRadius: 100,
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
