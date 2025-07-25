import {
  ActivityIndicator,
  Dimensions,
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
import MessagingScreenMessagesLoader from "../loaders/MessagingScreenMessagesLoader";
import { FlashList } from "@shopify/flash-list";
import TabBarIcon from "./TabBarIcon";
import Message from "./Message";
import { useDispatch, useSelector } from "react-redux";
import {
  removeSelectedMessageId,
  pushSelectedMessageId,
  selectCurrentConversationId,
  selectCurrentOtherParticipantId,
  selectCurrentStickyHeaderDate,
  selectIsMessMenuVisible,
  selectLoadingMessages,
  selectSelectedMessageIds,
  setCurrentStickyHeaderDate,
  setIsMessMenuVisible,
  setLoadingMessages,
  // setSelectedMessageIds,
} from "../messageScreenStatesSlice";

interface MessagesListProps {
  messages: any[];
}

type GroupMessagesListProps = {
  messagesWithSenders: {
    message: any;
    sender: any | null;
  }[];
};

type deleteMessagesProps = {
  messageId: string;
  isSender: boolean;
};

const { width, height } = Dimensions.get("window");

// Estimate the list size dynamically based on the screen's height and width
const estimatedListSize = {
  height: height * 0.7, // 70% of the screen height (you can adjust this)
  width: width, // Full width of the screen
};

import { format, isToday, isYesterday } from "date-fns";
import upsertBulkMessagesInChunks from "../database/upsertBulkMessages";
import { axiosInstance } from "../utilities/axiosInstance";
import { Image } from "expo-image";
import GroupMessage from "./GroupMessage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../MainComponent";
import { useAppTheme } from "../ThemeContext";
// export default function GroupMessagesList({
type Message = {
  senderId: string;
  [key: string]: any;
};

function addShowAvatarFlag(messages: Message[]): (Message & { showAvatar: boolean })[] {
  const result: (Message & { showAvatar: boolean })[] = [];
  let nextSenderId: string | null = null;

  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    const isNewGroup = msg.senderId !== nextSenderId;

    result.unshift({
      ...msg,
      showAvatar: isNewGroup,
    });

    nextSenderId = msg.senderId;
  }

  return result;
}

  function groupMessagesByDate(messagesWithSenders: any[]) {
  // const start = Date.now();
  
  const grouped: any[] = [];
  let currentGroup: any[] = [];
  let lastDate = "";
  
  
  messagesWithSenders.forEach((item, index) => {
    // const messageDate = new Date(message.createdAt);
    // Because message.createdAt is already a date object in ms or seconds by date-fns, we can use it directly

    // console.log("Item:", item.message.messageId);
    const messageDate = item.message.createdAt;
    let displayDate = "";
    
    if (isToday(messageDate)) {
      displayDate = "Today";
    } else if (isYesterday(messageDate)) {
      displayDate = "Yesterday";
    } else {
      displayDate = format(messageDate, "dd MMM yyyy");
    }

    if (displayDate !== lastDate && currentGroup.length > 0) {
      // Push the group messages first, then the header
      grouped.push(...currentGroup);
      grouped.push({
        type: "header",
        id: `header-${lastDate}`,
        displayDate: lastDate,
      });
      currentGroup = [];
    }
    
    currentGroup.push({
      type: "message",
      messageId: item.message.messageId,
      content: item.message.content,
      formattedDate: item.message.formattedDate,
      isSender: item.message.isSender,
      createdAt: item.message.createdAt,
      senderId: item.message.senderId,
      sender: item.sender || null, // Use the sender from the messagesWithSenders array
    });
    
    lastDate = displayDate;

    // Handle last group (at end of list)
    if (index === messagesWithSenders.length - 1 && currentGroup.length > 0) {
      grouped.push(...currentGroup);
      grouped.push({
        type: "header",
        id: `header-${lastDate}`,
        displayDate: lastDate,
      });
    }
  });
  
  // const end = Date.now();
  // const duration = end - start;
  // console.log("Duration: " + duration);

  // return grouped;
  return addShowAvatarFlag(grouped);
}

const CurrentStickyHeaderComponent = () => {
  const currentStickyHeader = useSelector(selectCurrentStickyHeaderDate);
  if (!currentStickyHeader) return;
  return (
    <View
      style={{
        position: "absolute",
        top: 10,
        padding: 5,
        // backgroundColor: "#f5f5f5",
        backgroundColor: "whitesmoke",
        zIndex: 10,
        // width: 100,
        alignSelf: "center",
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        opacity: 0.98,
      }}
    >
      <TabBarIcon name="date" size={12} color="black" />
      <Text
        style={{
          textAlign: "center",
          fontFamily: "Dosis_500Medium",
          fontSize: 13,
          marginLeft: 5,
        }}
      >
        {currentStickyHeader}
      </Text>
    </View>
  );
};

const ListEmptyComponent = () => {
  const {isDark} = useAppTheme();
  return (
    // <View style={{transform: [{rotate: '10deg'}]}}>
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Image
        style={{ width: 150, height: 100, borderRadius: 50 }}
        source={require("../../assets/icons/friends.jpg")}
        // placeholder={require("../../assets/icons/skeletonLoadingPlaceholder.gif")}
        placeholderContentFit="cover"
        contentFit="cover"
      />
      <Text
        style={{
          fontFamily: "Dosis_500Medium",
          fontSize: 18,
          padding: 5,
          borderRadius: 20,
          color: isDark ? "#FFFFFF" : "#000000"
        }}
      >
        Send your first text
      </Text>
    </View>
  );
};

// function GroupMessagesList({ messages }: MessagesListProps) {
function GroupMessagesList({ messagesWithSenders }: GroupMessagesListProps) {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, "GroupMessagingScreen">
    >();
  const flashListRef = useRef<FlashList<any>>(null);

  const {isDark, colors} = useAppTheme()

  // console.log(messagesWithSenders)
  
  // const start = Date.now()
    // console.log(messages)
  //   const end = Date.now()
  //   const duration = end - start
  // console.log('Duration: '+ duration)
  const [
    newMessageFromCurrentConversation,
    setNewMessageFromCurrentConversation,
  ] = useState(false);

  useEffect(() => {
    if (newMessageFromCurrentConversation) {
      flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [newMessageFromCurrentConversation]);

  // // In useEffect, when a new message is added:
  // flashListRef.current?.scrollToOffset({ offset: 0, animated: true });

  // const memoizedMessages = useMemo(() => messages, [messages]);

  const groupedMessages = useMemo(() => {
    return groupMessagesByDate(messagesWithSenders || []);
    // return [];
  }, [messagesWithSenders]);

  const conversationId = useSelector(selectCurrentConversationId);
  const otherParticipantId = useSelector(selectCurrentOtherParticipantId);

  const dispatch = useDispatch();

  const isMessMenuVisible = useSelector(selectIsMessMenuVisible);

  const selectedMessageIds = useSelector(selectSelectedMessageIds);

  const loadingMessages = useSelector(selectLoadingMessages);

  // console.log("Selected message ids: ", selectedMessageIds);

  // useEffect(() => {
  //   console.log("Redux isMessMenuVisible updated:", isMessMenuVisible);
  // }, [isMessMenuVisible]);
  const toggleMessageSelection = (newMessage: deleteMessagesProps) => {
    const exists = selectedMessageIds.some(
      (msg: { messageId: string }) => msg.messageId === newMessage.messageId
    );
    // console.log("Exists: ", exists);
    if (exists) {
      // Remove the message if it already exists
      dispatch(removeSelectedMessageId(newMessage));
    } else {
      // Add the message if it doesn't exist

      dispatch(pushSelectedMessageId(newMessage));
    }
  };

  const checkIfMessageAlreadySelected = (newMessageId: string) => {
    return selectedMessageIds.some(
      (message: { messageId: string }) => message.messageId === newMessageId
    );
  };

  // Required states- selectedMessageIds and its set function, isMessMenuVisible, page set function

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      // console.log("RendItem:", item.sender);
        const isSelected = checkIfMessageAlreadySelected(item.messageId);


      // const message = item.message;
      // const sender = item.sender;

      if (item.type === "header") {

        console.log("Header item:", item.displayDate);
        return (
          <View
            style={{
              alignSelf: "center",
              marginVertical: 10,
              // position: "sticky",
              top: 0,
              backgroundColor: "whitesmoke",
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "#000000",
                fontFamily: "Dosis_500Medium",
              }}
            >
              {item.displayDate}
            </Text>
          </View>
        );
      }

      return (
        <GroupMessage
          item={item}
          // selected={false}
          selected={isSelected}
          isMessMenuVisible={isMessMenuVisible}

          onClick={() => {
            // console.log("toggle");
            console.log(isMessMenuVisible);
            if (isMessMenuVisible) {
              toggleMessageSelection({
                messageId: item.messageId,
                isSender: item.isSender,
              });
            }
          }}
          onLongPress={() => {
            // If message menu is not visible then -
            // if (!isMessMenuVisible) {
            // setIsMessMenuVisible(true);
            if (!isMessMenuVisible) {

            dispatch(setIsMessMenuVisible(true));

            toggleMessageSelection({
              messageId: item.messageId,
              isSender: item.isSender,
            });
          }
          else{
             toggleMessageSelection({
              messageId: item.messageId,
              isSender: item.isSender,
            });
          }
          }}
          onPressParticipantProfileImg={()=>{navigation.navigate('User', {userId: item.senderId})}}
        />
      );
      // }, []);
    },
    [
      isMessMenuVisible,
      selectedMessageIds,
      // toggleMessageSelection,
      // checkIfMessageAlreadySelected,
    ]
  );

  const ListFooter = useMemo(
    () =>
      loadingMessages ? (
        <ActivityIndicator
          style={{ margin: 15 }}
          size="small"
          color="#000000"
        />
      ) : null,
    [loadingMessages]
  );

  // const keyExtractor = useCallback((item: any, index: number) => {
  //   if (item.message.type === "header") return item.message.id;
  //   return item.message.messageId?.toString() || index.toString();
  // }, []);

  const keyExtractor = useCallback((item: any, index: number) => {
  if (item.type === "header") return item.id;
  return item.messageId?.toString() || index.toString();
}, []);
  // const [loadingMessages, setLoadingMessages] = useState(true);

  // const skip = useRef(0);

  // const fetchConversationMessages = () => {
  //   if (conversationId !== "find_through_page_using_otherParticipant") {
  //     axiosInstance
  //       .get(
  //         "/api/conversations/getConversationAllMessages/" +
  //           conversationId +
  //           "/" +
  //           skip.current
  //       )
  //       .then((response) => {
  //         // console.log('response.data');
  //         // console.log(response.data);
  //         upsertBulkMessagesInChunks(response.data, 100);

  //         setTimeout(() => {
  //           setLoadingMessages(false);
  //           // setPage((prevPage) => prevPage + 1); // Increase the page number
  //         }, 500);
  //       })
  //       .catch((error) => {
  //         console.log("Error" + error);
  //         setTimeout(() => {
  //           setLoadingMessages(false);
  //         }, 500);
  //       });
  //   } else {
  //     console.log("loading by participants");
  //     axiosInstance
  //       .get(
  //         "/api/conversations/getConversationAllMessagesByParticipants/" +
  //           otherParticipantId +
  //           "/" +
  //           skip.current
  //       )
  //       .then((response) => {
  //         // console.log(response.data);
  //         // setMessagesData(response.data);

  //         // Save messages in realm data-
  //         // upsertBulkMessages(response.data);
  //         upsertBulkMessagesInChunks(response.data, 100);

  //         setTimeout(() => {
  //           // setLoadingMessages(false);
  //           dispatch(setLoadingMessages(false));
  //           // setPage((prevPage) => prevPage + 1); // Increase the page number
  //         }, 500);
  //       })
  //       .catch((error) => {
  //         console.log("Error" + error);
  //         setTimeout(() => {
  //           // setLoadingMessages(false);
  //           dispatch(setLoadingMessages(false));
  //         }, 500);
  //       });
  //   }
  // };

  const cursor = useRef({
  before: new Date().toISOString(),
  lastId: null,
});

const [hasMoreMessages, setHasMoreMessages] = useState(true);

const fetchConversationMessages = () => {
  if (!hasMoreMessages || loadingMessages) return;

  const { before, lastId } = cursor.current;

  const endpoint = `/api/conversations/getConversationAllMessages/${conversationId}`

  axiosInstance
    .get(endpoint, {
      params: {
        before,
        lastId,
      },
    })
    .then((response) => {
      const { messages, nextCursor } = response.data;

      if (messages && messages.length > 0) {
        upsertBulkMessagesInChunks(messages, 100);

        // Update cursor
        if (nextCursor) {
          cursor.current = nextCursor;
        } else {
          setHasMoreMessages(false);
        }
      } else {
        setHasMoreMessages(false);
      }

      setTimeout(() => {
        dispatch(setLoadingMessages(false));
      }, 500);
    })
    .catch((error) => {
      console.log("Error fetching messages:", error);
      setTimeout(() => {
        dispatch(setLoadingMessages(false));
      }, 500);
    });
};


  useEffect(() => {
    // Load conversation messages-
    fetchConversationMessages();
  }, [conversationId, otherParticipantId]);

   const onViewableItemsChanged = useCallback(
      ({ viewableItems }: { viewableItems: Array<{ item: any }> }) => {
        // console.log("Itemk:");
        for (let item of viewableItems) {
          // console.log("Itemk:", item.item.createdAt);
          if (item.item.type === "message") {
            const messageDate = item.item.createdAt;
            let displayDate = "";
  
            if (isToday(messageDate)) {
              displayDate = "Today";
            } else if (isYesterday(messageDate)) {
              displayDate = "Yesterday";
            } else {
              displayDate = format(messageDate, "dd MMM yyyy");
            }
  
          // const date = format(new Date(item.item.createdAt), "dd MMM yyyy");
          // setCurrentStickyHeader(date);
          // dispatch(setCurrentStickyHeaderDate(date));
          dispatch(setCurrentStickyHeaderDate(displayDate));
          break;
        }
      }
    },
    [] // ← Add dependencies if needed (e.g., if setCurrentStickyHeader depends on props/state)
  );

  // if (!messages || messages.length === 0) {
  //   return <MessagingScreenMessagesLoader />;
  // }
  // console.log(groupedMessages)
  // const data = Array.from({ length: 3000 }).map((_, i) => ({
  //   id: `${i}`,
  //   content: "Hi",
  // }));
  return (
    // <Surface
    <View
      // elevation={5}
      style={{
        // iOS shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        // Android shadow
        elevation: 5,

        // backgroundColor: "white",
        backgroundColor: !isDark ?"white": '#343A46',

        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        // marginTop: 62,
        overflow: "hidden",
        flex: 1,
      }}
    >
      {/* <View
        style={{
          padding: 15,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <TabBarIcon name="infocirlceo" size={20} color="black" />
        <Text
          style={{
            textAlign: "center",
            fontFamily: "Dosis_500Medium",
            color: "gray",
            fontSize: 12,
            marginLeft: 5,
          }}
        >
          All your messages are end to end encrypted. We delete your messages
          immediately from our servers when the receiver receives them. Hence no
          one can see your conversations.
        </Text>
      </View> */}
      <CurrentStickyHeaderComponent />

      <View style={styles.messagesContainer}>
        {/* {loadingMessages && <MessagingScreenMessagesLoader />} */}
        {/* {!loadingMessages && messages.length === 0 && <ListEmptyComponent />} */}
        {/* {loadingMessages && messages.length === 0 ? ( */}
        {/* {loadingMessages && messages.length === 0 ? (
          <MessagingScreenMessagesLoader />
        ) : ( */}
        {/* <FlashList
        data={data}
        estimatedListSize={{height: 600, width: 400}}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <View style={{backgroundColor: 'red', padding: 10, margin: 2, maxWidth: 200}}><Text style={{ fontSize: 20, padding: 10 }}>{item.content}</Text></View>}
        estimatedItemSize={70}
      /> */}

        {groupedMessages.length !== 0 ? (
          <FlashList
            //  onLoad={() => console.log("FlashList Loaded")}
            decelerationRate={0.92}
            // estimatedListSize={{height: 600, width: 200}}
            estimatedListSize={estimatedListSize}
            data={groupedMessages || []}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            // estimatedItemSize={50} // set closer to average actual height
            estimatedItemSize={71} // set closer to average actual height
            extraData={selectedMessageIds}
            inverted
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
            // getItemType={() => "message"}
            ref={flashListRef}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{
              itemVisiblePercentThreshold: 50,
            }}
          />
        ) : (
          <ListEmptyComponent />
        )}
        {/* )} */}
      </View>
    </View>
  );
}

export default React.memo(GroupMessagesList, (prevProps, nextProps) => {
  return prevProps.messagesWithSenders === nextProps.messagesWithSenders;
});

const styles = StyleSheet.create({
  messagesContainer: {
    flex: 1,
  },
});
