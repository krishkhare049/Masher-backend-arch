import { Platform, Pressable, StatusBar, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import Home from "../screens/Home";
import { RootStackParamList } from "../MainComponent";
// import LogOutCard from '../components/LogOutCard'

// import { socket } from "../socket";
// import Dashboard fro../screens/Meard";
import { axiosInstance } from "../utilities/axiosInstance";

import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../userDataSlice";
// import Me from "../screens/Me";
import * as SecureStore from "expo-secure-store";
import { selectLogged } from "../loggedSlice";
// import { initializeSocket, socket, SocketProvider } from "../socket";
// import { SocketProvider } from "../socket";
// import { Socket } from "socket.io-client";
// import { createUserDataTable, findData, insertData } from "../database/userDataTable";
import {
  checkIfImageExistsHidden,
  downloadAndSaveImage,
  downloadAndSaveImageGallery,
} from "../Local_File_System/fileSystem";
import addPathToProfileImages from "../utilities/addPathToProfileImages";

// import { Realm, useRealm } from "@realm/react";

// import { SocketProvider, useSocket } from "../SocketProvider";
// import { MessageSchema } from "../database/schema/MessageSchema";
import upsertMyUserData from "../database/upsertUser";
import fetchUserDataFromDatabase from "../database/fetchUserDataFromDatabase";
import Search from "../screens/Search";
import { selectIsTabBarVisible } from "../uiSlice";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MessagingScreen from "../screens/MessagingScreen";
import NotificationsScreen from "../screens/Notifications";
import CustomHeader from "../components/CustomHeader";
import CreateGroup from "../screens/CreateGroup";
import User from "../screens/User";
import Profile from "../screens/Profile";
import Settings from "../screens/Settings";
import EditProfile from "../screens/EditProfile";
import Customization from "../screens/settings_screens/Customization";
import Privacy from "../screens/settings_screens/Privacy";
import Payments from "../screens/settings_screens/Payments";
import Theme from "../screens/settings_screens/Theme";
import ChangeUsername from "../screens/settings_screens/ChangeUsername";
import ChangePassword from "../screens/settings_screens/ChangePassword";
import SearchHistory from "../screens/settings_screens/SearchHistory";
import Blocked from "../screens/settings_screens/Blocked";
import Security from "../screens/settings_screens/Security";
import CustomerService from "../screens/settings_screens/CustomerService";
import FAQ from "../screens/settings_screens/FAQ";
import LiveChat from "../screens/settings_screens/LiveChat";
import MyAccount from "../screens/settings_screens/MyAccount";
import Info from "../screens/settings_screens/Info";
import GroupMessagingScreen from "../screens/GroupMessagingScreen";
import ConversationPage from "../screens/ConversationPage";
import SelectUsersSearchComponent from "../screens/SelectUsersSearchComponent";
import GroupEditPage from "../screens/GroupEditPage";
import { format } from "date-fns";
import { useAppTheme } from "../ThemeContext";
import Fonts from "../screens/settings_screens/Fonts";
import { usePushNotifications } from "../hooks/usePushNotfications";
import * as Notifications from 'expo-notifications';
import mobileAds from 'react-native-google-mobile-ads';
// import * as NavigationBar from 'expo-navigation-bar';

// NavigationBar.setVisibilityAsync('visible')

// const BottomTab = createBottomTabNavigator<RootStackParamList>();

const HomeStack = createNativeStackNavigator<RootStackParamList>();

// // 1. Configure notification behavior and Android channel
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     // shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//     shouldShowBanner: true,
//     shouldShowList: true,
//   }),
// });

// if (Platform.OS === 'android') {
//   Notifications.setNotificationChannelAsync('default', {
//     name: 'default',
//     importance: Notifications.AndroidImportance.MAX,
//     sound: 'default',
//     vibrationPattern: [0, 250, 250, 250],
//     lightColor: '#FF231F7C',
//   });
// }

console.log("Signed IN STACK");
export default function SignedInStack() {
  const { colors, isDark } = useAppTheme();


useEffect(() => {
  mobileAds()
    .initialize()
    .then(adapterStatuses => {
      console.log('AdMob initialized');
      console.log(adapterStatuses);
    });
}, []);

  // const expoPushToken = usePushNotifications();

  // useEffect(() => {
  //   if (expoPushToken) {
  //     // Send token to your backend to save
  //     console.log('📱 Token ready to register on server:', expoPushToken);
  //   }
  // }, [expoPushToken]);

  // const isTabBarVisible = useSelector(selectIsTabBarVisible);
  // const realm = useRealm();
  // const UserData = useQuery(UserDataSchema);

  // const socket = useSocket();

  // Database-

  // const fetchDataFromDatabase = async () => {
  //   // setTimeout(()=> {
  //   console.log("Fetching user data from database!");
  //   // createUserDataTable();
  //   // }, 10000)
  //   // // setTimeout(async () => {
  //   //   let userDataFromDb = await findData();
  //   //   console.log(userDataFromDb.id);
  //   //   dispatch(setUserData(userDataFromDb));

  //   //   let img = addPathToProfileImages(userDataFromDb.profileImgFilename);
  //   //   console.log(img);
  //   //   downloadAndSaveImageGallery(img, userDataFromDb.profileImgFilename);
  //   // }, 2000);

  //   // UserData.forEach((user)=>{
  //   //   console.log(user);
  //   //   const userObject = {
  //   //     id: user.userId,
  //   //     full_name: user.full_name,
  //   //     user_email: user.user_email,
  //   //     joined: user.joined,
  //   //     username: user.username,
  //   //     profileImgFilename: user.profileImgFilename,
  //   //   };

  //   //   console.log(userObject)

  //   // })
  //   try {
  //     // const user = realm.objects("User")[0];
  //     const existingUsers = await database.get("myuserdata").query().fetch();

  //     console.log(existingUsers);

  //     if (existingUsers) {
  //       const currentUser = existingUsers[0];
  //       const userDataFromDb = {
  //         id: currentUser.userId,
  //         full_name: currentUser.fullName, // Ensure this matches the actual property name in your Model type
  //         user_email: currentUser.userEmail,
  //         joined: currentUser.joined,
  //         username: currentUser.username,
  //         profileImgFilename: currentUser.profileImgFilename,
  //       };

  //       console.log("User data found");
  //       console.log(userDataFromDb);
  //       dispatch(setUserData(userDataFromDb));
  //     } else {
  //       console.log("User data not found");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const loadUserDataFromDb = async () => {
    let userdata = await fetchUserDataFromDatabase();
    if (userdata) {
      console.log("User data found in database: ", userdata);
      dispatch(setUserData(userdata));
    } else {
      console.log("Failed to load user data from database.");
    }
  };

  useEffect(() => {
    // fetchDataFromDatabase();
    // fetchUserDataFromDatabase()
    loadUserDataFromDb();
  }, []);
  // insertData()

  // const [isConnected, setIsConnected] = useState(false);
  // const [transport, setTransport] = useState("N/A");

  console.log("Signed IN STACK.................");

  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectLogged);

  // useEffect(() => {
  //   if (socket.connected) {
  //     onConnect();
  //   }

  //   function onConnect() {
  //     console.log(socket.id)
  //     setIsConnected(true);
  //     console.log("connected");
  //     setTransport(socket.io.engine.transport.name);

  //     socket.io.engine.on("upgrade", (transport) => {
  //       setTransport(transport.name);
  //     });
  //   }

  //   function onDisconnect() {
  //     setIsConnected(false);
  //     setTransport("N/A");
  //   }

  //   socket.on("connect", onConnect);
  //   socket.on("disconnect", onDisconnect);

  //   socket.on("welcome", (data) => {
  //     console.log(data);
  //   });
  //   socket.on("welcome_alone", (data) => {
  //     console.log(data);
  //     // alert(data.message);
  //   });

  //   socket.on("new_message", (data) => {
  //     console.log("Data" + data);
  //     alert(data.message);
  //   });

  //   return () => { // cleanup function that runs when component unmounts
  //     socket.off("connect", onConnect);
  //     socket.off("disconnect", onDisconnect);
  //   };
  // }, []);

  if (!isLoggedIn) {
    console.log("Disconnecting socket because user is logged out");
    // socket.disconnect();
  }

  // const useSocket = async () => {
  //   const socketInstance = await initializeSocket(); // Initialize the socket

  //   if (socketInstance) {
  //     // Emit a message
  //     socketInstance.emit("send_message", { text: "Hello from TypeScript!" });

  //     socketInstance.on("new_message", (data: any) => {
  //       console.log("Data" + data);
  //       alert(data);
  //     });

  //     // Listen for an incoming message
  //     socketInstance.on("receive_message", (data: any) => {
  //       console.log("🔹 Message Received:", data);
  //     });
  //   }
  // };

  // useSocket();

  const loadUserData = () => {
    axiosInstance
      .get("/api/users/getUserData", {
        withCredentials: true,
      })
      .then((response) => {
        // console.log("My data: ");
        // console.log(response.data);

        const userObject = {
          id: response.data._id,
          fullName: response.data.full_name,
          userEmail: response.data.user_email,
          // joined: response.data.joined,
          joined: format(new Date(response.data.joined), "dd-LLLL-yyyy"),
          username: response.data.username,
          userDescription: response.data.user_description,
          profileImgFilename: response.data.profile_image_filename.filename,
        };

        const userData = {
          userId: response.data._id,
          fullName: response.data.full_name,
          userEmail: response.data.user_email,
          joined: response.data.joined,
          username: response.data.username,
          userDescription: response.data.user_description,
          profileImgFilename: response.data.profile_image_filename.filename,
        };

        // Inserting user data-
        upsertMyUserData(userData);

        // Create a function to delete all existing profile images and other user images which are changed by creating a profileimg schema

        // Check if image exist or not-
        async function loadAndSaveProfileImage() {
          let profileImageExists = await checkIfImageExistsHidden(
            response.data.profile_image_filename.filename
          );
          if (profileImageExists) {
          } else {
            downloadAndSaveImage(
              addPathToProfileImages(
                response.data.profile_image_filename.filename
              ),
              response.data.profile_image_filename.filename
            );
          }
        }
        loadAndSaveProfileImage();

        dispatch(setUserData(userObject));
      })
      .catch((error) => {
        console.log("Error" + error);
      });
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const token = SecureStore.getItemAsync("secure_token");
  // I am exporting only socket so only it will run not console.log
  console.log("token::" + JSON.stringify(token));

  // Listen for typing events from other users
  // useEffect(() => {
  //   socket?.on("hshd", (data: any) => {
  //     console.log(data.message.content);
  //     console.log("data.message", data.message.content);
  //     alert(data);

  //     // Data should be-
  //     // full message data and conversation data

  //     try {
  //       // Store message and conversations both because we are already fetching conversation to see if already exists, so we can send it also but only required data which can change with time - (send from server) lastMessage, participant (if group), groupName, groupIcon, conversationId and message data also

  //       // if(realm.objectForPrimaryKey)
  //       realm.write(() => {
  //         // data.forEach(
  //         //   (dataElement: {
  //         //     conversationId: any;
  //         //     _id: any;
  //         //     sender: any;
  //         //     recipients: any;
  //         //     content: any;
  //         //     createdAt: any;
  //         //     isSender: any;
  //         //   }) => {
  //         const dataMessage = data.message;

  //         const dataConversation = data.conversation;

  //         const messageData = {
  //           conversationId: dataMessage.conversationId,
  //           messageId: dataMessage._id || "",
  //           sender: dataMessage.sender || "",
  //           // recipients: dataMessage.recipients || [],
  //           content: dataMessage.content || "",
  //           createdAt: dataMessage.createdAt || "",
  //           isSender: dataMessage.isSender,
  //         };

  //         const realmMessage = MessageSchema.generate(
  //           messageData
  //           // "modified"
  //         );

  //         realm.create(
  //           "Message",
  //           { ...realmMessage },
  //           Realm.UpdateMode.Modified
  //         );

  //         const conversationData = {
  //           conversationId: dataConversation._id,
  //           otherParticipants: dataConversation.otherParticipants || [],
  //           isGroup: dataConversation.isGroup,
  //           groupName: dataConversation.groupName || "",
  //           groupIcon: dataConversation.groupIcon || "",
  //           createdAt: dataConversation.createdAt,
  //           updatedAt: dataConversation.updatedAt || null, // Default field in MongoDB timestamps
  //           lastMessage: dataConversation.lastMessage || null,
  //           editedMessages: dataConversation.editedMessages || null,
  //         };

  //         console.log("Creating conversation in Realm:", conversationData);

  //         // Generate a valid object **inside** the write transaction
  //         const realmConversation = ConversationSchema.generate(
  //           conversationData
  //           // "modified"
  //         );

  //         // Ensure realmConversation is a plain JS object before passing to `realm.create()`
  //         realm.create(
  //           "Conversation",
  //           { ...realmConversation },
  //           Realm.UpdateMode.Modified
  //         );
  //       });

  //       // });
  //     } catch (error) {
  //       console.log("Save realtime message error: " + error);
  //       console.log(error);
  //     }
  //   });

  //   // socket?.on("hideTyping", () => {
  //   //   setOtherUserTyping(null);
  //   // });

  //   // socket?.on("welcome", (data: any) => {
  //   //   // console.log(data);
  //   //   alert(data.data);
  //   // });

  //   return () => {
  //     // socket?.off("new_message");
  //     // Comment it if i want to receive it on chat screen or messaging screen
  //     // socket?.off("welcome");
  //   };
  // }, []);

  return (
    <>
      {/* <StatusBar barStyle={"light-content"} backgroundColor={"#fdbe00"} /> */}
      {/* <StatusBar barStyle={"light-content"} backgroundColor={"#fdbe00"} /> */}
      <StatusBar
        barStyle={"light-content"}
        backgroundColor={colors.background}
      />
      {/* // <View style={styles.container}> */}

      {/* <ScrollView keyboardShouldPersistTaps='handled'> */}

      <SafeAreaProvider style={{ backgroundColor: "white" }}>
        {/* <NavigationContainer independent={true}> */}
        <NavigationIndependentTree>
          <NavigationContainer>
            {/* <HomeStack.Navigator initialRouteName="Chats" screenOptions={{}}> */}
            <HomeStack.Navigator
              initialRouteName="Home"
              screenOptions={{
                animation: "simple_push", // Or use a different animation style
                gestureEnabled: true, // Enable swipe gestures for better transitions
                statusBarAnimation: "slide", // Fade the status bar during transitions
                // presentation: 'containedTransparentModal',
              }}
            >
              <HomeStack.Screen
                // name="Chats"
                // component={Chats}
                name="Home"
                component={Home}
                options={{ headerShown: false }}
              />
              <HomeStack.Screen
                name="MessagingScreen"
                component={MessagingScreen}
                initialParams={{ conversationId: "", otherParticipantId: "" }}
                options={{
                  headerShown: false,

                  // presentation: "modal", // Uses native modal presentation
                  // animation: "simple_push", // Smooth animation
                }}
              />
              <HomeStack.Screen
                name="GroupMessagingScreen"
                component={GroupMessagingScreen}
                initialParams={{ conversationId: "" }}
                options={{
                  headerShown: false,

                  // presentation: "modal", // Uses native modal presentation
                  // animation: "simple_push", // Smooth animation
                }}
              />
              <HomeStack.Screen
                name="GroupEditPage"
                component={GroupEditPage}
                options={{
                  header(props) {
                    return (
                      <CustomHeader
                        name="Edit Group"
                        // headerBackgroundColor="#FFFFFF"
                        // textColor="#000000"
                        headerBackgroundColor={!isDark ? "#FFFFFF": colors.background}
                      textColor={colors.text}
                      />
                    );
                  },
                }}
              />
              <HomeStack.Screen
                name="Search"
                component={Search}
                options={{
                  headerShown: false,
                }}
              />
              <HomeStack.Screen
                name="Notifications"
                component={NotificationsScreen}
                options={{
                  header(props) {
                    return (
                      <CustomHeader
                        name="Notifications"
                        // headerBackgroundColor="#fdbe00"
                        headerBackgroundColor={colors.background}
                        textColor="white"
                      />
                    );
                  },
                }}
              />
              <HomeStack.Screen
                name="CreateGroup"
                component={CreateGroup}
                options={{
                  header(props) {
                    return (
                      <CustomHeader
                        name="Create a Group"
                        // headerBackgroundColor="#FFFFFF"
                        // textColor="#000000"
                          headerBackgroundColor={!isDark ? "#FFFFFF": colors.background}
                      textColor={colors.text}
                      />
                    );
                  },
                }}
              />
              <HomeStack.Screen
                name="User"
                component={User}
                initialParams={{ userId: "" }}
                options={{
                  headerShown: false,
                }}
              />
              <HomeStack.Screen
                name="ConversationPage"
                component={ConversationPage}
                options={{
                  headerShown: false,
                }}
              />

              {/* Also including here me screens- */}
              <HomeStack.Screen
                name="Profile"
                component={Profile}
                options={{ headerShown: false }}
              />
              <HomeStack.Screen
                name="Settings"
                component={Settings}
                options={{
                  header(props) {
                    // return <CustomHeader name="Settings" headerBackgroundColor="#007bff" />;
                    return (
                      <CustomHeader
                        name="Settings"
                        headerBackgroundColor={!isDark ? "#FFFFFF": colors.background}
                        textColor={colors.text}
                        // textColor={"#000000"}
                      />
                    );
                  },
                }}
              />
              <HomeStack.Screen
                name="EditProfile"
                component={EditProfile}
                options={{
                  header(props) {
                    return (
                      <CustomHeader
                        name="Edit Profile"
                        headerBackgroundColor={colors.background}
                        textColor="white"
                      />
                    );
                  },
                }}
              />

              {/* Settings pages */}
              <HomeStack.Screen
                name="Customization"
                component={Customization}
                options={{
                  header(props) {
                    return (
                      <CustomHeader
                        name="Customization"
                        headerBackgroundColor={!isDark ? "#FFFFFF": colors.background}
                        textColor={colors.text}
                      />
                    );
                  },
                }}
              />

              <HomeStack.Screen
                name="Privacy"
                component={Privacy}
                options={{
                  header(props) {
                    return (
                      <CustomHeader
                        name="Privacy"
                        // headerBackgroundColor="#ff0026"
                        headerBackgroundColor={!isDark ? "royalblue": colors.background}
                        textColor="white"
                      />
                    );
                  },
                }}
              />
              <HomeStack.Screen
                name="Payments"
                component={Payments}
                options={{
                  header(props) {
                    return (
                      <CustomHeader
                        name="Payments"
                        headerBackgroundColor={!isDark ? "#129953": colors.background}

                        textColor="white"
                      />
                    );
                  },
                }}
              />
              <HomeStack.Screen
                name="Theme"
                component={Theme}
                options={{
                  header(props) {
                    return (
                      <CustomHeader
                        name="Theme"
                        headerBackgroundColor={!isDark ? "#FFFFFF": colors.background}
                        textColor={colors.text}
                      />
                    );
                  },
                }}
              />
              <HomeStack.Screen
                name="Fonts"
                component={Fonts}
                options={{
                  header(props) {
                    return (
                      <CustomHeader
                        name="Text"
                        headerBackgroundColor={!isDark ? "#FFFFFF": colors.background}
                        textColor={colors.text}
                      />
                    );
                  },
                }}
              />
              <HomeStack.Screen
                name="ChangeUsername"
                component={ChangeUsername}
                options={{
                  header(props) {
                    return (
                      <CustomHeader
                        name="Change Username"
                        headerBackgroundColor={!isDark ? "#FFFFFF": colors.background}
                        textColor={colors.text}
                      />
                    );
                  },
                }}
              />
              <HomeStack.Screen
                name="ChangePassword"
                component={ChangePassword}
                options={{
                  header(props) {
                    return (
                      <CustomHeader
                        name="Change Password"
                         headerBackgroundColor={!isDark ? "#FFFFFF": colors.background}
                        textColor={colors.text}
                      />
                    );
                  },
                }}
              />
              <HomeStack.Screen
                name="SearchHistory"
                component={SearchHistory}
                options={{
                  header(props) {
                    return (
                      <CustomHeader
                        name="Search History"
                        headerBackgroundColor={!isDark ? "#FFFFFF": colors.background}
                        textColor={colors.text}
                      />
                    );
                  },
                }}
              />
              <HomeStack.Screen
                name="Blocked"
                component={Blocked}
                options={{
                  header(props) {
                    return (
                      <CustomHeader
                        name="Blocked"
                       headerBackgroundColor={!isDark ? "#FFFFFF": colors.background}
                        textColor={colors.text}
                      />
                    );
                  },
                }}
              />
              <HomeStack.Screen
                name="Security"
                component={Security}
                options={{
                  header(props) {
                    return (
                      <CustomHeader
                        name="Security"
                        headerBackgroundColor={!isDark ? "#FFFFFF": colors.background}
                        textColor={colors.text}
                      />
                    );
                  },
                }}
              />
              <HomeStack.Screen
                name="CustomerService"
                component={CustomerService}
                options={{
                  header(props) {
                    return (
                      <CustomHeader
                        name="Customer Service"
                        headerBackgroundColor={!isDark ? "#FFFFFF": colors.background}
                        textColor={colors.text}
                      />
                    );
                  },
                }}
              />
              <HomeStack.Screen
                name="FAQ"
                component={FAQ}
                options={{
                  header(props) {
                    return (
                      <CustomHeader
                        name="FAQs"
                        // headerBackgroundColor="#FFFFFF"
                        // textColor="#000000"
                        headerBackgroundColor={!isDark ? "#FFFFFF": colors.background}
                        textColor={colors.text}
                      />
                    );
                  },
                }}
              />
              <HomeStack.Screen
                name="LiveChat"
                component={LiveChat}
                options={{
                  header(props) {
                    return (
                      <CustomHeader
                        name="Live chat"
                        headerBackgroundColor="#FFFFFF"
                        textColor="#000000"
                      />
                    );
                  },
                }}
              />
              <HomeStack.Screen
                name="MyAccount"
                component={MyAccount}
                options={{
                  header(props) {
                    return (
                      <CustomHeader
                        name="My Account"
                        headerBackgroundColor={!isDark ? "#FFFFFF": colors.background}
                        textColor={colors.text}
                      />
                    );
                  },
                }}
              />
              <HomeStack.Screen
                name="Info"
                component={Info}
                options={{
                  header(props) {
                    return (
                      <CustomHeader
                        name="Info"
                         headerBackgroundColor={!isDark ? "#FFFFFF": colors.background}
                        textColor={colors.text}
                      />
                    );
                  },
                }}
              />
              <HomeStack.Screen
                name="SelectUsersSearchComponent"
                component={SelectUsersSearchComponent}
                initialParams={{ headerText: "Select", conversationId: "" }}
                options={({ route }) => ({
                  header: (props) => (
                    <CustomHeader
                      name={route.params?.headerText ?? "Select"}
                      // headerBackgroundColor="#FFFFFF"
                      headerBackgroundColor={!isDark ? "#FFFFFF": colors.background}
                      textColor={colors.text}
                      // textColor="#000000"

                    />
                  ),
                })}
              />
              {/* Also including here me screens end- */}
            </HomeStack.Navigator>

            {/* <BottomTab.Navigator
              initialRouteName="Home"
              screenOptions={{ headerShown: false, lazy: true ,

                tabBarStyle: isTabBarVisible
                ? {
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    backgroundColor: "white",
                    overflow: "hidden",
                    elevation: 30,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: -6 },
                    shadowOpacity: 0.9,
                    shadowRadius: 12,
                    borderTopWidth: 0,
                  }
                : { display: "none" },
                tabBarLabelStyle: { fontFamily: "Dosis_600SemiBold" },

                tabBarButton: (props) => (
                  <Pressable
                    {...props}
                    // android_ripple={{ color: "#fdbe00", borderless: false }} // Change ripple color here
                    android_ripple={{
                      color: "whitesmoke",
                      borderless: false,
                    }} // Change ripple color here
                  />
                ),
               }}
            >
              <BottomTab.Screen
                name="Home"
                component={Home}
                options={{
                // options={({ route }) => ({
                  tabBarIcon: ({ color, focused }) => (
                    <TabBarIcon
                      name={focused ? "chats" : "chatsOutline"}
                      color={focused ? "#fdbe00" : "gainsboro"}
                      size={30}
                    />
                  ),
                  tabBarActiveTintColor: "#fdbe00",
                }}
              />
              <BottomTab.Screen
                name="Search"
                component={Search}
                options={{
                // options={({ route }) => ({
                  tabBarIcon: ({ color, focused }) => (
                    <TabBarIcon
                      name={"search"}
                      color={focused ? "#fdbe00" : "gainsboro"}
                      size={26}
                    />
                  ),
                  tabBarActiveTintColor: "#fdbe00",
                }}
              />
              <BottomTab.Screen
                // name="Dashboard"
                name="Me"
                component={Me}
                options={{
                // options={({ route }) => ({
                  tabBarIcon: ({ color, focused }) => (
                    <MeIconComponent focused={focused} />
                  ),
                  tabBarLabel: "My Space",
                  // tabBarActiveTintColor: "#193088",
                  tabBarActiveTintColor: "#fdbe00",
                }}
              />
            </BottomTab.Navigator> */}
          </NavigationContainer>
        </NavigationIndependentTree>
        {/* </NavigationContainer> */}
      </SafeAreaProvider>

      {/* </ScrollView> */}
    </>
  );
}

const styles = StyleSheet.create({});
