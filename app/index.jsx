import { StyleSheet, Text, View, } from 'react-native'
import messaging from '@react-native-firebase/messaging';
import React, { useEffect } from 'react'

const HomeScreen = () => {

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  useEffect(() => {
    if (requestUserPermission()) {
      messaging().getToken().then((token) => {
        console.log(token);
      });
    } else {
      console.log('Failed token status: ', authStatus);
    }
  }, []);
  return (
    <View>
      <Text>Lerian</Text>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})