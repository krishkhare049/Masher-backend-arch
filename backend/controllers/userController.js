const mongoose = require("mongoose");
const moment = require("moment");

const User = require("../models/userModel"); // Importing the User model

const fs = require("fs");
const access = require("fs").access;
const constants = require("fs").constants;

const {
  push_elements_of_arr_of_obj_in_another_arr_of_obj_in_respective_order,
} = require("../utils/utils");
const generateUniqueUsername = require("../utils/generateUniqueUsername");
const { getConversationFriends } = require("../utils/getConversationFriends");
const { pubClient } = require("../../chat/config/redisClient");
const Conversation = require("../models/conversationModel");

const { hash, compare } = require("bcrypt");

const saltRounds = 10;

// const { filterOnlineParticipants } = require("../utils/filterOnlineParticipants");

// Get user conversations
// async function getUserConversations(req, res) {
//   try {
//     const limit = 15;
//     const userId = new mongoose.Types.ObjectId(req.user_id);
//     const cursorTimestamp = req.query.cursor
//       ? new Date(req.query.cursor)
//       : new Date();

//     const userConversations = await User.aggregate([
//       { $match: { _id: userId } },
//       { $project: { conversations: 1, _id: 0 } },
//       { $unwind: "$conversations" },
//       {
//         $lookup: {
//           from: "conversations",
//           localField: "conversations.conversationId",
//           foreignField: "_id",
//           pipeline: [
//             {
//               $match: {
//                 updatedAt: { $lt: cursorTimestamp },
//               },
//             },
//             {
//               $project: {
//                 _id: 1,
//                 isGroup: 1,
//                 groupIcon: 1,
//                 groupName: 1,
//                 lastMessage: 1,
//                 updatedAt: 1,
//                 createdAt: 1,
//                 editedMessages: 1,
//                 unreadMessagesCount: 1,
//                 participants: 1,
//               },
//             },
//           ],
//           as: "userConversations",
//         },
//       },
//       {
//         $set: {
//           userConversations: { $arrayElemAt: ["$userConversations", 0] },
//         },
//       },
//       {
//         $match: { "userConversations.isGroup": { $exists: true } },
//       },
//       {
//         $set: {
//           otherParticipantId: {
//             $cond: {
//               if: { $eq: ["$userConversations.isGroup", false] },
//               then: {
//                 $arrayElemAt: [
//                   {
//                     $map: {
//                       input: {
//                         $filter: {
//                           input: "$userConversations.participants",
//                           as: "p",
//                           cond: { $ne: ["$$p.user", userId] },
//                         },
//                       },
//                       as: "userObj",
//                       in: "$$userObj.user",
//                     },
//                   },
//                   0,
//                 ],
//               },
//               else: null,
//             },
//           },
//         },
//       },
//       {
//         $lookup: {
//           from: "users",
//           let: { participantId: "$otherParticipantId" },
//           pipeline: [
//             { $match: { $expr: { $eq: ["$_id", "$$participantId"] } } },
//             {
//               $project: {
//                 _id: 1,
//                 full_name: 1,
//                 username: 1,
//                 profile_image_filename: 1,
//                 joined: 1,
//               },
//             },
//           ],
//           as: "participantData",
//         },
//       },
//       {
//         $set: {
//           participant: { $arrayElemAt: ["$participantData", 0] },
//         },
//       },
//       {
//         $project: {
//           conversationId: "$conversations.conversationId",
//           userConversations: {
//             _id: 1,
//             isGroup: 1,
//             groupName: 1,
//             groupIcon: 1,
//             updatedAt: 1,
//             createdAt: 1,
//             editedMessages: 1,
//             unreadMessagesCount: 1,
//             lastMessage: 1,
//             participants: "$userConversations.participants",
//           },
//           participant: {
//             $cond: {
//               if: { $eq: ["$userConversations.isGroup", false] },
//               then: "$participant",
//               else: "$$REMOVE",
//             },
//           },
//         },
//       },
//       { $sort: { "userConversations.updatedAt": -1 } },
//       { $limit: limit },
//     ]);

//     res.send(userConversations);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("error_occurred");
//   }
// }

async function getUserConversations(req, res) {
  console.log("Getting user conversations");
  try {
    const limit = 15;
    const userId = new mongoose.Types.ObjectId(req.user_id);

    const cursorTimestamp = req.query.cursor
      ? new Date(req.query.cursor)
      : new Date();

    const cursorId = req.query.lastId
      ? new mongoose.Types.ObjectId(req.query.lastId)
      : null;

    const userConversations = await User.aggregate([
      { $match: { _id: userId } },
      { $project: { conversations: 1, _id: 0 } },
      { $unwind: "$conversations" },
      {
        $lookup: {
          from: "conversations",
          let: { convId: "$conversations.conversationId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$convId"] },
                    {
                      $or: [
                        { $lt: ["$updatedAt", cursorTimestamp] },
                        {
                          $and: [
                            { $eq: ["$updatedAt", cursorTimestamp] },
                            ...(cursorId ? [{ $lt: ["$_id", cursorId] }] : []),
                          ],
                        },
                      ],
                    },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 1,
                isGroup: 1,
                groupIcon: 1,
                groupName: 1,
                groupDescription: 1,
                lastMessage: 1,
                updatedAt: 1,
                editPermissionsMembers: 1,
                adminsApproveMembers: 1,
                createdAt: 1,
                editedMessages: 1,
                unreadMessagesCount: 1,
                participants: 1,
              },
            },
          ],
          as: "userConversations",
        },
      },
      {
        $set: {
          userConversations: { $arrayElemAt: ["$userConversations", 0] },
        },
      },
      {
        $match: { "userConversations.isGroup": { $exists: true } },
      },
      {
        $set: {
          otherParticipantId: {
            $cond: {
              if: { $eq: ["$userConversations.isGroup", false] },
              then: {
                $arrayElemAt: [
                  {
                    $map: {
                      input: {
                        $filter: {
                          input: "$userConversations.participants",
                          as: "p",
                          cond: { $ne: ["$$p.user", userId] },
                        },
                      },
                      as: "userObj",
                      in: "$$userObj.user",
                    },
                  },
                  0,
                ],
              },
              else: null,
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          let: { participantId: "$otherParticipantId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$participantId"] } } },
            {
              $project: {
                _id: 1,
                full_name: 1,
                username: 1,
                profile_image_filename: 1,
                user_description: 1,
                joined: 1,
              },
            },
          ],
          as: "participantData",
        },
      },
      {
        $set: {
          participant: { $arrayElemAt: ["$participantData", 0] },
        },
      },
      {
        $project: {
          conversationId: "$conversations.conversationId",
          userConversations: {
            _id: 1,
            isGroup: 1,
            groupName: 1,
            groupDescription: 1,
            groupIcon: 1,
            updatedAt: 1,
            createdAt: 1,
            editedMessages: 1,
            unreadMessagesCount: 1,
            lastMessage: 1,
            participants: "$userConversations.participants",
          },
          participant: {
            $cond: {
              if: { $eq: ["$userConversations.isGroup", false] },
              then: "$participant",
              else: "$$REMOVE",
            },
          },
        },
      },
      { $sort: { "userConversations.updatedAt": -1, "userConversations._id": -1 } },
      { $limit: limit },
    ]);

    // Send pagination cursor
    const last = userConversations[userConversations.length - 1];
    const nextCursor = last
      ? {
          cursor: last.userConversations.updatedAt.toISOString(),
          lastId: last.userConversations._id.toString(),
        }
      : null;

      // console.log(userConversations);
    res.json({
      conversations: userConversations,
      nextCursor,
    });
  } catch (error) {
    console.error('Error getUserConversations' + error);
    res.status(500).send("error_occurred");
  }
}


// async function getUserConversations(req, res) {
//   console.log("Getting user conversations");
//   const skip = parseInt(req.params.skip) || 0;
//   const limit = 15;
//   const userId = new mongoose.Types.ObjectId(req.user_id);

//   const userChatConversations = await User.aggregate([
//     {
//       $match: { _id: userId },
//     },
//     {
//       $project: {
//         conversations: 1, // Keep conversations field
//         _id: 0, // Exclude _id
//       },
//     },
//     {
//       $unwind: "$conversations",
//     },
//     {
//       $sort: { "conversations.updatedAt": -1 },
//     },
//     {
//       $skip: skip,
//     },
//     {
//       $limit: limit,
//     },
//     {
//       $lookup: {
//         from: "conversations",
//         localField: "conversations.conversationId",
//         foreignField: "_id",
//         pipeline: [
//           {
//             $project: {
//               _id: 1,
//               isGroup: 1,
//               groupIcon: 1,
//               groupName: 1,
//               lastMessage: 1,
//               updatedAt: 1,
//               createdAt: 1,
//               editedMessages: 1,
//               unreadMessagesCount: 1,
//               participants: {
//                 $cond: {
//                   if: { $eq: ["$isGroup", false] },
//                   then: "$participants",
//                   else: "$$REMOVE",
//                 },
//               },
//             },
//           },
//         ],
//         as: "userConversations",
//       },
//     },
//     {
//       $set: {
//         userConversations: { $arrayElemAt: ["$userConversations", 0] },
//       },
//     },
//     {
//       $match: { "userConversations.isGroup": { $exists: true } },
//     },
//     {
//       $set: {
//         otherParticipantId: {
//           $cond: {
//             if: { $eq: ["$userConversations.isGroup", false] },
//             then: {
//               $arrayElemAt: [
//                 {
//                   $filter: {
//                     input: "$userConversations.participants",
//                     as: "participant",
//                     cond: {
//                       $ne: [
//                         "$$participant",
//                         userId,
//                       ],
//                     },
//                   },
//                 },
//                 0,
//               ],
//             },
//             else: null,
//           },
//         },
//       },
//     },
//     {
//       $lookup: {
//         from: "users",
//         let: { participantId: "$otherParticipantId" },
//         pipeline: [
//           {
//             $match: { $expr: { $eq: ["$_id", "$$participantId"] } },
//           },
//           {
//             $project: {
//               _id: 1,
//               joined: 1,
//               full_name: 1,
//               // user_email: 1,
//               username: 1,
//               profile_image_filename: 1,
//             },
//           },
//         ],
//         as: "participantData",
//       },
//     },
//     {
//       $set: {
//         participant: { $arrayElemAt: ["$participantData", 0] },
//       },
//     },
//     {
//       $project: {
//         conversationId: "$conversations.conversationId",
//         userConversations: {
//           _id: 1,
//           isGroup: 1,
//           groupName: 1,
//           groupIcon: 1,
//           updatedAt: 1,
//           createdAt: 1,
//           editedMessages: 1,
//           unreadMessagesCount: 1,
//           lastMessage: 1,
//           participants: "$userConversations.participants", // No need for condition, handled in $lookup
//         },
//         participant: {
//           $cond: {
//             if: { $eq: ["$userConversations.isGroup", false] },
//             then: "$participant",
//             else: "$$REMOVE",
//           },
//         },
//       },
//     },
//   ]);

//   // console.log(userChatConversations);
//   if (userChatConversations) {
//     res.send(userChatConversations);
//   } else {
//     res.send("conversations_not_found");
//   }
// }

// Search user by name
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function searchUserByName(req, res) {
  // console.log("Searching user by name");
  try {
    const limit = 10;
    const searchQ = req.params.text.trim();
    const user_id = new mongoose.Types.ObjectId(req.user_id);

    if (!searchQ) {
      return res.status(400).json({ message: "Search query is empty." });
    }

    const safeRegex = `^${escapeRegExp(searchQ)}`;

    const matching_users = await User.aggregate([
      {
        $match: {
          full_name: { $regex: safeRegex, $options: "i" },
          _id: { $ne: user_id },
        },
      },
      {
        $project: {
          _id: 1,
          full_name: 1,
          profile_image_filename: 1,
        },
      },
      { $limit: limit },
    ]);

    res.send(matching_users);
  } catch (error) {
    console.error("Error in searchUserByName:", error);
    res.status(500).json({ message: "error_occurred" });
  }
}

// Search user by name but unique which not included in conversation for adding group participants-
async function searchUserByNameUniqueConvoId(req, res) {
  try {
    const limit = 10;
    const searchText = req.params.text.trim();
    // console.log(req.params);
    const conversationId = req.params.conversationId;
    const userId = new mongoose.Types.ObjectId(req.user_id);

    // console.log("Searching user by name in unique conversation ID:", conversationId);

    // 1. Get current participants
    const conversation = await Conversation.findById(conversationId, {
      participants: 1,
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // 2. Exclude current participants + user themselves
    // const excludedIds = conversation.participants.map(p => p.user.toString());

    const excludedIds = conversation.participants
  .map(p => p?.user?.toString())
  .filter(Boolean); // remove undefined/null

    excludedIds.push(userId.toString());

    // 3. Escape regex safely
    const safeSearchRegex = new RegExp("^" + escapeRegExp(searchText), "i");

    // 4. Query users
    const matchingUsers = await User.aggregate([
      {
        $match: {
          _id: { $nin: excludedIds.map(id => new mongoose.Types.ObjectId(id)) },
          full_name: { $regex: safeSearchRegex },
        },
      },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          full_name: 1,
          profile_image_filename: 1,
        },
      },
    ]);

    res.send(matchingUsers);
  } catch (error) {
    console.error("Error in searchUserByNameUniqueConvoId:", error);
    res.status(500).send("error_occurred");
  }
}


// GET Search history-
// Load all 15 at once, no pagination
async function getUserSearchHistory(req, res) {
  // find user's name and profileimg by using user_id

  const limit = 15; // Limit to 15 search history entries

  // console.log(req.user_id);

  const userSearchHistory = await User.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(req.user_id) }, // Match the user by userId
    },
    {
      $project: {
        _id: 0,
        reversed_search_history: { $reverseArray: "$search_history" }, // Reverse messages array
      },
    },
    {
      $unwind: "$reversed_search_history", // Unwind to apply skip and limit
    },
    // {
    //   $skip: skip, // Skip first 'n' documents
    // },
    {
      $limit: limit, // Limit number of results
    },

    //
    {
      $lookup: {
        from: "users", // The collection name for users
        localField: "reversed_search_history.searched_user", // Match by searched_user inside the search_history array
        foreignField: "_id", // Match by user ID
        as: "searched_user", // Name of the output array
      },
    },
    {
      $unwind: "$searched_user", // Unwind the searched_user array
    },
    {
      $project: {
        searched_user: {
          _id: 1,
          full_name: 1,
          profile_image_filename: 1,
        },
        searched_at: "$reversed_search_history.searched_at",
        searchQueryId: "$reversed_search_history.searchQueryId",
      },
    },
    //

    // {
    //   $group: {
    //     // _id: "$_id",
    //     search_history: { $push: "$reversed_search_history" }, // Reconstruct the array
    //   },
    // },
  ]);
  // console.log(userSearchHistory);

  if (userSearchHistory) {
    res.send(userSearchHistory);
  }
}

// Add user search history-
// async function addUserSearchHistory(req, res) {
//   try {
//     const user_id = req.user_id;
//     const searched_userId = req.body.searched_userId;

//     const userPull = await User.updateOne(
//       { _id: user_id },
//       {
//         // Pull if exist, will not give error if not exist
//         $pull: {
//           search_history: {
//             searched_user: searched_userId,
//           },
//         },
//       }
//     );

//     const userPush = await User.updateOne(
//       { _id: user_id },
//       {
//         $push: {
//           search_history: {
//             searched_user: searched_userId,
//             searched_at: moment().toDate().toISOString(),
//           },
//         },
//       }
//     );

//     if (userPull.modifiedCount > 0 && userPush.modifiedCount > 0) {
//       console.log("Search history updated successfully.");
//       res.send("search_history_updated_successfully");
//     }
//   } catch (error) {
//     console.log(error);
//     res.send("error_occurred");
//   }
// }

// Limits to 15 search history entries and adds new entry at the beginning
async function addUserSearchHistory(req, res) {
  try {
    const user_id = req.user_id;
    const searched_userId = req.body.searched_userId;

    if (!searched_userId) {
      return res.status(400).send("searched_userId is required");
    }

    const currentDate = moment().toDate();

    const result = await User.updateOne(
      { _id: new mongoose.Types.ObjectId(user_id) },
      [
        {
          $set: {
            search_history: {
              $let: {
                vars: {
                  // Filter out existing entry for the same user
                  filtered: {
                    $filter: {
                      input: "$search_history",
                      as: "item",
                      cond: {
                        $ne: ["$$item.searched_user", new mongoose.Types.ObjectId(searched_userId)],
                      },
                    },
                  },
                },
                in: {
                  // Add new search entry at the beginning and slice top 15
                  $slice: [
                    [
                      {
                        searched_user: new mongoose.Types.ObjectId(searched_userId),
                        searched_at: currentDate,
                        searchQueryId: new mongoose.Types.ObjectId(),
                      },
                      ...["$$filtered"],
                    ],
                    15,
                  ],
                },
              },
            },
          },
        },
      ]
    );

    if (result.modifiedCount > 0) {
      console.log("Search history updated successfully.");
      res.send("search_history_updated_successfully");
    } else {
      res.status(500).send("search_history_update_failed");
    }
  } catch (error) {
    console.error("Search history error:", error);
    res.status(500).send("error_occurred");
  }
}

// Delete search element-
async function deleteSearchElement(req, res) {
  // console.log("Deleting")
  try {
    const user_id = req.user_id;
    const searchQueryId = req.body.searchQueryId;

    // console.log(searchQueryId)

    const user = await User.updateOne(
      { _id: user_id },
      {
        // Pull if exist, will not give error if not exist
        $pull: {
          search_history: {
            searchQueryId: searchQueryId,
          },
        },
      }
    );

    if (user.modifiedCount > 0) {
      console.log("Search element deleted successfully.");
      res.send("search_element_updated_successfully");
    }
  } catch (error) {
    console.log(error);
    res.send("error_occurred");
  }
}

// Delete full search history-
async function deleteFullSearchHistory(req, res) {
  try {
    const user_id = req.user_id;

    const user = await User.updateOne(
      { _id: user_id },
      {
        // Pull if exist, will not give error if not exist
        $set: {
          search_history: [], // Efficient than pullAll because pullAll is not used to remove everything
        },
      }
    );

    if (user.modifiedCount > 0) {
      console.log("Search history deleted successfully.");
      res.send("search_history_deleted_successfully");
    }
  } catch (error) {
    console.log(error);
    res.send("error_occurred");
  }
}

async function getUserData(req, res) {
  const user = await User.findOne(
    { _id: req.user_id },
    {
      _id: 1,
      full_name: 1,
      joined: 1,
      user_email: 1,
      username: 1,
      user_description: 1,
      profile_image_filename: 1,
    }
  );

  if (user) {
    // console.log(user);
    res.send(user);
  }
}

async function getOtherUserData(req, res) {
  const otherUserId = req.params.otherUserId;
  const user = await User.findOne(
    { _id: otherUserId },
    {
      _id: 1,
      full_name: 1,
      joined: 1,
      user_email: 1,
      username: 1,
      user_description: 1,
      profile_image_filename: 1,
    }
  );

  if (user) {
    // console.log(user);
    res.send(user);
  }
}

// Update user details
async function updateUserDetails(req, res) {
  console.log("Details updating");
  try {
    const user_id = req.user_id;
    const { full_name, user_description } = req.body;

    // const username = await generateUniqueUsername(req.body.full_name);

    const user = await User.updateOne(
      { _id: user_id },
      {
        // Pull if exist, will not give error if not exist
        $set: {
          // username: username, // This will update username based on new full name but make another api which updates username and other option in settings page other from edit profile, this option will only change username like first check and respond
          full_name: full_name, // Efficient than pullAll because pullAll is not used to remove everything
          user_description: user_description, // Efficient than pullAll because pullAll is not used to remove everything
        },
      },
      {
        new: true,
        projection: {
          _id: 1,
          full_name: 1,
          joined: 1,
          user_email: 1,
          username: 1,
          user_description: 1,
          profile_image_filename: 1,
        },
      }
    );

    if (user) {
      console.log("Details updated successfully.");
      // console.log(user);
      res.send("details_updated_successfully");
      // res.send(user);
    }
  } catch (error) {
    console.log(error);
    res.send("error_occurred");
  }
}

// Update username
async function updateUsername(req, res) {
  try {
    const user_id = req.user_id;
    const username = req.body.username;

    // const username = await generateUniqueUsername(req.body.full_name);

    const user = await User.findOne(
      { username: username, _id: { $ne: user_id } },
      { _id: 1 }
    );

    if (user) {
      res.send("another_user_already_exist_with_username");
    } else {
      const updateUsername = await User.updateOne(
        { _id: user_id },
        {
          $set: {
            username: username,
          },
        }
      );
      if (updateUsername.modifiedCount > 0) {
        console.log("Username updated successfully.");
        res.send("username_updated_successfully");
      }
    }
  } catch (error) {
    console.log(error);
    res.send("error_occurred");
  }
}
// Update password
// This is not used in frontend, only used in settings page to change password
 const updatePassword = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).send("missing_fields");
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).send("passwords_do_not_match");
    }

    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).send("user_not_found");
    }

    const isMatch = await compare(oldPassword, user.user_password);

    if (!isMatch) {
      return res.status(401).send("incorrect_old_password");
    }

    const hashedPassword = await hash(newPassword, saltRounds);

    user.user_password = hashedPassword;
    await user.save();

    res.send("password_updated_successfully");
  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).send("server_error");
  }
};

async function uploadProfileImage(req, res) {
  try {
    let file = req.file;
    console.log(file);
    // let decrypted_id = decrypt(req.body.enc_user_Id);
    const user_id = req.user_id;

    // Check whether user has profile image or not-
    const user = await User.findOne(
      { _id: user_id },
      { profile_image_filename: 1 }
    );
    // console.log(user);

    // If already has profile image then delete previous image-
    if (user.profile_image_filename.filename !== "default_profile_image") {
      let this_profile_file_path = `/MasherStorage/profile_images/${user.profile_image_filename.filename}`;
      // Check if the file or directory exists/not in the current directory.
      access(this_profile_file_path, constants.F_OK, (err) => {
        // console.log(`${file} ${err ? "does not exist" : "exists"}`);
        if (err) {
          console.log("Profile image does not exists!");
        } else {
          // console.log("Removed!");
          fs.rmSync(this_profile_file_path);
        }
      });
    }

    // Make sure this will happen synchronously-

    // and then update-

    const add_profile_img = await User.findOneAndUpdate(
      { _id: user_id },
      {
        $set: {
          profile_image_filename: {
            filename: file.filename,
            updated_at: moment().toDate().toISOString(),
          },
        },
      },
      { new: true } // ✅ this ensures the updated document is returned
    );
    if (add_profile_img) {
      res.send({ message: "uploaded" });
    }
  } catch (error) {
    console.log(error);
    res.send("error_occurred");
  }
}

async function removeProfileImage(req, res) {
  try {
    const user_id = req.user_id;

    // Check whether user has profile image or not-
    const user = await User.findOne(
      { _id: user_id },
      { profile_image_filename: 1 }
    );
    // console.log(user);

    // If already has profile image then delete previous image-
    if (user.profile_image_filename !== "default_profile_image") {
      let this_profile_file_path = `/MasherStorage/profile_images/${user.profile_image_filename.filename}`;
      // Check if the file or directory exists/not in the current directory.
      access(this_profile_file_path, constants.F_OK, (err) => {
        // console.log(`${file} ${err ? "does not exist" : "exists"}`);
        if (err) {
          console.log("Profile image does not exists!");
        } else {
          // console.log("Removed!");
          fs.rmSync(this_profile_file_path);
        }
      });
    }

    // Make sure this will happen synchronously-

    // and then update-

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
      res.send("deleted_profile_image_successfully");
    }
  } catch (error) {
    console.log(error);
    res.send("error_occurred");
  }
}

// async function getUserNotifications(req, res) {
//   try {
//     const userId = req.user_id; // from auth middleware
//     const limit = 15;

//     const cursor = req.query.cursor ? new Date(req.query.cursor) : new Date(); // default: now

//     const result = await User.aggregate([
//       { $match: { _id: new mongoose.Types.ObjectId(userId) } },
//       { $project: { notifications: 1 } },
//       { $unwind: "$notifications" },
//       {
//         $match: {
//           "notifications.createdAt": { $lt: cursor },
//         },
//       },
//       { $sort: { "notifications.createdAt": -1 } },
//       { $limit: limit },
//       {
//         $group: {
//           _id: null,
//           notifications: { $push: "$notifications" },
//         },
//       },
//     ]);

//     const notifications = result[0]?.notifications || [];

//     const nextCursor =
//       notifications.length > 0
//         ? notifications[notifications.length - 1].createdAt.toISOString()
//         : null;

//     res.json({ notifications, nextCursor });
//   } catch (error) {
//     console.error("Failed to fetch notifications", error);
//     res.status(500).json({ message: "error_occurred" });
//   }
// }

async function getUserNotifications(req, res) {
  try {
    const userId = new mongoose.Types.ObjectId(req.user_id);
    const limit = 15;

    const cursorDate = req.query.cursor ? new Date(req.query.cursor) : new Date();
    const cursorId = req.query.lastId ? new mongoose.Types.ObjectId(req.query.lastId) : null;

    const result = await User.aggregate([
      { $match: { _id: userId } },
      { $project: { notifications: 1 } },
      { $unwind: "$notifications" },
      {
        $match: {
          $or: [
            { "notifications.createdAt": { $lt: cursorDate } },
            {
              "notifications.createdAt": cursorDate,
              ...(cursorId && { "notifications.notificationId": { $lt: cursorId } }),
            },
          ],
        },
      },
      { $sort: { "notifications.createdAt": -1, "notifications.notificationId": -1 } },
      { $limit: limit },
      {
        $group: {
          _id: null,
          notifications: { $push: "$notifications" },
        },
      },
    ]);

    const notifications = result[0]?.notifications || [];

    const nextCursor =
      notifications.length > 0
        ? {
            cursor: notifications[notifications.length - 1].createdAt.toISOString(),
            lastId: notifications[notifications.length - 1].notificationId.toString(),
          }
        : null;

    res.json({ notifications, nextCursor });
  } catch (error) {
    console.error("Failed to fetch notifications", error);
    res.status(500).json({ message: "error_occurred" });
  }
}


// Add notification-
// async function addUserNotifications(req, res) {
//   try {
//     const user_id = req.user_id;
//     const { text, type, icon, data, person } = req.body.notification;

//     const user = await User.updateOne(
//       { _id: user_id },
//       {
//         // Pull if exist, will not give error if not exist
//         // $pull: {
//         //   notifications: {
//         //     searched_user: searched_userId,
//         //   },
//         // },
//         $addToSet: {
//           notifications: {
//             text: text,
//             type: type,
//             icon: icon,
//             data: data,
//             person: person,
//           },
//         },
//       }
//     );

//     if (user.modifiedCount > 0) {
//       console.log("Notification added successfully.");
//       res.send("notification_updated_successfully");
//     }
//   } catch (error) {
//     console.log(error);
//     res.send("error_occurred");
//   }
// }

async function addUserNotifications(req, res) {
  try {
    const user_id = req.user_id;
    const { text, type, icon, data, person } = req.body.notification;

    const newNotification = {
      notificationId: new mongoose.Types.ObjectId(),
      text: text,
      type: type,
      icon: icon,
      data: data,
      person: person ? new mongoose.Types.ObjectId(person) : null,
      createdAt: new Date(),
      isRead: false,
    };

    const result = await User.updateOne(
      { _id: new mongoose.Types.ObjectId(user_id) },
      {
        $addToSet: {
          notifications: newNotification,
        },
      }
    );

    if (result.modifiedCount > 0) {
      console.log("Notification added successfully.");
      res.send("notification_updated_successfully");
    } else {
      res.status(404).send("user_not_found_or_no_update");
    }
  } catch (error) {
    console.error("Add notification error:", error);
    res.status(500).send("error_occurred");
  }
}


// Delete notification-
async function deleteUserNotifications(req, res) {
  try {
    const user_id = req.user_id;
    const notificationId = req.body.notificationId;

    const user = await User.updateOne(
      { _id: user_id },
      {
        // Pull if exist, will not give error if not exist
        $pull: {
          notifications: {
            notificationId: notificationId,
          },
        },
      }
    );

    if (user.modifiedCount > 0) {
      console.log("Notification deleted successfully.");
      res.send("notification_updated_successfully");
    }
  } catch (error) {
    res.send("error_occurred");
    console.log(error);
  }
}

// Delete all notifications-
async function deleteAllNotifications(req, res) {
  try {
    const user_id = req.user_id;

    const user = await User.updateOne(
      { _id: user_id },
      {
        // Pull if exist, will not give error if not exist
        $set: {
          notifications: [], // Efficient than pullAll because pullAll is not used to remove everything
        },
      }
    );

    if (user.modifiedCount > 0) {
      console.log("All notifications deleted successfully.");
      res.send("all_notifications_deleted_successfully");
    }
  } catch (error) {
    console.log(error);
    res.send("error_occurred");
  }
}

// Get online user latest 100-
async function getOnlineUsers(req, res) {
  try {
    const user_id = req.user_id;

    let participants = await getConversationFriends(user_id);

    console.log("Participants found:", participants);

    if (participants.length === 0) return res.send([]);

    const pipeline = pubClient.pipeline();

    // Queue hgetall for each participant's Redis socket
    for (const participant of participants) {
      pipeline.hgetall(`user_sockets:${participant.otherParticipantId}`);
    }

    const results = await pipeline.exec();

    console.log("Redis results:", results);

    const onlineParticipants = [];

    for (let i = 0; i < participants.length; i++) {
      const participant = participants[i];
      const [err, sockets] = results[i];

      if (err || !sockets) continue;

      for (const [socketId, socketData] of Object.entries(sockets)) {
        try {
          const parsed = JSON.parse(socketData);
          if (parsed.status === "connected") {
            onlineParticipants.push(participant);
            break; // Stop checking more sockets for this user
          }
        } catch (e) {
          console.error("Invalid JSON for", participant.otherParticipantId, e);
        }
      }
    }

    console.log("Online participants:", onlineParticipants);

    res.send(onlineParticipants);
  } catch (error) {
    console.error("getOnlineUsers error:", error);
    res.status(500).send("error_occurred");
  }
}

async function homeinfo(req, res) {
  res.json({
    message: 'Hello from masher! This is the home info endpoint. - Krish Khare',
  })
}

// Register push token function
async function registerPushToken(req, res) {
    try {
        const token = req.body.token;
        const userId = req.user_id;

        console.log('Registering token: ', token)

        const user = await User.findOne(
            { _id: userId },
            { expoPushToken: 1 }

        );
        // console.log(user);

        if (user) {
            // Check if the token already exists
            // if (user.expoPushToken && user.expoPushToken.includes(token)) {
            //     return res.json({ token: 'already_registered', message: 'token_already_registered' });
            // }

            // Add the new token to the array
            const updatedUser = await User.updateOne(
                {_id: userId },
                { $set: { expoPushToken: token } }
            );

            if (updatedUser.modifiedCount > 0) {
              console.log('Token registered')
                res.json({ token: 'registered', message: 'token_registered_successfully' });
            } else {
                res.json({ token: 'not_updated', message: 'token_not_updated' });
            }
        } else {
            res.json({ message: 'user_not_found' });
        }
    } catch (error) {
        console.log(error);
        res.json({ message: 'user_not_found' });
    }
}


module.exports = {
  getUserConversations,

  searchUserByName,
  searchUserByNameUniqueConvoId,

  getUserSearchHistory,
  addUserSearchHistory,
  deleteSearchElement,
  deleteFullSearchHistory,

  getUserData,
  getOtherUserData,
  updateUserDetails,
  updateUsername,
  updatePassword,
  uploadProfileImage,
  removeProfileImage,

  getUserNotifications,
  addUserNotifications,
  deleteUserNotifications,
  deleteAllNotifications,

  getOnlineUsers,

  homeinfo,

  registerPushToken
}; // Exporting the functions

// i want to find a array
