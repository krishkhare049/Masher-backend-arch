// import { Q } from '@nozbe/watermelondb';
import { format } from "date-fns";
import database, { userDataCollection } from "../../index.native";

async function upsertMyUserData(userData) {
  try {
    await database.write(async () => {
      // Step 1: Fetch all existing documents
      // const existingUsers = await database.get("myuserdata").query().fetch();
      const existingUsers = await userDataCollection.query().fetch();

      // Step 2: If any user exists, delete it (Ensuring only one document remains)
      if (existingUsers.length > 0) {
        await Promise.all(
          existingUsers.map((user) => user.destroyPermanently())
        );
        console.log("🗑️ Deleted old user(s)");
      }

      // Step 3: Create new user with the given ID
      // await database.get("myuserdata").create((user) => {
      await userDataCollection.create((user) => {
        // user._raw.id = userId; // Assigning the specific ID
        user.userId = userData.userId;
        user.fullName = userData.fullName;
        // user.joined = userData.joined;
        user.joined = format(new Date(userData.joined), "dd-LLLL-yyyy");

        user.userEmail = userData.userEmail;
        user.username = userData.username;
        user.userDescription = userData.userDescription;
        user.profileImgFilename = userData.profileImgFilename;
      });

      console.log("✅ Created new user:", userData);
    });
  } catch (error) {
    console.log("Error inserting my user data: " + error);
  }
}

export default upsertMyUserData;
