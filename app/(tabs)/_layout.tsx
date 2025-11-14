import Colors from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[theme].tertiaryLight,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: Colors[theme].primary,
          height: 70 + insets.bottom,
          paddingBottom: insets.bottom, 
          paddingTop: 10,
          borderTopWidth: 0,
        },
        headerStyle: {
          backgroundColor: Colors[theme].primary
        }
      }}>
      <Tabs.Screen
        name="museumlist"
        options={{
          title: 'Lista de Museus',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="list-alt" color={color} />,
        }}
      />
      <Tabs.Screen
        name="eventmap"
        options={{
          title: 'Mapa de Museus',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="map-marker" color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendarevents"
        options={{
          title: 'Calendário de Eventos',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="calendar" color={color} />,
        }}
      />
    </Tabs>
  );
}
