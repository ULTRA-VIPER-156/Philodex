import { Stack } from "expo-router";
import { Modal } from "react-native";

export default function RootLayout() {
  return <Stack >
    <Stack.Screen name="index"
    options={{
      title:"Home",
    headerShown:false,

      
    }}
    
    />
    <Stack.Screen name="PokemonDetails"
    options={{
      title:"Pokemon Details",
      presentation:"formSheet",
      sheetAllowedDetents:[0.7,1]
      ,sheetGrabberVisible:true,
      navigationBarHidden:false,
      sheetCornerRadius:20,
      animation:"fade",
      


      
      
    }}
    
    />
   
  </Stack>
}
