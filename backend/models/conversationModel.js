const { Schema, model } = require("mongoose"); // Importing Schema and model from mongoose

const conversationSchema = new Schema(
  {
    // participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
     participants: [
    {
      user: { type: Schema.Types.ObjectId, ref: "User", required: true },
      addedAt: { type: Date, default: Date.now },
    },
  ],
  participantIds: [{
    type: Schema.Types.ObjectId, ref: 'User'
  }],
    lastMessage: { type: String },
    isGroup: { type: Boolean, default: false },
    adminsApproveMembers: { type: Boolean, default: true },
    editPermissionsMembers: { type: Boolean, default: false },
    groupName: {
      type: String,
      default: "default",
    },
    // groupIcon: { type: String, default: 'default' },
    groupIcon: {
      type: Object,
      default: { filename: "default_group_icon" },
    },
    groupGuidelines: { type: String, default: "Group guidelines state rules to be followed by group members!" },
    groupDescription: { type: String, default: "" },
    editedMessages: { type: Array, default: [] },
    admins: { type: Array, default: [] },

    // New-
    unreadMessagesCount: { type: Number }, // fetch from database and update in realtime

    // messageIds: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
    // createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Create an index. currently its not working
// conversationSchema.createIndex({ participants: 1 });
conversationSchema.index({ participants: 1 });
conversationSchema.index({ participantIds: 1, isGroup: 1 });
// conversationSchema.index({ isGroup: 1 });
conversationSchema.index({ updatedAt: -1 });

const Conversation = model("Conversation", conversationSchema); // Creating the Conversation model

module.exports = Conversation; // Exporting the Conversation model
