import { Stack } from "expo-router";
import HomeScreen from ".";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen name="index"/>
      <Stack.Screen name="details"/>
    </Stack>
  );
}