import mongoose from "mongoose";
import Conversation from "../models/conversationModel.js";

async function getConversationFriends(user_id) {
  try {
    const userObjectId = new mongoose.Types.ObjectId(user_id);

    const conversations = await Conversation.aggregate([
      {
        $match: {
          isGroup: false,
          "participants.user": userObjectId,
        },
      },
      {
        $sort: { updatedAt: -1 },
      },
      {
        $limit: 100,
      },
      {
        $unwind: "$participants",
      },
      {
        $match: {
          "participants.user": { $ne: userObjectId },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "participants.user",
          foreignField: "_id",
          as: "otherParticipant",
        },
      },
      {
        $unwind: "$otherParticipant",
      },
      {
        $project: {
          _id: 1,
          otherParticipantId: "$otherParticipant._id",
          otherParticipantName: "$otherParticipant.full_name",
          otherParticipantProfileImage: "$otherParticipant.profile_image_filename",
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    console.log("Latest conversations:");
    return conversations;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export { getConversationFriends };
