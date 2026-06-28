import { BlurView } from 'expo-blur';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Vibration,
  View,
  ViewStyle
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { getThemeColors } from './Artifacts/Colors';
import { useTheme } from './ThemeContext';

interface GlassSurfaceProps {
  width?: number;
  height?: number;
  style?: ViewStyle;
}

const GlassTabNavigation: React.FC<GlassSurfaceProps> = ({
  width,
  height = 80,
  style,
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const defaultWidth = Math.min(620, screenWidth - 24);
  const resolvedWidth = width ?? defaultWidth;
  const router = useRouter();
  const pathname = usePathname();
  const { isDark } = useTheme();

  const colors = getThemeColors(isDark);

  const activeAccentColor = isDark ? '#5953532e' : '#8a8a8a22';

  const iconColor = (active: boolean) => {
    if (active) {
      return colors.textPrimary;
    }
    return colors.textSecondary;
  };

  const icons = [
    { id: 0, path: '/', component: (active: boolean) => <HomeIcon color={iconColor(active)} /> },
    { id: 1, path: '/favourites', component: (active: boolean) => <HeartIcon color={iconColor(active)} /> },
    { id: 2, path: '/Settings', component: (active: boolean) => <SettingsIcon color={iconColor(active)} /> },
    { id: 3, path: '/profile', component: (active: boolean) => <UserIcon color={iconColor(active)} /> },
  ];

  const handlePress = (path: string) => {
    if (Platform.OS === 'android') {
      Vibration.vibrate(8);
    }
    router.push(path as any);
  };

  return (
    <View style={[styles.wrapper, { width: resolvedWidth, height }, style]}>
      <BlurView
        intensity={Platform.OS === 'ios' ? 90 : 100}
        tint={isDark ? "dark" : "extraLight"}
        style={[
          StyleSheet.absoluteFill, 
          styles.blurContainer,
          { 
            backgroundColor: colors.glassBackground, 
            borderColor: colors.glassBorder 
          }
        ]}
      >
        <View style={[styles.innerGlow, isDark && styles.innerGlowDark]} />
        <View style={styles.iconsContainer}>
          {icons.map((item) => {
            const isActive = pathname === item.path;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => handlePress(item.path)}
                activeOpacity={0.8}
                style={[
                  styles.iconButton,
                  isActive && { transform: [{ scale: 1.15 }] },
                  isActive && { backgroundColor: activeAccentColor }
                ]}
              >
                {item.component(isActive)}
                {isActive && (
                  <View style={[styles.activeDot, { backgroundColor: colors.textPrimary }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
};

/* --- Icon Components --- */

const HomeIcon = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <Path d="M9 22V12h6v10" />
  </Svg>
);

const HeartIcon = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </Svg>
);

const SettingsIcon = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="3" />
    <Path d="M19.4 15a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H15a1 1 0 0 1-1-1V5.78a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V9a1 1 0 0 1-1 1H5.78a1.65 1.65 0 0 0-1.51 1 1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.51 1H9a1 1 0 0 1 1 1v3.22a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1-1.51V15a1 1 0 0 1 1-1h3.22a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83l.06-.06z" />
  </Svg>
);

const UserIcon = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

/* --- Styles --- */

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  blurContainer: {
    borderWidth: 1.5,
  },
  innerGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    margin: 1.5,
  },
  innerGlowDark: {
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  iconsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
  },
  iconButton: {
    width: 54,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 27,
  },
  activeDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});

export default GlassTabNavigation;