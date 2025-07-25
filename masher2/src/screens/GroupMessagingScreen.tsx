import { StyleSheet, View, StatusBar } from "react-native";
import React, { useEffect } from "react";
import { RootStackParamList } from "../MainComponent";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import MessageInput from "../components/MessageInput";
import database, { messagesCollection, otherusersCollection } from "../../index.native";
// import withObservables from "@nozbe/with-observables";
import { withObservables } from '@nozbe/watermelondb/react'
import { Q } from "@nozbe/watermelondb";
import {
  selectCurrentConversationId,
  selectMessagingScreenPageCount,
  setCurrentOtherParticipantId,
  setCurrentStickyHeaderDate,
  setMessagingScreenPageCount,
  setSelectedMessageIds,
} from "../messageScreenStatesSlice";
import { useDispatch, useSelector } from "react-redux";
import GroupMessagingScreenCustomHeader from "../components/GroupMessagingScreenCustomHeader";
import GroupMessagesList from "../components/GroupMessagesList";
import GroupMessageInput from "../components/GroupMessageInput";
import { useAppTheme } from "../ThemeContext";
import { switchMap } from "rxjs";
import fetchConversationGroupData from "../utilities/fetchGroupParticipantsData";



type MessagingScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "GroupMessagingScreen"
>;

type deleteMessagesProps = {
  messageId: string;
  isSender: boolean;
};

const PAGE_SIZE = 100; // Number of conversations per page

// const enhance = withObservables(
//   ["conversationId", "page"],
//   ({ conversationId, page }) => {
//     const offset = (page - 1) * PAGE_SIZE;

//     const query = messagesCollection.query(
//       Q.where("conversation_id", conversationId),
//       Q.sortBy("created_at", Q.desc),
//       Q.skip(offset),
//       Q.take(PAGE_SIZE)
//     );

//     return {
//       messages: query.observeWithColumns(["content", "sender", "is_edited"]), // ✅ observe minimal columns
//     };
//   }
// );
const enhanceMessagesWithSenders = withObservables(['conversationId', 'page'], ({ conversationId, page }) => {
  const offset = (page - 1) * PAGE_SIZE;

  const messagesQuery = messagesCollection.query(
    Q.where('conversation_id', conversationId),
    Q.sortBy('created_at', Q.desc),
    Q.skip(offset),
    Q.take(PAGE_SIZE)
  );

  return {
    messagesWithSenders: messagesQuery.observe().pipe(
      switchMap(async (messages) => {
        const senderIds = [...new Set(messages.map((m) => m.senderId))];

        // 🔥 Efficient batch fetch instead of N queries
        const senders = await otherusersCollection
          .query(Q.where('user_id', Q.oneOf(senderIds)))
          .fetch();

        // Create lookup table for fast mapping
        const senderMap = Object.fromEntries(senders.map((s) => [s.userId, s]));

        return messages.map((message) => ({
          message,
          sender: senderMap[message.senderId] || null,
        }));
      })
    ),
  };
});

// const GroupMessagesListWithSender = enhanceWithSender(GroupMessagesList);
// const EnhancedGroupMessagesList = enhance(GroupMessagesList);
// const EnhancedGroupMessagesList = enhance(GroupMessagesListWithSender);
const EnhancedGroupMessagesList = enhanceMessagesWithSenders(GroupMessagesList);

function ReactiveGroupMessagesList() {
  const page = useSelector(selectMessagingScreenPageCount);
  const conversationId = useSelector(selectCurrentConversationId);

  // console.log("conversationId", conversationId);
  return <EnhancedGroupMessagesList conversationId={conversationId} page={page} />;
}

export default function GroupMessagingScreen({ route }: MessagingScreenProps) {
  const {
    conversationId,
    // otherParticipantId,
    groupName,
    imageUrl,
    isGroup,
  } = route.params || {
    conversationId: "",
    groupName: "",
    imageUrl: "",
    isGroup: false,
  };

        const { colors } = useAppTheme();
  
  const dispatch = useDispatch();
  useEffect(() => {
    // Fetch or update logic here...

    // Fetch group participants data
    fetchConversationGroupData(conversationId)

    return () => {
      // Reset states when component unmounts
      dispatch(setCurrentStickyHeaderDate(""));
      dispatch(setMessagingScreenPageCount(0));
      dispatch(setCurrentOtherParticipantId(""));
      dispatch(setSelectedMessageIds([]));
    };
    // }, [dispatch]);
  }, []);

  

  return (
    <>
      {/* <StatusBar backgroundColor={"#fdbe00"} barStyle={"light-content"} /> */}
      <StatusBar backgroundColor={colors.background} barStyle={"light-content"} />

      {/* <View style={{ flex: 1, backgroundColor: "#fdbe00" }}> */}
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <GroupMessagingScreenCustomHeader
          // userId={conversationId}
          name={groupName}
          imageUrl={imageUrl}
          isGroup={isGroup}
        />

        <ReactiveGroupMessagesList />

        <GroupMessageInput />
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
