import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import io, { type Socket } from "socket.io-client";
import { Alert } from "react-native"; // Import Alert for error messages
// import { useRealm } from "@realm/react";
// import { MessageSchema } from "./database/schema/MessageSchema";
// import { ConversationSchema } from "./database/schema/ConversationSchema";
import upsertMessage from "./database/upsertMessage";
import upsertConversation from "./database/upsertConversation";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentConversationId } from "./messageScreenStatesSlice";
import Toast from "react-native-toast-message";
import { playMessageSound } from "./utilities/playSound";
import { pushOnlineUser, removeOnlineUser } from "./onlineUsersListStatesSlice";

// const SOCKETIO_URL = "http://192.168.130.127:3000";
let SOCKETIO_URL = process.env.EXPO_PUBLIC_SOCKETIO_URL;
console.log("SOCKETIO_URL", SOCKETIO_URL);

interface SocketContextType {
  // socket: Socket | null;
  socket: ReturnType<typeof io> | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const getToken = async (): Promise<string> => {
  try {
    const token = await SecureStore.getItemAsync("secure_token");
    console.log("🔹 SecureStore Token:", token);
    return token || "noToken";
  } catch (error) {
    // console.error("❌ Error retrieving token:", error);
    console.log("❌ Error retrieving token:", error);
    return "noToken";
  }
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // const [socket, setSocket] = useState<Socket | null>(null);
  // const [socket, setSocket] = useState<typeof Socket | null>(null);
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);

  const currentConversationId = useSelector(selectCurrentConversationId);
  const dispatch = useDispatch()

  // const realm = useRealm();

  useEffect(() => {
    const initializeSocket = async () => {
      const token = await getToken();
      console.log("🔹 Connecting to Socket.IO with token:", token);

      const newSocket = io(SOCKETIO_URL, {
        transports: ["websocket"],
        auth: { token: `Bearer ${token}` },
      });

      newSocket.on("connect", () => {
        console.log("✅ Connected to Socket.IO server with ID:", newSocket.id);
      });

      newSocket.on("connect_error", (error: any) => {
        // console.error("❌ Connection Error:", error);
        console.log("❌ Connection Error:", error);
        // Alert.alert("Connection Error", "Failed to connect to the server.");
      });

      newSocket.on("disconnect", (reason: string) => {
        console.log("❌ Disconnected from Socket.IO server. Reason:", reason);
        if (reason === "io server disconnect") {
          // Alert.alert("Disconnected", "Server disconnected the connection.");
        }
      });

      newSocket.on("reconnect_failed", () => {
        // console.error("❌ Reconnection failed!");
        console.log("❌ Reconnection failed!");
        // Alert.alert("Connection Failed", "Unable to reconnect to the server.");
      });

      setSocket(newSocket);

      // Global event liseners-
      newSocket?.on("new_message", async(data: any) => {
        // console.log(data.message.content);
        console.log("data.message", data.message.content);

        // console.log("Whole data", data);
        // console.log(data);
        // alert(data);

        //
        try {
        await playMessageSound()

          // Store message and conversations both because we are already fetching conversation to see if already exists, so we can send it also but only required data which can change with time - (send from server) lastMessage, participant (if group), groupName, groupIcon, conversationId and message data also

          const dataMessage = data.message;

          // Whenever some sends me message if that conversation is not currently active then update unread message count by 1 else provide a scroll to bottom button if new message and also show "new message" in that button-
          // if(currentConversationId !== dataMessage.conversationId){

          // }

          // Upsert message-

          const messageData = {
            conversationId: dataMessage.conversationId,
            messageId: dataMessage._id ?? "",
            sender: dataMessage.sender ?? "",
            // recipients: dataMessage.recipients || [],
            content: dataMessage.content ?? "",
            createdAt: dataMessage.createdAt ?? "",
            isSender: false,
            isEdited: dataMessage.isEdited ?? false,
          };

          // console.log("messageDataSocket", messageData.messageId);
          upsertMessage(messageData);

          // Upsert conversation-
          const dataConversation = data.conversation;

          const conversationData = {
            conversationId: dataConversation._id,
            // otherParticipants: dataConversation.otherParticipants ?? [],

            // Because we are sending participants from server , otherParticipants is processed only for bulk conversations
            participants: dataConversation.participants ?? [],
            isGroup: dataConversation.isGroup,
            groupName: dataConversation.groupName ?? "",
            groupDescription: dataConversation.groupDescription ?? "",
            adminsApproveMembers: dataConversation.adminsApproveMembers ?? null,
            editPermissionsMembers:
              dataConversation.editPermissionsMembers ?? null,
            groupIcon: dataConversation.groupIcon ?? "",
            createdAt: dataConversation.createdAt,
            updatedAt: dataConversation.updatedAt ?? null, // Default field in MongoDB timestamps
            lastMessage: dataConversation.lastMessage ?? null,
            // editedMessages: dataConversation.editedMessages || null,

            unreadMessagesCount: dataConversation.unreadMessagesCount ?? 0,
          };

          upsertConversation(conversationData);

          // });
        } catch (error) {
          console.log("Save realtime message error: " + error);
          console.log(error);
        }
        // });
        //
      });
      newSocket?.on("new_group_message", async(data: any) => {
        // console.log(data.message.content);
        console.log("data.message", data.message.content);

        // console.log("Whole data", data);
        // console.log(data);
        // alert(data);

        //
        try {
        await playMessageSound()

          // Store message and conversations both because we are already fetching conversation to see if already exists, so we can send it also but only required data which can change with time - (send from server) lastMessage, participant (if group), groupName, groupIcon, conversationId and message data also

          const dataMessage = data.message;

          // Whenever some sends me message if that conversation is not currently active then update unread message count by 1 else provide a scroll to bottom button if new message and also show "new message" in that button-
          // if(currentConversationId !== dataMessage.conversationId){

          // }

          // Upsert message-

          const messageData = {
            conversationId: dataMessage.conversationId,
            messageId: dataMessage._id ?? "",
            sender: dataMessage.sender ?? "",
            // recipients: dataMessage.recipients || [],
            content: dataMessage.content ?? "",
            createdAt: dataMessage.createdAt ?? "",
            isSender: false,
            isEdited: dataMessage.isEdited ?? false,
          };

          // console.log("messageDataSocket", messageData.messageId);
          upsertMessage(messageData);

          // Upsert conversation-
          const dataConversation = data.conversation;

          const conversationData = {
            conversationId: dataConversation._id,
            // otherParticipants: dataConversation.otherParticipants ?? [],

            // Because we are sending participants from server , otherParticipants is processed only for bulk conversations
            participants: dataConversation.participants ?? [],
            isGroup: dataConversation.isGroup,
            groupName: dataConversation.groupName ?? "",
            groupDescription: dataConversation.groupDescription ?? "",
            adminsApproveMembers: dataConversation.adminsApproveMembers ?? null,
            editPermissionsMembers:
              dataConversation.editPermissionsMembers ?? null,
            groupIcon: dataConversation.groupIcon ?? "",
            createdAt: dataConversation.createdAt,
            updatedAt: dataConversation.updatedAt ?? null, // Default field in MongoDB timestamps
            lastMessage: dataConversation.lastMessage ?? null,
            // editedMessages: dataConversation.editedMessages || null,

            unreadMessagesCount: dataConversation.unreadMessagesCount ?? 0,
          };

          upsertConversation(conversationData);

          // });
        } catch (error) {
          console.log("Save realtime message error: " + error);
          console.log(error);
        }
        // });
        //
      });
      newSocket?.on("my_new_message",async(data: any) => {
        // console.log(data.message.content);
        console.log("data.messagesss", data.message.content);

        // await playMessageSound()
        // alert(data.message.content);
        // Toast.show({
        //   type: "success",  // or "error" for error messages
        //   text1: "New Message",
        //   text2: data.message.content,
        //   position: "bottom", // or "top" for top position    
        //   visibilityTime: 3000, // Duration in milliseconds
        //   autoHide: true, // Automatically hide after visibilityTime  
        // });
        //
        try {
          // Store message and conversations both because we are already fetching conversation to see if already exists, so we can send it also but only required data which can change with time - (send from server) lastMessage, participant (if group), groupName, groupIcon, conversationId and message data also

          // Upsert message-
          const dataMessage = data.message;

          const messageData = {
            conversationId: dataMessage.conversationId,
            messageId: dataMessage._id ?? "",
            sender: dataMessage.sender ?? "",
            // recipients: dataMessage.recipients || [],
            content: dataMessage.content ?? "",
            createdAt: dataMessage.createdAt ?? "",
            isSender: true,
            isEdited: dataMessage.isEdited ?? false,
          };

          // console.log("messageDataSocket", messageData.messageId);

          upsertMessage(messageData);

          // Upsert conversation-
          const dataConversation = data.conversation;

          const conversationData = {
            conversationId: dataConversation._id,
            // otherParticipants: dataConversation.otherParticipants ?? [],
            // Because we are sending participants from server , otherParticipants is processed only for bulk conversations
            participants: dataConversation.participants ?? [],

            adminsApproveMembers: dataConversation.adminsApproveMembers ?? null,
            editPermissionsMembers:
              dataConversation.editPermissionsMembers ?? null,
            isGroup: dataConversation.isGroup,
            groupName: dataConversation.groupName ?? "",
            groupDescription: dataConversation.groupDescription ?? "",
            groupIcon: dataConversation.groupIcon ?? "",
            createdAt: dataConversation.createdAt,
            updatedAt: dataConversation.updatedAt ?? null, // Default field in MongoDB timestamps
            lastMessage: dataConversation.lastMessage ?? null,
            // editedMessages: dataConversation.editedMessages || null,
            unreadMessagesCount: dataConversation.unreadMessagesCount ?? 0,
          };

          upsertConversation(conversationData);

          // });
        } catch (error) {
          console.log("Save realtime message error: " + error);
          console.log(error);
        }
        // });
        //
      });
      newSocket?.on("my_new_group_message",async(data: any) => {
        // console.log(data.message.content);
        console.log("data.messagesss", data.message.content);

        // await playMessageSound()
        // alert(data.message.content);
        // Toast.show({
        //   type: "success",  // or "error" for error messages
        //   text1: "New Message",
        //   text2: data.message.content,
        //   position: "bottom", // or "top" for top position    
        //   visibilityTime: 3000, // Duration in milliseconds
        //   autoHide: true, // Automatically hide after visibilityTime  
        // });
        //
        try {
          // Store message and conversations both because we are already fetching conversation to see if already exists, so we can send it also but only required data which can change with time - (send from server) lastMessage, participant (if group), groupName, groupIcon, conversationId and message data also

          // Upsert message-
          const dataMessage = data.message;

          const messageData = {
            conversationId: dataMessage.conversationId,
            messageId: dataMessage._id ?? "",
            sender: dataMessage.sender ?? "",
            // recipients: dataMessage.recipients || [],
            content: dataMessage.content ?? "",
            createdAt: dataMessage.createdAt ?? "",
            isSender: true,
            isEdited: dataMessage.isEdited ?? false,
          };

          // console.log("messageDataSocket", messageData.messageId);

          upsertMessage(messageData);

          // Upsert conversation-
          const dataConversation = data.conversation;

          const conversationData = {
            conversationId: dataConversation._id,
            // otherParticipants: dataConversation.otherParticipants ?? [],
            // Because we are sending participants from server , otherParticipants is processed only for bulk conversations
            participants: dataConversation.participants ?? [],

            adminsApproveMembers: dataConversation.adminsApproveMembers ?? null,
            editPermissionsMembers:
              dataConversation.editPermissionsMembers ?? null,
            isGroup: dataConversation.isGroup,
            groupName: dataConversation.groupName ?? "",
            groupDescription: dataConversation.groupDescription ?? "",
            groupIcon: dataConversation.groupIcon ?? "",
            createdAt: dataConversation.createdAt,
            updatedAt: dataConversation.updatedAt ?? null, // Default field in MongoDB timestamps
            lastMessage: dataConversation.lastMessage ?? null,
            // editedMessages: dataConversation.editedMessages || null,
            unreadMessagesCount: dataConversation.unreadMessagesCount ?? 0,
          };

          upsertConversation(conversationData);

          // });
        } catch (error) {
          console.log("Save realtime message error: " + error);
          console.log(error);
        }
        // });
        //
      });

      
      // newSocket?.on("welcome", (data: any) => {
      //   // console.log(data);
      //   alert(data.data);
      // });
      newSocket?.on("user_online", (data: any) => {
        // console.log('User is online: ', data);
        // alert(data);
        dispatch(pushOnlineUser(data))
      });
      newSocket?.on("user_offline", (data: any) => {
        // console.log(data);
        // console.log('User is offline: ', data);
        // alert(data);
        dispatch(removeOnlineUser(data._id))

      });
      //
      //

      return () => {
        console.log("🔹 Cleaning up socket connection...");
        newSocket.disconnect();
      };
    };

    initializeSocket();
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): ReturnType<typeof io> | null => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context.socket;
};
