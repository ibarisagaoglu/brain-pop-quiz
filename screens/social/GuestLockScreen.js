import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function GuestLockScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in required</Text>
      <Text style={styles.subtitle}>Leaderboard, Friends, and Profile are available for signed-in users.</Text>
      <Pressable style={styles.button} onPress={() => navigation.navigate('AuthFlow', { screen: 'Login' })}>
        <Text style={styles.buttonText}>Go to Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#101827' },
  title: { color: '#fff', fontFamily: 'Nunito_700Bold', fontSize: 28, textAlign: 'center' },
  subtitle: { color: '#d1d5db', textAlign: 'center', marginTop: 10, marginBottom: 16, fontFamily: 'Nunito_400Regular' },
  button: { backgroundColor: '#4CAF50', borderRadius: 12, padding: 14 },
  buttonText: { color: '#fff', textAlign: 'center', fontFamily: 'Nunito_700Bold' }
});
