import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { checkUsernameAvailable, createUserProfile } from '../../utils/auth';
import { useAppContext } from '../../context/AppContext';

const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;

export default function ProfileSetupScreen({ navigation, route }) {
  const user = route?.params?.user;
  const { setSignedInUser } = useAppContext();
  const [username, setUsername] = useState('');
  const [available, setAvailable] = useState(null);
  const [checking, setChecking] = useState(false);
  const [day, setDay] = useState(1);
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(new Date().getFullYear() - 7);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!USERNAME_REGEX.test(username)) {
        setAvailable(null);
        return;
      }

      setChecking(true);
      const result = await checkUsernameAvailable(username);
      setAvailable(result);
      setChecking(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  const age = useMemo(() => {
    const now = new Date();
    let next = now.getFullYear() - year;
    if (now.getMonth() + 1 < month || ((now.getMonth() + 1) === month && now.getDate() < day)) {
      next -= 1;
    }
    return next;
  }, [day, month, year]);

  const valid = USERNAME_REGEX.test(username) && available && age >= 7;

  const onSubmit = async () => {
    if (!valid || !user?.uid) return;

    const profile = {
      uid: user.uid,
      email: user.email || '',
      username: username.trim().toLowerCase(),
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      birthDate: { day, month, year },
      createdAt: new Date(),
      level: 1,
      xp: 0,
      totalGamesPlayed: 0,
      totalCorrectAnswers: 0,
      badges: [],
      friends: []
    };

    const saved = await createUserProfile(user.uid, profile);
    if (!saved) return;

    await setSignedInUser(profile);
    navigation.replace('MainTabs');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Setup Profile</Text>

      <TextInput
        placeholder="username"
        placeholderTextColor="#ffffff88"
        style={styles.input}
        value={username}
        autoCapitalize="none"
        onChangeText={(value) => setUsername(value.toLowerCase())}
      />
      <Text style={styles.helper}>3-20 chars: lowercase letters, numbers, underscore</Text>
      <Text style={styles.status}>
        {checking ? 'Checking...' : available === true ? '✅ Available' : available === false ? '❌ Taken' : ''}
      </Text>

      <Text style={styles.label}>Birth date</Text>
      <View style={styles.row}>
        <Picker style={styles.picker} selectedValue={day} onValueChange={setDay}>
          {Array.from({ length: 31 }, (_, i) => i + 1).map((item) => (
            <Picker.Item key={item} label={`Day ${item}`} value={item} />
          ))}
        </Picker>
        <Picker style={styles.picker} selectedValue={month} onValueChange={setMonth}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((item) => (
            <Picker.Item key={item} label={`Month ${item}`} value={item} />
          ))}
        </Picker>
        <Picker style={styles.picker} selectedValue={year} onValueChange={setYear}>
          {Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - i).map((item) => (
            <Picker.Item key={item} label={`${item}`} value={item} />
          ))}
        </Picker>
      </View>

      <Text style={styles.helper}>Age: {age} (minimum 7)</Text>

      <Pressable style={[styles.button, !valid && styles.disabled]} disabled={!valid} onPress={onSubmit}>
        <Text style={styles.buttonText}>Complete Setup</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', padding: 24, justifyContent: 'center' },
  title: { color: '#fff', fontFamily: 'Nunito_700Bold', fontSize: 30, marginBottom: 18, textAlign: 'center' },
  input: { backgroundColor: '#ffffff22', color: '#fff', borderRadius: 10, padding: 12, fontFamily: 'Nunito_700Bold' },
  helper: { color: '#fff', marginTop: 6, fontFamily: 'Nunito_400Regular' },
  status: { color: '#fff', minHeight: 20, marginTop: 6, fontFamily: 'Nunito_700Bold' },
  label: { color: '#fff', marginTop: 16, marginBottom: 6, fontFamily: 'Nunito_700Bold' },
  row: { flexDirection: 'row' },
  picker: { flex: 1, color: '#fff' },
  button: { backgroundColor: '#4CAF50', borderRadius: 12, paddingVertical: 14, marginTop: 18 },
  disabled: { backgroundColor: '#777' },
  buttonText: { color: '#fff', textAlign: 'center', fontFamily: 'Nunito_700Bold' }
});
