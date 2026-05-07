import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function MultiplayerResultScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Match Results</Text>
      <Text style={styles.subtitle}>Podium: 1st • 2nd • 3rd</Text>
      <View style={styles.table}><Text style={styles.row}>Full score table will render from room state.</Text></View>
      <Pressable style={styles.button} onPress={() => navigation.navigate('Lobby')}><Text style={styles.buttonText}>Rematch</Text></Pressable>
      <Pressable style={styles.button} onPress={() => navigation.navigate('MultiplayerMenu')}><Text style={styles.buttonText}>Leave</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', padding: 20, justifyContent: 'center' },
  title: { color: '#fff', textAlign: 'center', fontFamily: 'Nunito_700Bold', fontSize: 30 },
  subtitle: { color: '#fff', textAlign: 'center', marginTop: 8, marginBottom: 16, fontFamily: 'Nunito_400Regular' },
  table: { backgroundColor: '#ffffff1a', borderRadius: 12, padding: 14, marginBottom: 14 },
  row: { color: '#fff', fontFamily: 'Nunito_400Regular' },
  button: { backgroundColor: '#3949AB', borderRadius: 10, padding: 12, marginTop: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontFamily: 'Nunito_700Bold' }
});
