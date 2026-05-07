export const shuffleArray = (array) => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export const getRandomQuestions = (allQuestions, category, count) => {
  const filtered = category === 'mixed'
    ? allQuestions
    : allQuestions.filter((item) => item.category === category);
  return shuffleArray(filtered).slice(0, count);
};

export const calculateScore = (isCorrect, timeLeft) => {
  if (!isCorrect || timeLeft <= 0) {
    return 0;
  }
  if (timeLeft > 10) {
    return 15;
  }
  if (timeLeft >= 5) {
    return 10;
  }
  return 5;
};

export const getGrade = (percentage) => {
  if (percentage >= 90) return 'Perfect! Genius level!';
  if (percentage >= 70) return 'Amazing! Well done!';
  if (percentage >= 50) return 'Good job! Keep it up!';
  if (percentage >= 30) return 'Not bad! Try again!';
  return 'Keep practicing!';
};

export const getCategoryGradient = (category) => {
  const map = {
    Animals: ['#2E7D32', '#1B5E20'],
    Science: ['#3949AB', '#1A237E'],
    Geography: ['#00897B', '#004D40'],
    Sports: ['#EF6C00', '#E65100'],
    Food: ['#D81B60', '#880E4F'],
    History: ['#6D4C41', '#3E2723'],
    mixed: ['#1a1a2e', '#16213e']
  };
  return map[category] || ['#1a1a2e', '#16213e'];
};

export const getCategoryEmoji = (category) => {
  const map = {
    Animals: '🐾',
    Science: '🔬',
    Geography: '🌍',
    Sports: '🏅',
    Food: '🍔',
    History: '📜',
    mixed: '🎯'
  };
  return map[category] || '🧠';
};
