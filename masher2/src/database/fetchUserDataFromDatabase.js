import { userDataCollection } from "../../index.native";

const fetchUserDataFromDatabase = async () => {
  console.log("Fetching user data from database!");

  try {
    // const existingUsers = await database.get("myuserdata").query().fetch();
    const existingUsers = await userDataCollection.query().fetch();

    // console.log(existingUsers);

    if (existingUsers.length > 0) {
      const currentUser = existingUsers[0];
      const userDataFromDb = {
        id: currentUser.userId,
        fullName: currentUser.fullName, // Ensure this matches the actual property name in your Model type
        userEmail: currentUser.userEmail,
        joined: currentUser.joined,
        username: currentUser.username,
        profileImgFilename: currentUser.profileImgFilename,
        userDescription: currentUser.userDescription
      };

      console.log("User data found");
      // console.log(userDataFromDb);
      //   dispatch(setUserData(userDataFromDb));
      return userDataFromDb;
    } else {
      console.log("User data not found");
    }
  } catch (error) {
    console.log('Error while fetching user data: ' + error);
  }
};

export default fetchUserDataFromDatabase;
