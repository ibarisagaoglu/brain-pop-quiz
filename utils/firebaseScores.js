import { db } from '../firebase/config';
import { CATEGORIES } from './helpers';
import { evaluateBadges } from './badges';

const getWeekId = () => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const firstJan = new Date(Date.UTC(year, 0, 1));
  const day = Math.floor((now - firstJan) / 86400000);
  const week = Math.ceil((day + firstJan.getUTCDay() + 1) / 7);
  return `${year}-W${String(week).padStart(2, '0')}`;
};

const getMultiplier = (difficulty) => {
  if (difficulty === 'hard') return 2;
  if (difficulty === 'medium') return 1.5;
  return 1;
};

export const calculateXpGain = (correctAnswers = 0, difficulty = 'easy') => (
  Math.round(correctAnswers * 10 * getMultiplier(difficulty))
);

export const saveScoreToFirebase = async ({
  user,
  category,
  score,
  total,
  correctAnswers,
  averageDifficulty = 'easy',
  fastAnswers = 0
}) => {
  if (!db || !user?.uid) return null;

  const percentage = total ? Math.round((score / total) * 100) : 0;
  const xpGain = calculateXpGain(correctAnswers, averageDifficulty);
  const weekId = getWeekId();
  const categoryKey = category.toLowerCase().replace(/\s+/g, '_');
  const now = new Date();

  const userRef = db.collection('users').doc(user.uid);
  const scoreRef = db.collection('scores').doc(user.uid).collection('categoryScores').doc(categoryKey);
  const leaderboardRef = db.collection('leaderboard').doc(categoryKey).collection('scores').doc(user.uid);
  const weeklyRef = db.collection('weeklyLeaderboard').doc(weekId).collection('scores').doc(user.uid);

  await db.runTransaction(async (tx) => {
    const [userDoc, scoreDoc, weeklyDoc] = await Promise.all([
      tx.get(userRef),
      tx.get(scoreRef),
      tx.get(weeklyRef)
    ]);

    const userData = userDoc.exists ? userDoc.data() : {
      uid: user.uid,
      email: user.email || '',
      username: user.username || 'guest_user',
      displayName: user.displayName || 'Player',
      photoURL: user.photoURL || '',
      createdAt: now,
      level: 1,
      xp: 0,
      totalGamesPlayed: 0,
      totalCorrectAnswers: 0,
      badges: [],
      friends: [],
      streak: 0,
      weeklyWins: 0,
      categoryHighScores: {}
    };

    const existingCategory = scoreDoc.exists ? scoreDoc.data() : {
      category,
      bestScore: 0,
      bestPercentage: 0,
      gamesPlayed: 0,
      lastPlayed: now
    };

    const categoryHighScores = {
      ...(userData.categoryHighScores || {}),
      [category]: percentage >= 80 ? (userData.categoryHighScores?.[category] || 0) + 1 : (userData.categoryHighScores?.[category] || 0)
    };

    const nextXp = (userData.xp || 0) + xpGain;
    const nextLevel = Math.floor(nextXp / 1000) + 1;
    const nextGamesPlayed = (userData.totalGamesPlayed || 0) + 1;
    const nextCorrectAnswers = (userData.totalCorrectAnswers || 0) + correctAnswers;

    const badges = evaluateBadges({
      categories: CATEGORIES,
      existingBadges: userData.badges || [],
      percentage,
      fastAnswers,
      totalGamesPlayed: nextGamesPlayed,
      friendsCount: userData.friends?.length || 0,
      weeklyWins: userData.weeklyWins || 0,
      streak: userData.streak || 0,
      categoryHighScores,
      currentCategory: category
    });

    tx.set(userRef, {
      ...userData,
      xp: nextXp,
      level: nextLevel,
      totalGamesPlayed: nextGamesPlayed,
      totalCorrectAnswers: nextCorrectAnswers,
      badges,
      categoryHighScores,
      updatedAt: now
    }, { merge: true });

    tx.set(scoreRef, {
      category,
      bestScore: Math.max(existingCategory.bestScore || 0, score),
      bestPercentage: Math.max(existingCategory.bestPercentage || 0, percentage),
      gamesPlayed: (existingCategory.gamesPlayed || 0) + 1,
      lastPlayed: now
    }, { merge: true });

    tx.set(leaderboardRef, {
      userId: user.uid,
      username: userData.username || userData.displayName || 'player',
      photoURL: userData.photoURL || '',
      score,
      percentage,
      timestamp: now,
      level: nextLevel
    }, { merge: true });

    const weeklyData = weeklyDoc.exists ? weeklyDoc.data() : { totalScore: 0, gamesPlayed: 0 };
    tx.set(weeklyRef, {
      userId: user.uid,
      username: userData.username || userData.displayName || 'player',
      totalScore: (weeklyData.totalScore || 0) + score,
      gamesPlayed: (weeklyData.gamesPlayed || 0) + 1
    }, { merge: true });
  });

  return { xpGain };
};
