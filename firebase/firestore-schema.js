// users/{userId}
// {
//   uid: string,
//   email: string,
//   username: string, // unique, lowercase, 3-20 chars
//   displayName: string,
//   photoURL: string,
//   birthDate: { day: number, month: number, year: number },
//   createdAt: timestamp,
//   level: number, // starts at 1
//   xp: number, // starts at 0
//   totalGamesPlayed: number,
//   totalCorrectAnswers: number,
//   badges: string[], // array of badge IDs
//   friends: string[] // array of userIds
// }

// scores/{userId}/categoryScores/{category}
// {
//   category: string,
//   bestScore: number,
//   bestPercentage: number,
//   gamesPlayed: number,
//   lastPlayed: timestamp
// }

// leaderboard/{category}/scores/{userId}
// {
//   userId: string,
//   username: string,
//   photoURL: string,
//   score: number,
//   percentage: number,
//   timestamp: timestamp
// }

// weeklyLeaderboard/{weekId}/scores/{userId}
// {
//   userId: string,
//   username: string,
//   totalScore: number,
//   gamesPlayed: number
// }

// multiplayerRooms/{roomId}
// {
//   roomId: string,
//   status: 'waiting' | 'playing' | 'finished',
//   category: string,
//   questionCount: number,
//   createdBy: string,
//   players: {
//     [userId]: {
//       username: string,
//       score: number,
//       currentQuestion: number,
//       finished: boolean
//     }
//   },
//   questions: Question[], // shared question set
//   createdAt: timestamp
// }
