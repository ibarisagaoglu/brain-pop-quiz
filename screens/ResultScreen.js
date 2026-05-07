import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCategoryGradient, getGrade } from '../utils/helpers';
import { playGameOver } from '../utils/sounds';
import { useAppContext } from '../context/AppContext';
import { saveScoreToFirebase } from '../utils/firebaseScores';

const FALLBACK_TEXT = 'Oops! Something went wrong. Please restart the app.';

export default function ResultScreen({ route, navigation }) {
  const {
    score = 0,
    total = 100,
    category = 'mixed',
    questionCount = 10,
    correctAnswers = 0,
    averageDifficulty = 'easy',
    fastAnswers = 0
  } = route?.params || {};
  const { authUser, soundEnabled } = useAppContext();
  const [newRecord, setNewRecord] = useState(false);
  const [xpGain, setXpGain] = useState(0);
  const percentage = useMemo(() => Math.round((score / total) * 100), [score, total]);

  const star1 = useRef(new Animated.Value(0)).current;
  const star2 = useRef(new Animated.Value(0)).current;
  const star3 = useRef(new Animated.Value(0)).current;

  const calculateStarCount = (value) => {
    if (value > 80) return 3;
    if (value >= 50) return 2;
    return 1;
  };

  const starCount = calculateStarCount(percentage);

  useEffect(() => {
    const run = async () => {
      const key = category === 'mixed' ? 'bestScore_mixed' : `bestScore_${category}`;
      try {
        const prev = Number((await AsyncStorage.getItem(key)) || 0);
        if (score > prev) {
          await AsyncStorage.setItem(key, String(score));
          setNewRecord(true);
        }
      } catch (error) {
        console.log('Best score save failed');
      }
    };

    run();
  }, [score, category]);

  useEffect(() => {
    const syncScore = async () => {
      if (!authUser?.uid) return;
      try {
        const result = await saveScoreToFirebase({
          user: authUser,
          category,
          score,
          total,
          correctAnswers,
          averageDifficulty,
          fastAnswers
        });
        if (result?.xpGain) setXpGain(result.xpGain);
      } catch (error) {
        console.log('Firebase score sync failed');
      }
    };

    syncScore();
  }, [authUser, category, score, total, correctAnswers, averageDifficulty, fastAnswers]);

  useEffect(() => {
    if (soundEnabled) {
      playGameOver();
    }
  }, [soundEnabled]);

  useEffect(() => {
    const stars = [star1, star2, star3].slice(0, starCount);
    stars.forEach((item) => item.setValue(0));

    Animated.stagger(
      160,
      stars.map((item) => Animated.spring(item, { toValue: 1, useNativeDriver: true }))
    ).start();
  }, [star1, star2, star3, starCount]);

  try {
    return (
      <LinearGradient colors={getCategoryGradient(category)} style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.starsRow}>
          {[star1, star2, star3].map((item, i) => (
            <Animated.Text
              key={`star-${i}`}
              style={[
                styles.star,
                {
                  opacity: i < starCount ? item : 0.2,
                  transform: [{ scale: i < starCount ? item : 0.8 }]
                }
              ]}
            >
              ⭐
            </Animated.Text>
          ))}
        </View>

        <Text style={styles.finalScore}>{score} / {total}</Text>
        <Text style={styles.grade}>{percentage}% • {getGrade(percentage)}</Text>
        <Text style={styles.meta}>Questions: {questionCount} • Correct: {correctAnswers}</Text>
        {xpGain > 0 ? <Text style={styles.meta}>XP gained: +{xpGain}</Text> : null}

        {newRecord ? <Text style={styles.badge}>New Record!</Text> : null}

        <Pressable style={styles.button} onPress={() => navigation.replace('Quiz', { category, questionCount })}><Text style={styles.buttonText}>Play Again</Text></Pressable>
        <Pressable style={styles.button} onPress={() => navigation.navigate('Categories')}><Text style={styles.buttonText}>Change Category</Text></Pressable>
        <Pressable style={styles.button} onPress={() => navigation.navigate('Home')}><Text style={styles.buttonText}>Home</Text></Pressable>
      </LinearGradient>
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
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  starsRow: { flexDirection: 'row', marginBottom: 14 },
  star: { fontSize: 42, marginHorizontal: 6 },
  finalScore: { color: '#fff', fontFamily: 'Nunito_700Bold', fontSize: 48, marginBottom: 10 },
  grade: { color: '#fff', fontFamily: 'Nunito_400Regular', fontSize: 18, textAlign: 'center', marginBottom: 6 },
  meta: { color: '#fff', fontFamily: 'Nunito_400Regular', fontSize: 14, marginBottom: 4 },
  badge: { backgroundColor: '#FFD700', color: '#111', fontFamily: 'Nunito_700Bold', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, marginBottom: 16, marginTop: 6 },
  button: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, paddingVertical: 12, width: '100%', marginBottom: 10 },
  buttonText: { color: '#fff', textAlign: 'center', fontFamily: 'Nunito_700Bold', fontSize: 16 },
  fallback: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }
});
