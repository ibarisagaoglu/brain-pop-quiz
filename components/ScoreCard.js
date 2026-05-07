import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ScoreCard({ title, score }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.score}>{score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    alignItems: 'center'
  },
  title: {
    color: '#ffffff',
    fontFamily: 'Nunito_400Regular'
  },
  score: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Nunito_700Bold'
  }
});
