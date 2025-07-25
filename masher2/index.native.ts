import { Platform } from "react-native";
import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import schema from "./src/model/schema";
import migrations from "./src/model/migrations";
import Conversation from "./src/model/Conversation";
import ConversationOtherParticipant from "./src/model/ConversationOtherParticipant";
import MyUserData from "./src/model/MyUserData";
import Message from "./src/model/Message";
import OtherUser from "./src/model/OtherUser";
import SearchQuery from "./src/model/SearchQuery";
import Notification from "./src/model/Notification";
// ⬅️ You'll import your Models here

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
  schema,
  // (You might want to comment it out for development purposes -- see Migrations documentation)
  migrations,
  // (optional database name or file system path)
  // dbName: 'myapp',
  // (recommended option, should work flawlessly out of the box on iOS. On Android,
  // additional installation steps have to be taken - disable if you run into issues...)
  jsi: true /* Platform.OS === 'ios' */,
  // (optional, but you should implement this method)
  onSetUpError: (error) => {
    // Database failed to load -- offer the user to reload the app or log out
    console.log('Watermelon db error occured: ' + error);
  },
});

// Then, make a Watermelon database from it!
const database = new Database({
  adapter,
  modelClasses: [
    Conversation,
    ConversationOtherParticipant,
    Message,
    MyUserData,
    OtherUser,
    SearchQuery,
    Notification, // ⬅️ You'll add Models to Watermelon here
  ],
});

export default database;

export const conversationsCollection = database.get<Conversation>('conversations');
export const userDataCollection = database.get<MyUserData>('myuserdata');
export const otherusersCollection = database.get<OtherUser>('otherusers');
export const messagesCollection = database.get<Message>('messages');
export const notificationsCollection = database.get<Notification>('notifications');
export const conversationOtherParticipantsCollection = database.get<ConversationOtherParticipant>('conversation_other_participants');
export const searchQueryCollection = database.get<SearchQuery>('search_queries');