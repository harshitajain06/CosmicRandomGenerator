// src/navigation/StackLayout.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import App from './index'; // Make sure the path is correct
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

export default function StackLayout() {
  const colorScheme = useColorScheme();

  return (

      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Home"
          component={App}
          options={{
            title: 'Home',
          }}
        />
      </Stack.Navigator>

  );
}
