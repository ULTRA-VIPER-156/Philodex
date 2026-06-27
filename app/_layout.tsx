import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import GlassSurface from "./GlassSurface";
import { ThemeProvider } from "./ThemeContext";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <View style={styles.shell}>
        <View style={styles.stackContainer}>
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
                sheetAllowedDetents: [0.8,1],
                sheetGrabberVisible: true,
                navigationBarHidden: true,
                sheetCornerRadius: 15,
                animation: "slide_from_bottom",
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
        </View>

        <View style={styles.bottomBarContainer}>
          <GlassSurface />
        </View>
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: '#fff',
  },
  stackContainer: {
    flex: 1,
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    zIndex: 999,
  },
});
