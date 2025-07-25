import { StyleSheet, View, StatusBar } from "react-native";
import React, { useEffect } from "react";
import MessagingScreenCustomHeader from "../components/MessagingScreenCustomHeader";
import { RootStackParamList } from "../MainComponent";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import MessageInput from "../components/MessageInput";
import MessagesList from "../components/MessagesList";
import { messagesCollection } from "../../index.native";
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
import { useAppTheme } from "../ThemeContext";

type MessagingScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "MessagingScreen"
>;

type deleteMessagesProps = {
  messageId: string;
  isSender: boolean;
};

const PAGE_SIZE = 100; // Number of conversations per page

const enhance = withObservables(
  ["conversationId", "page"],
  ({ conversationId, page }) => {
    const offset = (page - 1) * PAGE_SIZE;

    const query = messagesCollection.query(
      Q.where("conversation_id", conversationId),
      // Q.sortBy("created_at", "desc"),
      Q.sortBy("created_at", Q.desc),
      Q.skip(offset),
      Q.take(PAGE_SIZE)
    );

    return {
      messages: query.observeWithColumns(["content", "sender", "is_edited"]), // ✅ observe minimal columns
    };
  }
);

const EnhancedMessagesList = enhance(MessagesList);

function ReactiveMessagesList() {
  const page = useSelector(selectMessagingScreenPageCount);
  const conversationId = useSelector(selectCurrentConversationId);

  // console.log("conversationId", conversationId);
  return <EnhancedMessagesList conversationId={conversationId} page={page} />;
}

export default function MessagingScreen({ route }: MessagingScreenProps) {
  const {
    conversationId,
    otherParticipantId,
    otherParticipantName,
    imageUrl,
    isGroup,
  } = route.params || {
    conversationId: "",
    otherParticipantId: "",
    otherParticipantName: "",
    imageUrl: "",
    isGroup: false,
  };

        const { colors } = useAppTheme();
  
  const dispatch = useDispatch();
  useEffect(() => {
    // Fetch or update logic here...

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
        <MessagingScreenCustomHeader
          userId={otherParticipantId}
          name={otherParticipantName}
          imageUrl={imageUrl}
          isGroup={isGroup}
        />

        <ReactiveMessagesList />

        <MessageInput otherParticipantId={otherParticipantId} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
