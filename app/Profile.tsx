import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Profile() {
  return (
    <View style={styles.container}>
        
      <Text style={styles.title}>Profile</Text>
      <TouchableOpacity
        style={{
            
            padding: 10,
            height: 90,
            width: 90,
            backgroundColor: '#e0e0e0',
            borderRadius: 90,
            justifyContent: 'center',
            alignItems: 'center',
        }}
        >


        </TouchableOpacity>
        <Text style={styles.message}>Greetings ,Jonathan </Text>
        <View
        style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '93%',
            marginTop: 20,
            height: 90,
            backgroundColor: '#e0e0e0',
            borderRadius: 10,
        }}>
            <Text>
                Stats
            </Text>
        </View>
      <Text style={styles.message}>🚧 Under Construction 🚧</Text>
      <Text style={styles.subText}>
        This section is still being built. Check back soon!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 16,
  },
  message: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});