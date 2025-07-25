// import withObservables from "@nozbe/with-observables";
import { withObservables } from '@nozbe/watermelondb/react'
import { Q } from "@nozbe/watermelondb";
import {
  conversationOtherParticipantsCollection,
  conversationsCollection,
  otherusersCollection,
} from "../../index.native";
import { combineLatest, map, of, switchMap } from "rxjs";

const PAGE_SIZE = 30; // Number of conversations per page

// function ReactiveChatsList() {
//   // const [page, setPage] = useState(1);
//   const page = useSelector(selectChatScreenPageCount);
//   const filterBy = useSelector(selectFilterBy);

//   // if(filterBy == 'directConv'){

//   // }
//   // else if(filterBy == 'group'){

//   // }
//   // else if(filterBy == 'unread'){

//   // }

//   // const clauses = [];

//   // if (filterBy) {
//   //   clauses.push(

//   //     Q.where('some_field', Q.like(`%${filterBy}%`)) // 🧹 Add your dynamic filter first
//   //   );
//   // }

//   // clauses.push(
//   //   Q.sortBy('updated_at', 'desc'), // 📅 Sort by updated_at AFTER filtering
//   //   Q.skip((page - 1) * PAGE_SIZE), // 📜 Pagination
//   //   Q.take(PAGE_SIZE)
//   // );

//   // const conversationsQuery = conversationsCollection.query(...clauses);

//   // const EnhancedChat = withObservables(["page"], ({ page }) => {
//   // const EnhancedChat = withObservables(
//   //   ["page"],
//   //   ({ page }) => {
//   const EnhancedChat = withObservables([], () => {
//     const clauses = [];

//     // console.log(filterBy);

//     if (filterBy === "directConv") {
//       clauses.push(
//         Q.where("is_group", false) // filter conversations
//       );
//     } else if (filterBy === "group") {
//       // console.log("Pushing group");
//       clauses.push(
//         Q.where("is_group", true) // filter conversations
//       );
//     } else if (filterBy === "unread") {
//       clauses.push(Q.where("unread_messages_count", Q.gt(0)));
//     }

//     // if (filterBy) {
//     //   clauses.push(
//     //     Q.where('some_field', Q.like(`%${filterBy}%`)) // filter conversations
//     //   );
//     // }

//     clauses.push(
//       Q.sortBy("updated_at", Q.desc),
//       Q.skip((page - 1) * PAGE_SIZE),
//       Q.take(PAGE_SIZE)
//     );

//     // const conversationsQuery = conversationsCollection.query(
//     //   Q.sortBy("updated_at", "desc"),
//     //   Q.skip((page - 1) * PAGE_SIZE),
//     //   Q.take(PAGE_SIZE)
//     // );

//     // console.log(clauses);

//     const conversationsQuery = conversationsCollection.query(...clauses);

//     const conversations$ = conversationsQuery.observe();

//     const enrichedConversations$ = conversations$.pipe(
//       switchMap((conversations) => {
//         if (conversations.length === 0) {
//           return of([]);
//         }
    
//         const convoIds = conversations
//           .filter((c) => !c.isGroup)
//           .map((c) => c.conversationId);
    
//         if (convoIds.length === 0) {
//           // All conversations are group chats
//           return of(
//             conversations.map((convo) => ({
//               ...convo._raw,
//               participants: [],
//             }))
//           );
//         }
    
//         return conversationOtherParticipantsCollection
//           .query(Q.where("conversation_id", Q.oneOf(convoIds)))
//           .observe()
//           .pipe(
//             switchMap((participants) => {
//               const userIds = [...new Set(participants.map((p) => p.userId))];
    
//               if (userIds.length === 0) {
//                 // No users found
//                 return of(
//                   conversations.map((convo) => ({
//                     ...convo._raw,
//                     participants: [],
//                   }))
//                 );
//               }
    
//               return otherusersCollection
//                 .query(Q.where("user_id", Q.oneOf(userIds)))
//                 .observe()
//                 .pipe(
//                   map((users) => {
//                     const userMap = Object.fromEntries(
//                       users.map((u) => [u.userId, u._raw])
//                     );
    
//                     const participantsByConvo: Record<string, any[]> = {};
    
//                     participants.forEach((p) => {
//                       const convoId = p.conversationId;
//                       const user = userMap[p.userId];
    
//                       if (!participantsByConvo[convoId]) {
//                         participantsByConvo[convoId] = [];
//                       }
    
//                       participantsByConvo[convoId].push({
//                         ...p._raw,
//                         user: user || null,
//                       });
//                     });
    
//                     return conversations.map((convo) => ({
//                       ...convo._raw,
//                       participants: !convo.isGroup
//                         ? participantsByConvo[convo.conversationId] || []
//                         : [],
//                     }));
//                   })
//                 );
//             })
//           );
//       })
//     );

//     return {
//       conversations: enrichedConversations$,
//     };
//   })(ChatList);

//   // return <EnhancedChat page={page} />;
//   // No need to pass page because we are already using it from redux
//   return <EnhancedChat />;
// }
function ReactiveChatsList() {
  const page = useSelector(selectChatScreenPageCount);
  const filterBy = useSelector(selectFilterBy);

  const EnhancedChat = withObservables([], () => {
    const clauses = [];

    if (filterBy === "directConv") {
      clauses.push(Q.where("is_group", false));
    } else if (filterBy === "group") {
      clauses.push(Q.where("is_group", true));
    } else if (filterBy === "unread") {
      clauses.push(Q.where("unread_messages_count", Q.gt(0)));
    }

    clauses.push(
      Q.sortBy("updated_at", Q.desc),
      Q.skip((page - 1) * PAGE_SIZE),
      Q.take(PAGE_SIZE)
    );

    const conversations$ = conversationsCollection
      .query(...clauses)
      .observeWithColumns([
        "last_message",
        "updated_at",
        "is_group",
        "unread_messages_count",
      ]);

    const enriched$ = conversations$.pipe(
      switchMap((conversations) => {
        const convoIds = conversations
          .filter((c) => !c.isGroup)
          .map((c) => c.conversationId);

        if (convoIds.length === 0) {
          return of(
            conversations.map((c) => ({
              ...c._raw,
              participants: [],
            }))
          );
        }

        const participants$ = conversationOtherParticipantsCollection
          .query(Q.where("conversation_id", Q.oneOf(convoIds)))
          .observe();

        return participants$.pipe(
          switchMap((participants) => {
            const userIds = [...new Set(participants.map((p) => p.userId))];

            if (userIds.length === 0) {
              return of(
                conversations.map((c) => ({
                  ...c._raw,
                  participants: [],
                }))
              );
            }

            return otherusersCollection
              .query(Q.where("user_id", Q.oneOf(userIds)))
              .observe()
              .pipe(
                map((users) => {
                  const userMap = Object.fromEntries(
                    users.map((u) => [u.userId, u._raw])
                  );

                  const participantsByConvo: Record<string, any[]> = {};

                  participants.forEach((p) => {
                    const convoId = p.conversationId;
                    const user = userMap[p.userId];

                    if (!participantsByConvo[convoId]) {
                      participantsByConvo[convoId] = [];
                    }

                    if (user) {
                      participantsByConvo[convoId].push({
                        ...p._raw,
                        user,
                      });
                    }
                  });

                  return conversations.map((c) => ({
                    ...c._raw,
                    participants: c.isGroup
                      ? []
                      : participantsByConvo[c.conversationId] || [],
                  }));
                })
              );
          })
        );
      })
    );

    return { conversations: enriched$ };
  })(ChatList);

  return <EnhancedChat />;
}

import { StyleSheet, View } from "react-native";
import React from "react";

import OnlineUserChatList from "../components/OnlineUserChatList";
import { useSelector } from "react-redux";
import {
  selectChatScreenPageCount,
  selectFilterBy,
} from "../chatScreenStatesSlice";
import ChatListMoreMenu from "../components/ChatListMoreMenu";
import ChatList from "../components/ChatList";
import ChatScreenCustomHeader from "../components/ChatScreenCustomHeader";
import { useAppTheme } from "../ThemeContext";

// type ChatProps = NativeStackScreenProps<RootStackParamList, "Chats">;
// type conversationProps = {
//   conversations: any;
//   otherParticipant: any;
//   full_name: string;
//   _id: string;
//   profile_image_filename: any;
//   otherParticipantProfileImage: string;
//   lastUpdated: string;
//   otherParticipantId: string;
//   // conversationFieldElementId: string;
//   conversationId: string;
//   otherParticipantName: string;
//   lastMessage: string;
//   unreadMessagesCount: number;
//   imageUrl: string;
// };
// type deleteConversationProps = {
//   conversationId: string;
// };

export default function Chats({}) {
  // const onlineUsers = useMemo(() => {
  //   return conversations.filter((conversation: any) => conversation.isOnline);
  // }, [conversations]);

  const {colors, isDark} = useAppTheme();

  return (
    <>
      {/* <View style={{ flex: 1, backgroundColor: "#fdbe00" }}> */}
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <ChatScreenCustomHeader />

          <OnlineUserChatList />
          {/* )} */}

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

              // alignItems: "center",
              // justifyContent: "center",
              // backgroundColor: "white",
              backgroundColor: !isDark? '#FFFFFF': '#343A46' ,
              width: "100%",
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
              // paddingTop: 20,
              flex: 1,
              overflow: "hidden",
            }}
          >
            <ChatListMoreMenu />

            {/* <Text
              style={{
                fontFamily: "Dosis_600SemiBold",
                fontSize: 18,
                margin: 15,
              }}
            >
              All messages
            </Text> */}

            <ReactiveChatsList />
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
