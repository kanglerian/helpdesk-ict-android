import { StyleSheet, Text, View, Button, Platform } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'expo-router'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'
import { io } from 'socket.io-client'

Notifications.setNotificationHandler({
  handleNotification: async() => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  }),
});

const HomeScreen = () => {
  const [expoPushToken, setExpoPushToken] = useState();
  const [status, setStatus] = useState('Loading...');
  const [channels, setChannels] = useState([]);
  const [notification, setNotification] = useState(undefined);

  const notificationListener = useRef();
  const responseListener = useRef();

  const socket = io("https://api.politekniklp3i-tasikmalaya.ac.id");

  socket.on("connect", () => {
    setStatus('Berhasil terhubung ke server Socket.IO');
  });

  socket.on("connect_error", () => {
    setStatus('Koneksi ke server Socket.IO terputus. Pesan tidak terkirim. Coba lagi nanti.');
  });

  socket.on('help', async (help) => {
    await schedulePushNotification(help);
    console.log(help);
  });

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));
    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
    }
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  return (
    <View>
      <Text>{status}</Text>
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
  )
}

async function schedulePushNotification(help) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Helpdesk ICT! 📬`,
      body: `${help.room}: ${help.message}`,
      data: help,
    },
    trigger: null,
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
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
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error('Project ID not found');
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

export default HomeScreen

const styles = StyleSheet.create({})