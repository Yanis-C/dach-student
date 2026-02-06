import { Stack } from "expo-router";
import { useFonts, Comfortaa_400Regular, Comfortaa_700Bold } from "@expo-google-fonts/comfortaa";
import { Colors } from "@/constants/Colors";
import * as SplashScreen from 'expo-splash-screen'
import { Suspense, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { fr, registerTranslation } from 'react-native-paper-dates';

import { SQLiteProvider, openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from '@/drizzle/migrations';
import { ActivityIndicator } from "react-native";

export const DATABASE_NAME = "dachDB";

registerTranslation('fr', fr);
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);
  const { success, error } = useMigrations(db, migrations);

  const [loadedFont, errorFont] = useFonts({
    Comfortaa_400Regular,
    Comfortaa_700Bold,
  });

  useEffect(() => {
    if (loadedFont || errorFont) {
      SplashScreen.hideAsync();
    }
  }, [loadedFont, errorFont]);

  if (!loadedFont && !errorFont)
    return null;

  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        options={{ enableChangeListener: true }}
        useSuspense
      >
        <SafeAreaProvider>
          <PaperProvider>
            <StatusBar style="light" translucent={false} backgroundColor={Colors.white} />
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" options={{ headerShown: false }} />
            </Stack>
          </PaperProvider>
        </SafeAreaProvider>
      </SQLiteProvider>
    </Suspense>

  );
}
