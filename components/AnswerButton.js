import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';

export default function AnswerButton({ label, text, onPress, status }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  };

  const styleForStatus = {
    correct: styles.correct,
    wrong: styles.wrong,
    disabled: styles.disabled
  }[status] || styles.default;

  const marker = status === 'correct' ? ' ✓' : status === 'wrong' ? ' ✕' : '';

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        disabled={status === 'disabled' || status === 'correct' || status === 'wrong'}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[styles.button, styleForStatus]}
      >
        <Text style={styles.label}>{label}. {text}{marker}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 10
  },
  default: {
    backgroundColor: '#ffffff'
  },
  correct: {
    backgroundColor: '#4CAF50'
  },
  wrong: {
    backgroundColor: '#F44336'
  },
  disabled: {
    backgroundColor: '#9E9E9E',
    opacity: 0.6
  },
  label: {
    color: '#111111',
    fontFamily: 'Nunito_700Bold',
    fontSize: 16
  }
});
