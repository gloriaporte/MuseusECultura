import Header from '@/components/Header';
import { ThemeProvider } from '@/contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const hasSeen = await AsyncStorage.getItem('hasSeenOnboarding');
        setInitialRoute(hasSeen ? '(tabs)' : 'index');
      } catch (e) {
        console.log('Erro ao verificar onboarding:', e);
        setInitialRoute('index');
      }
    };

    checkOnboarding();
  }, []);

  if (!initialRoute) {
    return null;
  }

  return (
    <ThemeProvider>
      <Stack initialRouteName={initialRoute}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)"
          options={{
            header: () => <Header />,
          }}  />
        <Stack.Screen name="museumdetail" 
          options={{
            header: () => <Header />,
          }}  />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
