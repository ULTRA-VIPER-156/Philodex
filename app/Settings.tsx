import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import GlassSurface from './GlassSurface';

export default function Settings() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const themeStyles = {
    safeArea: { backgroundColor: darkMode ? '#121212' : '#fff' },
    text: { color: darkMode ? '#fff' : '#333' },
    sectionTitle: { color: darkMode ? '#666' : '#aaa' },
    rowBorder: { borderBottomColor: darkMode ? '#333' : '#f0f0f0' },
    icon: darkMode ? '#fff' : '#333'
  };

  return (
    <SafeAreaView style={[styles.safeArea, themeStyles.safeArea]}>
      <ScrollView style={styles.container}>
        <Text style={[styles.title, themeStyles.text]}>Settings</Text>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, themeStyles.sectionTitle]}>Theme</Text>
          
          <View style={[styles.row, themeStyles.rowBorder]}>
            <View style={styles.rowLeft}>
              <Ionicons name="notifications-outline" size={22} color={themeStyles.icon} />
              <Text style={[styles.rowText, themeStyles.text]}>Notifications</Text>
            </View>
            <Switch 
              value={notifications} 
              onValueChange={setNotifications}
              trackColor={{ false: "#eee", true: "#A6D8FF" }}
            />
          </View>

          <View style={[styles.row, themeStyles.rowBorder]}>
            <View style={styles.rowLeft}>
              <Ionicons name="moon-outline" size={22} color={themeStyles.icon} />
              <Text style={[styles.rowText, themeStyles.text]}>Dark Mode</Text>
            </View>
            <Switch 
              value={darkMode} 
              onValueChange={setDarkMode}
              trackColor={{ false: "#eee", true: "#A6D8FF" }}
            />
          </View>
        </View>
        
        <View style={styles.section}>
              <View style={styles.center}>

              </View>
              </View>

        <View style={styles.section}>
              <View style={styles.center}>
                  <LottieView
                    source={require("../assets/undeConstruct.json")}
                    autoPlay
                    loop
                    style={styles.lottie}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                        color: themeStyles.text.color,
                        textAlign: "center",
                        paddingHorizontal: 20,
                    }}
                    
                  
                  >
                    Yeah Rome was not built in a day buddy bye
                    come back next month for more updates 
                  </Text>
                </View>
       </View>

       
        
              
      </ScrollView>

      <View style={styles.floatingGlassContainer}>
        <GlassSurface />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20 },
  title: { fontSize: 36, fontWeight: '900', marginVertical: 20, letterSpacing: -1.5 },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 14, fontWeight: '700', textTransform: 'uppercase', marginBottom: 15, letterSpacing: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowText: { fontSize: 16, fontWeight: '600', marginLeft: 15 },
  floatingGlassContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    zIndex: 999,
  },
     lottie: {
    top:0,
    width: 280,
    height: 280
  },
   center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent:'center'
  },
});