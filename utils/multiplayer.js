import { rtdb } from '../firebase/config';

const randomRoomCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();

const roomRef = (roomId) => rtdb?.ref?.(`multiplayerRooms/${roomId}`) || null;

export const createRoom = async (userId, category, questionCount) => {
  const roomId = randomRoomCode();
  const ref = roomRef(roomId);
  if (!ref) return roomId;

  await ref.set({
    roomId,
    status: 'waiting',
    category,
    questionCount,
    createdBy: userId,
    players: {
      [userId]: {
        username: 'Host',
        score: 0,
        currentQuestion: 0,
        finished: false
      }
    },
    questions: [],
    createdAt: Date.now()
  });

  return roomId;
};

export const joinRoom = async (roomId, userId) => {
  const ref = roomRef(roomId);
  if (!ref) return;
  await ref.child(`players/${userId}`).set({
    username: `Player_${userId.slice(0, 4)}`,
    score: 0,
    currentQuestion: 0,
    finished: false
  });
};

export const updatePlayerScore = async (roomId, userId, score, questionIndex) => {
  const ref = roomRef(roomId);
  if (!ref) return;
  await ref.child(`players/${userId}`).update({ score, currentQuestion: questionIndex });
};

export const subscribeToRoom = (roomId, callback) => {
  const ref = roomRef(roomId);
  if (!ref) return () => {};
  ref.on('value', (snapshot) => callback(snapshot.val()));
  return () => ref.off('value');
};

export const leaveRoom = async (roomId, userId) => {
  const ref = roomRef(roomId);
  if (!ref) return;
  await ref.child(`players/${userId}`).remove();
};

export const startGame = async (roomId) => {
  const ref = roomRef(roomId);
  if (!ref) return;
  await ref.update({ status: 'playing', countdownStartedAt: Date.now() });
};
