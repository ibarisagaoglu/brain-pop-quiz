import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function MultiplayerMenuScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Multiplayer</Text>
      <Pressable style={styles.button} onPress={() => navigation.navigate('Lobby', { mode: 'create' })}><Text style={styles.buttonText}>Create Room</Text></Pressable>
      <Pressable style={styles.button} onPress={() => navigation.navigate('Lobby', { mode: 'join' })}><Text style={styles.buttonText}>Join Room</Text></Pressable>
      <Pressable style={styles.button} onPress={() => navigation.navigate('Lobby', { mode: 'quick' })}><Text style={styles.buttonText}>Quick Match</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', justifyContent: 'center', padding: 24 },
  title: { color: '#fff', fontSize: 32, textAlign: 'center', fontFamily: 'Nunito_700Bold', marginBottom: 24 },
  button: { backgroundColor: '#3949AB', borderRadius: 12, padding: 14, marginBottom: 12 },
  buttonText: { color: '#fff', textAlign: 'center', fontFamily: 'Nunito_700Bold' }
});
