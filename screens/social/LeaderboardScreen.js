import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View, FlatList, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAppContext } from '../../context/AppContext';

const tabs = ['Global', 'Weekly', 'Friends'];

export default function LeaderboardScreen() {
  const [activeTab, setActiveTab] = useState('Global');
  const [rows, setRows] = useState([]);
  const { authUser } = useAppContext();

  useFocusEffect(useCallback(() => {
    setRows([
      { id: '1', username: 'quiz_master', score: 990, level: 8, avatar: 'https://i.pravatar.cc/64?img=1' },
      { id: authUser?.uid || 'me', username: authUser?.username || 'you', score: 870, level: authUser?.level || 1, avatar: authUser?.photoURL || 'https://i.pravatar.cc/64?img=2' },
      { id: '3', username: 'brainy', score: 810, level: 6, avatar: 'https://i.pravatar.cc/64?img=3' }
    ]);
  }, [authUser]));

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <Pressable key={tab} style={[styles.tab, activeTab === tab && styles.activeTab]} onPress={() => setActiveTab(tab)}>
            <Text style={styles.tabText}>{tab}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={[styles.row, item.id === (authUser?.uid || 'me') && styles.currentUser]}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.score}>{item.score}</Text>
            <Text style={styles.level}>Lv.{item.level}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#101827', padding: 16 },
  tabBar: { flexDirection: 'row', marginBottom: 14 },
  tab: { flex: 1, borderRadius: 10, backgroundColor: '#1f2937', padding: 10, marginHorizontal: 4 },
  activeTab: { backgroundColor: '#4CAF50' },
  tabText: { color: '#fff', textAlign: 'center', fontFamily: 'Nunito_700Bold' },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1f2937', marginBottom: 10, borderRadius: 12, padding: 10 },
  currentUser: { borderWidth: 1, borderColor: '#4CAF50' },
  rank: { color: '#fff', width: 40, fontFamily: 'Nunito_700Bold' },
  avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  username: { color: '#fff', flex: 1, fontFamily: 'Nunito_700Bold' },
  score: { color: '#fff', width: 60, textAlign: 'right', fontFamily: 'Nunito_700Bold' },
  level: { color: '#9ad', width: 50, textAlign: 'right', fontFamily: 'Nunito_700Bold' }
});
