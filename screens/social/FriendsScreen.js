import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function FriendsScreen() {
  const [query, setQuery] = useState('');
  const [requests, setRequests] = useState([{ id: 'r1', username: 'alex' }]);
  const [friends] = useState([{ id: 'f1', username: 'mila', recentScore: 120 }]);

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Search username" placeholderTextColor="#ffffff99" value={query} onChangeText={setQuery} />
      <Pressable style={styles.button}><Text style={styles.buttonText}>Send friend request</Text></Pressable>

      <Text style={styles.section}>Pending Requests</Text>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rowText}>{item.username}</Text>
            <Pressable onPress={() => setRequests((prev) => prev.filter((r) => r.id !== item.id))}><Text style={styles.accept}>Accept</Text></Pressable>
            <Pressable onPress={() => setRequests((prev) => prev.filter((r) => r.id !== item.id))}><Text style={styles.reject}>Reject</Text></Pressable>
          </View>
        )}
      />

      <Text style={styles.section}>Friends</Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rowText}>{item.username}</Text>
            <Text style={styles.rowText}>Recent: {item.recentScore}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#101827', padding: 16 },
  input: { backgroundColor: '#1f2937', color: '#fff', borderRadius: 10, padding: 12 },
  button: { backgroundColor: '#4CAF50', marginTop: 10, borderRadius: 10, padding: 12 },
  buttonText: { color: '#fff', textAlign: 'center', fontFamily: 'Nunito_700Bold' },
  section: { color: '#fff', marginTop: 16, marginBottom: 8, fontFamily: 'Nunito_700Bold' },
  row: { backgroundColor: '#1f2937', borderRadius: 10, padding: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' },
  rowText: { color: '#fff', fontFamily: 'Nunito_400Regular' },
  accept: { color: '#4CAF50', marginRight: 10, fontFamily: 'Nunito_700Bold' },
  reject: { color: '#F44336', fontFamily: 'Nunito_700Bold' }
});
