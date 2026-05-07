# Brain Pop Quiz

Brain Pop Quiz is a React Native + Expo SDK 54 trivia app with category quizzes,
authentication-ready Firebase integration, sound effects, social foundations, and
multiplayer room scaffolding.

## Features
- 26 categories and 2,600 total questions (100 per category)
- Question count selector (10–100, step 5)
- Dynamic timer scaling per selected question count
- Correct/wrong/revealed answer states with visual indicators
- AsyncStorage best score tracking by category and mixed mode
- Sound effects system with persisted mute/unmute toggle
- Auth flow: Google sign-in + profile setup
- Social screens: leaderboard, friends, profile
- Multiplayer foundation: room creation, lobby, quiz, result
- Bottom-tab navigation with guest access restrictions for social tabs

## Firebase Setup Instructions
1. Create a Firebase project at https://console.firebase.google.com.
2. Enable Authentication (Google), Firestore, Realtime Database, and Storage.
3. Copy your Firebase web/native config values.
4. Open `/firebase/config.js` and replace placeholder values in `firebaseConfig`.
5. Add Google OAuth client ID to `utils/auth.js` (`YOUR_GOOGLE_WEB_CLIENT_ID`).
6. Configure Firebase rules based on your security model.
7. Build native app (`npx expo run:android` / `npx expo run:ios`) for full RN Firebase support.
8. Review `/firebase/firestore-schema.js` for expected collection/document structure.

## Development
```bash
npm install
npx expo start
```

## Validation
```bash
npx expo install --fix
npx expo export --platform web
```
Expected: `Exported: dist`

## Updated Roadmap
- [x] Expanded categories and dynamic quiz setup
- [x] Firebase-ready auth/data architecture
- [x] Sound, social, and multiplayer foundations
- [ ] Full production Firebase auth token exchange
- [ ] Complete realtime multiplayer gameplay sync and anti-cheat
- [ ] Push notifications and daily challenge events
