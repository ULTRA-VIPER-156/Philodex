import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React from 'react';
import { Animated, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Switch, Text, Vibration, View } from 'react-native';
import { G, Path, Rect, Svg } from 'react-native-svg';
import { getThemeColors } from './Artifacts/Colors';
import { useTheme } from './ThemeContext';
export default function Settings() {
  const router = useRouter();
  const [notifications, setNotifications] = React.useState(true);
  const { isDark, setTheme } = useTheme();
  const themeColors = getThemeColors(isDark);
  const vibrationDuration = 30; // This will act as vibration strength which we can change and modify in settings 
  const [selectedVibration, setSelectedVibration] = React.useState('light')
  const vibrationColors = {
    mute: 'rgba(255, 207, 129, 0.4)',
    light: 'rgba(21, 255, 0, 0.37)',
    medium: 'rgba(42, 120, 255, 0.4)',
    heavy: 'rgba(224, 0, 0, 0.46)',
  };
  const muteShake = React.useRef(new Animated.Value(0)).current;
  const lightShake = React.useRef(new Animated.Value(0)).current;
  const mediumShake = React.useRef(new Animated.Value(0)).current;
  const heavyShake = React.useRef(new Animated.Value(0)).current;
    //@ts-ignore

    //this will shake the icons we have on our vibration blocks 
  const runShake = (shakeValue) => {
    shakeValue.setValue(0);
    Animated.sequence([
      //the sequence is basically how we want the object to move 1 in the axis 

      Animated.timing(shakeValue, { toValue: 1, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeValue, { toValue: -1, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeValue, { toValue: 1, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeValue, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };
    //@ts-ignore

  const shakeStyle = (shakeValue) => ({
    transform: [
      {
        //yeah the rest of this was from some repo im still not 100% sure how it works tbh 
        rotate: shakeValue.interpolate({
          inputRange: [-1, 1],
          outputRange: ['-8deg', '8deg'],
        }),
      },
    ],
  });
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <ScrollView style={styles.container}>
        <Text style={[styles.title, { color: themeColors.textPrimary }]}>Settings</Text>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.textSecondary }]}>Theme</Text>
          
          <View style={[styles.row, { borderBottomColor: isDark ? '#333' : '#f0f0f0' }]}>
            <View style={styles.rowLeft}>
              <Ionicons name="notifications-outline" size={22} color={themeColors.textPrimary} />
              <Text style={[styles.rowText, { color: themeColors.textPrimary }]}>System Sounds</Text>
            </View>
            <Switch 
              value={notifications} 
              trackColor={{ false: "#090101", true: "#e00000" }}
              thumbColor={isDark ? '#fff' : '#f4f3f4'}
              onValueChange={() => {
                setNotifications(!notifications);
                Vibration.vibrate(30);
              }
            }
                
            />
          
          </View>
          <View style={[styles.row, { borderBottomColor: isDark ? '#333' : '#f0f0f0' }]}>
            <View style={styles.rowLeft}>
              <Ionicons name="moon-outline" size={22} color={themeColors.textPrimary} />
              <Text style={[styles.rowText, { color: themeColors.textPrimary }]}>Dark Mode</Text>
            </View>
            <Switch 
              value={isDark} 
              trackColor={{ false: "#090101", true: "#e00000" }}
              thumbColor={isDark ? '#fff' : '#f4f3f4'}
              onValueChange={() => {
                setTheme(!isDark);
                Vibration.vibrate(30);
              }
              }
            />
          </View>
          
        </View>
        <View style={styles.section}>
          <Text
          style={[styles.sectionTitle, { color: themeColors.textSecondary }]}>
            Vibration Strength
          </Text>
             <View style={styles.container1}>
                          <Pressable
                  onPress={() => {
                    if (Platform.OS === "android") {
                      Vibration.vibrate(2);
                    }
                    setSelectedVibration('mute');
                    runShake(muteShake);
                  }}
                  style={({ pressed }) => [
                    styles.box,
                    { borderColor: isDark ? '#333' : '#f0f0f0' },
                    (pressed || selectedVibration === 'mute') && styles.boxPressed,
                    selectedVibration === 'mute' && { backgroundColor: vibrationColors.mute },
                  ]}
                >
                  <Text style={[styles.labelText, { color: isDark ? '#fff' : '#000' }]}>Mute</Text>
                  <Animated.View style={shakeStyle(muteShake)}>
                  <Svg width={40} height={40} viewBox="0 0 24 24">
                    <G
                      fill="none"
                      stroke={isDark ? "#fff" : "#000"}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    >
                      <Path d="m2 8 2 2-2 2 2 2-2 2m20-8-2 2 2 2-2 2 2 2" />
                      <Rect x={8} y={5} width={8} height={14} rx={1} />
                    </G>
                  </Svg>
                  </Animated.View>
                </Pressable>
           <Pressable
                onPress={() => {
                  if (Platform.OS === "android") {
                    Vibration.vibrate(30);
                  }
                  setSelectedVibration('light');
                  runShake(lightShake);
                }}
                style={({ pressed }) => [
                  styles.box,
                  { borderColor: isDark ? '#333' : '#f0f0f0' },
                  (pressed || selectedVibration === 'light') && styles.boxPressed,
                  selectedVibration === 'light' && { backgroundColor: vibrationColors.light },
                ]}
              >
                <Text style={[styles.labelText, { color: isDark ? '#fff' : '#000' }]}>Light</Text>
                <Animated.View style={shakeStyle(lightShake)}>
                <Svg width={40} height={40} viewBox="0 0 256 256">
                  <Path
                    fill={isDark ? "#fff" : "#000"}
                    d="M164 28H92a28 28 0 0 0-28 28v144a28 28 0 0 0 28 28h72a28 28 0 0 0 28-28V56a28 28 0 0 0-28-28Zm4 172a4 4 0 0 1-4 4H92a4 4 0 0 1-4-4V56a4 4 0 0 1 4-4h72a4 4 0 0 1 4 4Zm64-100v56a12 12 0 0 1-24 0v-56a12 12 0 0 1 24 0Zm-184 0v56a12 12 0 0 1-24 0v-56a12 12 0 0 1 24 0Z"
                  />
                </Svg>
                </Animated.View>
              </Pressable>
            <Pressable
                onPress={() => {
                  if (Platform.OS === "android") {
                    Vibration.vibrate(60);
                  }
                  setSelectedVibration('medium');
                  runShake(mediumShake);
                }}
                style={({ pressed }) => [
                  styles.box,
                  { borderColor: isDark ? '#333' : '#f0f0f0' },
                  (pressed || selectedVibration === 'medium') && styles.boxPressed,
                  selectedVibration === 'medium' && { backgroundColor: vibrationColors.medium },
                ]}
              >
                <Text style={[styles.labelText, { color: isDark ? '#fff' : '#000' }]}>Medium</Text>
                <Animated.View style={shakeStyle(mediumShake)}>
                <Svg width={40} height={40} viewBox="0 0 256 256">
                  <G fill={isDark ? "#fff" : "#000"}>
                    <Path
                      d="M176 56v144a16 16 0 0 1-16 16H96a16 16 0 0 1-16-16V56a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16Z"
                      opacity={0.2}
                    />
                    <Path d="M160 32H96a24 24 0 0 0-24 24v144a24 24 0 0 0 24 24h64a24 24 0 0 0 24-24V56a24 24 0 0 0-24-24Zm8 168a8 8 0 0 1-8 8H96a8 8 0 0 1-8-8V56a8 8 0 0 1 8-8h64a8 8 0 0 1 8 8Zm48-112v80a8 8 0 0 1-16 0V88a8 8 0 0 1 16 0Zm32 16v48a8 8 0 0 1-16 0v-48a8 8 0 0 1 16 0ZM56 88v80a8 8 0 0 1-16 0V88a8 8 0 0 1 16 0Zm-32 16v48a8 8 0 0 1-16 0v-48a8 8 0 0 1 16 0Z" />
                  </G>
                </Svg>
                </Animated.View>
              </Pressable>
           <Pressable
              onPress={() => {
                if (Platform.OS === "android") {
                  Vibration.vibrate(100);
                }
                setSelectedVibration('heavy');
                runShake(heavyShake);
              }}
              style={({ pressed }) => [
                styles.box,
                { borderColor: isDark ? '#333' : '#f0f0f0' },
                (pressed || selectedVibration === 'heavy') && styles.boxPressed,
                selectedVibration === 'heavy' && { backgroundColor: vibrationColors.heavy },
              ]}
            >
              <Text style={[styles.labelText, { color: isDark ? '#fff' : '#000' }]}>Heavy</Text>
              <Animated.View style={shakeStyle(heavyShake)}>
              <Svg width={40} height={40} viewBox="0 0 256 256">
                <G fill={isDark ? "#fff" : "#000"}>
                  <Rect x={72} y={32} width={112} height={192} rx={24} />
                  <Path d="M208 80a8 8 0 0 0-8 8v80a8 8 0 0 0 16 0V88a8 8 0 0 0-8-8Zm32 16a8 8 0 0 0-8 8v48a8 8 0 0 0 16 0v-48a8 8 0 0 0-8-8ZM48 80a8 8 0 0 0-8 8v80a8 8 0 0 0 16 0V88a8 8 0 0 0-8-8ZM16 96a8 8 0 0 0-8 8v48a8 8 0 0 0 16 0v-48a8 8 0 0 0-8-8Z" />
                </G>
              </Svg>
              </Animated.View>
            </Pressable>
          </View>
          
          
          </View>
          <View style={styles.section}>

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
  title: {
     fontSize: 36, fontWeight: '900', marginVertical: 20, letterSpacing: -1.5
     ,
     marginTop: 20,
     paddingTop: 20,
     },
  section: { marginBottom: 30 },
  sectionTitle: 
  { fontSize: 14, fontWeight: '900', textTransform: 'uppercase', marginBottom: 15, letterSpacing: 1,
    paddingLeft: 15, 
   },
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
   container1: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 16,
  },
  //Will have 4 of this for the diffrent boxes 
  //Number1 unpressed and pressed
  box: {
    width: "48%",
    aspectRatio: 1,
    backgroundColor: "#dddddd5e",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderRadius: 24,
    borderWidth: 1,
  },
  boxPressed: {
  transform: [{ scale: 0.97 },],
  
},
  labelText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
});