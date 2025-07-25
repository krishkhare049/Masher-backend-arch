import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import TabBarIcon from "./TabBarIcon";
import { useSelector } from "react-redux";
import { selectUserData } from "../userDataSlice";
import { Image } from "expo-image";
import addPathToProfileImages from "../utilities/addPathToProfileImages";
import { useAppTheme } from "../ThemeContext";

// export default function MeIconComponent({ focused }: { focused: boolean }) {
function MeIconComponent({ focused }: { focused: boolean }) {
  const userData = useSelector(selectUserData);
      const { colors, isDark } = useAppTheme();

  // useEffect(() => {
  //   // console.log("Userdata::");
  //   // console.log(userData);
  // }, [userData]);
  return (
    <>
      {userData.profileImgFilename !== "default_profile_image" ? (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: 30,
            height: 30,
            borderRadius: 30,
            borderWidth: 1,
            padding: 5,
            // borderColor: focused ? "#fdbe00" : "#000000",
            borderColor: focused ? colors.background : "#000000",
          }}
        >
          <Image
            style={{ width: 25, height: 25, borderRadius: 30, padding: 5 }}
            source={{
              uri: addPathToProfileImages(userData.profileImgFilename),
              cachePolicy: "memory",
            }}
            placeholder={require("../../assets/icons/skeletonLoadingPlaceholder.gif")}
            placeholderContentFit="cover"
            contentFit="cover"
          />
        </View>
      ) : (
        <TabBarIcon
          name={focused ? "defaultProfileIcon" : "userOutline"}
          // color={focused ? "#fdbe00" : "gainsboro"}
          // color={focused ? colors.background : "gainsboro"}
                //  color={focused ? (!isDark ?colors.background: '#B1B9C8') : "gray"}
                 color={focused ? (!isDark ?colors.background: '#B1B9C8') : "#B1B9C8"}

          size={24}
        />
      )}
    </>
  );
}

export default React.memo(MeIconComponent, (prevProps, nextProps) => {
  return prevProps.focused === nextProps.focused;
});

const styles = StyleSheet.create({});
