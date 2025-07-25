import { BackHandler, Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Button, Dialog, Portal, Surface, TextInput } from "react-native-paper";
import { axiosInstance } from "../utilities/axiosInstance";

import * as ImagePicker from "expo-image-picker";
import TabBarIcon from "../components/TabBarIcon";
import CustomButton from "../components/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { selectUserData, setUserData } from "../userDataSlice";
import addPathToProfileImages from "../utilities/addPathToProfileImages";
import {
  checkIfImageExistsHidden,
  downloadAndSaveImage,
} from "../Local_File_System/fileSystem";
import upsertMyUserData from "../database/upsertUser";

import * as ImageManipulator from "expo-image-manipulator";
import { getMimeTypeFromUri } from "../utilities/getMimeTypeFromUri";
import { format, set } from "date-fns";
import Toast from "react-native-toast-message";
import { Formik } from "formik";
import * as Yup from "yup";
import { useAppTheme } from "../ThemeContext";

// let API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function EditProfile() {
  const dispatch = useDispatch();

  const { colors, isDark } = useAppTheme();

    const android_ripple = {
    color: !isDark ? "whitesmoke": "#282C35",
  };

  // console.log(API_URL)
  const [fullName, setFullName] = useState("");
  const [userDescription, setUserDescription] = useState("");
  // const [visibleSnackBar, setVisibleSnackBar] = useState<boolean>(false);
  // const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  // const [email, setEmail] = useState("");
  const [bottomSheetIndex, setBottomSheetIndex] = useState<number>(-1);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const userData = useSelector(selectUserData);
  // console.log(API_URL + '/MasherStorage/profile_images/' + userData.profileImgFilename)
  // http://localhost:5000/static/profile_images/masherProfileImg-1733121399208-984054749.jpg

  // console.log('User data :' + userData.fullName);

  // Set data-
  useEffect(() => {
    if (userData !== null && userData !== undefined) {
      console.log("User data: ", userData);
      // console.log(userData.joined);
      // setFullName(userData.full_name);
      setFullName(userData.fullName);
      setUserDescription(userData.userDescription ?? "");
      // setUserDescription(userData.user_description ?? "");
    }
  }, [userData]);

  // Load user data-
  const loadUserData = () => {
    axiosInstance
      .get("/api/users/getUserData", {
        withCredentials: true,
      })
      .then((response) => {
        console.log("My data: ");
        console.log(response.data);

        const userObject = {
          id: response.data._id,
          fullName: response.data.full_name,
          userEmail: response.data.user_email,
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

  // useEffect(()=>{
  //   loadUserData()

  // }, )

  // Update user details-
  // const updateUserDetails = () => {
  const updateUserDetails = async (
    values: { fullName: string; userDescription: string },
    { setSubmitting }: any
  ) => {
    console.log("Updating user details");
    axiosInstance
      .post(
        "/api/users/updateUserDetails",
        {
          full_name: values.fullName,
          user_description: values.userDescription,
          // more details like - gender, country, address, dob etc
        },
        { withCredentials: true }
      )
      .then((response) => {
        // console.log(response.data);
        if (response.data === "details_updated_successfully") {
          // dispatch(setUserData(response.data));
          loadUserData();

          // setSnackbarMessage("Details updated successfully!");
          // setVisibleSnackBar(true);

          Toast.show({
            type: "success",
            text1: "Updated details!",
            text2: "Updated your details ✏️",
            visibilityTime: 2000,
          });
        } else {
          // setSnackbarMessage("Details not updated. Try again!");
          // setVisibleSnackBar(true);
          Toast.show({
            type: "error",
            text1: "Error occurred!",
            text2: "Details not updated. Try again later ✏️",
            visibilityTime: 2000,
          });
        }
      })
      .catch((error) => {
        console.log("Error" + error);

        // setSnackbarMessage("Details not updated. Try again!");
        // setVisibleSnackBar(true);
        Toast.show({
          type: "error",
          text1: "Error occurred!",
          text2: "Details not updated. Try again later ✏️",
          visibilityTime: 2000,
        });
      });
  };

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);

    setBottomSheetIndex(index);
  }, []);

  const handleOpenPress = () => {
    // console.log("hi");
    // bottomSheetRef.current?.expand(); // Open the bottom sheet

    if (bottomSheetIndex === -1) {
      bottomSheetRef.current?.expand(); // Open the bottom sheet
    } else {
      bottomSheetRef.current?.close(); // Close the bottom sheet
    }
  };

  // const snapPoints = ['25%', '50%', '100%'];
  // const snapPoints = [200, "30%"];
  const snapPoints = [150];

  //
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showSelectedImage, setShowSelectedImage] = useState<boolean>(false);

  const initialValues = useMemo(
    () => ({
      fullName: fullName ?? "",
      userDescription: userDescription ?? "",
    }),
    [fullName, userDescription]
  );

  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
      .min(5, "Full name must be at least 5 characters")
      .required("Please enter your full name"),
    userDescription: Yup.string().max(
      200,
      "Description must be at most 200 characters"
    ),
  });

  const hideDialog = () => {
    console.log("Cancelling uploading profile image");
    setSelectedImage(null);
    setShowSelectedImage(false);
  };

  // const createFormData = (uri: string) => {
  //   const fileName = uri.split("/").pop();
  //   const formData = new FormData();
  //   const mimeType = getMimeTypeFromUri(uri);

  //   // console.log(mimeType);

  //   const file = {
  //     name: fileName,
  //     uri,
  //     // type: "image/jpeg", // or the appropriate type based on the image
  //     type: mimeType, // or the appropriate type based on the image
  //   };

  //   formData.append("fileData", file as any); // Use 'as any' if TypeScript complains
  //   // formData.append('fileData', {
  //   //   name: fileName,
  //   //   uri,
  //   //   type: 'image/jpeg', // or the appropriate type based on the image
  //   // });
  //   return formData;
  // };

  // const uploadProImage = async (uri: string) => {
  // const uploadProImage = async () => {
  //   // const formData = createFormData(uri);

  //   console.log("Uploading profile image");
  //   if (selectedImage) {
  //     // console.log(selectedImage);
  //     // Check if selectedImage is not null

  //     try {
  //       const formData = createFormData(selectedImage);

  //       const response = await axiosInstance.post(
  //         "/api/users/uploadProfileImage",
  //         formData,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //           },
  //         }
  //       );

  //       // console.log(response.data);

  //       hideDialog(); // Hide the dialog after successful upload
  //       if (response.data.message === "uploaded") {
  //         console.log("Upload successful:", response.data);

  //         loadUserData();

  //         // setSnackbarMessage("Profile image added successfully!");
  //         // setVisibleSnackBar(true);
  //         Toast.show({
  //           type: "success",
  //           text1: "Added profile image!",
  //           text2: "Profile image added successfully! 👤",
  //           visibilityTime: 2000,
  //         });
  //       } else {
  //         // setSnackbarMessage("Upload failed. Please try again!");
  //         // setVisibleSnackBar(true);
  //         Toast.show({
  //           type: "error",
  //           text1: "Error occurred!",
  //           text2: "Upload failed. Please try again! 👤",
  //           visibilityTime: 2000,
  //         });
  //       }
  //     } catch (error) {
  //       console.error("Upload failed:", error);
  //       // alert("Upload failed. Please try again.");
  //       hideDialog(); // Hide the dialog even if upload fails
  //       // setSnackbarMessage("Upload failed. Please try again!");
  //       // setVisibleSnackBar(true);
  //       Toast.show({
  //         type: "error",
  //         text1: "Error occurred!",
  //         text2: "Upload failed. Please try again! 👤",
  //         visibilityTime: 2000,
  //       });
  //     }
  //   } else {
  //     console.error("No image selected to upload.");
  //   }
  // };

  const uploadProImageToS3 = async () => {
    // const formData = createFormData(uri);

    if (!selectedImage) return;

    console.log("Uploading profile image to s3");
    // console.log(selectedImage);

    try {
      const fileType = getMimeTypeFromUri(selectedImage);

      //  const response = await axiosInstance.post("/api/upload/getSignedUrlForProfileImage", {
      const { data } = await axiosInstance.post(
        "/api/uploads/getProfileImagePresignedUploadUrl",
        {
          fileType: fileType,
        }
      );

      const blob = await (await fetch(selectedImage)).blob();

      console.log(blob)

      // 2. Upload image to S3
      await fetch(data.signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": fileType,
        },
        body: blob,
      });

      // 3. Send image key to backend for database update
      const savedProfileImgToUser = await axiosInstance.post(
        "/api/uploads/saveProfileImageKey",
        {
          imageKey: data.key,
        }
      );

      // console.log(response.data);

      hideDialog(); // Hide the dialog after successful upload
      if (savedProfileImgToUser.data.message === "uploaded") {
        console.log("Upload successful:", savedProfileImgToUser.data);

        loadUserData();

        // setSnackbarMessage("Profile image added successfully!");
        // setVisibleSnackBar(true);
        Toast.show({
          type: "success",
          text1: "Added profile image!",
          text2: "Profile image added successfully! 👤",
          visibilityTime: 2000,
        });
      } else {
        // setSnackbarMessage("Upload failed. Please try again!");
        // setVisibleSnackBar(true);
        Toast.show({
          type: "error",
          text1: "Error occurred!",
          text2: "Upload failed. Please try again! 👤",
          visibilityTime: 2000,
        });
      }
    } catch (error) {
      console.error("Upload failed:", error);
      // alert("Upload failed. Please try again.");
      hideDialog(); // Hide the dialog even if upload fails
      // setSnackbarMessage("Upload failed. Please try again!");
      // setVisibleSnackBar(true);
      Toast.show({
        type: "error",
        text1: "Error occurred!",
        text2: "Upload failed. Please try again! 👤",
        visibilityTime: 2000,
      });
    }
  };

    const removeProImageS3 = () => {
    console.log("Removing profile image");

    try {
      axiosInstance
        .post("/api/uploads/deleteProfileImageFromS3", { withCredentials: true })

        .then((response) => {
          // console.log(response.data);
          if (response.data.message === "deleted_profile_image_successfully") {
            loadUserData();

            // setSnackbarMessage("Profile image removed successfully!");
            // setVisibleSnackBar(true);

            Toast.show({
              type: "success",
              text1: "Removed profile image!",
              text2: "Profile image removed successfully! 👤",
              visibilityTime: 2000,
            });

            console.log("Deleted profile image successfully");
          } else {
            // setSnackbarMessage("Profile image not removed. Please try again!");
            // setVisibleSnackBar(true);
            Toast.show({
              type: "error",
              text1: "Error occurred!",
              text2: "Profile image not removed. Please try again! 👤",
              visibilityTime: 2000,
            });
          }
        });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error occurred!",
        text2: "Profile image not removed. Please try again! 👤",
        visibilityTime: 2000,
      });
      console.error("Remove failed:", error);
      // alert("Upload failed. Please try again.");
      // setSnackbarMessage("Profile image not removed. Please try again!");
      // setVisibleSnackBar(true);
    }
  };

  // const removeProImage = () => {
  //   console.log("Removing profile image");

  //   try {
  //     axiosInstance
  //       .post("/api/users/removeProfileImage", { withCredentials: true })

  //       .then((response) => {
  //         // console.log(response.data);
  //         if (response.data === "deleted_profile_image_successfully") {
  //           loadUserData();

  //           // setSnackbarMessage("Profile image removed successfully!");
  //           // setVisibleSnackBar(true);

  //           Toast.show({
  //             type: "success",
  //             text1: "Removed profile image!",
  //             text2: "Profile image removed successfully! 👤",
  //             visibilityTime: 2000,
  //           });

  //           console.log("Deleted profile image successfully");
  //         } else {
  //           // setSnackbarMessage("Profile image not removed. Please try again!");
  //           // setVisibleSnackBar(true);
  //           Toast.show({
  //             type: "error",
  //             text1: "Error occurred!",
  //             text2: "Profile image not removed. Please try again! 👤",
  //             visibilityTime: 2000,
  //           });
  //         }
  //       });
  //   } catch (error) {
  //     Toast.show({
  //       type: "error",
  //       text1: "Error occurred!",
  //       text2: "Profile image not removed. Please try again! 👤",
  //       visibilityTime: 2000,
  //     });
  //     console.error("Remove failed:", error);
  //     // alert("Upload failed. Please try again.");
  //     // setSnackbarMessage("Profile image not removed. Please try again!");
  //     // setVisibleSnackBar(true);
  //   }
  // };

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

  const handleHideBottomSheet = () => {
    if (bottomSheetIndex === 1) {
      // If the menu is visible, hide it and prevent the default back action
      // setBottomSheetIndex(-1);
      bottomSheetRef.current?.close();
      return true; // Prevent the default back action
    }
    return false; // Allow the default back action if the menu is not visible
  };

  // const onDismissSnackBar = () => {
  //   setVisibleSnackBar(false);
  // };

  // Handle back functionality by using removing any state from here and chat conversations pages and use redux store for global states and use useEffect and pass both dependencies of isConvMenuVisible and isMessMenuVisible.
  useEffect(() => {
    // Add event listener for back button
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleHideBottomSheet
    );

    // Cleanup the event listener on component unmount
    return () => backHandler.remove();
  }, [bottomSheetIndex]);

  return (
    <GestureHandlerRootView style={[styles.container, {backgroundColor: !isDark ? "#FFFFFF": "#343A46"}]}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginVertical: 10,
        }}
      >
        {/* <Surface
          style={{
            width: 100,
            height: 100,
            justifyContent: "center",
            alignItems: "center",
            margin: 5,
            borderRadius: 100,
            backgroundColor: "white",
            overflow: "hidden",
            position: "relative", // Allows for positioning the camera icon
          }}
        > */}
        <View
          style={{
            // iOS shadow
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            // Android shadow
            elevation: 5,

            width: 100,
            height: 100,
            justifyContent: "center",
            alignItems: "center",
            margin: 5,
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
            android_ripple={android_ripple}
            onPress={handleOpenPress}
          >
            {/* {userData.profileImgFilename ? ( */}
            {userData.profileImgFilename !== "default_profile_image" ? (
              // <Image
              //   source={require("../assets/pexels-prateekkatyal-7389639.jpg")} // Your image source
              //   style={{ width: 100, height: 100, borderRadius: 100 }} // Centered image
              // />
              <Image
                // source={{ uri: API_URL + '/static/profile_images/' + userData.profileImgFilename }}
                source={{
                  uri: addPathToProfileImages(userData.profileImgFilename),
                }}
                placeholder={require("../../assets/icons/skeletonLoadingPlaceholder.gif")}
                placeholderContentFit="cover"
                contentFit="cover"
                style={{ width: 100, height: 100 }} // Centered image
              />
            ) : (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: 100,
                  height: 100,
                }}
              >
                <TabBarIcon
                  name="defaultProfileIcon"
                  size={100}
                  color="#fdbe00"
                />
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
                padding: 5, // Optional: padding around the icon
              }}
            >
              <TabBarIcon
                name="uploadProfileIcon" // Replace with your camera icon name
                size={20}
                color="#000000"
              />
            </View>
          </Pressable>
        </View>
      </View>

      {/* <Surface
        style={{
          borderRadius: 10,
          width: "95%",
          marginVertical: 15,
          backgroundColor: "#FFFFFF",
          padding: 10,
        }}
      > */}
      <View
        style={{
          // iOS shadow
          // shadowColor: "#000",
          // shadowOffset: { width: 0, height: 4 },
          // shadowOpacity: 0.1,
          // shadowRadius: 6,
          // Android shadow
          // elevation: 5,

          borderRadius: 10,
          width: "95%",
          marginVertical: 15,
          // backgroundColor: "#FFFFFF",
          // backgroundColor: !isDark ? "#FFFFFF": '#282C35',
          padding: 10,
        }}
      >
        <View style={{ alignItems: "center" }}>
          {/* {typeof userData.joined === "string" &&
            userData.joined.trim() !== "" && ( */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 10,
            }}
          >
            {/* <TabBarIcon name="date" size={20} color="#193088" /> */}
            <TabBarIcon name="date" size={20} color={colors.text} />
            <Text
              style={{
                fontFamily: "Dosis_600SemiBold",
                fontSize: 17,
                marginLeft: 5,
                color: colors.text,
              }}
            >
              {/* Joined on {format(userData.joined, "dd MMM yyyy")} */}
              Joined on {userData?.joined}
            </Text>
          </View>
          {/* )} */}

          <Formik
            // initialValues={{
            //   groupName: groupName || "",
            //   adminsApproveMembers: adminsApproveMembers ?? true,
            //   editPermissionsMembers: editPermissionsMembers ?? false,
            // }}
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={updateUserDetails}
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
              setFieldValue,
              // }) => (
            }) => {
              // Compare against original values from route.params
              const hasChanges =
                // values.fullName !== (fullName ?? "") ||
                // values.fullName.trim() !== fullName.trim();
                values.fullName?.trim() !== fullName?.trim() ||
                values.userDescription?.trim() !== userDescription?.trim();
              console.log("hasChanges", hasChanges);

              // console.log("Formik values:", values);
              return (
                <>
                  <TextInput
                    style={[styles.inputBar, {backgroundColor: !isDark ? "whitesmoke" : "#444E60"}]}
                    underlineStyle={{ display: "none" }}
                    // value={fullName}
                    value={values.fullName}
                    // onChangeText={(text) => setFullName(text)}
                    onChangeText={handleChange("fullName")}
                    onBlur={handleBlur("fullName")}

                    label={
                      <Text
                        style={{
                          // color: "gray",
                          textAlign: "center",
                          color: isDark ? 'white' : 'gray'
          // backgroundColor: 'tranparent',

                        }}
                      >
                        Your name...
                      </Text>
                    }
                    // placeholderTextColor={"gainsboro"}
                    outlineStyle={{
                      borderWidth: 0,
                      // borderTopRightRadius: 0,
                      // borderBottomRightRadius: 0,
                      borderRadius: 15,

                      margin: 0,
                      padding: 0,
                    }}
                    mode="outlined"
                    // cursorColor="royalblue"
                    cursorColor="#000000"

                  />

                  {touched.fullName && errors.fullName && (
                    <Text style={{ color: "red" }}>{errors.fullName}</Text>
                  )}
                  <TextInput
                    multiline
                    numberOfLines={4}
                  style={[styles.inputBar, {backgroundColor: !isDark ? "whitesmoke" : "#444E60"}]}
                    underlineStyle={{ display: "none" }}
                    value={values.userDescription}
                    // onChangeText={setLoginEmail}
                    onChangeText={handleChange("userDescription")}
                    onBlur={handleBlur("userDescription")}
                    label={
                      <Text
                        style={{
                          // color: "gray",
                          // color: "#193088",
                          textAlign: "center",
                          fontFamily: "Dosis_400Regular",
                          color: isDark ? 'white' : 'gray'}}
                      >
                        Write something about yourself...
                      </Text>
                    }
                    // placeholderTextColor={"gainsboro"}
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
                    // contentStyle={{
                    //   fontFamily: "Dosis_400Regular",
                    //   color: "#000000",
                    // }}
                  />
                  {touched.userDescription && errors.userDescription && (
                    <Text style={{ color: "red" }}>
                      {errors.userDescription}
                    </Text>
                  )}
                  <CustomButton
                    name="Save"
                    bgColor="#193088"
                    borRadius={10}
                    pressedColor="#142666"
                    onClick={() => {
                      handleSubmit();
                    }}
                    customStyle={{
                      backgroundColor:
                        isValid && hasChanges ? "#193088" : "#e8e8e8",
                    }}
                    // disabled={false}
                    disabled={!isValid || !hasChanges}
                  />
                </>
              );
            }}
          </Formik>
        </View>
      </View>

      {/* Snackbar- */}
      {/* <Snackbar
        style={{ backgroundColor: "#FFFFFF" }}
        visible={visibleSnackBar}
        onDismiss={onDismissSnackBar}
        action={{
          // label: "X",
          label: "✖",
          labelStyle: { color: "#000000" },
          onPress: () => {
            // Do something
            onDismissSnackBar();
          },
        }}
      >
        <Text>{snackbarMessage}</Text>
      </Snackbar> */}

      {/* Profile image upload portal */}
      <Portal>
        <Dialog
          visible={showSelectedImage}
          onDismiss={hideDialog}
          style={{ backgroundColor: "white", borderRadius: 20 }}
        >
          {selectedImage && (
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Image
                source={{ uri: selectedImage }}
                style={{ width: 200, height: 200, borderRadius: 200 }}
                placeholder={require("../../assets/icons/skeletonLoadingPlaceholder.gif")}
                placeholderContentFit="cover"
                contentFit="cover"
              />
            </View>
          )}

          <Dialog.Title style={{ textAlign: "center" }}>
            <Text
              style={{
                fontFamily: "Dosis_700Bold",
                // color: "#FFFFFF",
                textAlign: "center",
                // backgroundColor: "#007bff",
              }}
            >
              Upload Profile photo
            </Text>
          </Dialog.Title>
          <Dialog.Content>
            <Text
              style={{
                fontFamily: "Dosis_400Regular",
                // color: "#FFFFFF",
                textAlign: "center",
                fontSize: 17,
              }}
            >
              Are you sure!.
            </Text>
            <Text
              style={{
                fontFamily: "Dosis_400Regular",
                // color: "#FFFFFF",
                textAlign: "center",
                fontSize: 17,
              }}
            >
              You are going to upload profile photo...
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              style={{ backgroundColor: "white", borderRadius: 10 }}
              onPress={hideDialog}
            >
              <Text style={{ color: "#000000", fontFamily: "Dosis_700Bold" }}>
                Cancel
              </Text>
            </Button>
            <Button
              style={{ backgroundColor: "#007bff", borderRadius: 10 }}
              // onPress={uploadProImage}
              onPress={uploadProImageToS3}
            >
              <Text style={{ fontFamily: "Dosis_700Bold", color: "#FFFFFF" }}>
                Upload
              </Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose
        // enableDynamicSizing
        handleIndicatorStyle={{ width: 150, backgroundColor: "#e8e8e8" }}
        // style={{backgroundColor: '#e8e8e8'}}
        backgroundStyle={{ borderWidth: 2, borderColor: "#e8e8e8", backgroundColor: !isDark ? "#FFFFFF" : "#343A46" }}
      >
        <BottomSheetView style={{backgroundColor: !isDark ? "#FFFFFF" : "#343A46"}}>
          <View style={{ justifyContent: "center", alignItems: "center", }}>
            {/* {userData.profileImgFilename !== "default_profile_image" && ( */}
            <Pressable
              style={{
                paddingHorizontal: 25,
                paddingVertical: 15,
                width: "100%",
                flexDirection: "row",
              }}
              android_ripple={android_ripple}
              onPress={() => {
                bottomSheetRef.current?.close();
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
                {userData.profileImgFilename !== "default_profile_image"
                  ? "Change profile photo"
                  : "Add a profile photo"}
              </Text>
            </Pressable>
            {/* )} */}

            <View
              style={{ height: 1, backgroundColor: "#e8e8e8", width: "100%" }}
            />

            {userData.profileImgFilename !== "default_profile_image" && (
              <Pressable
                style={{
                  paddingHorizontal: 25,
                  paddingVertical: 15,
                  width: "100%",
                  flexDirection: "row",
                }}
                android_ripple={android_ripple}
                onPress={() => {
                  bottomSheetRef.current?.close();
                  // removeProImage();
                  removeProImageS3()
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
                  Remove current photo
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
                bottomSheetRef.current?.close();
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
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  inputBar: {
    // backgroundColor: "whitesmoke",
    borderRadius: 15,
    width: "98%",
    color: "#193088",
    fontSize: 16,
    marginBottom: 5,
    marginTop: 5,
    fontFamily: "Dosis_500Medium",
  },
});
