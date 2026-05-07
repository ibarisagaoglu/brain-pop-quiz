import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useAppContext } from '../../context/AppContext';

export default function ProfileScreen() {
  const { authUser } = useAppContext();
  const badges = (authUser?.badges || []).slice(0, 6);

  return (
    <View style={styles.container}>
      <Image source={{ uri: authUser?.photoURL || 'https://i.pravatar.cc/120' }} style={styles.avatar} />
      <Text style={styles.name}>{authUser?.username || 'guest'}</Text>
      <Text style={styles.meta}>Level {authUser?.level || 1} • XP {authUser?.xp || 0}</Text>
      <View style={styles.bar}><View style={[styles.fill, { width: `${((authUser?.xp || 0) % 1000) / 10}%` }]} /></View>

      <Text style={styles.section}>Top Badges</Text>
      <View style={styles.badgeWrap}>
        {badges.length ? badges.map((item) => <Text key={item} style={styles.badge}>🏅 {item}</Text>) : <Text style={styles.meta}>No badges yet</Text>}
      </View>

      <Text style={styles.section}>Stats</Text>
      <Text style={styles.meta}>Games played: {authUser?.totalGamesPlayed || 0}</Text>
      <Text style={styles.meta}>Correct answers: {authUser?.totalCorrectAnswers || 0}</Text>
      <Text style={styles.meta}>Best category: {authUser?.bestCategory || 'N/A'}</Text>
      <Text style={styles.section}>Recent games</Text>
      <Text style={styles.meta}>Feature ready for Firebase history integration.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#101827', padding: 18 },
  avatar: { width: 90, height: 90, borderRadius: 45, alignSelf: 'center', marginTop: 18 },
  name: { color: '#fff', textAlign: 'center', fontFamily: 'Nunito_700Bold', fontSize: 24, marginTop: 8 },
  meta: { color: '#d1d5db', textAlign: 'center', marginTop: 4, fontFamily: 'Nunito_400Regular' },
  bar: { height: 10, backgroundColor: '#374151', borderRadius: 999, marginTop: 10 },
  fill: { height: '100%', backgroundColor: '#4CAF50', borderRadius: 999 },
  section: { color: '#fff', marginTop: 18, fontFamily: 'Nunito_700Bold', fontSize: 16 },
  badgeWrap: { marginTop: 8 },
  badge: { color: '#fff', backgroundColor: '#1f2937', borderRadius: 10, padding: 8, marginBottom: 6, fontFamily: 'Nunito_700Bold' }
});
