import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../MainComponent";
import { axiosInstance } from "../utilities/axiosInstance";
import addPathToProfileImages from "../utilities/addPathToProfileImages";
import TabBarIcon from "../components/TabBarIcon";
import PressableIcon from "../components/PressableIcon";
import { Appbar } from "react-native-paper";
import { format } from "date-fns";
import { useAppTheme } from "../ThemeContext";
import { useSelector } from "react-redux";
import { selectOnlineUsersList } from "../onlineUsersListStatesSlice";

type UserProps = NativeStackScreenProps<RootStackParamList, "User">;

type OtherUserDataProps = {
  userId: string;
  full_name: string;
  joined: string;
  // user_email: string;
  username: string;
  profileImgFilename: string;
  user_description: string;
  // lastSeen: string;
  // isOnline: boolean;
};

type OnlineUser = {
  otherParticipantId: string;
};

export default function User({ route, navigation }: UserProps) {
  const { colors, isDark } = useAppTheme();
  const [otherUserData, setOtherUserData] = useState<OtherUserDataProps>();

  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState("");

  const onlineUsers = useSelector(selectOnlineUsersList) as OnlineUser[];
  // console.log("Online Users List:::", onlineUsers);
  const checkIsUserOnline = (userId: string, onlineUsers: OnlineUser[]): boolean => {
  return onlineUsers.some(user => user.otherParticipantId === userId);
};

const isUserOnline = ()=>{
   if (!route.params?.userId) {
      return;
    }
    console.log(route.params.userId)
// return checkIsUserOnline(route.params?.userId, onlineUsers);
setIsOnline(checkIsUserOnline(route.params?.userId, onlineUsers));
}
  
// console.log(isUserOnline())

useEffect(()=>{
  isUserOnline()
}, [])

console.log(`User is ${isOnline ? 'online' : 'offline'}`);

  // console.log(route.params?.userId)

 


      const android_ripple={ color: isDark ? '#ffffff22' : '#00000011'}


  const loadOtherUserData = () => {
    if (!route.params?.userId) {
      return;
    }
    axiosInstance
      .get("/api/users/getOtherUserData/" + route.params?.userId, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);

        let userObj = {
          userId: response.data._id,
          full_name: response.data.full_name,
          joined: format(new Date(response.data.joined), "dd LLLL yyyy"),
          // user_email: response.data.user_email,
          username: response.data.username,
          profileImgFilename: response.data.profile_image_filename.filename,
          user_description: response.data.user_description,
          // lastSeen: response.data.lastSeen,
          // isOnline: response.data.online,
        };

        setOtherUserData(userObj);
      })
      .catch((error) => {
        console.log("Error" + error);
      });
  };

  useEffect(() => {
    loadOtherUserData();
  }, []);

  return (
    // <View style={{ flex: 1, backgroundColor: "#fdbe00" }}>
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* <StatusBar backgroundColor={"#FFFFFF"} barStyle={"dark-content"} /> */}

      <View
        style={{
          flexDirection: "row",
          width: "100%",
          padding: 5,
        }}
      >
        {/* <PressableIcon
          iconName="arrowLeft"
          iconSize={35}
          rippleColor=""
          iconColor="white"
          onClick={() => {
            // navigation.push("Search");
            navigation.goBack();
          }}
          customStyle={{
            padding: 5,
            borderRadius: 100,
          }}
          disabled={false}
        /> */}

        <Appbar.BackAction
          color={"#FFFFFF"}
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 10 }}
        />
      </View>

      {/* <Text>User: {route.params?.userId}</Text> */}

      {/* <Surface style={{ flex: 1, backgroundColor: "white", borderTopLeftRadius: 40, borderTopRightRadius: 40 }} elevation={5}> */}
      <View
        style={{
          // iOS shadow
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          // Android shadow
          elevation: 5,
          flex: 1,
          backgroundColor: !isDark ? "white": "#343A46",
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: -40,
          }}
        >
          <View
            style={{
              padding: 10,
              // borderWidth: 2,
              // borderColor: "#FFFFFF",
              borderRadius: 100,
              height: 130,
              width: 130,
              justifyContent: "center",
              alignItems: "center",
              // backgroundColor: "#fdbe00",
              backgroundColor: colors.background,
            }}
          >
            {otherUserData?.profileImgFilename !== "default_profile_image" ? (
              <Image
                style={styles.img}
                source={{
                  uri: addPathToProfileImages(
                    otherUserData?.profileImgFilename
                  ),
                }}
                placeholder={require("../../assets/icons/skeletonLoadingPlaceholder.gif")}
                placeholderContentFit="cover"
                contentFit="cover"
              />
            ) : (
              // <TabBarIcon name="defaultProfileIcon" size={40} color="white" />

              <TabBarIcon name="defaultProfileIcon" size={100} color="white" />
            )}
          </View>
          <Text
            style={[
              styles.boldText,
              {
                fontSize: 17,
                backgroundColor: !isDark ? "whitesmoke": "#282C35",
                padding: 10,
                borderRadius: 10,
                maxWidth: "90%",
                marginVertical: 10,
                color: colors.text,
              },
            ]}
          >
            @{otherUserData?.username}
          </Text>
          <Text style={[styles.mediumText, { fontSize: 22, color: colors.text }]}>
            {otherUserData?.full_name}
          </Text>

          {isOnline ? (
            <Text
              style={{
                fontFamily: "Dosis_700Bold",
                // color: "#FFFFFF",
                color: colors.text,
                fontSize: 11,
              }}
            >
              <TabBarIcon name="circle" size={8} color="lightgreen" /> Online
            </Text>
          ) : (
            lastSeen !== "" && (
              <Text
                style={[
                  styles.mediumText,
                  { fontSize: 16, color: colors.text, margin: 5 },
                ]}
              >
                Last seen at {lastSeen}
              </Text>
            )
          )}
          <Text
            style={[
              styles.mediumText,
              { fontSize: 16, color: colors.text, margin: 5 },
            ]}
          >
            Joined at {otherUserData?.joined}
          </Text>
          {/* <Text style={[styles.mediumText, { fontSize: 18 }]}>
            description: {otherUserData?.user_description}
          </Text> */}

          {otherUserData?.user_description && (
            <Text
              style={[
                styles.mediumText,
                {
                  fontSize: 16,
                  padding: 10,
                  backgroundColor: "whitesmoke",
                  borderRadius: 10,
                  margin: 5,
                },
              ]}
            >
              {otherUserData?.user_description}
            </Text>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <View style={{ borderRadius: 10, overflow: "hidden" }}>
            <Pressable
              android_ripple={android_ripple}
              style={styles.pressableBtns}
            >
              <TabBarIcon name="chats" size={30} color="orange" />
              <Text style={[styles.mediumText, { fontSize: 15, color: colors.text }]}>Message</Text>
            </Pressable>
          </View>
          <View style={{ borderRadius: 10, overflow: "hidden" }}>
            <Pressable
              android_ripple={android_ripple}
              style={styles.pressableBtns}
            >
              <TabBarIcon name="leafMaple" size={30} color="#0077FF" />
              <Text style={[styles.mediumText, { fontSize: 15, color: colors.text }]}>Theme</Text>
            </Pressable>
          </View>
          <View style={{ borderRadius: 10, overflow: "hidden" }}>
            <Pressable
              android_ripple={android_ripple}
              style={styles.pressableBtns}
            >
              <TabBarIcon name="share" size={30} color="#03045E" />
              <Text style={[styles.mediumText, { fontSize: 15, color: colors.text }]}>Share</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  img: {
    width: 130,
    height: 130,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    // marginLeft: 10,
  },

  pressableBtns: {
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "whitesmoke",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
    // minWidth: 100
  },

  regularText: { fontFamily: "Dosis_400Regular" },
  boldText: { fontFamily: "Dosis_700Bold" },
  mediumText: { fontFamily: "Dosis_500Medium" },
});
