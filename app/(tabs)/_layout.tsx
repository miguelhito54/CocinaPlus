import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { Colors } from '@/constants/Colors';

export default function TabLayout() {
  const colorScheme = useColorScheme() || 'light';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme]?.tint || Colors.light.tint,
        tabBarInactiveTintColor: '#bbb',
        headerShown: false,
        tabBarShowLabel: Platform.OS === 'web', 
        tabBarIconStyle: { marginBottom: -2 },
        tabBarStyle: {
          backgroundColor: Colors[colorScheme]?.background || '#FFF8F0',
          borderTopWidth: 0.5,
          borderTopColor: '#eee',
          ...Platform.select({
            ios: { position: 'absolute' },
            android: { elevation: 10 },
            web: {},
          }),
        },
      }}
    >
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
