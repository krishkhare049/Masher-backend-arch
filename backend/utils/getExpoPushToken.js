import mongoose from "mongoose";
import User from "../models/userModel.js";

async function getExpoPushToken(user_id) {
  try {
    const userObjectId = new mongoose.Types.ObjectId(user_id);

     const recipient = await User.findById(userObjectId);
     
  const pushToken = recipient?.expoPushToken;
    return pushToken;
  } catch (error) {
    console.error(error);
    return;
  }
}

export { getExpoPushToken };
