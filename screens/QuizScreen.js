import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import questions from '../data/questions';
import { calculateScore, getCategoryGradient, getRandomQuestions, getTimerPerQuestion, shuffleArray } from '../utils/helpers';
import ProgressBar from '../components/ProgressBar';
import AnswerButton from '../components/AnswerButton';
import { playCorrect, playTimeout, playWrong } from '../utils/sounds';
import { useAppContext } from '../context/AppContext';

const FALLBACK_TEXT = 'Oops! Something went wrong. Please restart the app.';

export default function QuizScreen({ route, navigation }) {
  const category = route?.params?.category || 'mixed';
  const questionCount = route?.params?.questionCount || 10;
  const timerPerQuestion = getTimerPerQuestion(questionCount);
  const quizQuestions = useMemo(() => getRandomQuestions(questions, category, questionCount), [category, questionCount]);
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timerPerQuestion);
  const [score, setScore] = useState(0);
  const [statuses, setStatuses] = useState({});
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [fastAnswers, setFastAnswers] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const timerRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scoreAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoopRef = useRef(null);
  const { soundEnabled } = useAppContext();

  const currentQuestion = quizQuestions[index];
  const shuffledOptions = useMemo(
    () => (currentQuestion ? shuffleArray(currentQuestion.options) : []),
    [currentQuestion]
  );

  const difficultyTracker = useMemo(() => ({ easy: 0, medium: 0, hard: 0 }), []);

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

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const nextStep = useCallback((nextScore) => {
    setTimeout(() => {
      if (index >= quizQuestions.length - 1) {
        try {
          const averageDifficulty = quizQuestions.reduce((sum, q) => {
            if (q.difficulty === 'hard') return sum + 3;
            if (q.difficulty === 'medium') return sum + 2;
            return sum + 1;
          }, 0) / quizQuestions.length;
          const difficultyBucket = averageDifficulty >= 2.5 ? 'hard' : averageDifficulty >= 1.5 ? 'medium' : 'easy';

          navigation.replace('Result', {
            score: nextScore,
            total: quizQuestions.length * 15,
            category,
            questionCount,
            correctAnswers,
            averageDifficulty: difficultyBucket,
            fastAnswers
          });
        } catch (error) {
          console.log('Navigation failed');
        }
        return;
      }
      setIndex((prev) => prev + 1);
    }, 1500);
  }, [index, quizQuestions, navigation, category, questionCount, correctAnswers, fastAnswers]);

  const onTimeout = useCallback(async () => {
    if (!currentQuestion) return;

    setButtonsDisabled(true);
    setStatuses(
      shuffledOptions.reduce((acc, option) => {
        if (option === currentQuestion.answer) acc[option] = 'revealed';
        else acc[option] = 'disabled';
        return acc;
      }, {})
    );

    if (soundEnabled) {
      await playTimeout();
    }

    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (error) {
      console.log('Haptics failed');
    }

    nextStep(score);
  }, [currentQuestion, shuffledOptions, soundEnabled, nextStep, score]);

  useEffect(() => {
    setTimeLeft(timerPerQuestion);
    setStatuses({});
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
  }, [index, timerPerQuestion, clearTimer, onTimeout]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const onAnswer = useCallback(async (choice) => {
    if (buttonsDisabled || !currentQuestion) return;

    clearTimer();
    setButtonsDisabled(true);

    const isCorrect = choice === currentQuestion.answer;
    const points = calculateScore(isCorrect, timeLeft);
    const nextScore = score + points;

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
      if (timeLeft >= timerPerQuestion - 3) setFastAnswers((prev) => prev + 1);
      setStatuses(shuffledOptions.reduce((acc, option) => {
        acc[option] = option === choice ? 'correct' : 'disabled';
        return acc;
      }, {}));
      if (soundEnabled) await playCorrect();
    } else {
      setStatuses(shuffledOptions.reduce((acc, option) => {
        if (option === choice) acc[option] = 'wrong';
        else if (option === currentQuestion.answer) acc[option] = 'revealed';
        else acc[option] = 'disabled';
        return acc;
      }, {}));
      if (soundEnabled) await playWrong();
    }

    if (points > 0) {
      setScore(nextScore);
      Animated.spring(scoreAnim, { toValue: 1.18, useNativeDriver: true }).start(() => {
        Animated.spring(scoreAnim, { toValue: 1, useNativeDriver: true }).start();
      });
    }

    try {
      if (isCorrect) await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      else await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (error) {
      console.log('Haptics failed');
    }

    difficultyTracker[currentQuestion.difficulty] += 1;
    nextStep(nextScore);
  }, [buttonsDisabled, currentQuestion, clearTimer, timeLeft, score, scoreAnim, nextStep, shuffledOptions, soundEnabled, timerPerQuestion, difficultyTracker]);

  const getStatus = (option) => statuses[option] || null;

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
            <Text style={styles.metaText}>{index + 1} / {questionCount}</Text>
            <Animated.Text style={[styles.metaText, timeLeft < 5 && styles.dangerText, { transform: [{ scale: pulseAnim }] }]}>
              {timeLeft}s
            </Animated.Text>
          </View>

          <ProgressBar current={index + 1} total={questionCount} />

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
