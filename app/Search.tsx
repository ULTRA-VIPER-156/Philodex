import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import GlassSurface from './GlassSurface';
import React from "react"

export default function Profile() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Profile</Text>
          <Text style={styles.placeholderText}>
            Your profile information will appear here.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Pokémon Caught</Text>
            <Text style={styles.statValue}>0</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Favorites</Text>
            <Text style={styles.statValue}>0</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.placeholderText}>
            More features coming soon! 
          </Text>
        </View>
      </ScrollView>

      <View style={styles.floatingGlassContainer}>
        <GlassSurface />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, paddingHorizontal: 20 },
  title: { fontSize: 36, fontWeight: '900', marginVertical: 20, letterSpacing: -1.5 },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 14, fontWeight: '700', textTransform: 'uppercase', marginBottom: 15, letterSpacing: 1 },
  statCard: { 
    backgroundColor: '#f5f5f5', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 12,
    alignItems: 'center'
  },
  statLabel: { fontSize: 14, color: '#666', marginBottom: 8 },
  statValue: { fontSize: 28, fontWeight: '900', color: '#333' },
  placeholderText: { fontSize: 16, color: '#999', textAlign: 'center', marginVertical: 20 },
  floatingGlassContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    zIndex: 999,
  },
});
