import { Audio } from 'expo-av';
import { Buffer } from 'buffer';

const soundCache = {
  correct: null,
  wrong: null,
  timeout: null,
  gameOver: null
};

const SAMPLE_RATE = 44100;

const createToneUri = (frequency, durationMs, volume = 0.45) => {
  const sampleCount = Math.floor((SAMPLE_RATE * durationMs) / 1000);
  const data = Buffer.alloc(44 + sampleCount * 2);

  data.write('RIFF', 0);
  data.writeUInt32LE(36 + sampleCount * 2, 4);
  data.write('WAVE', 8);
  data.write('fmt ', 12);
  data.writeUInt32LE(16, 16);
  data.writeUInt16LE(1, 20);
  data.writeUInt16LE(1, 22);
  data.writeUInt32LE(SAMPLE_RATE, 24);
  data.writeUInt32LE(SAMPLE_RATE * 2, 28);
  data.writeUInt16LE(2, 32);
  data.writeUInt16LE(16, 34);
  data.write('data', 36);
  data.writeUInt32LE(sampleCount * 2, 40);

  for (let i = 0; i < sampleCount; i += 1) {
    const t = i / SAMPLE_RATE;
    const envelope = Math.max(0, 1 - i / sampleCount);
    const sample = Math.sin(2 * Math.PI * frequency * t) * envelope * volume;
    data.writeInt16LE(Math.floor(sample * 32767), 44 + i * 2);
  }

  return `data:audio/wav;base64,${data.toString('base64')}`;
};

const safePlay = async (sound) => {
  if (!sound) return;
  try {
    await sound.replayAsync();
  } catch (error) {
    console.log('Audio playback failed');
  }
};

export const loadSounds = async () => {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true
    });

    const [correct, wrong, timeout, gameOver] = await Promise.all([
      Audio.Sound.createAsync({ uri: createToneUri(880, 150) }),
      Audio.Sound.createAsync({ uri: createToneUri(220, 180) }),
      Audio.Sound.createAsync({ uri: createToneUri(440, 120) }),
      Audio.Sound.createAsync({ uri: createToneUri(660, 350) })
    ]);

    soundCache.correct = correct.sound;
    soundCache.wrong = wrong.sound;
    soundCache.timeout = timeout.sound;
    soundCache.gameOver = gameOver.sound;
  } catch (error) {
    console.log('Sound preload failed');
  }
};

export const playCorrect = async () => {
  try {
    await safePlay(soundCache.correct);
  } catch (error) {
    console.log('Sound playback failed');
  }
};

export const playWrong = async () => {
  try {
    await safePlay(soundCache.wrong);
  } catch (error) {
    console.log('Sound playback failed');
  }
};

export const playTimeout = async () => {
  try {
    await safePlay(soundCache.timeout);
  } catch (error) {
    console.log('Sound playback failed');
  }
};

export const playGameOver = async () => {
  try {
    await safePlay(soundCache.gameOver);
  } catch (error) {
    console.log('Sound playback failed');
  }
};

export const unloadSounds = async () => {
  const entries = Object.keys(soundCache);
  await Promise.all(entries.map(async (key) => {
    const sound = soundCache[key];
    if (!sound) return;
    try {
      await sound.unloadAsync();
      soundCache[key] = null;
    } catch (error) {
      console.log('Sound unload failed');
    }
  }));
};
