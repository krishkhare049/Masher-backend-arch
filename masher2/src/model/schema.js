// model/schema.js
import { appSchema, tableSchema } from "@nozbe/watermelondb";

// conversationId: string;
// otherParticipants: string[];
// isGroup: boolean;
// groupName: string;
// groupIcon: string;
// createdAt: string;
// lastMessage?: string | null;
// updatedAt?: string | null;
// editedMessages?: string[];

// conversationId: "string",
// messageId: {type: "string", indexed: true},
// sender: "string",
// // recipients: "string[]",
// content: "string",
// isSender: "bool",
// createdAt: "string",

// userId: string,
// full_name: string,
// joined: string,
// user_email: string,
// username: string,
// profileImgFilename: string

// searchQueryId: { type: "string", indexed: true },
//       searched_user: "string",
//       searched_at: { type: "string", indexed: true },

// _id: "objectId",
// notificationId: { type: "string", indexed: true },
// text: "string",
// type: "string",
// icon: "string",
// createdAt: { type: "string", indexed: true },

// export const mySchema = appSchema({
const mySchema = appSchema({
  version: 2,
  tables: [
    tableSchema({
      name: "conversations",
      columns: [
        { name: "conversation_id", type: "string", isIndexed: true },
        // { name: 'otherParticipants', type: 'string' }, // Make it array
        { name: "is_group", type: "boolean", isIndexed: true },
        {
          name: "is_admins_approve_members",
          type: "boolean",
          isIndexed: true,
          isOptional: true,
        },
        {
          name: "is_edit_permissions_members",
          type: "boolean",
          isIndexed: true,
          isOptional: true,
        },
        { name: "group_name", type: "string" },
        { name: "group_description", type: "string", isOptional: true },
        { name: "group_icon", type: "string" },
        { name: "created_at", type: "number", isIndexed: true },
        { name: "last_message", type: "string", isOptional: true },
        { name: "updated_at", type: "number" },
        { name: "formatted_updated_date", type: "string" },
        {
          name: "unread_messages_count",
          type: "number",
          isOptional: true,
          isIndexed: true,
        },
        // { name: 'editedMessages', type: 'string' }, // Make it array
      ],
    }),
    tableSchema({
      // name: 'conversationOtherParticipants',
      name: "conversation_other_participants",
      columns: [
        { name: "user_id", type: "string" },
        { name: "conversation_id", type: "string", isIndexed: true },
        { name: "is_admin", type: "boolean", isOptional: true },
        // { name: "created_at", type: "number", isOptional: true, isIndexed: true },
        { name: "added_at", type: "number", isIndexed: true },
      ],
    }),
    tableSchema({
      name: "messages",
      columns: [
        { name: "conversation_id", type: "string" },
        { name: "message_id", type: "string", isIndexed: true },
        { name: "sender_id", type: "string", isIndexed: true },
        { name: "content", type: "string" },
        { name: "created_at", type: "number", isIndexed: true },
        { name: "formatted_date", type: "string" },
        { name: "is_sender", type: "boolean" },
        { name: "is_edited", type: "boolean", isOptional: true },
      ],
    }),
    tableSchema({
      name: "myuserdata",
      columns: [
        { name: "user_id", type: "string" }, //  WatermelonDB uses snake_case in the schema but camelCase in the model class.
        { name: "full_name", type: "string" },
        { name: "joined", type: "string" },
        { name: "user_email", type: "string" },
        { name: "username", type: "string" },
        { name: "user_description", type: "string" },
        { name: "profile_img_filename", type: "string" },
      ],
    }),
    tableSchema({
      name: "otherusers",
      columns: [
        { name: "user_id", type: "string", isIndexed: true },
        { name: "full_name", type: "string" },
        { name: "joined", type: "string" },
        // { name: 'user_email', type: 'string'},
        { name: "username", type: "string" },
        { name: "user_description", type: "string" },
        { name: "profile_img_filename", type: "string" },
      ],
    }),
    tableSchema({
      name: "searchqueries",
      columns: [
        { name: "search_query_id", type: "string", isIndexed: true },
        { name: "searched_user", type: "string" },
        { name: "searched_at", type: "number", isIndexed: true },
      ],
    }),
    tableSchema({
      name: "notifications",
      columns: [
        { name: "notification_id", type: "string", isIndexed: true },
        { name: "text", type: "string" },
        { name: "type", type: "string" },
        { name: "icon", type: "string" },
        { name: "person", type: "string" },
        { name: "created_at", type: "number", isIndexed: true },
        { name: "data", type: "string" },
      ],
    }),
  ],
});

export default mySchema;
