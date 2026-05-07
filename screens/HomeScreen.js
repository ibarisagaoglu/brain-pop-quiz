import React, { useCallback, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import ScoreCard from '../components/ScoreCard';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from '../utils/i18n';
import { useSettings } from '../utils/settings';

export default function HomeScreen({ navigation }) {
  const [bestScore, setBestScore] = useState(0);
  const [showResetModal, setShowResetModal] = useState(false);
  const { authUser, guestMode } = useAppContext();
  const { settings } = useSettings();
  const { t } = useTranslation();

  useFocusEffect(
    useCallback(() => {
      const loadBest = async () => {
        try {
          const value = await AsyncStorage.getItem('bestScore_mixed');
          setBestScore(Number(value || 0));
        } catch (error) {
          console.log(t('error_best_score_load'));
          setBestScore(0);
        }
      };
      loadBest();
    }, [t])
  );

  const quickPlayCategory = useMemo(() => {
    const selected = settings.settings_default_category;
    return !selected || selected === t('settings_default_any') || selected === 'Any' ? 'mixed' : selected;
  }, [settings.settings_default_category, t]);

  const resetScores = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const scoreKeys = keys.filter((key) => key.startsWith('bestScore_'));
      if (scoreKeys.length) await AsyncStorage.multiRemove(scoreKeys);
      setBestScore(0);
    } catch (error) {
      console.log('Score reset failed');
    } finally {
      setShowResetModal(false);
    }
  };

  const level = authUser?.level || 1;
  const xp = authUser?.xp || 0;
  const levelProgress = ((xp % 1000) / 1000) * 100;

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.headerRow}>
        <Pressable style={styles.iconButton} onPress={() => navigation.navigate('Multiplayer')}>
          <Text style={styles.iconText}>🎮</Text>
        </Pressable>
        <View style={styles.rightHeader}>
          {authUser ? (
            <>
              <Image source={{ uri: authUser.photoURL || 'https://i.pravatar.cc/80' }} style={styles.avatar} />
              <Text style={styles.level}>{t('home_level_short')} {level}</Text>
            </>
          ) : null}
          <Pressable style={styles.iconButton} onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.iconText}>⚙️</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.emoji}>🧠</Text>
      <Text style={styles.title}>{t('app_title')}</Text>
      <Text style={styles.subtitle}>{t('home_subtitle')}</Text>

      {authUser ? (
        <View style={styles.xpCard}>
          <Text style={styles.xpText}>XP: {xp} / {(Math.floor(xp / 1000) + 1) * 1000}</Text>
          <View style={styles.xpTrack}><View style={[styles.xpFill, { width: `${levelProgress}%` }]} /></View>
        </View>
      ) : null}

      {guestMode || !authUser ? (
        <Pressable style={styles.banner} onPress={() => navigation.navigate('AuthFlow', { screen: 'Login' })}>
          <Text style={styles.bannerText}>{t('home_signin_banner')}</Text>
        </Pressable>
      ) : null}

      <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('Categories')}>
        <Text style={styles.buttonText}>{t('home_start_game')}</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('QuestionCount', { category: quickPlayCategory })}>
        <Text style={styles.buttonText}>{t('home_quick_play')}</Text>
      </Pressable>

      <Pressable onLongPress={() => setShowResetModal(true)}>
        <View pointerEvents="none">
          <ScoreCard title={t('home_best_mixed_score')} score={`${bestScore}`} />
        </View>
      </Pressable>

      <Modal transparent visible={showResetModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{t('home_reset_scores_title')}</Text>
            <Pressable style={styles.modalDanger} onPress={resetScores}>
              <Text style={styles.modalButtonText}>{t('home_reset_scores_button')}</Text>
            </Pressable>
            <Pressable style={styles.modalCancel} onPress={() => setShowResetModal(false)}>
              <Text style={styles.modalButtonText}>{t('common_cancel')}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  headerRow: { position: 'absolute', top: 52, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rightHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 34, height: 34, borderRadius: 17, marginRight: 8, borderWidth: 1, borderColor: '#fff' },
  level: { color: '#fff', marginRight: 8, fontFamily: 'Nunito_700Bold' },
  iconButton: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 999, paddingVertical: 8, paddingHorizontal: 10 },
  iconText: { fontSize: 16 },
  emoji: { fontSize: 64, marginBottom: 12 },
  title: { color: '#fff', fontFamily: 'Nunito_700Bold', fontSize: 36, textAlign: 'center' },
  subtitle: { color: 'rgba(255,255,255,0.8)', fontFamily: 'Nunito_400Regular', fontSize: 16, marginBottom: 16 },
  xpCard: { width: '100%', marginBottom: 12 },
  xpText: { color: '#fff', fontFamily: 'Nunito_700Bold', marginBottom: 6 },
  xpTrack: { height: 10, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 999 },
  xpFill: { height: '100%', backgroundColor: '#4CAF50', borderRadius: 999 },
  banner: { width: '100%', backgroundColor: '#FFC107', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12, marginBottom: 12 },
  bannerText: { color: '#111', textAlign: 'center', fontFamily: 'Nunito_700Bold' },
  primaryButton: { backgroundColor: '#4CAF50', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 30, width: '100%', marginBottom: 12 },
  secondaryButton: { backgroundColor: '#3949AB', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 30, width: '100%', marginBottom: 12 },
  buttonText: { color: '#fff', textAlign: 'center', fontFamily: 'Nunito_700Bold', fontSize: 18 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  modalBox: { backgroundColor: '#fff', borderRadius: 14, padding: 20 },
  modalTitle: { fontSize: 18, fontFamily: 'Nunito_700Bold', color: '#111', marginBottom: 16 },
  modalDanger: { backgroundColor: '#F44336', borderRadius: 10, padding: 12, marginBottom: 8 },
  modalCancel: { backgroundColor: '#9E9E9E', borderRadius: 10, padding: 12 },
  modalButtonText: { color: '#fff', textAlign: 'center', fontFamily: 'Nunito_700Bold' }
});
