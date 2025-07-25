import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import TabBarIcon from "./TabBarIcon";
import { Image } from 'expo-image'
import { useAppTheme } from "../ThemeContext";

type NotificationsCardElementProps = {
  notificationId: string;
  text: string;
  type: string;
  data: any;
  person: any;
  icon: string;
  createdAt: string;
  customStyle: object | undefined;
};

export default function NotificationsCardElement({
  notificationId,
  text,
  type,
  data,
  person,
  icon,
  createdAt,
  customStyle,
}: NotificationsCardElementProps) {
  const {colors}= useAppTheme()
  // console.log(otherParticipantName);

  // const [pressed, setPressed] = useState(false);

  // const handleLongPress = () => {
  //   setPressed(true);
  // };

  // const handlePressOut = () => {
  //   setPressed(false);
  // };

  return (
    <Pressable
      key={notificationId}
      android_ripple={{ color: "whitesmoke" }}
      // onPress={onClick}
      // style={({ pressed }) => [
      style={
        {
          ...customStyle,
          justifyContent: "center",
          // backgroundColor: pressed ? 'orange' : 'white',
          // backgroundColor: 'white',
          // backgroundColor: customStyle.backgroundColor,
          // borderColor: pressed ? 'whitesmoke' : 'whitesmoke',
          borderColor: "whitesmoke",
          borderWidth: 1,
          // transform: pressed ? [{scale: 0.98}]: []
        }
        // ]}
      }
      // onLongPress={onLongPress}
      // onPressOut={handlePressOut}
    >
      <View style={styles.contactsItems}>
        <View style={[styles.profileImgView, {backgroundColor: colors.background}]}>
          {icon !== "default_profile_image" ? (
            <Image
              style={styles.profileImg}
              source={{
                uri: icon,
              }}
              placeholder={require('../../assets/icons/skeletonLoadingPlaceholder.gif')}
              placeholderContentFit="cover"
            contentFit="cover"

            />
          ) : (
            <TabBarIcon name="defaultProfileIcon" size={30} color="#193088" />
          )}
        </View>

        <View style={styles.nameOccDiv}>
          <Text style={styles.name}>{person}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {text}
          </Text>
          <Text>{createdAt}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  contactsItems: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    margin: 1,
    borderRadius: 10,
    padding: 15,
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
    fontFamily: "Dosis_600SemiBold",
  },
  lastMessage: {
    fontSize: 14,
    color: "gray",
    fontFamily: "Dosis_400Regular",
    width: "80%",
  },
  profileImgView: {
    width: 55,
    height: 55,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "whitesmoke",
    // backgroundColor: "#fdbe00",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImg: {},
});
