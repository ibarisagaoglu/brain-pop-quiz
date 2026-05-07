import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import questions from '../data/questions';
import { calculateScore, getCategoryGradient, getRandomQuestions, shuffleArray } from '../utils/helpers';
import ProgressBar from '../components/ProgressBar';
import AnswerButton from '../components/AnswerButton';

const FALLBACK_TEXT = 'Oops! Something went wrong. Please restart the app.';

export default function QuizScreen({ route, navigation }) {
  const category = route?.params?.category || 'mixed';
  const quizQuestions = useMemo(() => getRandomQuestions(questions, category, 10), [category]);
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const timerRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scoreAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoopRef = useRef(null);

  const currentQuestion = quizQuestions[index];
  const shuffledOptions = useMemo(
    () => (currentQuestion ? shuffleArray(currentQuestion.options) : []),
    [currentQuestion]
  );

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, [index, fadeAnim]);

  useEffect(() => {
    if (timeLeft < 5) {
      if (pulseLoopRef.current) return;
      pulseLoopRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.12, duration: 320, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 320, useNativeDriver: true })
        ])
      );
      pulseLoopRef.current.start();
    } else if (pulseLoopRef.current) {
      pulseLoopRef.current.stop();
      pulseLoopRef.current = null;
      pulseAnim.setValue(1);
    }
  }, [timeLeft, pulseAnim]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    setTimeLeft(15);
    setSelected(null);
    setButtonsDisabled(false);
    clearTimer();

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => () => clearTimer(), []);

  const nextStep = (nextScore) => {
    setTimeout(() => {
      if (index >= quizQuestions.length - 1) {
        try {
          navigation.replace('Result', {
            score: nextScore,
            total: quizQuestions.length * 10,
            category
          });
        } catch (error) {
          console.log('Navigation failed');
        }
        return;
      }
      setIndex((prev) => prev + 1);
    }, 1500);
  };

  const onTimeout = async () => {
    setButtonsDisabled(true);
    setSelected('__timeout__');
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (error) {
      console.log('Haptics failed');
    }
    nextStep(score);
  };

  const onAnswer = async (choice) => {
    if (buttonsDisabled || !currentQuestion) return;
    clearTimer();
    setButtonsDisabled(true);
    setSelected(choice);

    const isCorrect = choice === currentQuestion.answer;
    const points = calculateScore(isCorrect, timeLeft);
    const nextScore = score + points;

    if (points > 0) {
      setScore(nextScore);
      Animated.spring(scoreAnim, { toValue: 1.18, useNativeDriver: true }).start(() => {
        Animated.spring(scoreAnim, { toValue: 1, useNativeDriver: true }).start();
      });
    }

    try {
      if (isCorrect) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    } catch (error) {
      console.log('Haptics failed');
    }

    nextStep(nextScore);
  };

  const getStatus = (option) => {
    if (!selected) return buttonsDisabled ? 'disabled' : null;
    if (option === currentQuestion.answer) return 'correct';
    if (selected === '__timeout__') return 'disabled';
    if (option === selected && option !== currentQuestion.answer) return 'wrong';
    return 'disabled';
  };

  try {
    if (!currentQuestion) {
      return (
        <View style={styles.fallback}>
          <Text>{FALLBACK_TEXT}</Text>
        </View>
      );
    }

    return (
      <LinearGradient colors={getCategoryGradient(category)} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar style="light" />
          <View style={styles.topBar}>
            <Animated.Text style={[styles.metaText, { transform: [{ scale: scoreAnim }] }]}>Score: {score}</Animated.Text>
            <Text style={styles.metaText}>{index + 1} / 10</Text>
            <Animated.Text style={[styles.metaText, timeLeft < 5 && styles.dangerText, { transform: [{ scale: pulseAnim }] }]}>
              {timeLeft}s
            </Animated.Text>
          </View>

          <ProgressBar current={index + 1} total={10} />

          <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
            <Text style={styles.questionEmoji}>{currentQuestion.emoji}</Text>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
          </Animated.View>

          <View>
            {shuffledOptions.map((option, optionIndex) => (
              <AnswerButton
                key={`${currentQuestion.id}-${option}`}
                label={String.fromCharCode(65 + optionIndex)}
                text={option}
                onPress={() => onAnswer(option)}
                status={getStatus(option)}
              />
            ))}
          </View>
        </SafeAreaView>
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
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: 18 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  metaText: { color: '#fff', fontFamily: 'Nunito_700Bold', fontSize: 18 },
  dangerText: { color: '#F44336' },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 16 },
  questionEmoji: { fontSize: 48, textAlign: 'center', marginBottom: 8 },
  questionText: { color: '#111', fontFamily: 'Nunito_700Bold', fontSize: 18, textAlign: 'center' },
  fallback: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }
});
