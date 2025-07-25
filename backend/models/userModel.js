// const { Schema, model } = require("mongoose"); // Importing Schema and model from mongoose
const mongoose = require("mongoose"); // Importing Schema and model from mongoose
const { hash } = require("bcrypt"); // Importing hash from bcrypt
const { sign } = require("jsonwebtoken"); // Importing sign from jsonwebtoken

const { JWT_secret_key } = process.env; // Destructuring JWT secret key from environment variables
const { remove_whitespaces, random_five_digit } = require("../utils/utils"); // Importing utility functions

const saltRounds = 10;

const userSchema = new mongoose.Schema(
  {
    // User basic data
    joined: { type: Date, default: Date.now },
    full_name: { type: String, required: true },
    // first_name: String,
    // last_name: String,
    username: { type: String, required: true, unique: true },
    user_email: { type: String, required: true, unique: true },
    user_password: { type: String, required: true },

    // New-
    user_description: { type: String }, // status
    lastSeen: { type: String }, // when the socket connection breaks update this field and send realtime to other users - decision - don't do it (try, not required really because user may be online while messaging and then goes offline, only required if user does not know if user was online or not recently)
    blocked: {type: Array, default: []}, // whenever a user searches the user, don't show if the searching user is not blocked by that user and also if later create a functionality to share user profile in a conversation, make sure whenever fetching profile share msg check if blocked or not (do it everytime because what if user blocks user2 after someone sended his/her profile to user2)
    // 

    // User profile and cover images

    profile_image_filename: {
      type: Object,
      default: { filename: "default_profile_image" },
    },

    cover_image_filename: {
      type: Object,
      default: { filename: "default_cover_image" },
    },
    // msgs: Array,
    conversations: [
      {
        conversationId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Conversation",
        },
        updatedAt: {
          type: Date
        }
        // otherParticipants: [
        //   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        // ],
        // isGroup: { type: Boolean, default: false },
        // groupIcon: { type: String },
        // createdAt: { type: Date, default: Date.now },
        // lastUpdated: { type: Date },
        // lastMessage: { type: String, ref: "Message" },
        // deletedAtMessageId: {
        //   type: mongoose.Schema.Types.ObjectId,
        //   ref: "Message",
        //   default: null,
        // }, // use this to fetch data whenever restoring conversations
        // editedMessages: { type: Array, default: [] },
      },
    ],
    search_history: [
      {
        searchQueryId: {
          type: mongoose.Schema.Types.ObjectId,
          default: () => new mongoose.Types.ObjectId(),
        },
        searched_user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        searched_at: { type: Date },
      },
    ],
notifications: [
  {
    notificationId: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    }, // Unique ID for reference or deletion

    text: { type: String, required: true }, // Notification message

    type: {
      type: String,
      enum: ["user", "message", "system", "official"],
      default: "user",
    }, // Notification category

    data: { type: String }, // Extra data (e.g., postId, userId, etc.)

    person: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    // Sender ID – can also be 'khareindustries' as string if needed

    icon: { type: String }, // Icon or avatar (URL or filename)

    createdAt: {
      type: Date,
      default: Date.now,
      index: true, // Enables cursor-based pagination by createdAt
    },
  }
],
    // Tokens
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    expoPushToken: {
      type: String,
      default: null, // Default value is null if no token is set
      unique: true // Ensure each user has a unique token
    }
  },
  { timestamps: true }
);

// Generating tokens
userSchema.methods.generateAuthToken = async function () {
  try {
    const token = sign(
      {
        _id: this._id.toString(),
        random_id: random_five_digit(), // Just to ensure more uniqueness of token
      },
      JWT_secret_key
    );

    // Adding token in token of tokens field
    this.tokens = this.tokens.concat({ token: token });

    await this.save();

    return token;
  } catch (error) {
    console.log(error);
  }
};

userSchema.pre("save", async function (next) {
  // If user_password is modified during creation or updating
  if (this.isModified("user_password")) {
    let user_password = remove_whitespaces(this.user_password);
    this.user_password = await hash(user_password, saltRounds);
  }
  next();
});

// 🔥 Create an index for faster queries
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ full_name: 1 });

const User = mongoose.model("User", userSchema);

module.exports = User; // Exporting the User model
