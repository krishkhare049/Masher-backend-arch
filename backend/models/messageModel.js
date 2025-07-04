// const Conversation = require("./conversationModel");
const mongoose = require("mongoose"); // Importing Schema and model from mongoose

const messageSchema = new mongoose.Schema(
  {
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
    parentMessage: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    content: { type: String, required: true },
    isEdited: { type: Boolean, default: false },
    deliveredTo: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        deliveredAt: { type: Date },
      },
    ],
    // timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Middleware to auto-delete messages for a user after they are delivered to all-

// I have to use findOneandUpdate method to use this-

messageSchema.post("bulkWrite", async function (res) {
  if (res.deletedCount > 0) return; // If any message was deleted, no need to process further

  const messages = await mongoose.model("Message").find({
    _id: { $in: res.upsertedIds ? Object.values(res.upsertedIds) : [] }
  });

  if (messages.length > 0) {
    const messagesToDelete = messages.filter((doc) => {
      const unDeliveredRecipients = doc.recipients.filter(
        (recipient) => !doc.deliveredTo.some((delivered) => delivered.user.equals(recipient))
      );
      return unDeliveredRecipients.length === 0;
    });

    if (messagesToDelete.length > 0) {
      await mongoose.model("Message").deleteMany({
        _id: { $in: messagesToDelete.map((msg) => msg._id) }
      });
    }
  }
});

// Auto-delete messages after 1 month, even if undelivered
messageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days

// 🔥 Create an index for faster searches on conversation messages & deliveredTo.user
messageSchema.index({ conversationId: 1, "deliveredTo.user": 1 });
messageSchema.index({ conversationId: 1, createdAt: -1, _id: -1 });


const Message = mongoose.model("Message", messageSchema); // Creating the Message model

module.exports = Message; // Exporting the Message model
