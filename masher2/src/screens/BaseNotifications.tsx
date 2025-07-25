import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, Platform, Text, Button } from "react-native";
import { FlashList } from "@shopify/flash-list";
import NotificationsCardElement from "../components/NotificationCardElement";
import NoNotifications from "../components/NoNotifications";
import { ActivityIndicator } from "react-native-paper";
import Notification from "../model/Notification";
import { axiosInstance } from "../utilities/axiosInstance";
import { useDispatch } from "react-redux";
import { hideTabBar, showTabBar } from "../uiSlice";
import { useAppTheme } from "../ThemeContext";



import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
      sound: 'longpop.wav',
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here', test: { test1: 'more data' } },
      sound: 'longpop.wav',
       attachments: [{
      url: 'http://192.168.128.127:5000/static/fallback-icons/profile.png',
     identifier: 'message-image',
        type: 'image'            // optional; can help some Android devices
    }], // Uncomment and use this line for iOS with correct structure
    // imageUrl: imageUrl, // fallback
    // ✅ Android uses imageUrl directly
  },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
        channelId: 'default', // ✅ Use the same ID here
    },
  });
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

export default function BaseNotifications({
  notifications,
  page,
  setPage,
}: {
  notifications: Notification[];
  page: number;
  setPage: (val: number) => void;
}) {

   const [expoPushToken, setExpoPushToken] = useState('');
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
    }
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  const dispatch = useDispatch();
  const {isDark, colors} = useAppTheme();
  // Hide bottom bar-
  useEffect(() => {
    dispatch(hideTabBar());

    return () => {
      dispatch(showTabBar()); // Show tab bar again on unmount
    };
  }, []);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

const cursor = useRef({
  before: new Date().toISOString(), // createdAt cursor
  lastId: null, // tie-breaker _id
});

const [hasMore, setHasMore] = useState(true);
// const [loadingNotifications, setLoadingNotifications] = useState(false);

const fetchUserNotifications = () => {
  if (!hasMore || loadingNotifications) return;

  setLoadingNotifications(true);

  const { before, lastId } = cursor.current;

  axiosInstance
    .get("/api/users/getUserNotifications", {
      params: {
        before,     // ISO timestamp string
        lastId,     // ObjectId string
      },
    })
    .then((response) => {
      const { notifications, nextCursor } = response.data;

      if (notifications && notifications.length > 0) {
        // Append notifications to state/store here if needed
        // setUserNotifications((prev) => [...prev, ...notifications]);

        // ✅ Update cursor
        if (nextCursor) {
          cursor.current = nextCursor;
        } else {
          setHasMore(false); // No more notifications
        }
      } else {
        setHasMore(false); // No results
      }

      setTimeout(() => {
        setLoadingNotifications(false);
        // setPage(page + 1); // Optional if you’re tracking pages
      }, 500);
    })
    .catch((error) => {
      console.error("Error fetching notifications:", error);
      setTimeout(() => setLoadingNotifications(false), 500);
    });
};


  const ListFooter = useMemo(
    () =>
      loadingNotifications ? (
        <ActivityIndicator
          style={{ margin: 15 }}
          size="small"
          color="#000000"
        />
      ) : null,
    [loadingNotifications]
  );

  const renderItem = useCallback(({ item }: { item: Notification }) => {
    return (
      <NotificationsCardElement
        notificationId={item.notificationId}
        type={item.type}
        createdAt={item.created_at}
        person={item.person}
        icon={item.icon}
        text={item.text}
        data={item.data}
        customStyle={{}}
      />
    );
  }, []);

  return (
    <View style={[styles.container, {backgroundColor: !isDark ?"white": '#343A46',}]}>


       <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
      <Text>Your expo push token: {expoPushToken}</Text>
      <Text>{`Channels: ${JSON.stringify(
        channels.map(c => c.id),
        null,
        2
      )}`}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
      />
    </View>

      {notifications.length !== 0 ? (
        <FlashList
          data={notifications}
          removeClippedSubviews={true}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}
          inverted={true}
          onEndReached={() => {
            if (!loadingNotifications) {
              setLoadingNotifications(true);
              fetchUserNotifications();
            }
          }}
          ListFooterComponent={ListFooter}
          onEndReachedThreshold={0.5}
          renderItem={renderItem}
          estimatedItemSize={40}
          keyExtractor={(item) => item.notificationId.toString()}
        />
      ) : (
        <NoNotifications />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});
