import { Stack } from "expo-router";
import BackgroundTaskHandler from "./BackgroundTaskHandler";

export default function RootLayout() {
  return (
    <>
    <BackgroundTaskHandler/>
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#00426D',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen name="index" options={{ headerTitle: 'Helpdesk ICT' }}/>
      <Stack.Screen name="details"/>
    </Stack>
    </>
  );
}