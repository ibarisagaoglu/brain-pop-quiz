export const badgeDefinitions = [
  { id: 'first_game', name: 'First Step', emoji: '🎉', description: 'Play your first game', condition: 'totalGamesPlayed >= 1' },
  { id: 'perfect_score', name: 'Perfect Score', emoji: '💯', description: 'Get 100% in any game', condition: 'percentage === 100' },
  { id: 'speed_demon', name: 'Speed Demon', emoji: '⚡', description: 'Answer 5 questions in under 3 seconds each', condition: 'fastAnswers >= 5' },
  { id: 'veteran', name: 'Veteran', emoji: '🏆', description: 'Play 50 total games', condition: 'totalGamesPlayed >= 50' },
  { id: 'social_butterfly', name: 'Social Butterfly', emoji: '🦋', description: 'Add 5 friends', condition: 'friendsCount >= 5' },
  { id: 'weekly_champion', name: 'Weekly Champion', emoji: '👑', description: 'Win a weekly leaderboard', condition: 'weeklyWins >= 1' },
  { id: 'quiz_addict', name: 'Quiz Addict', emoji: '🔥', description: 'Play 7 days in a row', condition: 'streak >= 7' }
];

export const buildCategoryMasterBadgeId = (category) => `category_master_${category.toLowerCase().replace(/\s+/g, '_')}`;

export const getAllBadgeDefinitions = (categories = []) => ([
  ...badgeDefinitions,
  ...categories.map((category) => ({
    id: buildCategoryMasterBadgeId(category),
    name: `${category} Master`,
    emoji: '🥇',
    description: `Score above 80% in ${category} 3 times`,
    condition: `categoryWins.${category} >= 3`
  }))
]);

export const evaluateBadges = ({
  categories = [],
  existingBadges = [],
  percentage = 0,
  fastAnswers = 0,
  totalGamesPlayed = 0,
  friendsCount = 0,
  weeklyWins = 0,
  streak = 0,
  categoryHighScores = {},
  currentCategory
}) => {
  const next = new Set(existingBadges);

  if (totalGamesPlayed >= 1) next.add('first_game');
  if (percentage === 100) next.add('perfect_score');
  if (fastAnswers >= 5) next.add('speed_demon');
  if (totalGamesPlayed >= 50) next.add('veteran');
  if (friendsCount >= 5) next.add('social_butterfly');
  if (weeklyWins >= 1) next.add('weekly_champion');
  if (streak >= 7) next.add('quiz_addict');

  if (currentCategory && (categoryHighScores[currentCategory] || 0) >= 3) {
    next.add(buildCategoryMasterBadgeId(currentCategory));
  }

  getAllBadgeDefinitions(categories).forEach((badge) => {
    if (existingBadges.includes(badge.id)) next.add(badge.id);
  });

  return Array.from(next);
};
