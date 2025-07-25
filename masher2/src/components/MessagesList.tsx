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
  setCurrentConversationId,
  setMessagingScreenPageCount,
  selectMessagingScreenPageCount,
  // setSelectedMessageIds,
} from "../messageScreenStatesSlice";

interface MessagesListProps {
  messages: any[];
}

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
import { useAppTheme } from "../ThemeContext";
// export default function MessagesList({

function groupMessagesByDate(messages: any[]) {
  // const start = Date.now();

  const grouped: any[] = [];
  let currentGroup: any[] = [];
  let lastDate = "";

  messages.forEach((message, index) => {
    // const messageDate = new Date(message.createdAt);
    // Because message.createdAt is already a date object in ms or seconds by date-fns, we can use it directly
    const messageDate = message.createdAt;
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
      messageId: message.messageId,
      content: message.content,
      formattedDate: message.formattedDate,
      isSender: message.isSender,
      createdAt: message.createdAt,
    });

    lastDate = displayDate;

    // Handle last group (at end of list)
    if (index === messages.length - 1 && currentGroup.length > 0) {
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

  return grouped;
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

function MessagesList({ messages }: MessagesListProps) {
  const flashListRef = useRef<FlashList<any>>(null);

  const {colors, isDark} = useAppTheme()
const messagingScreenPageCount = useSelector(selectMessagingScreenPageCount)

  // const start = Date.now()
  //   console.log(messages)
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
    return groupMessagesByDate(messages || []);
    // return [];
  }, [messages]);

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
    // console.log(selectedMessageIds)
    return selectedMessageIds.some(
      (message: { messageId: string }) => message.messageId === newMessageId
    );
  };


    useEffect(()=>{
 console.log('Selection mode:', isMessMenuVisible);
  console.log('Selected messages:', selectedMessageIds);
}, [isMessMenuVisible, selectedMessageIds]);

  // Required states- selectedMessageIds and its set function, isMessMenuVisible, page set function

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      // console.log("Item:", item.messageId);

        const isSelected = checkIfMessageAlreadySelected(item.messageId);

      if (item.type === "header") {
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
        <Message
          item={item}
          // selected={false}
          isMessMenuVisible={isMessMenuVisible}
          selected={isSelected}
          onClick={() => {
            // console.log("toggle");
            // console.log(isMessMenuVisible);
              // if (!isMessMenuVisible) return;
            if (isMessMenuVisible) {
              toggleMessageSelection({
                messageId: item.messageId,
                isSender: item.isSender,
              });
            }
            // else{
            //   console.log('Message menu not visible')
            // }
          }}
          onLongPress={() => {
            // If message menu is not visible then -
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

  const keyExtractor = useCallback((item: any, index: number) => {
    if (item.type === "header") return item.id;
    return item.messageId?.toString() || index.toString();
  }, []);

  // const [loadingMessages, setLoadingMessages] = useState(true);

  // const skip = useRef(0);

  const handleEndReached = () => {
  // if (!loadingMessages && hasMoreMessages) {
    console.log(messagingScreenPageCount)
    dispatch(setMessagingScreenPageCount(messagingScreenPageCount + 1));
  // }
};
  const handleStartReached = () => {
  // if (!loadingMessages && hasMoreMessages) {
    console.log(messagingScreenPageCount)
    dispatch(setMessagingScreenPageCount(messagingScreenPageCount - 1));
  // }
};

  const cursor = useRef({
    before: new Date().toISOString(), // createdAt timestamp
    lastId: null, // message _id
  });

  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  const fetchConversationMessages = () => {
    if (!hasMoreMessages || loadingMessages) return;

    const { before, lastId } = cursor.current;

    const baseUrl =
      conversationId !== "find_through_page_using_otherParticipant"
        ? `/api/conversations/getConversationAllMessages/${conversationId}`
        : `/api/conversations/getConversationAllMessagesByParticipants/${otherParticipantId}`;

        console.log("Fetching messages for conversationId:", conversationId);

    axiosInstance
      .get(baseUrl, {
        params: {
          before,
          lastId,
        },
      })
      .then((response) => {
        const { messages, nextCursor } = response.data;

         if (messages && messages.length > 0) {

          if(conversationId === 'find_through_page_using_otherParticipant'){
            dispatch(setCurrentConversationId(messages[0].conversationId))
          }
        }
        // console.log(messages)

        
        if (messages && messages.length > 0) {

          // if(conversationId === 'find_through_page_using_otherParticipant'){
          //   dispatch(setCurrentConversationId(messages[0].conversationId))
          // }

          upsertBulkMessagesInChunks(messages, 100);

          // Update cursor for next fetch
          if (nextCursor) {
            cursor.current = nextCursor;
          } else {
            setHasMoreMessages(false);
          }
        } else {
          setHasMoreMessages(false);
        }

        setTimeout(() => {
          dispatch(setLoadingMessages(false)); // or setLoadingMessages(false);
        }, 500);
      })
      .catch((error) => {
        console.log("Error fetching messages:", error);
        setTimeout(() => {
          dispatch(setLoadingMessages(false)); // or setLoadingMessages(false);
        }, 500);
      });
  };

  // const fetchConversationMessages = () => {
  //   console.log("Fetching messages" + conversationId);
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
  //     console.log(otherParticipantId)
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

  useEffect(() => {
    // Load conversation messages-
    fetchConversationMessages();
  }, [conversationId, otherParticipantId]);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ item: any }> }) => {
      for (let item of viewableItems) {
        // console.log("Itemk:", item.item);
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
            // DOUBLE CURSOR
            // onEndReached={() => {
            //   if (!loadingMessages && hasMoreMessages) {
            //     fetchConversationMessages();
            //   }
            // }}
            // contentContainerStyle={styles.contentContainer}
             onScroll={({ nativeEvent }) => {
    const { contentOffset } = nativeEvent;
    if (contentOffset.y <= 0) {
      // Implement your logic here
      if(messagingScreenPageCount < 0){
        console.log('Reached the start of the list!');
        handleStartReached()
      }
    }
  }}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.7}
            // ListEmptyComponent={ListEmptyComponent}
            maintainVisibleContentPosition={{
              minIndexForVisible: 1,
              autoscrollToTopThreshold: 50,
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

export default React.memo(MessagesList, (prevProps, nextProps) => {
  return prevProps.messages === nextProps.messages;
});

const styles = StyleSheet.create({
  messagesContainer: {
    flex: 1,
  },
});
