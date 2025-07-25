import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
        console.log('Expo Push Token:', token);
        // send this token to your backend
      }
    });

    // notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    //   console.log('📩 Notification received:', notification);
    //   // Update UI or trigger actions
    // });

    // responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    //   console.log('📬 User tapped on notification:', response);
    //   // Navigate or handle action
    // });

      const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('📩 Notification received:', notification);

      // setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('📬 User tapped on notification:', response);


      // My notification code starts from app.tsx so before navigating to a screen, check if the user is logged in or not

      console.log(response);
    });

    return () => {
      // notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
      // responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
       notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return expoPushToken;
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'A channel is needed for the permissions prompt to appear',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'longpop.wav',
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    // EAS projectId is used here.
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error('Project ID not found');
      }

      console.log(projectId)
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log('Expo notification Token: ' + token);
    } catch (e) {
      console.error('Error getting Expo push token:', e);
      token = `${e}`;
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}