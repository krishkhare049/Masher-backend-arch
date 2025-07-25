import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import TabBarIcon from "./TabBarIcon";
import addPathToProfileImages from "../utilities/addPathToProfileImages";
import { Image } from 'expo-image'
import { useAppTheme } from "../ThemeContext";
import AppText from "./AppText";

type SearchHistoryElementProps = {
  name: string;
  profileImageUrl: string;
  searchQueryId: string;
  searchedAt: string;

  onClick: () => void;
  onLongPress: () => void;
  //   bgColor: string | undefined;
  //   pressedColor: string | 'black';
  //   customStyle: object | undefined;
};

// export default function SearchHistoryElement({
function SearchHistoryElement({
  name,
  profileImageUrl,
  searchQueryId,
  searchedAt,
  //   lastMsg,
  onClick,
  onLongPress,
}: 
SearchHistoryElementProps) {
  // console.log("profileImageUrl: ", profileImageUrl);

  const { colors, isDark } = useAppTheme();
      const android_ripple={ color: isDark ? '#ffffff22' : '#00000011'}
  return (
    <Pressable
      android_ripple={android_ripple}
      style={
        {
          justifyContent: "center",
          borderColor: isDark ? "#444E60": "whitesmoke",
          borderBottomWidth: 1,
        }

        // ]}
      }
      onPress={onClick}
      onLongPress={onLongPress}
    >
      <View style={styles.searchItems}>
        <View style={styles.profileImgView}>
          {profileImageUrl !== "default_profile_image" ? (
            <Image
              style={styles.profileImg}
              source={{ uri: addPathToProfileImages(profileImageUrl) }}
            placeholder={require('../../assets/icons/skeletonLoadingPlaceholder.gif')}
            placeholderContentFit="cover"
            contentFit="cover"

            />
          ) : (
            <TabBarIcon name="defaultProfileIcon" size={30} color="#193088" />
          )}
        </View>

        <View style={styles.nameOccDiv}>
          <AppText style={{fontSize: 18}}>{name}</AppText>
          {/* <Text style={styles.lastMsg} numberOfLines={1}>{lastMsg}</Text> */}
        </View>
          {/* <Text style={styles.lastMsg} numberOfLines={1}>{lastMsg}</Text> */}
        {/* <View>
            <Text style={{color: 'gray'}}>{searchedAt} </Text>
            </View>
            <View style={{backgroundColor: 'whitesmoke', borderRadius: 100, padding: 5,}}>
            <TabBarIcon name="cross" size={20} color="black" />
            </View> */}
            <TabBarIcon name="history" size={25} color={colors.text} />
      </View>
    </Pressable>
  );
}

export default React.memo(SearchHistoryElement, (prevProps, nextProps) => {
  return (
    prevProps.name === nextProps.name &&
    prevProps.profileImageUrl === nextProps.profileImageUrl &&
    prevProps.searchQueryId === nextProps.searchQueryId &&
    prevProps.searchedAt === nextProps.searchedAt &&
    prevProps.onClick === nextProps.onClick &&
    prevProps.onLongPress === nextProps.onLongPress
  );
});

const styles = StyleSheet.create({
  searchItems: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#fdbe00",
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
  name: {
    fontSize: 18,
    fontFamily: "Dosis_400Regular",
  },
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
