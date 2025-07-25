import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FlashList } from "@shopify/flash-list";
import { useNavigation, useScrollToTop } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import GroupCardElement from "./GroupCardElement";
import MessagesCardElement from "./MessagesCardElement";
import {
  pushSelectedConversationId,
  removeSelectedConversationId,
  selectChatScreenPageCount,
  selectFilterBy,
  selectIsConvMenuVisible,
  selectSelectedConversationIds,
  setChatScreenPageCount,
  setIsConvMenuVisible,
  setLoadingChats,
  setSelectedConversationIds,
} from "../chatScreenStatesSlice";
import { RootStackParamList } from "../MainComponent";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import upsertBulkConversationsInChunks from "../database/upsertBulkConversations";
import upsertBulkOtherUsersInChunks from "../database/upsertBulkOtherUsers";
import { axiosInstance } from "../utilities/axiosInstance";
import {
  selectLoadingMessages,
  setCurrentConversationId,
  setCurrentOtherParticipantId,
} from "../messageScreenStatesSlice";
import { Image } from "expo-image";
import MessageCardElementsLoader from "../loaders/MessageCardElementsLoader";
import { useAppTheme } from "../ThemeContext";
import { selectOnlineUsersList } from "../onlineUsersListStatesSlice";

interface ConversationsListProps {
  conversations: any[];
}

type OnlineUser={
  otherParticipantId: string;
}

const ListEmptyComponent = () => {
  const { isDark } = useAppTheme();
  const filterBy = useSelector(selectFilterBy);

  const filterByText = () => {
    if (filterBy === "directConv") {
      return "No direct messages found";
    } else if (filterBy === "group") {
      return "No groups found";
    } else if (filterBy === "unread") {
      return "No unreads found";
    }
    // } else {
    // return "All conversations";
    // }
  };
  return (
    // <View style={{transform: [{rotate: '10deg'}]}}>
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Image
        style={{ width: 160, height: 116,}}
        source={require('../../assets/icons/chat.png')}
        // placeholder={require("../../assets/icons/skeletonLoadingPlaceholder.gif")}
        placeholderContentFit="cover"
        contentFit="cover"
      />
      <Text
        style={{
          fontFamily: "Dosis_600SemiBold",
          fontSize: 18,
          padding: 5,
          borderRadius: 20,
          color: isDark ? "#FFFFFF" : "#000000",
        }}
      >
        {/* No conversation found */}
        {filterByText()}
      </Text>
    </View>
  );
};

// export default function ChatList({ conversations }: ConversationsListProps) {
function ChatList({ conversations }: ConversationsListProps) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Chats">>();

  const chatScreenPageCount = useSelector(selectChatScreenPageCount);
  const isConvMenuVisible = useSelector(selectIsConvMenuVisible);
  const loadingChats = useSelector(selectLoadingMessages);
  const selectedConversationsIds = useSelector(selectSelectedConversationIds);
  const filterBy = useSelector(selectFilterBy);

    const onlineUsers = useSelector(selectOnlineUsersList) as OnlineUser[];
    // console.log("Online Users List:::", onlineUsers);
    const checkIsUserOnline = (userId: string, onlineUsers: OnlineUser[]): boolean => {
    return onlineUsers.some(user => user.otherParticipantId === userId);
  };

  const ScrollRef = useRef(null);

  
  const [loading, setLoading] = useState(true);

  const {isDark, colors} = useAppTheme();


  useEffect(() => {
    console.log("Conversation changed");
    console.log(conversations);

  }, [conversations]);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 100); // small delay to avoid flicker
    return () => {
      clearTimeout(timeout);
      setLoading(true); // reset for next filter
    };
  }, [filterBy]);

  // The expected native behavior of scrollable components is to respond to events from navigation that will scroll to top when tapping on the active tab as you would expect from native tab bars.
  // In order to achieve it we export useScrollToTop which accept ref to scrollable component (e,g. ScrollView or FlatList).
  useScrollToTop(ScrollRef);

  const dispatch = useDispatch();

  const skip = useRef(0);

  const [refreshing, setRefreshing] = useState(false);

  const refreshData = () => {
    dispatch(setLoadingChats(true));
    fetchConversations();
    //   console.log(conversationsData.length);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    //   setConversationsData([]);
    skip.current = 0;
    // setPage(1);
    dispatch(setChatScreenPageCount(1));

    refreshData();

    dispatch(setIsConvMenuVisible(false));
    // setSelectedConversationId(null);
    dispatch(setSelectedConversationIds([]));

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const memoizedConversations = useMemo(() => conversations, [conversations]);

  // Optimizing flash list-
  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      // const renderItem = ({ item }: { item: any })=> {

      // console.log('item')
      // console.log(item.participants[0].user.full_name);

      // console.log("Item: ");
      // console.log('item.is_group');
      // console.log(item.last_message);

      if (!item.is_group) {

       let isOnline = checkIsUserOnline(item.participants[0].user.user_id, onlineUsers)
       console.log("Is online: ", isOnline);
       console.log("Is online: ", item.participants[0].user.user_id);
        return (
          <MessagesCardElement
            conversationId={item.conversation_id}
            lastMessage={item.last_message ?? ""}
            // unreadMessagesCount={item.unreadMessagesCount ?? 0}
            unreadMessagesCount={item.unread_messages_count}
            // lastUpdated={item.updated_at ?? ""}
            lastUpdated={item.formatted_updated_date ?? ""}
            // otherParticipantId={item.otherParticipantId ?? ""}
            otherParticipantId={item.participants[0].user.user_id ?? ""}
            // otherParticipantName={item.otherParticipantName ?? ""}
            // otherParticipantName={item.participants[0].user.full_name ?? ""}
            otherParticipantName={item.participants[0].user.full_name ?? ""}
            imageUrl={
              // item.participants[0].user.profile_img_filename ??
              item.participants[0].user.profile_img_filename ??
              "default_profile_image"
            }
            // imageUrl={"default_profile_image"}
            onClick={() => {
              // Check if the clicked conversation is already selected
              // If the same conversation is clicked, deselect it
              // checkIfConversationAlreadySelected(item.conversation_id)
              //   ? toggleConversationSelection(item.conversation_id)
              //   : // Otherwise, select the new conversation

              if (isConvMenuVisible) {
                toggleConversationSelection(item.conversation_id);
              } else {
                dispatch(setCurrentConversationId(item.conversation_id));
                dispatch(
                  setCurrentOtherParticipantId(item.participants[0].user.user_id)
                );

                navigation.navigate("MessagingScreen", {
                  conversationId: item.conversation_id,
                  otherParticipantId: item.participants[0].user.user_id ?? "",
                  // isGroup: item.is_group,
                  isGroup: false,
                  otherParticipantName:
                    // item.participants[0].user.full_name ?? "",
                    item.participants[0].user.full_name ?? "",
                  imageUrl:
                    // item.participants[0].user.profile_img_filename ??
                    item.participants[0].user.profile_img_filename ??
                    "default_profile_image",
                  // lastSeen: item.lastSeen ?? "",
                  // isOnline: item.isOnline ?? false,
                });
              }
            }}
            onLongPress={() => {
              if (!isConvMenuVisible) {
                dispatch(setIsConvMenuVisible(true));
                toggleConversationSelection(item.conversation_id);
              } else {
                toggleConversationSelection(item.conversation_id);
              }
            }}
            customStyle={
              checkIfConversationAlreadySelected(item.conversation_id)
                // ? { backgroundColor: "whitesmoke" }
                ? { backgroundColor: !isDark? "whitesmoke": "#444E60" }

                : {}
            }
          isOnline={isOnline}

          />
        );
      } else {
        return (
          <GroupCardElement
            conversationId={item.conversation_id}
            lastMessage={item.last_message ?? ""}
            isGroup={item.is_group}
            groupName={item.group_name ?? ""}
            groupIcon={item.group_icon ?? "default_group_icon"}
            // unreadMessagesCount={item.unreadMessagesCount ?? 0}
            // unreadMessagesCount={10}
            unreadMessagesCount={item.unread_messages_count}
            // lastUpdated={item.updated_at ?? ""}
            lastUpdated={item.formatted_updated_date ?? ""}
            // otherParticipantId={item.otherParticipantId ?? ""}
            // otherParticipantId={item.participants[0].user_id ?? ""}
            // otherParticipantName={item.otherParticipantName ?? ""}
            // imageUrl={"default_profile_image"}
            onClick={() => {
              // Check if the clicked conversation is already selected
              // If the same conversation is clicked, deselect it
              // isConvMenuVisible
              //   ? toggleConversationSelection(item.conversation_id)
              //   : // Otherwise, select the new conversation

              // console.log(
              //   "Clicked conversation ID: ",
              //   item.conversation_id
              // );
              if (isConvMenuVisible) {
                toggleConversationSelection(item.conversation_id);
              } else {
                dispatch(setCurrentConversationId(item.conversation_id));

                navigation.navigate("GroupMessagingScreen", {
                  conversationId: item.conversation_id,
                  isGroup: item.is_group,

                  groupName: item.group_name,
                  imageUrl: item.group_icon ?? "default_group_icon",
                  // lastSeen: item.lastSeen ?? "",
                  // isOnline: item.isOnline ?? false,
                });
              }
            }}
            onLongPress={() => {
              if (!isConvMenuVisible) {
                dispatch(setIsConvMenuVisible(true));
                toggleConversationSelection(item.conversation_id);
              } else {
                toggleConversationSelection(item.conversation_id);
              }
            }}
            customStyle={
              checkIfConversationAlreadySelected(item.conversation_id)
                ? { backgroundColor: !isDark? "whitesmoke": "#444E60" }
                : {}
            }
          />
        );
      }
    },
    [selectedConversationsIds, isConvMenuVisible]
    // []
  );

  const cursorRef = useRef({
  before: new Date().toISOString(), // Initial cursor is now
  lastId: null,
});

const [hasMore, setHasMore] = useState(true);

const fetchConversations = () => {
  if (!hasMore) return; // 🚫 Stop if no more data

  const { before, lastId } = cursorRef.current;

  axiosInstance
    .get("/api/users/getUserConversations", {
      params: {
        before, // timestamp
        lastId, // tie-breaker
      },
      withCredentials: true,
    })
    .then((response) => {
      const { conversations, nextCursor } = response.data;

      if (!conversations || conversations.length === 0) {
        setHasMore(false);
        return;
      }

      // 🧠 Store users first (avoid FlashList crash)
      const extractConversationsUsersData = conversations
        .filter((c: { participant: any; }) => c.participant)
        .map((c: { participant: any; }) => c.participant);

      upsertBulkOtherUsersInChunks(extractConversationsUsersData, 100);

      // 📦 Prepare conversation data
      const extractConversationsData = conversations.map((c: { userConversations: any; participant: { _id: any; }; }) => {
        const userConversation = c.userConversations;
        if (c.participant) {
          userConversation.otherParticipants = [c.participant._id];
        }
        return userConversation;
      });

      upsertBulkConversationsInChunks(extractConversationsData, 100);

      // 🧭 Update cursor
      if (nextCursor) {
        cursorRef.current = nextCursor;
      } else {
        setHasMore(false); // ✅ End reached
      }

      // Delay for smoothness
      setTimeout(() => {
        dispatch(setLoadingChats(false));
      }, 500);
    })
    .catch((error) => {
      console.error("Error fetching conversations:", error);
      dispatch(setLoadingChats(false));
    });
};

  // const fetchConversations = () => {
  //   // console.log("Loading conversations!");
  //   // console.log(skip.current);
  //   axiosInstance
  //     .get("/api/users/getUserConversations/" + skip.current, {
  //       withCredentials: true,
  //     })
  //     .then((response) => {
  //       // console.log("Loaded conversations data: ", response.data);
  //       // setConversationsData(response.data);

  //       console.log(response.data);

  //       // First store conversation users data because if conversations are stored first, flashlist will access its reactive data and will not found user data and will throw error
  //       // Conversations Users data-
  //       let extractConversationsUsersData = [];

  //       for (let i = 0; i < response.data.length; i++) {
  //         if (response.data[i].participant) {
  //           const userData = response.data[i].participant;
  //           extractConversationsUsersData.push(userData);
  //         }
  //       }
  //       // console.log(extractConversationsUsersData);
  //       // insertBulkOtherUsers(extractConversationsUsersData);
  //       // upsertBulkOtherUsers(extractConversationsUsersData);
  //       upsertBulkOtherUsersInChunks(extractConversationsUsersData, 100);

  //       // Store conversations in realm database-
  //       let extractConversationsData = [];

  //       for (let i = 0; i < response.data.length; i++) {
  //         const userConversation = response.data[i].userConversations;

  //         if (response.data[i].participant) {
  //           let otherParticipants = [response.data[i].participant._id];
  //           // console.log("Other participant: " + otherParticipants);
  //           Object.assign(userConversation, {
  //             otherParticipants: otherParticipants,
  //           });
  //         }
  //         extractConversationsData.push(userConversation);
  //       }

  //       // console.log(extractConversationsData);
  //       // insertBulkConversations(extractConversationsData);
  //       // upsertBulkConversations(extractConversationsData);

  //       // for (let index = 0; index < extractConversationsData.length; index++) {
  //       //   const element = extractConversationsData[index];
  //       //   upsertConversation(element)
  //       // }

  //       upsertBulkConversationsInChunks(extractConversationsData, 100);

  //       // setConversationsData((prevData) => [...prevData, ...response.data]);

  //       // skip.current += response.data.length; // Update the skip count

  //       setTimeout(() => {
  //         //   //   setPage((prevPage: number) => prevPage + 1); // Increase the page number
  //         //   setPage(page + 1); // Increase the page number
  //         dispatch(setLoadingChats(false));
  //       }, 500); // Simulating network delay
  //     })
  //     .catch((error) => {
  //       console.log("Error" + error);
  //       dispatch(setLoadingChats(false));
  //     });
  // };

  useEffect(() => {
    // Load conversations-
    fetchConversations();
  }, [chatScreenPageCount]);

  const toggleConversationSelection = (newConv: string) => {
    const exists = selectedConversationsIds.some(
      (convoId: string) => convoId === newConv
    );
    // console.log("Exists: ", exists);
    // console.log(newConv);
    if (exists) {
      // Remove the message if it already exists
      dispatch(removeSelectedConversationId(newConv));
    } else {
      // Add the message if it doesn't exist

      dispatch(pushSelectedConversationId(newConv));
    }
  };

  const checkIfConversationAlreadySelected = (newConversationId: string) => {
    // console.log(newConversationId);
    return selectedConversationsIds.some(
      // (convId) => convId.conversationId === newConversationId
      (convId: string) => convId === newConversationId
    );
  };

  // console.log(conversations);

  if (loading) return <MessageCardElementsLoader />;

  if (conversations.length !== 0) {
    return (
      <FlashList
        refreshControl={
          <RefreshControl
            progressBackgroundColor={"white"}
            colors={["#fdbe00", "orange", "black"]}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        onEndReached={() => {
          if (!loadingChats) {
            //   setPage(page + 1);
            dispatch(setChatScreenPageCount(chatScreenPageCount + 1));
          }
        }}

      // OR USE THIS WITH DOUBLE CURSOR
//       onEndReached={() => {
//   if (hasMore && !loading) {
//     fetchConversations();
//   }
// }}

        ListFooterComponent={
          loadingChats ? (
            <ActivityIndicator
              style={{ margin: 15 }}
              size="small"
              color={"#000000"}
            />
          ) : null
        } // Show loader
        onEndReachedThreshold={0.3}
        // data={conversations}
        data={memoizedConversations}
        extraData={selectedConversationsIds}
        renderItem={renderItem}
        // initialNumToRender={20}
        estimatedItemSize={20}
        keyExtractor={(item) => item.conversation_id?.toString()} // Ensure to return a string
        showsVerticalScrollIndicator={false}
      />
    );
  } else {
    return <ListEmptyComponent />;
  }
}

export default React.memo(ChatList, (prevProps, nextProps) => {
  return prevProps.conversations === nextProps.conversations;
});

const styles = StyleSheet.create({});
