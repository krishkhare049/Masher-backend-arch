const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/userModel");
const moment = require("moment");
const Conversation = require("../models/conversationModel");
const mongoose = require("mongoose");

// import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import { v4 as uuidv4 } from 'uuid';

const s3 = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// console.log(process.env.AWS_ACCESS_KEY_ID);
// console.log(process.env.S3_BUCKET);
// console.log(process.env.AWS_SECRET_ACCESS_KEY);

// export async function getPresignedUploadUrl(req, res) {
async function getProfileImagePresignedUploadUrl(req, res) {
  const { fileType } = req.body;

  console.log(req.body);

  console.log(process.env.AWS_ACCESS_KEY_ID);
  console.log(process.env.S3_BUCKET);
  console.log(process.env.AWS_SECRET_ACCESS_KEY);

  if (!fileType) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(fileType)) {
    return res.status(400).json({ error: "Invalid file type" });
  }

  const user_id = req.user_id;

  const fileExt = fileType.split("/")[1];
  const key = `uploads/profile-images/${user_id}-${uuidv4()}.${fileExt}`;

  const command = new PutObjectCommand({
    // Bucket: 'masher-static-bucket',
    Bucket: process.env.S3_BUCKET,
    Key: key,
    ContentType: fileType,
  });

  // const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

  // console.log(signedUrl)
  // console.log(key)

  res.json({
    signedUrl: signedUrl,
    key, // Store this in your DB for later retrieval
  });
}

async function getGroupIconPresignedUploadUrl(req, res) {
  try {
    const { fileType, conversationId } = req.body;
    const user_id = req.user_id;

    // if (!conversationId || !fileType) {

    // When creating a new group, user won't have a conversationId so if conversation id is not avaiiable then use userId for randomness and dont check for permission as it is new creating group
    // if (!conversationId || !fileType) {

    // will always reject requests with conversationId: 'new_group', because 'new_group' is a string (which is truthy), but if condition is still rejecting any missing conversationId — even when the rest of the code handles it fine.

    if (!fileType) {
      return res
        .status(400)
        .json({ message: "conversationId and fileType are required." });
    }

    const userObjectId = new mongoose.Types.ObjectId(user_id);
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(fileType)) {
      return res.status(400).json({ error: "Invalid file type" });
    }

    if (conversationId !== "new_group") {
      const conversation = await Conversation.findById(conversationId).select(
        "editPermissionsMembers admins participants"
      );

      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found." });
      }

      const isAllowed =
        conversation.editPermissionsMembers &&
        conversation.participants.some(
          (p) => p.user?.toString() === userObjectId.toString()
        );

      const isAdmin = conversation.admins.some(
        (a) => a.toString() === userObjectId.toString()
      );

      if (!isAllowed && !isAdmin) {
        return res
          .status(403)
          .json({ message: "You are not authorized to add group icon." });
      }
    }

    // When creating a new group, user won't have a conversationId so if conversation id is not avaiiable then use userId for randomness and dont check for permission as it is new creating group

    const fileExt = fileType.split("/")[1];
    const key = `uploads/group-icons/${
      conversationId !== "new_group" ? conversationId : user_id
    }-${uuidv4()}.${fileExt}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 minutes

    return res.json({ signedUrl, key });
  } catch (error) {
    console.error("getGroupIconUploadUrl error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// router.post('/delete-image', async (req, res) => {
async function deleteImageFromS3(req, res) {
  const { key } = req.body; // example: "profile-images/user123.jpg"

  const user_id = req.user_id;

  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET,
    // Bucket: 'masher-static-bucket',
    Key: key,
  });

  try {
    await s3.send(command);

    const remove_profile_img = await User.findOneAndUpdate(
      { _id: user_id },
      {
        $set: {
          profile_image_filename: {
            filename: "default_profile_image",
            updated_at: moment().toDate().toISOString(),
          },
        },
      },
      { new: true } // ✅ this ensures the updated document is returned
    );

    if (remove_profile_img) {
      res.json({
        success: true,
        message: "deleted_profile_image_successfully",
      });
    }
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ success: false, error: "Failed to delete image" });
  }
}

async function deleteProfileImageFromS3(req, res) {
  const user_id = req.user_id;

  try {
    const user = await User.findOne(
      { _id: user_id },
      { profile_image_filename: 1 }
    );

    if (
      user?.profile_image_filename?.filename &&
      user.profile_image_filename.filename !== "default_profile_image"
    ) {
      // Delete the previous profile image from S3

      const command = new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET,
        // Bucket: 'masher-static-bucket',
        Key: user.profile_image_filename.filename,
      });
      await s3.send(command);
    }

    const remove_profile_img = await User.findOneAndUpdate(
      { _id: user_id },
      {
        $set: {
          profile_image_filename: {
            filename: "default_profile_image",
            updated_at: moment().toDate().toISOString(),
          },
        },
      },
      { new: true } // ✅ this ensures the updated document is returned
    );

    if (remove_profile_img) {
      res.json({
        success: true,
        message: "deleted_profile_image_successfully",
      });
    }
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ success: false, error: "Failed to delete image" });
  }
}
async function deleteGroupIconFromS3(req, res) {
  try {
    const user_id = req.user_id;
    const conversationId = req.body.conversationId;

    if (!conversationId) {
      return res.status(400).json({ message: "conversationId is required." });
    }

    const userObjectId = new mongoose.Types.ObjectId(user_id);

    const conversation = await Conversation.findById(conversationId).select(
      "editPermissionsMembers admins participants groupIcon"
    );

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found." });
    }

    const isParticipant = conversation.participants.some(
      (p) => p.user.toString() === userObjectId.toString()
    );
    const isAdmin = conversation.admins.some(
      (a) => a.toString() === userObjectId.toString()
    );

    if (conversation.editPermissionsMembers && !isParticipant) {
      return res.status(403).json({
        message: "Must be a participant to remove group icon.",
      });
    }

    if (!conversation.editPermissionsMembers && !isAdmin) {
      return res.status(403).json({
        message: "Admin rights required to remove group icon.",
      });
    }

    const oldGroupIcon = conversation.groupIcon;

    // Delete the group icon from S3 if it exists and is not default
    if (
      oldGroupIcon?.filename &&
      oldGroupIcon.filename !== "default_group_icon"
    ) {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: oldGroupIcon.filename,
      });

      try {
        await s3.send(deleteCommand);
        console.log("Deleted group icon from S3:", oldGroupIcon.filename);
      } catch (err) {
        console.error("S3 delete error (ignored):", err);
      }
    }

    // Update DB to use default icon
    conversation.groupIcon = {
      filename: "default_group_icon",
      updated_at: moment().toISOString(),
    };

    await conversation.save();

    res.status(200).json({ message: "deleted_group_icon_successfully" });
  } catch (error) {
    console.error("removeGroupIcon error:", error);
    res.status(500).json({ message: "error_occurred" });
  }
}

// export async function saveProfileImageKey(req, res) {
async function saveProfileImageKey(req, res) {
  const { imageKey } = req.body;

  if (!imageKey) {
    return res.status(400).json({ error: "Image key is required" });
  }

  try {
    const user_id = req.user_id;

    const user = await User.findOne(
      { _id: user_id },
      { profile_image_filename: 1 }
    );

    if (
      user?.profile_image_filename?.filename &&
      user.profile_image_filename.filename !== "default_profile_image"
    ) {
      // Delete the previous profile image from S3
      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: user.profile_image_filename.filename,
      });

      await s3.send(deleteCommand);
    }

    // Update user with new profile image key
    const updatedUser = await User.findOneAndUpdate(
      { _id: user_id },
      {
        $set: {
          profile_image_filename: {
            filename: imageKey,
            updated_at: moment().toISOString(),
          },
        },
      },
      { new: true }
    );

    if (updatedUser) {
      return res.json({ message: "uploaded" });
    } else {
      return res
        .status(500)
        .json({ error: "Failed to update user profile image" });
    }
  } catch (error) {
    console.error("Error in saveProfileImageKey:", error);
    return res.status(500).json({ error: "error_occurred" });
  }
}

async function saveGroupIconKey(req, res) {
  const { imageKey, conversationId } = req.body;

  if (!imageKey) {
    return res.status(400).json({ error: "Image key is required" });
  }

  try {
    const conv = await Conversation.findOne(
      { _id: conversationId },
      { groupIcon: 1 }
    );

    if (
      conv?.groupIcon?.filename &&
      conv.groupIcon.filename !== "default_group_icon"
    ) {
      // Delete the previous profile image from S3
      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: conv.groupIcon.filename,
      });

      await s3.send(deleteCommand);
    }

    // Update user with new profile image key
    const updatedConv = await Conversation.findOneAndUpdate(
      { _id: conversationId },
      {
        $set: {
          groupIcon: {
            filename: imageKey,
            updated_at: moment().toISOString(),
          },
        },
      },
      { new: true }
    );

    if (updatedConv) {
      return res.json({ message: "uploaded" });
    } else {
      return res.status(500).json({ error: "Failed to update group icon" });
    }
  } catch (error) {
    console.error("Error in saveGroupIconeKey:", error);
    return res.status(500).json({ error: "error_occurred" });
  }
}

// async function getObjectURL(key) {
//   const command = new GetObjectCommand({
//     Bucket: 'masher-static-bucket',
//     Key: key,
//     // ContentType: fileType,
//   });

//   const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
//   return signedUrl;

// }

// async function init() {

//   console.log('GET URL: ' + await getObjectURL('krishkhare.jpg'))
// }

// init()

module.exports = {
  getProfileImagePresignedUploadUrl,
  getGroupIconPresignedUploadUrl,
  deleteImageFromS3,
  deleteProfileImageFromS3,
  deleteGroupIconFromS3,
  saveProfileImageKey,
  saveGroupIconKey,
}; // Exporting the functions
