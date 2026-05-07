import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { createRoom, joinRoom, startGame, subscribeToRoom } from '../../utils/multiplayer';
import { useAppContext } from '../../context/AppContext';

export default function LobbyScreen({ navigation, route }) {
  const mode = route?.params?.mode || 'create';
  const { authUser } = useAppContext();
  const [roomCode, setRoomCode] = useState('');
  const [roomData, setRoomData] = useState(null);
  const [category, setCategory] = useState('mixed');
  const [questionCount, setQuestionCount] = useState(10);

  useEffect(() => {
    let unsub = () => {};
    const run = async () => {
      const userId = authUser?.uid || `guest_${Date.now()}`;
      if (mode === 'create' || mode === 'quick') {
        const roomId = await createRoom(userId, category, questionCount);
        setRoomCode(roomId);
        unsub = subscribeToRoom(roomId, setRoomData);
      }
    };
    run();
    return () => unsub();
  }, [mode, authUser, category, questionCount]);

  const onJoin = async () => {
    const userId = authUser?.uid || `guest_${Date.now()}`;
    await joinRoom(roomCode, userId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lobby</Text>
      <Text style={styles.subtitle}>Room Code: {roomCode || '------'}</Text>

      <TextInput style={styles.input} value={roomCode} onChangeText={setRoomCode} autoCapitalize="characters" maxLength={6} placeholder="ROOM CODE" placeholderTextColor="#ffffff66" />
      <Pressable style={styles.button} onPress={onJoin}><Text style={styles.buttonText}>Join Room</Text></Pressable>

      <View style={styles.row}>
        <Pressable style={styles.pill} onPress={() => setCategory(category === 'mixed' ? 'Science' : 'mixed')}><Text style={styles.buttonText}>Category: {category}</Text></Pressable>
        <Pressable style={styles.pill} onPress={() => setQuestionCount((prev) => (prev >= 100 ? 10 : prev + 10))}><Text style={styles.buttonText}>Count: {questionCount}</Text></Pressable>
      </View>

      <FlatList
        data={Object.entries(roomData?.players || {}).map(([id, player]) => ({ id, ...player }))}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.playerRow}><Text style={styles.playerText}>{item.username}</Text><Text style={styles.playerText}>{item.score}</Text></View>
        )}
      />

      <Pressable style={styles.startButton} onPress={async () => {
        await startGame(roomCode);
        navigation.navigate('MultiplayerQuiz', { roomCode });
      }}>
        <Text style={styles.buttonText}>Start Game</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', padding: 18 },
  title: { color: '#fff', fontFamily: 'Nunito_700Bold', fontSize: 30 },
  subtitle: { color: '#fff', marginVertical: 8, fontFamily: 'Nunito_400Regular' },
  input: { backgroundColor: '#ffffff22', color: '#fff', borderRadius: 10, padding: 12, marginBottom: 10 },
  button: { backgroundColor: '#3949AB', borderRadius: 10, padding: 12, marginBottom: 10 },
  buttonText: { color: '#fff', textAlign: 'center', fontFamily: 'Nunito_700Bold' },
  row: { flexDirection: 'row', marginBottom: 8 },
  pill: { flex: 1, backgroundColor: '#0f3460', borderRadius: 10, padding: 10, marginRight: 6 },
  playerRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#ffffff14', borderRadius: 8, padding: 10, marginBottom: 6 },
  playerText: { color: '#fff', fontFamily: 'Nunito_700Bold' },
  startButton: { backgroundColor: '#4CAF50', borderRadius: 10, padding: 14, marginTop: 8 }
});
