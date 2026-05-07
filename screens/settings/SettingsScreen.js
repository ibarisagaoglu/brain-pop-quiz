import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import { signOut } from '../../utils/auth';

export default function SettingsScreen({ navigation }) {
  const { soundEnabled, toggleSound, signOutLocal } = useAppContext();

  const onSignOut = async () => {
    await signOut();
    await signOutLocal();
    navigation.replace('AuthFlow', { screen: 'Login' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Pressable style={styles.button} onPress={toggleSound}><Text style={styles.text}>Sound: {soundEnabled ? 'On' : 'Off'}</Text></Pressable>
      <Pressable style={styles.button} onPress={() => Linking.openURL('https://policies.google.com/privacy')}><Text style={styles.text}>Privacy Policy</Text></Pressable>
      <Pressable style={styles.buttonDanger} onPress={onSignOut}><Text style={styles.text}>Sign Out</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', padding: 20 },
  title: { color: '#fff', fontSize: 30, fontFamily: 'Nunito_700Bold', marginBottom: 20 },
  button: { backgroundColor: '#3949AB', borderRadius: 12, padding: 14, marginBottom: 10 },
  buttonDanger: { backgroundColor: '#F44336', borderRadius: 12, padding: 14, marginBottom: 10 },
  text: { color: '#fff', textAlign: 'center', fontFamily: 'Nunito_700Bold' }
});
