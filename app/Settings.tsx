import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { getThemeColors } from './Artifacts/Colors';
import { useTheme } from './ThemeContext';

export default function Settings() {
  const router = useRouter();
  const [notifications, setNotifications] = React.useState(true);
  const { isDark, setTheme } = useTheme();

  const themeColors = getThemeColors(isDark);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <ScrollView style={styles.container}>
        <Text style={[styles.title, { color: themeColors.textPrimary }]}>Settings</Text>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.textSecondary }]}>Theme</Text>
          
          <View style={[styles.row, { borderBottomColor: isDark ? '#333' : '#f0f0f0' }]}>
            <View style={styles.rowLeft}>
              <Ionicons name="notifications-outline" size={22} color={themeColors.textPrimary} />
              <Text style={[styles.rowText, { color: themeColors.textPrimary }]}>Notifications</Text>
            </View>
            <Switch 
              value={notifications} 
              onValueChange={setNotifications}
              trackColor={{ false: "#eee", true: "#A6D8FF" }}
              thumbColor={isDark ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={[styles.row, { borderBottomColor: isDark ? '#333' : '#f0f0f0' }]}>
            <View style={styles.rowLeft}>
              <Ionicons name="moon-outline" size={22} color={themeColors.textPrimary} />
              <Text style={[styles.rowText, { color: themeColors.textPrimary }]}>Dark Mode</Text>
            </View>
            <Switch 
              value={isDark} 
              onValueChange={setTheme}
              trackColor={{ false: "#eee", true: "#A6D8FF" }}
              thumbColor={isDark ? '#fff' : '#f4f3f4'}
            />
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
                color: themeColors.textSecondary,
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