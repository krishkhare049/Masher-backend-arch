import { Q } from "@nozbe/watermelondb";
import database from "../../index.native";

async function upsertOtherUser(data) {
  try {
    
  await database.write(async () => {
    // Step 1: Check if otherUser exists
    const existingOtherUser = await database
      .get('otherusers')
      .query(Q.where('user_id', data.userId)) // Search by ID
      .query() // Search by ID
      .fetch();

    if (existingOtherUser.length > 0) {
      // Step 2: If otherUser exists, update
      await existingOtherUser[0].update(otherUser => {
        // otherUser.userId = data.userId;
        otherUser.fullName = data.fullName;
        // otherUser.joined = data.joined;
        otherUser.userEmail = data.userEmail;
        otherUser.username = data.username;
        otherUser.userDescription = data.userDescription;
        otherUser.profileImgFilename = data.profileImgFilename;
      });
      console.log("✅ Other user updated:", userId);
    } else {
      // Step 3: If otherUser doesn't exist, create new
      await database.get('otherusers').create(otherUser => {
        // otherUser._raw.id = userId; // Set a specific ID
        otherUser.userId = data.userId;
        otherUser.fullName = data.fullName;
        // otherUser.joined = data.joined;
        otherUser.joined = format(new Date(data.joined), "dd-LLLL-yyyy");
        otherUser.userEmail = data.userEmail;
        otherUser.username = data.username;
        otherUser.userDescription = data.userDescription;
        otherUser.profileImgFilename = data.profileImgFilename;
      });
      console.log("✅ New other user created:", data);
    }
  });
} catch (error) {
  console.error("Error in upsertOtherUser:", error);
}
}

export default upsertOtherUser;