import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function ProgressBar({ current, total }) {
  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${progress}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 12,
    marginBottom: 16
  },
  fill: {
    height: '100%',
    backgroundColor: '#4CAF50'
  }
});
