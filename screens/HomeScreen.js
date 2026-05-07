import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScoreCard from '../components/ScoreCard';

const FALLBACK_TEXT = 'Oops! Something went wrong. Please restart the app.';

export default function HomeScreen({ navigation }) {
  const [bestScore, setBestScore] = useState(0);
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    const loadBest = async () => {
      try {
        const value = await AsyncStorage.getItem('bestScore_mixed');
        setBestScore(Number(value || 0));
      } catch (error) {
        console.log('Best score load failed');
        setBestScore(0);
      }
    };
    loadBest();
  }, []);

  const goToCategories = () => {
    try {
      navigation.navigate('Categories');
    } catch (error) {
      console.log('Navigation failed');
    }
  };

  const startQuickPlay = () => {
    try {
      navigation.navigate('Quiz', { category: 'mixed' });
    } catch (error) {
      console.log('Navigation failed');
    }
  };

  const resetScores = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const scoreKeys = keys.filter((key) => key.startsWith('bestScore_'));
      if (scoreKeys.length) {
        await AsyncStorage.multiRemove(scoreKeys);
      }
      setBestScore(0);
    } catch (error) {
      console.log('Score reset failed');
    } finally {
      setShowResetModal(false);
    }
  };

  try {
    return (
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
        <StatusBar style="light" />
        <Text style={styles.emoji}>🧠</Text>
        <Text style={styles.title}>Brain Pop Quiz</Text>
        <Text style={styles.subtitle}>Test your knowledge!</Text>

        <Pressable style={styles.primaryButton} onPress={goToCategories}>
          <Text style={styles.buttonText}>Start Game</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={startQuickPlay}>
          <Text style={styles.buttonText}>Quick Play</Text>
        </Pressable>

        <Pressable onLongPress={() => setShowResetModal(true)}>
          <View pointerEvents="none">
            <ScoreCard title="Best Mixed Score (Long press to reset)" score={`${bestScore} / 150`} />
          </View>
        </Pressable>

        <Modal transparent visible={showResetModal} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Reset all best scores?</Text>
              <Pressable style={styles.modalDanger} onPress={resetScores}>
                <Text style={styles.modalButtonText}>Reset All Scores</Text>
              </Pressable>
              <Pressable style={styles.modalCancel} onPress={() => setShowResetModal(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
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
  emoji: { fontSize: 64, marginBottom: 12 },
  title: { color: '#fff', fontFamily: 'Nunito_700Bold', fontSize: 36, textAlign: 'center' },
  subtitle: { color: 'rgba(255,255,255,0.8)', fontFamily: 'Nunito_400Regular', fontSize: 16, marginBottom: 22 },
  primaryButton: { backgroundColor: '#4CAF50', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 30, width: '100%', marginBottom: 12 },
  secondaryButton: { backgroundColor: '#3949AB', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 30, width: '100%', marginBottom: 12 },
  buttonText: { color: '#fff', textAlign: 'center', fontFamily: 'Nunito_700Bold', fontSize: 18 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  modalBox: { backgroundColor: '#fff', borderRadius: 14, padding: 20 },
  modalTitle: { fontSize: 18, fontFamily: 'Nunito_700Bold', color: '#111', marginBottom: 16 },
  modalDanger: { backgroundColor: '#F44336', borderRadius: 10, padding: 12, marginBottom: 8 },
  modalCancel: { backgroundColor: '#9E9E9E', borderRadius: 10, padding: 12 },
  modalButtonText: { color: '#fff', textAlign: 'center', fontFamily: 'Nunito_700Bold' },
  fallback: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }
});
