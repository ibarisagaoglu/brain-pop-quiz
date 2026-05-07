import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import questions from '../data/questions';
import { getDifficultyBreakdown, getTimerPerQuestion } from '../utils/helpers';
import { useTranslation } from '../utils/i18n';
import { useSettings } from '../utils/settings';

export default function QuestionCountScreen({ navigation, route }) {
  const category = route?.params?.category || 'mixed';
  const { settings } = useSettings();
  const { t } = useTranslation();
  const [questionCount, setQuestionCount] = useState(settings.settings_default_question_count || 10);

  const timerPerQuestion = useMemo(() => getTimerPerQuestion(questionCount), [questionCount]);
  const estimatedTime = timerPerQuestion * questionCount;
  const breakdown = useMemo(
    () => getDifficultyBreakdown(questions, category, questionCount),
    [category, questionCount]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category} {t('question_setup_title')}</Text>
      <Text style={styles.value}>{t('question_setup_questions')}: {questionCount}</Text>
      <Slider
        value={questionCount}
        minimumValue={10}
        maximumValue={100}
        step={5}
        minimumTrackTintColor="#4CAF50"
        maximumTrackTintColor="#FFFFFF66"
        thumbTintColor="#4CAF50"
        onValueChange={(value) => setQuestionCount(value)}
      />

      <View style={styles.card}>
        <Text style={styles.cardText}>{t('question_setup_timer_per_question')}: {timerPerQuestion}s</Text>
        <Text style={styles.cardText}>{t('question_setup_estimated_total')}: {estimatedTime}s</Text>
        <Text style={styles.cardText}>{t('question_setup_easy')}: {breakdown.easy}</Text>
        <Text style={styles.cardText}>{t('question_setup_medium')}: {breakdown.medium}</Text>
        <Text style={styles.cardText}>{t('question_setup_hard')}: {breakdown.hard}</Text>
      </View>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Quiz', { category, questionCount })}
      >
        <Text style={styles.buttonText}>{t('question_setup_start')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', padding: 24, justifyContent: 'center' },
  title: { color: '#fff', fontFamily: 'Nunito_700Bold', fontSize: 28, textAlign: 'center', marginBottom: 20 },
  value: { color: '#fff', fontFamily: 'Nunito_700Bold', fontSize: 20, textAlign: 'center', marginBottom: 12 },
  card: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: 16, marginTop: 16 },
  cardText: { color: '#fff', fontFamily: 'Nunito_400Regular', marginBottom: 6 },
  button: { backgroundColor: '#4CAF50', borderRadius: 14, paddingVertical: 14, marginTop: 20 },
  buttonText: { color: '#fff', textAlign: 'center', fontFamily: 'Nunito_700Bold', fontSize: 18 }
});
