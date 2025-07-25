import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Image } from "expo-image";
import TabBarIcon from "./TabBarIcon";
import addPathToProfileImages from "../utilities/addPathToProfileImages";
import AppText from "./AppText";
import { useAppTheme } from "../ThemeContext";

type SearchListElementProps = {
  name: string;
  profileImageUrl: string;
  //   lastMsg: string;

  onClick: () => void;
};

// export default function SearchListElement({
function SearchListElement({
  name,
  profileImageUrl,
  //   lastMsg,
  onClick,
}: SearchListElementProps) {
  // console.log("profileImageUrl: ", profileImageUrl);

  const { colors, isDark } = useAppTheme();
      const android_ripple={ color: isDark ? '#ffffff22' : '#00000011'}


  return (
    <Pressable
      android_ripple={android_ripple}
      style={
        {
          justifyContent: "center",
     borderColor: isDark ? "gray": "whitesmoke",
          borderBottomWidth: 1,
        }

        // ]}
      }
      onPress={onClick}
    >
      <View style={styles.searchItems}>
        <View style={styles.profileImgView}>
          {profileImageUrl !== "default_profile_image" ? (
            <Image
              style={styles.profileImg}
              source={{ uri: addPathToProfileImages(profileImageUrl) }}
              placeholder={require("../../assets/icons/skeletonLoadingPlaceholder.gif")}
              placeholderContentFit="cover"
              contentFit="cover"
            />
          ) : (
            <TabBarIcon name="defaultProfileIcon" size={30} color="#193088" />
          )}
        </View>

        {/* <Image
          style={styles.contactsImg}
          source={{
            uri: profileImageUrl,
          }}
          defaultSource={require('../../assets/icons/skeletonLoadingPlaceholder.gif')}
        /> */}

        <View style={styles.nameOccDiv}>
          <AppText style={{fontSize: 18}}>{name}</AppText>
          {/* <Text style={styles.lastMsg} numberOfLines={1}>{lastMsg}</Text> */}
        </View>
        <TabBarIcon name="search" size={25} color={colors.text} />
      </View>
    </Pressable>
  );
}

export default React.memo(SearchListElement, (prevProps, nextProps) => {
  return (
    prevProps.name === nextProps.name &&
    prevProps.profileImageUrl === nextProps.profileImageUrl &&
    prevProps.onClick === nextProps.onClick
  );
});

const styles = StyleSheet.create({
  searchItems: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    margin: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  nameOccDiv: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    marginLeft: 20,
    fontFamily: "Dosis_400Regular",
  },
  // name: {
  //   fontSize: 18,
  //   fontFamily: "Dosis_400Regular",
  // },
  lastMsg: {
    fontSize: 14,
    color: "gray",
    fontFamily: "Dosis_400Regular",
    width: "80%",
  },

  profileImgView: {
    width: 45,
    height: 45,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "whitesmoke",
    backgroundColor: "whitesmoke",

    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  profileImg: {
    width: 45,
    height: 45,
  },
});
