import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import questions from '../data/questions';
import { getDifficultyBreakdown, getTimerPerQuestion } from '../utils/helpers';

export default function QuestionCountScreen({ navigation, route }) {
  const category = route?.params?.category || 'mixed';
  const [questionCount, setQuestionCount] = useState(10);

  const timerPerQuestion = useMemo(() => getTimerPerQuestion(questionCount), [questionCount]);
  const estimatedTime = timerPerQuestion * questionCount;
  const breakdown = useMemo(
    () => getDifficultyBreakdown(questions, category, questionCount),
    [category, questionCount]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category} Quiz Setup</Text>
      <Text style={styles.value}>Questions: {questionCount}</Text>
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
        <Text style={styles.cardText}>Timer per question: {timerPerQuestion}s</Text>
        <Text style={styles.cardText}>Estimated total: {estimatedTime}s</Text>
        <Text style={styles.cardText}>Easy: {breakdown.easy}</Text>
        <Text style={styles.cardText}>Medium: {breakdown.medium}</Text>
        <Text style={styles.cardText}>Hard: {breakdown.hard}</Text>
      </View>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Quiz', { category, questionCount })}
      >
        <Text style={styles.buttonText}>Start Quiz</Text>
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
