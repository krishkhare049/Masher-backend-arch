import {
  BackHandler,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import TabBarIcon from "../components/TabBarIcon";
import { Switch, TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { axiosInstance } from "../utilities/axiosInstance";
// import { navigationRef } from "../navigationRef";
import * as ImageManipulator from "expo-image-manipulator";

import { Formik } from "formik";
import * as Yup from "yup";
import { getMimeTypeFromUri } from "../utilities/getMimeTypeFromUri";
import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import addPathToProfileImages from "../utilities/addPathToProfileImages";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSelectedUsersList,
  setUsers,
  toggleUser,
} from "../selectedUsersListSlice";
import SelectUsersSearchComponent from "./SelectUsersSearchComponent";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../MainComponent";
import { useAppTheme } from "../ThemeContext";
import { lightenHexColor } from "../utilities/lightenHexColor";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  groupName: Yup.string()
    .min(6, "Group name must be at least 6 characters")
    .max(50, "Group name must be at most 50 characters")
    .required("Please enter your group name"),
  groupDescription: Yup.string().max(
    250,
    "Group description must be at most 250 characters"
  ),
});

export default function CreateGroup() {
        const { colors, isDark } = useAppTheme();
  
  const dispatch = useDispatch();
  const selectedUsersList = useSelector(selectSelectedUsersList);

  const [isPermissionSwitchOn, setIsPermissionSwitchOn] = useState(false);
  const onTogglePermissionSwitch = () =>
    setIsPermissionSwitchOn(!isPermissionSwitchOn);

  const [isApproveSwitchOn, setIsApproveSwitchOn] = useState(true);
  const onToggleApproveSwitch = () => setIsApproveSwitchOn(!isApproveSwitchOn);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showSelectedImage, setShowSelectedImage] = useState<boolean>(false);

  const [bottomSheetIndexGroupIcon, setbottomSheetIndexGroupIcon] =
    useState<number>(-1);
  // const [
  //   bottomSheetIndexSelectParticipants,
  //   setbottomSheetIndexSelectParticipants,
  // ] = useState<number>(-1);

  const bottomSheetRefGroupIcon = useRef<BottomSheet>(null);
  // const bottomSheetRefSelectParticipants = useRef<BottomSheet>(null);

  const [clickedOnCreateGroup, setClickedOnCreateGroup] = useState(false);

      const android_ripple = {
    color: !isDark ? "whitesmoke": "#282C35",
  };


  // const navigation = useNavigation();
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, "CreateGroup">
    >();

  const removeImage = () => {
    console.log("Cancelling uploading profile image");
    setSelectedImage(null);
    setShowSelectedImage(false);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      // mediaTypes: ImagePicker.MediaTypeOptions.All,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      // Compress the selected image
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 500 } }], // Resize to a specific width (adjust as necessary)
        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG } // Compress the image to 50% quality
      );

      setSelectedImage(manipulatedImage.uri); // Set the compressed image URI

      // setSelectedImage(result.assets[0].uri);
      setShowSelectedImage(true);
      // uploadProImage(result.assets[0].uri); // Call upload function here
    }
  };

  // callbacks
  const handleSheetChangesGroupIcon = useCallback((index: number) => {
    console.log("handleSheetChangesGroupIcon", index);

    setbottomSheetIndexGroupIcon(index);
  }, []);

  // const handleSheetChangesSelectParticipants = useCallback((index: number) => {
  //   console.log("handleSheetChangesSelectParticipants", index);

  //   setbottomSheetIndexSelectParticipants(index);
  // }, []);

  const handleOpenPressGroupIcon = () => {
    // console.log("hi");
    // bottomSheetRef.current?.expand(); // Open the bottom sheet

    if (bottomSheetIndexGroupIcon === -1) {
      bottomSheetRefGroupIcon.current?.expand(); // Open the bottom sheet
    } else {
      bottomSheetRefGroupIcon.current?.close(); // Close the bottom sheet
    }
  };
  // const handleOpenPressSelectParticipants = () => {
  //   // console.log("hi");
  //   // bottomSheetRef.current?.expand(); // Open the bottom sheet

  //   if (bottomSheetIndexSelectParticipants === -1) {
  //     bottomSheetRefSelectParticipants.current?.expand(); // Open the bottom sheet
  //   } else {
  //     bottomSheetRefSelectParticipants.current?.close(); // Close the bottom sheet
  //   }
  // };

  // const snapPointsGroupIcon = ['25%', '50%', '100%'];
  // const snapPointsGroupIcon = [200, "30%"];
  const snapPointsGroupIcon = [150];
  // const snapPointsSelectParticipants = ["80%"];

  const handleHideBottomSheet = () => {
    if (
      bottomSheetIndexGroupIcon === 1
      // bottomSheetIndexSelectParticipants === 1
      // bottomSheetIndexGroupIcon !== 0 ||
      // bottomSheetIndexSelectParticipants !== 0
    ) {
      // If the menu is visible, hide it and prevent the default back action
      // setbottomSheetIndexGroupIcon(-1);
      bottomSheetRefGroupIcon.current?.close();
      // bottomSheetRefSelectParticipants.current?.close();
      return true; // Prevent the default back action
    }
    return false; // Allow the default back action if the menu is not visible
  };

  // Handle back functionality by using removing any state from here and chat conversations pages and use redux store for global states and use useEffect and pass both dependencies of isConvMenuVisible and isMessMenuVisible.
  useEffect(() => {
    // Add event listener for back button
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleHideBottomSheet
    );

    // Cleanup the event listener on component unmount
    // return () => backHandler.remove();
    return () => {
      backHandler.remove();
      // dispatch(setUsers([]))
    };
  }, [bottomSheetIndexGroupIcon]);

  useEffect(() => {
    return () => {
      // This runs only on unmount
      dispatch(setUsers([]));
    };
  }, []);

  // const handleCreateGroup = async () => {
  const handleCreateGroup = async (
  values: { groupName: string; groupDescription: string },
  { setSubmitting }: any
) => {
  setClickedOnCreateGroup(true);

  try {
    let imageKey: string | undefined;

    if (selectedImage) {
      const fileType = getMimeTypeFromUri(selectedImage);

      // 1. Request pre-signed upload URL from backend
      const { data } = await axiosInstance.post(
        "/api/uploads/getGroupIconPresignedUploadUrl",
        { fileType,
          conversationId: 'new_group'
         }
      );

      imageKey = data.key;

      // 2. Upload to S3
      const blob = await (await fetch(selectedImage)).blob();

      await fetch(data.signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": fileType,
        },
        body: blob,
      });
    }

    // 3. Collect recipients
    const recipients = selectedUsersList.map((u: { _id: any; }) => u._id);

    // 4. Create group
    const response = await axiosInstance.post(
      "/api/conversations/createNewGroup",
      {
        groupName: values.groupName,
        groupDescription: values.groupDescription,
        adminsApproveMembers: isApproveSwitchOn,
        editPermissionsMembers: isPermissionSwitchOn,
        recipients: recipients,
        imageKey: imageKey, // Pass key (or undefined)
      },
      { withCredentials: true }
    );

    if (response.data === "group_created_successfully") {
      dispatch(setUsers([]));
      navigation.goBack();
    }
  } catch (error) {
    console.error("Error creating group:", error);
  } finally {
    setClickedOnCreateGroup(false);
    setSubmitting(false);
  }
};

  const renderItem = ({ item }: { item: any }) => {
    // console.log("Item: ");
    console.log(item._id);
    return (
      <Pressable
        onPress={() => {
          dispatch(toggleUser(item));
        }}
        style={{ padding: 5 }}
      >
        {item.profile_image_filename.filename !== "default_profile_image" ? (
          <Image
            source={{
              uri: addPathToProfileImages(item.profile_image_filename.filename),
            }}
            style={{ width: 60, height: 60, borderRadius: 80 }}
            placeholder={require("../../assets/icons/skeletonLoadingPlaceholder.gif")}
            placeholderContentFit="cover"
            contentFit="cover"
          />
        ) : (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: 60,
              height: 60,
            }}
          >
            <TabBarIcon name="defaultProfileIcon" size={60} color="#000000" />
          </View>
        )}
        {/* Camera Icon positioned at the bottom right */}
        <View
          style={{
            position: "absolute",
            bottom: 10, // Adjust as needed
            right: 10, // Adjust as needed
            // backgroundColor: "#193088", // Optional: background color for the icon
            backgroundColor: "#FFFFFF", // Optional: background color for the icon
            borderRadius: 20, // Optional: to make it circular
            // padding: 5, // Optional: padding around the icon
          }}
        >
          <TabBarIcon
            name="cancel" // Replace with your camera icon name
            size={15}
            color="#000000"
          />
        </View>
      </Pressable>
    );
  };

  return (
    <>
      <StatusBar barStyle={ !isDark ?"dark-content": "light-content"} backgroundColor={!isDark ?"white": colors.background} />
      <GestureHandlerRootView>
        <ScrollView
          style={{
            flex: 1,
            // justifyContent: "flex-start",
            // alignItems: "center",
            // backgroundColor: "white",
            backgroundColor:!isDark ?"white": "#343A46"
          }}
        >
          <View
            style={{
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            {/* <Surface
              elevation={1}
              style={{
                width: 80,
                height: 80,
                justifyContent: "center",
                alignItems: "center",
                margin: 15,
                borderRadius: 100,
                backgroundColor: "white",
                overflow: "hidden",
                position: "relative", // Allows for positioning the camera icon
              }}
            > */}
            <View
              // elevation={1}
              style={{
                // iOS shadow
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
                // Android shadow
                elevation: 1,

                width: 100,
                height: 100,
                justifyContent: "center",
                alignItems: "center",
                margin: 15,
                borderRadius: 100,
                backgroundColor: "white",
                overflow: "hidden",
                position: "relative", // Allows for positioning the camera icon
              }}
            >
              <Pressable
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: 100,
                  height: 100,
                }}
                onPress={handleOpenPressGroupIcon}
                android_ripple={{ color: "whitesmoke" }}
                // onPress={handleOpenPressGroupIcon}
              >
                {/* {userData.GroupIconFilename ? ( */}
                {/* {userData.GroupIconFilename !== "default_profile_image" ? ( */}
                {/* //   <Image
            //     source={{
            //       uri: addPathToProfileImages(userData.GroupIconFilename),
            //     }}
            //     placeholder={require("../assets/skeletonLoadingPlaceholder.gif")}
            //     style={{ width: 100, height: 100 }} // Centered image
            //   />
            // ) : ( */}

                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    // width: 80,
                    // height: 80,
                    width: 100,
                    height: 100,
                    backgroundColor: !isDark ? "white" : "#444E60",
                  }}
                >
                  {selectedImage ? (
                    <View style={{ width: 100, height: 100 }}>
                      <Image
                        source={{ uri: selectedImage }}
                        style={{ width: 100, height: 100, borderRadius: 100 }}
                        placeholder={require("../../assets/icons/skeletonLoadingPlaceholder.gif")}
                        placeholderContentFit="cover"
                        contentFit="cover"
                      />
                    </View>
                  ) : (
                    <TabBarIcon name="imageOutline" size={40} color={colors.text} />
                  )}
                </View>

                {/* // )} */}

                {/* Camera Icon positioned at the bottom right */}
              </Pressable>
            </View>

            {/* Formik Wrapper */}
            <Formik
              initialValues={{ groupName: "", groupDescription: "" }}
              validationSchema={validationSchema}
              onSubmit={handleCreateGroup}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isValid,
                isSubmitting,
              }) => (
                <>
                  <TextInput
                    // style={styles.inputBar}
                    style={[styles.inputBar, {backgroundColor: !isDark ? "whitesmoke" : "#444E60", color: colors.text}]}

                    underlineStyle={{ display: "none" }}
                    value={values.groupName}
                    // onChangeText={setLoginEmail}
                    onChangeText={handleChange("groupName")}
                    onBlur={handleBlur("groupName")}
                    label={
                      <Text
                        style={{
                          color: "gray",
                          // color: "#193088",
                          textAlign: "center",
                          fontFamily: "Dosis_400Regular",
                        }}
                      >
                        Group name
                      </Text>
                    }
                    placeholderTextColor={"gainsboro"}
                    outlineStyle={{
                      borderWidth: 0,
                      borderRadius: 15,
                      // borderTopRightRadius: 0,
                      // borderBottomRightRadius: 0,
                      margin: 0,
                      padding: 0,
                    }}
                    mode="outlined"
                    cursorColor="#000000"
                    contentStyle={{
                      fontFamily: "Dosis_400Regular",
                      // color: "#000000",
                    }}
                  />

                  {touched.groupName && errors.groupName && (
                    <Text style={styles.errorText}>{errors.groupName}</Text>
                  )}
                  <TextInput
                    multiline
                    numberOfLines={4}
                    style={[styles.inputBar, {backgroundColor: !isDark ? "whitesmoke" : "#444E60", color: colors.text}]}
                    underlineStyle={{ display: "none" }}
                    value={values.groupDescription}
                    // onChangeText={setLoginEmail}
                    onChangeText={handleChange("groupDescription")}
                    onBlur={handleBlur("groupDescription")}
                    label={
                      <Text
                        style={{
                          color: "gray",
                          // color: "#193088",
                          textAlign: "center",
                          fontFamily: "Dosis_400Regular",
                        }}
                      >
                        Write something about your group...
                      </Text>
                    }
                    placeholderTextColor={"gainsboro"}
                    outlineStyle={{
                      borderWidth: 0,
                      borderRadius: 15,
                      // borderTopRightRadius: 0,
                      // borderBottomRightRadius: 0,
                      margin: 0,
                      padding: 0,
                    }}
                    mode="outlined"
                    cursorColor="#000000"
                    contentStyle={{
                      fontFamily: "Dosis_400Regular",
                      // color: "#000000",
                    }}
                  />
                  {touched.groupDescription && errors.groupDescription && (
                    <Text style={styles.errorText}>
                      {errors.groupDescription}
                    </Text>
                  )}

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      width: "90%",
                      marginVertical: 10,
                      // backgroundColor: "whitesmoke",
                       backgroundColor: !isDark ? "whitesmoke" : "#444E60",
                      padding: 10,
                      borderRadius: 10,
                    }}
                  >
                    <View style={{ maxWidth: "80%" }}>
                      <Text
                        style={{
                          fontFamily: "Dosis_600SemiBold",
                          fontSize: 18,
                          color: colors.text,
                        }}
                      >
                        Edit permissions
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Dosis_500Medium",
                          fontSize: 14,
                          // color: "#000000",
                          color: colors.text,

                        }}
                      >
                        Members can edit or remove group icon, name, pinned
                        messages
                      </Text>
                    </View>
                    <Switch
                      // color="#fdbe00"
                      color={colors.background}
                      value={isPermissionSwitchOn}
                      onValueChange={onTogglePermissionSwitch}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      width: "90%",
                      marginVertical: 10,
                      // backgroundColor: "whitesmoke",
                       backgroundColor: !isDark ? "whitesmoke" : "#444E60",

                      padding: 10,
                      borderRadius: 10,
                    }}
                  >
                    <View style={{ maxWidth: "80%" }}>
                      <Text
                        style={{
                          fontFamily: "Dosis_600SemiBold",
                          fontSize: 18,
                          color: colors.text,
                        }}
                      >
                        Approve members
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Dosis_500Medium",
                          fontSize: 14,
                          // color: "#000000",
                          color: colors.text,

                        }}
                      >
                        Admins must approve members before they join the group
                      </Text>
                    </View>
                    <Switch
                      // color="#fdbe00"
                      color={colors.background}
                      value={isApproveSwitchOn}
                      onValueChange={onToggleApproveSwitch}
                    />
                  </View>

                  {/* <Text>Commented out flashlist</Text> */}
                  <View
                    style={{
                      // backgroundColor: "whitesmoke",
                      // height: 50,
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      margin: 10,
                      borderRadius: 10,
                    }}
                  >
                    {selectedUsersList.length !== 0 ? (
                      <FlashList
                        //  onLoad={() => console.log("FlashList Loaded")}
                        decelerationRate={0.92}
                        estimatedListSize={{ height: 50, width: 50 }}
                        // estimatedListSize={estimatedListSize}
                        data={selectedUsersList || []}
                        renderItem={renderItem}
                        // keyExtractor={keyExtractor}
                        // estimatedItemSize={50} // set closer to average actual height
                        estimatedItemSize={50} // set closer to average actual height
                        // extraData={selectedMessageIds}
                        // inverted
                        removeClippedSubviews
                        keyboardShouldPersistTaps="handled"
                        automaticallyAdjustKeyboardInsets
                        // showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        // contentContainerStyle={styles.contentContainer}
                        // onEndReached={handleEndReached}
                        onEndReachedThreshold={0.7}
                        // ListEmptyComponent={ListEmptyComponent}
                        // maintainVisibleContentPosition={{
                        //   minIndexForVisible: 1,
                        //   autoscrollToTopThreshold: 10,
                        // }}
                        // getItemType={() => "message"}
                        // ref={flashListRef}
                        // onViewableItemsChanged={onViewableItemsChanged}
                        // viewabilityConfig={{
                        //   itemVisiblePercentThreshold: 50,
                        // }}
                        keyExtractor={(item) => item._id.toString()}
                      />
                    ) : (
                      <Text style={{color: colors.text}}>Select group participants</Text>
                    )}
                  </View>
                  {/* <View style={{ margin: 10 }}>
                    {selectedUsersList.length !== 0 ? (
                      <FlashList
                        //  onLoad={() => console.log("FlashList Loaded")}
                        decelerationRate={0.92}
                        estimatedListSize={{ height: 600, width: 200 }}
                        // estimatedListSize={estimatedListSize}
                        data={selectedUsersList || []}
                        renderItem={renderItem}
                        // keyExtractor={keyExtractor}
                        // estimatedItemSize={50} // set closer to average actual height
                        estimatedItemSize={71} // set closer to average actual height
                        // extraData={selectedMessageIds}
                        inverted
                        removeClippedSubviews
                        keyboardShouldPersistTaps="handled"
                        automaticallyAdjustKeyboardInsets
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        // contentContainerStyle={styles.contentContainer}
                        // onEndReached={handleEndReached}
                        onEndReachedThreshold={0.7}
                        // ListEmptyComponent={ListEmptyComponent}
                        maintainVisibleContentPosition={{
                          minIndexForVisible: 1,
                          autoscrollToTopThreshold: 10,
                        }}
                        // getItemType={() => "message"}
                        // ref={flashListRef}
                        // onViewableItemsChanged={onViewableItemsChanged}
                        viewabilityConfig={{
                          itemVisiblePercentThreshold: 50,
                        }}
                        keyExtractor={(item) => item.toString()}
                      />
                    ) : (
                      <Text>Select group participants</Text>
                    )}
                  </View> */}

                  <View
                    style={{ borderRadius: 10, overflow: "hidden", margin: 10 }}
                  >
                    <Pressable
                      android_ripple={android_ripple}
                      style={{
                        // backgroundColor: "whitesmoke",
                        backgroundColor: !isDark ? "whitesmoke" : "#444E60",
                        padding: 10,
                        borderRadius: 10,
                        flexDirection: "row",
                      }}
                      onPress={() => {
                        navigation.navigate("SelectUsersSearchComponent", {
                          headerText: "Select participants",
                          conversationId: "",
                        });
                      }}
                    >
                      <TabBarIcon name="addToList" size={20} color={colors.text} />
                      <Text
                        style={{
                          fontFamily: "Dosis_500Medium",
                          marginLeft: 10,
                          fontSize: 16,
                          color: colors.text,
                        }}
                      >
                        {selectedUsersList.length !== 0
                          ? "Edit participants"
                          : "Add participants"}
                      </Text>
                    </Pressable>
                  </View>

                  {clickedOnCreateGroup || isSubmitting ? (
                    <ActivityIndicator
                      size={30}
                      color={"#193088"}
                      style={{ marginTop: 10 }}
                    />
                  ) : (
                    <View
                      style={{
                        borderRadius: 10,
                        overflow: "hidden",
                        margin: 20,
                      }}
                    >
                      <Pressable
                        disabled={!isValid}
                        style={{
                          padding: 5,
                          paddingHorizontal: 10,
                          flexDirection: "row",
                          justifyContent: "space-evenly",
                          alignItems: "center",
                          borderRadius: 10,
                          // backgroundColor: isValid ? "#fdbe00" : "#ffd966",
                          backgroundColor: isValid ? colors.background : lightenHexColor(colors.background, 0.5),
                        }}
                        android_ripple={android_ripple}
                        // onPress={handleCreateGroup}
                        onPress={() => {
                          handleSubmit();
                        }}
                      >
                        <TabBarIcon
                          name="defaultGroupIcon"
                          size={30}
                          color="#FFFFFF"
                        />
                        <Text
                          style={{
                            fontFamily: "Dosis_600SemiBold",
                            fontSize: 18,
                            marginLeft: 10,
                            color: "#FFFFFF",
                          }}
                        >
                          Create group
                        </Text>
                      </Pressable>
                    </View>
                  )}
                </>
              )}
            </Formik>
          </View>
        </ScrollView>
        <BottomSheet
          ref={bottomSheetRefGroupIcon}
          index={-1}
          snapPoints={snapPointsGroupIcon}
          onChange={handleSheetChangesGroupIcon}
          enablePanDownToClose
          // enableDynamicSizing
          handleIndicatorStyle={{ width: 150, backgroundColor: "#e8e8e8" }}
          // style={{backgroundColor: '#e8e8e8'}}
          backgroundStyle={{ borderWidth: 2, borderColor: "#e8e8e8",  backgroundColor: !isDark ? "#FFFFFF" : "#343A46" }}
        >
          <BottomSheetView style={{  backgroundColor: !isDark ? "#FFFFFF" : "#343A46" }}>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              {/* {userData.GroupIconFilename === "default_profile_image" && ( */}
              <Pressable
                style={{
                  paddingHorizontal: 25,
                  paddingVertical: 15,
                  width: "100%",
                  flexDirection: "row",
                }}
                android_ripple={android_ripple}
                onPress={() => {
                  bottomSheetRefGroupIcon.current?.close();
                  pickImage();
                }}
              >
                <TabBarIcon name="imageOutline" size={25} color={colors.text} />
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: "Dosis_500Medium",
                    marginLeft: 10,
                    color: colors.text,
                  }}
                >
                  {selectedImage ? "Change group icon" : "Add a group icon"}
                </Text>
              </Pressable>
              {/* )} */}

              <View
                style={{ height: 1, backgroundColor: "#e8e8e8", width: "100%" }}
              />
              {/* <View
              style={{ height: 1, backgroundColor: "#e8e8e8", width: "100%" }}
            /> */}

              {selectedImage && (
                <Pressable
                  style={{
                    paddingHorizontal: 25,
                    paddingVertical: 15,
                    width: "100%",
                    flexDirection: "row",
                  }}
                  android_ripple={android_ripple}
                  onPress={() => {
                    bottomSheetRefGroupIcon.current?.close();
                    removeImage();
                  }}
                >
                  <TabBarIcon name="delete" size={25} color="#ff0026" />
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: "Dosis_500Medium",
                      color: "#ff0026",
                      marginLeft: 10,
                    }}
                  >
                    Remove icon
                  </Text>
                </Pressable>
              )}

              <View
                style={{ height: 1, backgroundColor: "#e8e8e8", width: "100%" }}
              />

              <Pressable
                style={{
                  paddingHorizontal: 25,
                  paddingVertical: 15,
                  width: "100%",
                  flexDirection: "row",
                }}
                android_ripple={android_ripple}
                onPress={() => {
                  bottomSheetRefGroupIcon.current?.close();
                }}
              >
                <TabBarIcon name="cancel" size={25} color={colors.text} />

                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: "Dosis_500Medium",
                    color: colors.text,
                    marginLeft: 10,
                  }}
                >
                  Cancel
                </Text>
              </Pressable>
            </View>
          </BottomSheetView>
        </BottomSheet>
        {/* <BottomSheet
          ref={bottomSheetRefSelectParticipants}
          index={-1}
          snapPoints={snapPointsSelectParticipants}
          onChange={handleSheetChangesSelectParticipants}
          enablePanDownToClose
          // enableDynamicSizing
          handleIndicatorStyle={{ width: 150, backgroundColor: "#e8e8e8" }}
          // style={{backgroundColor: '#e8e8e8'}}
          backgroundStyle={{ borderWidth: 2, borderColor: "#e8e8e8" }}
        >
          <BottomSheetView style={{ backgroundColor: "white" }}>
            <SelectUsersSearchComponent/>
          </BottomSheetView>
        </BottomSheet> */}
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  inputBar: {
    // paddingHorizontal: 12,
    // paddingVertical: 12,
    borderRadius: 10,
    // backgroundColor: "whitesmoke",
    // borderWidth: 2,
    borderColor: "whitesmoke",
    width: "80%",
    // color: "#193088",
    marginHorizontal: "auto",
    fontSize: 19,
    marginBottom: 10,
    // textAlign: "center",
    fontFamily: "Dosis_400Regular",
  },

  errorText: {
    color: "crimson",
    fontSize: 14,
    fontFamily: "Dosis_400Regular",
    marginBottom: 5,
  },
});
