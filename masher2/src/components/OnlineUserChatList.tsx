import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Image } from "expo-image";
import { FlashList } from "@shopify/flash-list";
import { maxLengthNameWithSuffix } from "../utilities/maxLengthNameWithSuffix";
import { axiosInstance } from "../utilities/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import {
  selectOnlineUsersList,
  setOnlineUsers,
} from "../onlineUsersListStatesSlice";
import addPathToProfileImages from "../utilities/addPathToProfileImages";
import TabBarIcon from "./TabBarIcon";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../MainComponent";
import {
  setCurrentConversationId,
  setCurrentOtherParticipantId,
} from "../messageScreenStatesSlice";

interface OnlineListProps {
  // users: any[];
  // loadingOnlineUsers: boolean;
  // renderItem: ({ item }: { item: any }) => JSX.Element | null;
  // page: number;
  // setPage: (val: number) => void;
}

type OnlineUser = {
  // userId: string;
  otherParticipantId: string;
};

// const users: OnlineUser[] = [];
// const users: OnlineUser[] = [{ userId: "sf" }, { userId: "fasf" }, { userId: "fdsa" }];

// export default function OnlineUserChatList({
function OnlineUserChatList({}: // users,
// renderItem,
// page,
// setPage,
//   ListFooter,
OnlineListProps) {
  const onlineUsers = useSelector(selectOnlineUsersList) as OnlineUser[];
  // const navigation = useNavigation();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Chats">>();
  const dispatch = useDispatch();
  // console.log("Online Users List: ");

  // setInterval(() => {
  //   fetchOnlineUsers();
  // }, 5000);
console.log("Online Users List:: ", onlineUsers);
  const fetchOnlineUsers = () => {
    axiosInstance
      .get("/api/users/getOnlineUsers")
      .then((response) => {
        console.log("Online Users: ");
        console.log(response.data);
        dispatch(setOnlineUsers(response.data));
        //  const onlineUsers = useSelector(selectOnlineUsersList);
        //  console.log("Online Users List: ", onlineUsers);
        
      })
      .catch((error) => {
        console.log("Error:" + error);
      });
  };

  useEffect(() => {
    // setInterval(() => {
    fetchOnlineUsers();
    // }, 10000);
  }, []);

  const [loadingOnlineUsers, setLoadingOnlineUsers] = useState(false);
  // Optimizing flash list-
  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      // const renderItem = ({ item }: { item: any })=> {

      // console.log("Item: " + item);
      // console.log(item);
      // console.log(item.updated_at);

      // let name = "Krish ggd ggggdd gfg ";

      return (
        <Pressable
          onPress={() => {
            console.log("Pressed: " + item.otherParticipantId);

            dispatch(setCurrentConversationId(item._id));
            dispatch(setCurrentOtherParticipantId(item.otherParticipantId));

            navigation.navigate("MessagingScreen", {
              conversationId: item._id,
              otherParticipantId: item.otherParticipantId,
              otherParticipantName: item.otherParticipantName,
              imageUrl: item.otherParticipantProfileImage.filename,
              isGroup: false,
            });
          }}
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 3,
            // marginTop: 2,
            // backgroundColor: 'red',
            width: 75,
            height: 75

          }}
        >
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            {item?.otherParticipantProfileImage.filename !==
            "default_profile_image" ? (
              <Image
                source={{
                  uri: addPathToProfileImages(
                    item?.otherParticipantProfileImage.filename
                  ),
                }}
                placeholder={require("../../assets/icons/skeletonLoadingPlaceholder.gif")}
                placeholderContentFit="cover"
                contentFit="cover"
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 50,

                  borderWidth: 2,
                  borderColor: "#FFFFFF",
                }}
              />
            ) : (
              // <TabBarIcon name="defaultProfileIcon" size={40} color="white" />

              <TabBarIcon name="defaultProfileIcon" size={60} color="white" />
            )}

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
          </View>
          {/* <Text selectable selectionColor={'red'} style={{fontFamily: 'Dosis_500Medium', fontSize: 14, margin: 2, color: '#FFFFFF'}}>Krish</Text> */}
          <Text
            style={{
              fontFamily: "Dosis_600SemiBold",
              fontSize: 14,
              color: "#FFFFFF",
              maxWidth: 100,
              textAlign: "center",
              overflow: "hidden",
            }}
          >
            {maxLengthNameWithSuffix(item.otherParticipantName, 8, 8)}
          </Text>
        </Pressable>
      );
    },
    // [selectedConversationsIds, isConvMenuVisible]
    []
  );

  const ListFooter = useMemo(
    () =>
      loadingOnlineUsers ? (
        <ActivityIndicator
          style={{ margin: 15 }}
          size="small"
          color="#000000"
        />
      ) : null,
    [loadingOnlineUsers]
  );

  // if (users.length === 0) {
  // if (onlineUsers.length === 0) {
  //   // return
  //   return
  // }
  return (
    <>
      {onlineUsers.length !== 0 && (
        <View
          style={{
            // padding: 5,
            flexDirection: "row",
            alignItems: "center",
            // maxHeight: 80,
            height: 80,
            marginHorizontal: 5,
            marginBottom: 10,
            // backgroundColor: 'green',
            // height: 'auto'
          }}
        >
          <FlashList
            // initialScrollIndex={0}
            // data={users || []}
            data={onlineUsers || []}
            removeClippedSubviews={true}
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets={true}
            // showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            //   extraData={selectedMessageIds}
            // inverted={true}
            onEndReached={() => {
              //   !loadingMessages && fetchConversationMessages()
              if (!loadingOnlineUsers) {
                // setPage(page + 1);
              }
            }}
            // ListEmptyComponent={<Text>No messages</Text>}
            ListFooterComponent={ListFooter}
            onEndReachedThreshold={0.5}
            renderItem={({ item }) => renderItem({ item })}
            estimatedItemSize={40}
            keyExtractor={(item, index) =>
              item?.otherParticipantId?.toString() || index.toString()
            }
            // contentContainerStyle={{ paddingVertical: 12,  }}
            horizontal={true}
          />
        </View>
      )}
    </>
  );
}

// export default React.memo(OnlineUserChatList, (prevProps, nextProps) => {
//   return prevProps.users === nextProps.users &&
//   prevProps.loadingOnlineUsers === nextProps.loadingOnlineUsers
// });
export default React.memo(OnlineUserChatList);

const styles = StyleSheet.create({});
