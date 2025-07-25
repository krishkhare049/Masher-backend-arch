import User from "../models/userModel.js";
import mongoose from "mongoose"; // ensure mongoose is imported if _id needs casting

async function getMessageSenderData(user_id) {
  try {
    console.log(user_id)
    // Ensure valid ObjectId (optional but good practice)
    const objectId = mongoose.Types.ObjectId.isValid(user_id)
      ? new mongoose.Types.ObjectId(user_id)
      : null;

    if (!objectId) {
      console.error("Invalid user_id:", user_id);
      return null;
    }

    const senderData = await User.findOne(
      { _id: objectId },
      { full_name: 1, profile_image_filename: 1, username: 1 }
    );

    if (!senderData) {
      console.warn("No user found with ID:", user_id);
      return null;
    }

    console.log("✅ Sender data:", senderData);
    return senderData;
  } catch (error) {
    console.error("❌ Error fetching sender data:", error);
    return null;
  }
}

export { getMessageSenderData };