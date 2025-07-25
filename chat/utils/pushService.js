const { Expo } = require("expo-server-sdk");
const { getExpoPushToken } = require("../../backend/utils/getExpoPushToken");
const { trimText } = require("./trimText");

const STATIC_IMAGE_PATH = process.env.STATIC_IMAGE_PATH;

// Create a new Expo SDK client
const expo = new Expo();

// Send push notification
// async function sendPushNotification(pushToken, userId,title, body, data = {}) {
async function sendPushNotification(userId, title, senderImageUrl, body, data = {}) {
  const pushToken = await getExpoPushToken(userId);
  // const pushToken = 'ExponentPushToken[ly0ZSLCTLPmG_viMQO77sn]'

  // console.log('Sending push notification')

  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
    return;
  }
  
  let bigPictureUrl = senderImageUrl !== 'default_profile_image' ? `${STATIC_IMAGE_PATH}/static/profile_images/${senderImageUrl}`: `${STATIC_IMAGE_PATH}/static/fallback-icons/profile.png`

  console.log(bigPictureUrl)

  const message = {
    to: pushToken,
    sound: "longpop.wav",
    title,
    body: trimText(body),
    data,
     richContent: {
      // type: 'bigpicture',
      image: bigPictureUrl
    },
    imageUrl: bigPictureUrl, // fallback
  };

  try {
    const result = await expo.sendPushNotificationsAsync([message]);
    console.log("✅ Push Notification sent:", result);
  } catch (error) {
    console.error("❌ Error sending push notification:", error);
  }
}

// Send push notification to multiple users for groups-
async function sendPushNotificationsToMultipleUsers(userIds, title, groupIconUrl, body, data = {}) {
  const messages = [];

  let bigPictureUrl =
    groupIconUrl === "default_group_icon"
      ? `${STATIC_IMAGE_PATH}/static/group_icons/${groupIconUrl}`
      : `${STATIC_IMAGE_PATH}/static/fallback-icons/group.png`;

  for (const userId of userIds) {
    const pushToken = await getExpoPushToken(userId);

    if (!pushToken || !Expo.isExpoPushToken(pushToken)) {
      console.warn(`⚠️ Skipping user ${userId}: Invalid or missing push token`, pushToken);
      continue;
    }

    const message = {
      to: pushToken,
      sound: "longpop.wav",
      title,
      body: trimText(body),
      data,
      richContent: {
        image: bigPictureUrl,
      },
      imageUrl: bigPictureUrl, // fallback
    };

    messages.push(message);
  }

  if (messages.length === 0) {
    console.warn("🚫 No valid push tokens to send notifications.");
    return;
  }

  try {
    const result = await expo.sendPushNotificationsAsync(messages);
    console.log("✅ Push notifications sent:", result);
  } catch (error) {
    console.error("❌ Error sending push notifications:", error);
  }
}

module.exports = { sendPushNotification, sendPushNotificationsToMultipleUsers };
