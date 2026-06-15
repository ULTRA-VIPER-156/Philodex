import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <Stack>
      <Stack.Screen 
        name="index"
        options={{
          title: "index",
          headerShown: false,
          navigationBarHidden: true,
        }}
      />
      <Stack.Screen 
        name="PokemonDetails"
        options={{
          title: "Pokemon Details",
          presentation: "formSheet",
          sheetAllowedDetents: [0.6, 1],
          sheetGrabberVisible: true,
          headerShown: false,
          navigationBarHidden: false,
          sheetCornerRadius: 20,
          animation: "fade",
        }}
      />
      <Stack.Screen 
        name="favourites"
        options={{
          title: "Favourites",
          headerShown: false,
          sheetAllowedDetents: [0.6, 1],
          sheetGrabberVisible: true,
        }}
      />
      <Stack.Screen 
        name="Settings"
        options={{
          title: "Settings",
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
