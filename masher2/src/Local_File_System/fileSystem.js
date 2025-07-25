// import * as FileSystem from "expo-file-system";

// import * as MediaLibrary from 'expo-media-library';

// const requestStoragePermission = async () => {
//   const { status } = await MediaLibrary.requestPermissionsAsync()
//   console.log(status)
//   if (status !== "granted") {
//     console.log("❌ Storage permission denied");
//     return false;
//   }
//   return true;
// };

// const APP_FOLDER = `${FileSystem.documentDirectory}Masher/`;

// const createAppFolder = async () => {

//   const hasPermission = await requestStoragePermission();
//   if (!hasPermission) return;


//   const dirInfo = await FileSystem.getInfoAsync(APP_FOLDER);

//   if (!dirInfo.exists) {
//     await FileSystem.makeDirectoryAsync(APP_FOLDER, { intermediates: true });
//     console.log("✅ Folder Created:", APP_FOLDER);
//   } else {
//     console.log("📂 Folder Already Exists:", APP_FOLDER);
//   }
// };

// const saveImageToFolder = async (imageUri, filename) => {
//   try {
//     await createAppFolder(); // Ensure folder exists

//     const newPath = `${APP_FOLDER}${filename}`;
//     await FileSystem.moveAsync({
//       from: imageUri,
//       to: newPath,
//     });

//     console.log("✅ Image saved at:", newPath);
//     return newPath;
//   } catch (error) {
//     console.error("❌ Error saving image:", error);
//   }
// };

// //   const imageUri = "file:///path-to-image/image.jpg"; // Example
// // saveImageToFolder(imageUri, "profile_picture.jpg");

// // To store profile image and chat users images-

// // Now i have to download image and add it to masher sqlite database-

// // Download and store image in app specific folder hidden-
// const downloadAndSaveImage = async (imageUrl, filename) => {
//   try {
    
//     await createAppFolder(); // Ensure folder exists

//     const fileUri = `${APP_FOLDER}${filename}`;

//     const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);

//     console.log("✅ Image downloaded and saved at:", uri);
//     return uri;
//   } catch (error) {
//     console.error("❌ Error downloading image:", error);
//   }
// };


// // Download and store image on publicly available folder to make sure that images appear in gallery-
// const GALLERY_FOLDER = `${FileSystem.externalStorageDirectory}Pictures/Masher/`;
// const downloadAndSaveImageGallery = async (imageUrl, filename) => {
//   try {

//     const hasPermission = await requestStoragePermission();
//     if (!hasPermission) return;

//     await FileSystem.makeDirectoryAsync(GALLERY_FOLDER, { intermediates: true });

//     const fileUri = `${GALLERY_FOLDER}${filename}`;

//     const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);

//     console.log("✅ Image saved in gallery:", uri);
//     return uri;
//   } catch (error) {
//     console.error("❌ Error downloading image:", error);
//   }
// };

// // const imageUrl = "https://example.com/path-to-image.jpg"; // Replace with your image URL
// // downloadAndSaveImage(imageUrl, "profile_picture.jpg");

// export { saveImageToFolder, downloadAndSaveImage, downloadAndSaveImageGallery };

// import * as FileSystem from "expo-file-system";
// import * as MediaLibrary from "expo-media-library";
// import { Platform } from "react-native";

// const APP_FOLDER = `${FileSystem.documentDirectory}Masher/`;
// const GALLERY_FOLDER = FileSystem.externalStorageDirectory
//   ? `${FileSystem.externalStorageDirectory}Pictures/Masher/`
//   : null;

// // ✅ Request storage permissions
// const requestStoragePermission = async () => {
//   const { status } = await MediaLibrary.requestPermissionsAsync();
//   if (status !== "granted") {
//     console.log("❌ Storage permission denied");
//     return false;
//   }
//   return true;
// };

// // ✅ Create a folder in app storage (hidden, private)
// const createAppFolder = async () => {
//   const dirInfo = await FileSystem.getInfoAsync(APP_FOLDER);
//   if (!dirInfo.exists) {
//     await FileSystem.makeDirectoryAsync(APP_FOLDER, { intermediates: true });
//     console.log("✅ App Folder Created:", APP_FOLDER);
//   }
// };

// // ✅ Save an image to app storage (hidden)
// const saveImageToFolder = async (imageUri, filename) => {
//   try {
//     await createAppFolder();
//     const newPath = `${APP_FOLDER}${filename}`;
//     await FileSystem.moveAsync({
//       from: imageUri,
//       to: newPath,
//     });
//     console.log("✅ Image saved at:", newPath);
//     return newPath;
//   } catch (error) {
//     console.error("❌ Error saving image:", error);
//   }
// };

// // ✅ Download and store image in private app folder
// const downloadAndSaveImage = async (imageUrl, filename) => {
//   try {
//     await createAppFolder();
//     const fileUri = `${APP_FOLDER}${filename}`;
//     const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);
//     console.log("✅ Image downloaded & saved at:", uri);
//     return uri;
//   } catch (error) {
//     console.error("❌ Error downloading image:", error);
//   }
// };

// // ✅ Download and store image in a public folder (Gallery)
// const downloadAndSaveImageGallery = async (imageUrl, filename) => {
//   try {
//     if (!GALLERY_FOLDER) {
//       console.log("❌ External storage is not available.");
//       return;
//     }

//     const hasPermission = await requestStoragePermission();
//     if (!hasPermission) return;

//     await FileSystem.makeDirectoryAsync(GALLERY_FOLDER, { intermediates: true });

//     const fileUri = `${GALLERY_FOLDER}${filename}`;
//     const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);

//     // ✅ Ensure the image appears in the gallery
//     if (Platform.OS === "android") {
//       await MediaLibrary.saveToLibraryAsync(uri);
//     }

//     console.log("✅ Image saved in gallery:", uri);
//     return uri;
//   } catch (error) {
//     console.error("❌ Error downloading image:", error);
//   }
// };

// // ✅ Exports
// export { saveImageToFolder, downloadAndSaveImage, downloadAndSaveImageGallery };

import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Platform } from "react-native";

const APP_FOLDER = `${FileSystem.documentDirectory}Masher/`;

// ✅ Request storage permission
const requestStoragePermission = async () => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== "granted") {
    console.log("❌ Storage permission denied");
    return false;
  }
  return true;
};

// ✅ Create a hidden folder in app storage (for private images)
const createAppFolder = async () => {
  const dirInfo = await FileSystem.getInfoAsync(APP_FOLDER);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(APP_FOLDER, { intermediates: true });
    console.log("✅ App Folder Created:", APP_FOLDER);
  }
};

// ✅ Save image to app storage (hidden)
const saveImageToFolder = async (imageUri, filename) => {
  try {
    await createAppFolder();
    const newPath = `${APP_FOLDER}${filename}`;
    await FileSystem.moveAsync({ from: imageUri, to: newPath });
    console.log("✅ Image saved at:", newPath);
    return newPath;
  } catch (error) {
    console.error("❌ Error saving image:", error);
  }
};

// ✅ Download and save image in a private folder (hidden)
const downloadAndSaveImage = async (imageUrl, filename) => {
  try {
    await createAppFolder();
    const fileUri = `${APP_FOLDER}${filename}`;
    const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);
    console.log("✅ Image downloaded & saved at:", uri);
    return uri;
  } catch (error) {
    console.error("❌ Error downloading image:", error);
  }
};

const checkIfImageExistsHidden = async (filename) => {
  const imagePath = `${APP_FOLDER}Masher/${filename}`;

  const fileInfo = await FileSystem.getInfoAsync(imagePath);

  if (fileInfo.exists) {
    console.log("✅ Image exists:", imagePath);
    return true;
  } else {
    console.log("❌ Image does not exist");
    return false;
  }
};

// ✅ Download image & save to gallery using MediaLibrary
const downloadAndSaveImageGallery = async (imageUrl, filename) => {
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) return;

    const fileUri = `${FileSystem.documentDirectory}${filename}`;
    const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);

    // ✅ Save image to gallery
    const asset = await MediaLibrary.createAssetAsync(uri);
    await MediaLibrary.createAlbumAsync("Masher", asset, false); // Creates "Masher" album

    console.log("✅ Image saved to gallery:", uri);
    return uri;
  } catch (error) {
    console.error("❌ Error saving image to gallery:", error);
  }
};

// ✅ Exports
export { saveImageToFolder, downloadAndSaveImage, checkIfImageExistsHidden, downloadAndSaveImageGallery };
