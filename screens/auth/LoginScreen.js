import React, { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { signInWithGoogle } from '../../utils/auth';
import { useAppContext } from '../../context/AppContext';

export default function LoginScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const { setSignedInUser, signInAsGuest } = useAppContext();

  const onGoogle = async () => {
    setLoading(true);
    const user = await signInWithGoogle();
    setLoading(false);
    if (!user) return;

    await setSignedInUser(user);
    navigation.replace('ProfileSetup', { user });
  };

  const onGuest = async () => {
    await signInAsGuest();
    navigation.replace('MainTabs');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🧠</Text>
      <Text style={styles.title}>Brain Pop Quiz</Text>

      <Pressable style={styles.googleButton} onPress={onGoogle}>
        <Text style={styles.buttonText}>{loading ? 'Connecting...' : 'Continue with Google'}</Text>
      </Pressable>

      <Pressable style={styles.guestButton} onPress={onGuest}>
        <Text style={styles.buttonText}>Play without account</Text>
      </Pressable>

      <Pressable onPress={() => Linking.openURL('https://policies.google.com/privacy')}>
        <Text style={styles.link}>Privacy Policy</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#1a1a2e' },
  logo: { fontSize: 72, textAlign: 'center' },
  title: { color: '#fff', fontFamily: 'Nunito_700Bold', fontSize: 34, textAlign: 'center', marginBottom: 24 },
  googleButton: { backgroundColor: '#4285F4', borderRadius: 12, paddingVertical: 14, marginBottom: 12 },
  guestButton: { backgroundColor: '#3949AB', borderRadius: 12, paddingVertical: 14, marginBottom: 20 },
  buttonText: { color: '#fff', textAlign: 'center', fontFamily: 'Nunito_700Bold', fontSize: 16 },
  link: { color: '#90CAF9', textAlign: 'center', fontFamily: 'Nunito_400Regular' }
});
