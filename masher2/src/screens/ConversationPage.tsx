import {
  Pressable,
  StyleSheet,
  View,
  ScrollView,
  TouchableNativeFeedback,
  StatusBar,
} from "react-native";

import AppText from "../components/AppText";
import { Image } from "expo-image";
import React, { useCallback, useEffect, useState } from "react";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { RootStackParamList } from "../MainComponent";
import addPathToProfileImages from "../utilities/addPathToProfileImages";
import TabBarIcon from "../components/TabBarIcon";
import { Appbar, Button, Dialog, Portal, TextInput } from "react-native-paper";
import addPathToGroupImages from "../utilities/addPathToGroupImages";
import { FlashList } from "@shopify/flash-list";
import { maxLengthNameWithSuffix } from "../utilities/maxLengthNameWithSuffix";
import fetchConversationGroupData from "../utilities/fetchGroupParticipantsData";
import { useDispatch, useSelector } from "react-redux";
// import withObservables from "@nozbe/with-observables";
import { withObservables } from '@nozbe/watermelondb/react'
import {
  conversationOtherParticipantsCollection,
  conversationsCollection,
  otherusersCollection,
} from "../../index.native";
import { Q } from "@nozbe/watermelondb";
import { selectCurrentConversationId } from "../messageScreenStatesSlice";
import { selectGroupParticipantsData } from "../groupStatesSlice";
import { useNavigation } from "@react-navigation/native";
import { map, of, switchMap } from "rxjs";
import { format, set } from "date-fns";
import { selectUserData } from "../userDataSlice";
import ConversationPageCustomHeader from "../components/ConversationPageCustomHeader";
import PressableIcon from "../components/PressableIcon";
import Toast from "react-native-toast-message";
import { axiosInstance } from "../utilities/axiosInstance";
import { useAppTheme } from "../ThemeContext";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

type UserProps = NativeStackScreenProps<RootStackParamList, "ConversationPage">;

type ConversationDataProps = {
  conversationId: string;
  groupName: string;
  createdAt: number;
  groupIcon: string;
  // lastMessage: string;
  // unreadMessagesCount: string;
  isAdmin: string;
  isAdminsApproveMembers: boolean;
  isEditPermissionsMembers: boolean;
  groupDescription?: string;
};

type ParticipantDataProps = {
  user: any;
  isAdmin: boolean;
};

// function ReactiveGroupConversationPage() {
//   const conversationId = useSelector(selectCurrentConversationId);
//   // const EnhancedConversationPage = withObservables([], () => {
//   //   const query = conversationsCollection.query(
//   //     Q.where("conversation_id", conversationId)
//   //   );

//   //   return {
//   //     conversation: query.observeWithColumns([
//   //       "is_admins_approve_members",
//   //       "is_edit_permissions_members",
//   //       "group_icon",
//   //     ]), // ✅ observe minimal columns
//   //     // groupConversationId: conversationId,
//   //   };
//   // })(ConversationPage);
//   const EnhancedConversationPage = withObservables([], () => {
//     // Step 1: Observe the conversation
//     const conversationQuery = conversationsCollection.query(
//       Q.where("conversation_id", conversationId)
//     );

//     const conversation$ = conversationQuery.observeWithColumns([
//       "is_admins_approve_members",
//       "is_edit_permissions_members",
//       "group_icon",
//     ]);

//     // Step 2: Observe participants from intermediate table
//     const participants$ = conversationOtherParticipantsCollection
//       .query(
//         Q.where("conversation_id", conversationId),
//         Q.sortBy("is_admin", Q.desc), // Sort so that true (admins) come first)
//         Q.sortBy("created_at", Q.asc)
//       )
//       .observe();

//     // Step 3: Enrich participants with user info
//     const enrichedParticipants$ = participants$.pipe(
//       switchMap((participants) => {
//         const userIds = [...new Set(participants.map((p) => p.userId))];

//         if (userIds.length === 0) return of([]);

//         return otherusersCollection
//           .query(Q.where("user_id", Q.oneOf(userIds)))
//           .observe()
//           .pipe(
//             map((users) => {
//               const userMap = Object.fromEntries(
//                 users.map((u) => [u.userId, u._raw])
//               );

//               return participants.map((p) => ({
//                 ...p._raw,
//                 user: userMap[p.userId] || null,
//               }));
//             })
//           );
//       })
//     );

//     return {
//       conversation: conversation$,
//       participants: enrichedParticipants$,
//     };
//   })(ConversationPage);

//   return <EnhancedConversationPage />;
// }
interface EnrichedParticipant {
  id: string;
  userId: string;
  isAdmin: boolean;
  addedAt: number;
  user: any;
  // add other fields if needed
}
function ReactiveGroupConversationPage() {
  const conversationId = useSelector(selectCurrentConversationId);

  console.log("Conversation ID: ", conversationId);

  const userData = useSelector(selectUserData);
  const myUserId = userData.id;

  const EnhancedConversationPage = withObservables([], () => {
    // Step 1: Observe the conversation
    const conversationQuery = conversationsCollection.query(
      Q.where("conversation_id", conversationId)
    );

    const conversation$ = conversationQuery.observeWithColumns([
      "is_admins_approve_members",
      "is_edit_permissions_members",
      "group_icon",
    ]);

    // Step 2: Observe participants for this conversation
    const participants$ = conversationOtherParticipantsCollection
      .query(Q.where("conversation_id", conversationId))
      .observe();

    // Step 3: Enrich participants with user info and custom sort
    const enrichedParticipants$ = participants$.pipe(
      switchMap((participants) => {
        if (participants.length === 0) return of([]);

        console.log("Participants::", participants);

        const userIds = [...new Set(participants.map((p) => p.userId))];

        console.log("User IDs: ", userIds);

        return otherusersCollection
          .query(Q.where("user_id", Q.oneOf(userIds)))
          .observe()
          .pipe(
            map((users) => {
              const userMap = Object.fromEntries(
                users.map((u) => [u.userId, u._raw])
              );

              // Attach user info to participants
              // const participantsWithUser : EnrichedParticipant[]= participants.map((p) => ({
              //   ...p._raw,
              //   user: userMap[p.userId] || null,
              // }));

              const participantsWithUser: EnrichedParticipant[] =
                participants.map((p) => ({
                  id: p.id,
                  userId: p.userId,
                  isAdmin: p.isAdmin,
                  addedAt: p.addedAt,
                  user: userMap[p.userId] || null,
                }));

              // Custom sorting logic:
              // 1. Admins first, sorted by created_at ascending
              // 2. Then current user (if not admin), sorted by created_at ascending
              // 3. Then others sorted by created_at ascending

              const admins = participantsWithUser
                .filter((p) => p.isAdmin)
                // .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                .sort(
                  (a, b) =>
                    // new Date(a.createdAt).getTime() -
                    // new Date(b.createdAt).getTime()
                    a.addedAt - b.addedAt
                );

              const me = participantsWithUser.filter(
                (p) => !p.isAdmin && p.userId === myUserId
              );

              const others = participantsWithUser
                .filter((p) => !p.isAdmin && p.userId !== myUserId)
                .sort(
                  (a, b) =>
                    // new Date(a.createdAt).getTime() -
                    // new Date(b.createdAt).getTime()
                    a.addedAt - b.addedAt
                );
              console.log("E" + enrichedParticipants$);
              // Combine in order: admins, me, others
              return [...admins, ...me, ...others];
            })
          );
      })
    );

    return {
      conversation: conversation$,
      participants: enrichedParticipants$,
    };
  })(ConversationPage);

  return <EnhancedConversationPage />;
}

// const enhance = withObservables(
//   // ["conversationId"],
//   [],
//   // ({ conversationId }) => {
//   () => {
//     // const offset = (page - 1) * PAGE_SIZE;

//     const conversationId = useSelector(selectCurrentConversationId);

//     const query = conversationsCollection.query(
//       Q.where("conversation_id", conversationId)
//     );

//     return {
//       conversation: query.observeWithColumns([
//         "is_admins_approve_members",
//         "is_edit_permissions_members",
//         "group_icon",
//       ]), // ✅ observe minimal columns
//       groupConversationId: conversationId,
//     };
//   }
// );

// const EnhancedConversationPage = enhance(ConversationPage);

export default ReactiveGroupConversationPage;

// function ConversationPage({ route, navigation, conversation }: UserProps & { conversation: any }) {
function ConversationPage({
  conversation,
  participants,
}: {
  conversation: any;
  participants: any;
}) {
  const [conversationData, setConversationData] =
    useState<ConversationDataProps>();
  const [participantsData, setParticipantsData] = useState<
    ParticipantDataProps[]
  >([]);

  const { colors, isDark } = useAppTheme();
      const android_ripple={ color: isDark ? '#ffffff22' : '#00000011'}


  const userData = useSelector(selectUserData);
  const groupConversationId = useSelector(selectCurrentConversationId);

  const [isUserAdmin, setIsUserAdmin] = useState(true);
  // const [inputGroupName, setInputGroupName] = useState(
  //   conversationData?.groupName
  // );

  const [visibleLeaveGroup, setVisibleLeaveGroup] = useState(false);
  const [removeParticipantId, setRemoveParticipantId] = useState("");

  const hideDialog = () => setVisibleLeaveGroup(false);

  // console.log("dfd" + conversationData?.groupName);
  // console.log(conversationData);

  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, "ConversationPage">
    >();

  // const participantsData = useSelector(selectGroupParticipantsData);
  console.log("Participants data:", participants);

  useEffect(() => {
    if (conversation) {
      // console.log("🔁 Observed conversation changed:", conversation[0]);
      // Optionally set local state or trigger other effects

      // console.log("Conversation data:", conversation[0]);

      console.log("Conversation data:", conversation[0].isAdminsApproveMembers);

      setConversationData(conversation[0]);

      // setInputGroupName(conversation[0].groupName);
    }
    if (participants) {
      console.log("🔁 Observed participants changed:", participants);
      // Optionally set local state or trigger other effects
      // for (let i = 0; i < participants.length; i++) {
      //   const element = participants[i];
      //   console.log(element.user.user_id)
      // }

      console.log("Participants data:", participants);
      setParticipantsData(participants);
    }
  }, [conversation, participants]);

  useEffect(() => {
    if (participantsData?.length > 0 && userData?.id) {
      const myEntry = participantsData.find(
        (p) => p.user?.user_id === userData.id
      );
      if (myEntry?.isAdmin !== undefined) {
        setIsUserAdmin(myEntry.isAdmin);
      }
    }
  }, [participantsData, userData]);

  const handleLeaveGroup = async () => {
    // Logic to leave the group
    console.log("Leaving group with ID:", groupConversationId);
    try {
      const response = await axiosInstance.post(
        "/api/conversations/editGroupDetails",
        {
          conversationId: groupConversationId,
        },
        { withCredentials: true }
      );

      // console.log(response.data);

      if (response.data.message === "group_exited_successfully") {
        // dispatch(setUsers([]));
        Toast.show({
          type: "success",
          text1: "Left group!",
          text2: "You have left the group successfully! 👤",
          visibilityTime: 2000,
        });

        setVisibleLeaveGroup(false);

        console.log("Left group successfully!");
        console.log("DELETE ALL CONVERSATION MESSAGES FROM DB");

        // fetchConversationGroupData(conversationId);
        navigation.goBack();
      }
    } catch (error) {
      console.log("Error:", error);
      // setUserAlreadyExists(true); // Show invalid credentials error on network failure
      setVisibleLeaveGroup(false);

      Toast.show({
        type: "error",
        text1: "Error leaving group",
        text2: "You could not leave the group. Please try again later.",
        visibilityTime: 2000,
      });
    }
  };

  const handleRemoveParticipant = async()=>{
      try {
        console.log('Removing participant')
      const response = await axiosInstance.post(
        "/api/conversations/removeParticipantFromGroup",
        {
          participantId: removeParticipantId,
          conversationId: groupConversationId,
        },
        { withCredentials: true }
      );

      // console.log(response.data);

      if (response.data.message === "group_exited_successfully") {
        // dispatch(setUsers([]));
        Toast.show({
          type: "success",
          text1: "Removed participant!",
          text2: "Participant removed from group! 👤",
          visibilityTime: 2000,
        });

        setVisibleLeaveGroup(false);

        fetchConversationGroupData(groupConversationId);
        navigation.goBack();
      }
    } catch (error) {
      console.log("Error:", error);
      // setUserAlreadyExists(true); // Show invalid credentials error on network failure
      setVisibleLeaveGroup(false);

      Toast.show({
        type: "error",
        text1: "Participant not removed!",
        text2: "Please try again later.",
        visibilityTime: 2000,
      });
    }
  }

  // const [isOnline, setIsOnline] = useState(false);
  // const [lastSeen, setLastSeen] = useState("");

  // const loadConversationGroupData = () => {
  //   if (!route.params?.conversationId) {
  //     return;
  //   }

  //   try {
  //     axiosInstance
  //       .get(
  //         "/api/conversations/getGroupConversationData/" +
  //           route.params?.conversationId,
  //         {
  //           withCredentials: true,
  //         }
  //       )
  //       .then((response) => {
  //         console.log(response.data);

  //         const conversationResponse = response.data.conversation;

  //         let convObj = {
  //           conversationId: conversationResponse._id,
  //           groupName: conversationResponse.groupName,
  //           createdAt: format(conversationResponse.createdAt, "dd-LLLL-yyyy"),
  //           groupIcon: conversationResponse.groupIcon.filename,
  //           // lastMessage: conversationResponse.lastMessage,
  //           // unreadMessagesCount: conversationResponse.unreadMessagesCount,
  //           isAdmin: conversationResponse.isAdmin,
  //           adminsApproveMembers: conversationResponse.adminsApproveMembers,
  //           editPermissionsMembers: conversationResponse.editPermissionsMembers,
  //           // lastSeen: response.data.lastSeen,
  //           // isOnline: response.data.online,
  //         };

  //         setConversationData(convObj);
  //         setParticipantsData(response.data.participants);

  //         // Upsert participants data-
  //         upsertBulkOtherUsersInChunks(response.data.participants, 100);
  //       })
  //       .catch((error) => {
  //         console.log("Error" + error);
  //       });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    // loadConversationGroupData();
    fetchConversationGroupData(
      // route.params?.conversationId, dispatch)
      groupConversationId
    );
  }, []);

  const ParticipantsEmptyComponent = () => {
    return (
      // <View style={{transform: [{rotate: '10deg'}]}}>
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <AppText
          style={{
            fontSize: 18,
            padding: 5,
            borderRadius: 20,
            color: colors.text,
          }}
        >
          No participants found
        </AppText>
      </View>
    );
  };

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      // const renderItem = ({ item }: { item: any })=> {

      console.log("Item: ");
      console.log(item);
      const participant = item.user;
      const isAdmin = item.isAdmin;

      // if (userData.id === participant.user_id) {
      //   // Allow the user to see their own admin status-
      //   setIsUserAdmin(isAdmin);
      //   // setIsUserAdmin(true);

      //   // console.log(
      //   //   "Abhi ke liye sab true krderhe, baadme yaad se is isAdmin pe set krlena: ",
      //   //   isAdmin
      //   // );
      // }

      return (
        <Pressable
          onPress={() => {
            navigation.navigate("User", {
              userId: participant.user_id,
            });
          }}
          android_ripple={android_ripple}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#555' : "#f0f0f0",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {participant.profile_img_filename !== "default_profile_image" ? (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  width: 50,
                  height: 50,
                  borderRadius: 100,
                }}
              >
                <Image
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                  }}
                  source={{
                    uri: addPathToProfileImages(
                      participant.profile_img_filename
                    ),
                    cachePolicy: "memory",
                  }}
                  placeholder={require("../../assets/icons/skeletonLoadingPlaceholder.gif")}
                  placeholderContentFit="cover"
                  contentFit="cover"
                />
              </View>
            ) : (
              <TabBarIcon
                name={"defaultProfileIcon"}
                color={colors.background}
                size={50}
              />
            )}
            <View style={{ marginLeft: 10 }}>
              <AppText style={[styles.boldText, { fontSize: 16, color: colors.text }]}>
                {/* {maxLengthNameWithSuffix(participant.full_name, 20, 20)} */}
                {userData.id !== participant.user_id
                  ? maxLengthNameWithSuffix(participant.full_name, 20, 20)
                  : "Me"}
              </AppText>
              <AppText style={[styles.regularText, { fontSize: 14, color: colors.text }]}>
                @{maxLengthNameWithSuffix(participant.username, 20, 20)}
              </AppText>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            {isAdmin && (
              <View
                style={{
                  marginLeft: 10,
                  backgroundColor: "#fdbe00",
                  padding: 5,
                  borderRadius: 5,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <TabBarIcon name="shield" size={15} color="#000000" />
                <AppText
                  style={[styles.mediumText, { fontSize: 14, marginLeft: 5, color: "#000000" }]}
                >
                  Admin
                </AppText>
              </View>
            )}

                {userData.id !== participant.user_id &&
            <Menu style={{ borderRadius: 30, overflow: "hidden", marginLeft: 10 }}>
              <MenuTrigger style={{ borderRadius: 30 }}>
                <TouchableNativeFeedback
                  background={TouchableNativeFeedback.Ripple(isDark ? '#ffffff22' : '#00000011', true, 30)}
                  useForeground={true} // Ensure ripple effect appears inside the
                  >
                  <TabBarIcon name="moreHorizontal" size={30} color={colors.text} />
                </TouchableNativeFeedback>
              </MenuTrigger>
              <MenuOptions
                optionsContainerStyle={{ borderRadius: 10, padding: 5, backgroundColor: !isDark ? '#FFFFFF' : '#343A46'  }}
                >
                <MenuOption
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    padding: 10,
                    borderRadius: 100,
                  }}
                  onSelect={() => {
                    // setShowMoreIconMenu(false)
                    // navigation.navigate("FAQ");
                    setRemoveParticipantId(participant.user_id);
                    handleRemoveParticipant()
                  }}
                  >
                  <TabBarIcon name="userPen" size={20} color={colors.text} />
                  <AppText
                    style={{ marginLeft: 10, color: colors.text }}
                    >
                    Remove
                  </AppText>
                </MenuOption>
                <MenuOption
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    padding: 10,
                  }}
                  onSelect={() => {
                    // setShowMoreIconMenu(false)
                  }}
                  >
                  <TabBarIcon name="cancel" size={20} color={colors.text} />
                  <AppText
                    style={{ marginLeft: 10, color: colors.text }}
                    >
                    Close
                  </AppText>
                </MenuOption>
              </MenuOptions>
            </Menu>
                  }
          </View>
        </Pressable>

      );
    },
    []
    // []
  );

  return (
    <>
      <StatusBar barStyle={'light-content'} backgroundColor={ colors.background} />
      <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* <StatusBar backgroundColor={"#FFFFFF"} barStyle={"dark-content"} /> */}

      {/* <View
        style={{
          flexDirection: "row",
          width: "100%",
          padding: 5,
        }}
      > */}
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

      {/* <Appbar.BackAction
          color={"#FFFFFF"}
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 10 }}
        />
        {!isUserAdmin && (
          <View></View>
        )
      } */}
      <ConversationPageCustomHeader
        isAdmin={isUserAdmin}
        conversationId={conversationData?.conversationId ?? ""}
        groupName={conversationData?.groupName ?? ""}
        groupIconFilePath={conversationData?.groupIcon ?? "default_group_icon"}
        adminsApproveMembers={conversationData?.isAdminsApproveMembers ?? true}
        editPermissionsMembers={
          conversationData?.isEditPermissionsMembers ?? false
        }
      />
      {/* </View> */}

      {/* <Text>User: {route.params?.userId}</Text> */}

      {/* <Surface style={{ flex: 1, backgroundColor: "white", borderTopLeftRadius: 40, borderTopRightRadius: 40 }} elevation={5}> */}
      <ScrollView
        style={{
          // iOS shadow
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          // Android shadow
          elevation: 5,
          flex: 1,
          backgroundColor: isDark ? '#343A46' : "white",
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            // marginTop: -40,
            paddingTop: 5,
          }}
        >
          {/* {!isUserAdmin ? ( */}
          <>
            <View
              style={{
                padding: 10,
                // borderWidth: 2,
                // borderColor: "#000000",
                // borderColor: "gainsboro",
                borderRadius: 40,
                height: 140,
                width: 140,
                justifyContent: "center",
                alignItems: "center",
                // backgroundColor: "#fdbe00",
                // backgroundColor: "#ffde7a",
                backgroundColor: "gainsboro",
              }}
            >
              {conversationData?.groupIcon !== "default_group_icon" ? (
                <Image
                  style={styles.img}
                  source={{
                    uri: addPathToGroupImages(conversationData?.groupIcon),
                  }}
                  placeholder={require("../../assets/icons/skeletonLoadingPlaceholder.gif")}
                  placeholderContentFit="cover"
                  contentFit="cover"
                />
              ) : (
                // <TabBarIcon name="defaultProfileIcon" size={40} color="white" />

                <TabBarIcon name="defaultGroupIcon" size={60} color={isDark ? '#000000': '#ffffff'} />
              )}
            </View>
            <AppText
              style={[
                styles.boldText,
                {
                  fontSize: 17,
                  backgroundColor: isDark ? '#536076' : "whitesmoke",
                  padding: 10,
                  borderRadius: 10,
                  maxWidth: "90%",
                  marginVertical: 10,
                  color: colors.text,
                },
              ]}
            >
              @{conversationData?.groupName}
            </AppText>
            <AppText style={[styles.mediumText, { fontSize: 22, color: colors.text }]}>
              {conversationData?.groupName}
            </AppText>

            {/* {isOnline ? (
            <Text
              style={{
                fontFamily: "Dosis_700Bold",
                color: "#FFFFFF",
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
                  { fontSize: 16, color: "gray", margin: 5 },
                ]}
              >
                Last seen at {lastSeen}
              </Text>
            )
          )} */}
            <AppText
              style={[
                styles.mediumText,
                { fontSize: 16, color: colors.text, margin: 5 },
              ]}
            >
              Group created at{" "}
              {conversationData?.createdAt
                ? format(new Date(conversationData.createdAt), "dd LLLL yyyy")
                : ""}
            </AppText>
            {conversationData?.groupDescription && (
              <AppText
                style={[
                  styles.mediumText,
                  {
                    fontSize: 16,
                    padding: 10,
                    backgroundColor: isDark ? '#536076' : "whitesmoke",
                    borderRadius: 10,
                    margin: 5,
                    color: colors.text,
                  },
                ]}
              >
                {conversationData?.groupDescription}
              </AppText>
            )}
          </>
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
              <AppText style={[styles.mediumText, { fontSize: 15, color: colors.text }]}>Message</AppText>
            </Pressable>
          </View>
          <View style={{ borderRadius: 10, overflow: "hidden" }}>
            <Pressable
              android_ripple={android_ripple}
              style={styles.pressableBtns}
            >
              <TabBarIcon name="leafMaple" size={30} color="#0077FF" />
              <AppText style={[styles.mediumText, { fontSize: 15, color: colors.text }]}>Theme</AppText>
            </Pressable>
          </View>
          <View style={{ borderRadius: 10, overflow: "hidden" }}>
            <Pressable
              android_ripple={android_ripple}
              style={styles.pressableBtns}
            >
              <TabBarIcon name="share" size={30} color="#03045E" />
              <AppText style={[styles.mediumText, { fontSize: 15, color: colors.text }]}>Share</AppText>
            </Pressable>
          </View>
        </View>
        {/* <View>
          <Text
            style={[
              styles.mediumText,
              { fontSize: 16, color: "gray", margin: 5 },
            ]}
          >
            Last message: {conversationData?.lastMessage}
          </Text>
          <Text
            style={[
              styles.mediumText,
              { fontSize: 16, color: "gray", margin: 5 },
            ]}
          >
            Unread messages count: {conversationData?.unreadMessagesCount}
          </Text>
        </View> */}
        <View
          style={{
            flexDirection: "row",
            // justifyContent: "space-evenly",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 20,
            marginHorizontal: 20,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#555' : "#f0f0f0",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TabBarIcon name="defaultGroupIcon" size={33} color={colors.text} />
            <AppText
              style={[
                styles.boldText,
                { fontSize: 16, color: colors.text, margin: 5 },
              ]}
            >
              Participants
            </AppText>
          </View>
          <PressableIcon
            disabled={false}
            // disabled={!isUserAdmin}
            iconName="groupAdd"
            iconSize={25}
            rippleColor=""
            // iconColor={isDark ? colors.text : "#000000"}
            iconColor={colors.text}
            onClick={() => {
              // navigation.navigate("AddParticipants", {
              //   conversationId: groupConversationId,
              // });
              navigation.navigate("SelectUsersSearchComponent", {
                headerText: "Add group participants",
                conversationId: groupConversationId,
                info: "add_group_participants",
              });
            }}
            customStyle={{
              padding: 10,
              backgroundColor: isDark ? '#536076' : "whitesmoke",
              margin: 5,
              // borderWidth: 2,
              // borderColor: "#000000",
              // borderRadius: 10,
              // marginLeft: 10,
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          {participantsData?.length !== 0 ? (
            <FlashList
              //  onLoad={() => console.log("FlashList Loaded")}
              decelerationRate={0.92}
              // estimatedListSize={{height: 600, width: 200}}
              // estimatedListSize={70}
              data={participantsData || []}
              renderItem={renderItem}
              keyExtractor={(item) => item.user.user_id?.toString()} // Ensure to return a string
              // estimatedItemSize={50} // set closer to average actual height

              estimatedItemSize={60} // set closer to average actual height
              // extraData={selectedMessageIds}
              // inverted
              removeClippedSubviews
              keyboardShouldPersistTaps="handled"
              automaticallyAdjustKeyboardInsets
              showsVerticalScrollIndicator={false}
              // contentContainerStyle={styles.contentContainer}
              // onEndReached={handleEndReached}
              onEndReachedThreshold={0.7}
              // ListEmptyComponent={ListEmptyComponent}
              maintainVisibleContentPosition={{
                minIndexForVisible: 1,
                autoscrollToTopThreshold: 10,
              }}
              ListFooterComponent={
                <>
                  <Pressable
                    android_ripple={android_ripple}
                    style={{
                      padding: 20,
                      // backgroundColor: "whitesmoke",
                      // borderTopWidth: 1,
                      // borderColor: "#f0f0f0",
                      borderRadius: 10,
                      // width: 200,
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <TabBarIcon name="book" size={25} color= {!isDark ? "#000000": "#FFFFFF"}  />
                    <AppText
                      style={[
                        styles.boldText,
                        { marginLeft: 10, fontSize: 15, color: colors.text },
                      ]}
                    >
                      Group rules/guidelines
                    </AppText>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setVisibleLeaveGroup(true);
                    }}
                    android_ripple={android_ripple}
                    style={{
                      padding: 20,
                      // backgroundColor: "whitesmoke",
                      // borderTopWidth: 1,
                      // borderColor: "#f0f0f0",
                      borderRadius: 10,
                      // width: 200,
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <TabBarIcon name="logout" size={25} color="crimson" />
                    <AppText
                      style={[
                        styles.boldText,
                        { marginLeft: 10, fontSize: 15, color: colors.text },
                      ]}
                    >
                      Leave the group
                    </AppText>
                  </Pressable>
                </>
              }
              // getItemType={() => "message"}
              // ref={flashListRef}
              // onViewableItemsChanged={onViewableItemsChanged}
              // viewabilityConfig={{
              //   itemVisiblePercentThreshold: 50,
              // }}
            />
          ) : (
            <ParticipantsEmptyComponent />
          )}
        </View>
      </ScrollView>

      <Portal>
        <Dialog
          visible={visibleLeaveGroup}
          onDismiss={hideDialog}
          style={{ backgroundColor: isDark ? colors.background : "#FFFFFF", borderRadius: 20 }}
        >
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <TabBarIcon name="logout" color={colors.text} size={30} />
          </View>

          <Dialog.Title
            style={{
              color: colors.text,
              textAlign: "center",
            }}
          >
            Leave group
          </Dialog.Title>
          <Dialog.Content>
            <AppText
              style={{
                color: colors.text,
                textAlign: "center",
                fontSize: 17,
              }}
            >
              Are you sure ?
            </AppText>
            <AppText
              style={{
                color: colors.text,
                textAlign: "center",
                fontSize: 17,
              }}
            >
              You are going to leave the group. All your messages and
              conversations will be deleted permanently...
            </AppText>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              style={{ backgroundColor: colors.primary, borderRadius: 10 }}
              onPress={() => {
                console.log("Cancel");
                setVisibleLeaveGroup(false);
              }}
            >
              <AppText style={{ color: "#FFFFFF" }}>Cancel</AppText>
            </Button>
            <Button
              style={{ backgroundColor: isDark ? '#555' : "#FFFFFF", borderRadius: 10 }}
              onPress={handleLeaveGroup}
            >
              <AppText style={{ color: colors.text }}>Leave group!</AppText>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  img: {
    width: 130,
    height: 130,
    borderRadius: 40,
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

  regularText: { },
  boldText: { },
  mediumText: { },

  inputBar: {
    // paddingHorizontal: 12,
    // paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "whitesmoke",
    // borderWidth: 2,
    borderColor: "whitesmoke",
    width: "80%",
    color: "#193088",
    marginHorizontal: "auto",
    fontSize: 16,
    // marginTop: 20,
    // marginBottom: 20,
    // textAlign: "center",

  },

  placeholder: {
    color: "gray",
    textAlign: "center",
  },
  inputOutline: {
    borderWidth: 0,
    borderRadius: 10,
    margin: 0,
    padding: 0,
  },
});
