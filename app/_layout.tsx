import { Stack } from "expo-router";
import { useFonts, Comfortaa_400Regular, Comfortaa_700Bold } from "@expo-google-fonts/comfortaa";
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [loaded, error] = useFonts({
    Comfortaa_400Regular,
    Comfortaa_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error)
    return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
