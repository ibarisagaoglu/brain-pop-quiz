import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { subscribeToRoom } from '../../utils/multiplayer';

export default function MultiplayerQuizScreen({ navigation, route }) {
  const roomCode = route?.params?.roomCode;
  const [countdown, setCountdown] = useState(5);
  const [roomData, setRoomData] = useState(null);

  useEffect(() => {
    const unsub = subscribeToRoom(roomCode, setRoomData);
    return () => unsub();
  }, [roomCode]);

  useEffect(() => {
    if (countdown <= 0) return undefined;
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  if (countdown > 0) {
    return (
      <View style={styles.container}><Text style={styles.title}>Starting in {countdown}...</Text></View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Multiplayer Quiz ({roomCode})</Text>
      <Text style={styles.subtitle}>Live score comparison</Text>
      <FlatList
        data={Object.entries(roomData?.players || {}).map(([id, player]) => ({ id, ...player }))}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}><Text style={styles.text}>{item.username}</Text><Text style={styles.text}>{item.score}</Text></View>
        )}
      />
      <Text style={styles.subtitle}>Question sync index: {roomData?.currentQuestionIndex || 0}</Text>
      <Text style={styles.link} onPress={() => navigation.navigate('MultiplayerResult')}>Finish Match</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', padding: 18 },
  title: { color: '#fff', fontSize: 26, fontFamily: 'Nunito_700Bold' },
  subtitle: { color: '#fff', marginTop: 10, fontFamily: 'Nunito_400Regular' },
  row: { backgroundColor: '#ffffff1a', borderRadius: 10, padding: 10, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between' },
  text: { color: '#fff', fontFamily: 'Nunito_700Bold' },
  link: { color: '#90CAF9', marginTop: 16, fontFamily: 'Nunito_700Bold' }
});
