import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCategoryEmoji } from '../utils/helpers';

const FALLBACK_TEXT = 'Oops! Something went wrong. Please restart the app.';
const categories = ['Animals', 'Science', 'Geography', 'Sports', 'Food', 'History'];
const cardWidth = (Dimensions.get('window').width / 2) - 24;

export default function CategoriesScreen({ navigation }) {
  const [bestScores, setBestScores] = useState({});

  useEffect(() => {
    const load = async () => {
      const next = {};
      await Promise.all(categories.map(async (category) => {
        try {
          const value = await AsyncStorage.getItem(`bestScore_${category}`);
          next[category] = Number(value || 0);
        } catch (error) {
          console.log('Category best score load failed');
          next[category] = 0;
        }
      }));
      setBestScores(next);
    };
    load();
  }, []);

  const onSelectCategory = (category) => {
    try {
      navigation.navigate('Quiz', { category });
    } catch (error) {
      console.log('Navigation failed');
    }
  };

  try {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <Text style={styles.title}>Choose a Category</Text>
        <FlatList
          data={categories}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pressable onPress={() => onSelectCategory(item)} style={styles.cardOuter}>
              <LinearGradient colors={['#16213e', '#0f3460']} style={styles.card}>
                <Text style={styles.emoji}>{getCategoryEmoji(item)}</Text>
                <Text style={styles.name}>{item}</Text>
                <Text style={styles.best}>Best: {bestScores[item] || 0}</Text>
              </LinearGradient>
            </Pressable>
          )}
        />
      </View>
    );
  } catch (error) {
    return (
      <View style={styles.fallback}>
        <Text>{FALLBACK_TEXT}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', paddingHorizontal: 12, paddingTop: 32 },
  title: { color: '#fff', fontFamily: 'Nunito_700Bold', fontSize: 24, marginBottom: 18, textAlign: 'center' },
  listContent: { paddingBottom: 24 },
  row: { justifyContent: 'space-between', marginBottom: 12 },
  cardOuter: { width: cardWidth, height: 140, borderRadius: 16, overflow: 'hidden' },
  card: { flex: 1, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 40, marginBottom: 4 },
  name: { color: '#fff', fontFamily: 'Nunito_700Bold', fontSize: 16 },
  best: { color: 'rgba(255,255,255,0.8)', fontFamily: 'Nunito_400Regular', fontSize: 13 },
  fallback: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }
});
