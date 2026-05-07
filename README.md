# Brain Pop Quiz

> A fun, free trivia quiz for all ages — no account needed, fully offline!

## About
Brain Pop Quiz is a colorful mobile trivia game built with React Native and
Expo SDK 54. Choose from 6 categories or jump into a quick mixed game.
Answer 10 questions, beat your best score, and challenge your friends!

## Features
- 6 categories: Animals, Science, Geography, Sports, Food, History
- 30 questions with more coming soon
- 15 second timer per question with fast answer bonus
- Best score saved per category
- Works fully offline — no account needed
- Colorful gradients and smooth animations
- Haptic feedback on correct and wrong answers

## Screenshots
_Coming soon_

## Tech Stack
- Expo SDK 54
- React Native 0.79.6
- React Navigation v7
- AsyncStorage
- expo-haptics
- expo-linear-gradient
- Nunito Google Font

## Getting Started
git clone https://github.com/ibarisagaoglu/brain-pop-quiz.git
cd brain-pop-quiz
npm install
npx expo start

Then scan the QR code with Expo Go app on your phone.

## How to Add Questions
Open data/questions.js and add a new object:
{
  id: 31,
  category: 'Animals',
  question: 'Your question here?',
  emoji: '🐘',
  options: ['Option A', 'Option B', 'Option C', 'Option D'],
  answer: 'Option A'
}

## Roadmap
- [ ] Dark mode
- [ ] Multiplayer mode
- [ ] Global leaderboard
- [ ] Sound effects
- [ ] More categories
- [ ] Daily challenge mode

## Contributing
1. Fork the repository
2. Create a branch: git checkout -b feature/my-feature
3. Commit your changes: git commit -m 'Add my feature'
4. Push: git push origin feature/my-feature
5. Open a Pull Request

## License
MIT

## FINAL VALIDATION CHECKLIST (must all pass before submitting PR):
1. Run: npx expo install --fix — confirm 0 version mismatches
2. Run: npx expo export --platform web — confirm "Exported to dist/"
3. Confirm these files exist: App.js, app.json, package.json, metro.config.js,
   babel.config.js, screens/HomeScreen.js, screens/CategoriesScreen.js,
   screens/QuizScreen.js, screens/ResultScreen.js, components/AnswerButton.js,
   components/ProgressBar.js, components/ScoreCard.js, data/questions.js,
   utils/helpers.js, assets/icon.png, assets/adaptive-icon.png, assets/splash.png
4. CodeQL scan: 0 alerts
5. No file references external paths outside this repository
