import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import { auth, db } from '../firebase/config';

const googleDiscovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token'
};

export const signInWithGoogle = async () => {
  try {
    const state = Crypto.randomUUID();
    const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });

    const request = new AuthSession.AuthRequest({
      clientId: 'YOUR_GOOGLE_WEB_CLIENT_ID',
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.Token,
      redirectUri,
      state
    });

    await request.makeAuthUrlAsync(googleDiscovery);
    const result = await request.promptAsync(googleDiscovery);

    if (result.type !== 'success') return null;

    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${result.params.access_token}` }
    });
    const profile = await userInfoResponse.json();

    return {
      uid: profile.id,
      email: profile.email,
      displayName: profile.name,
      photoURL: profile.picture
    };
  } catch (error) {
    console.log('Google sign-in failed');
    return null;
  }
};

export const signOut = async () => {
  try {
    if (auth?.signOut) {
      await auth.signOut();
    }
  } catch (error) {
    console.log('Sign out failed');
  }
};

export const disconnectAccount = async () => {
  try {
    await signOut();
    return true;
  } catch (error) {
    console.log('Disconnect failed');
    return false;
  }
};

const deleteSubCollection = async (docRef, subPath) => {
  const collectionRef = docRef.collection(subPath);
  const snapshot = await collectionRef.get();
  if (snapshot.empty) return;
  const batch = db.batch();
  snapshot.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
};

export const deleteUserData = async (uid) => {
  if (!db || !uid) return false;

  try {
    const userRef = db.collection('users').doc(uid);
    const scoresRef = db.collection('scores').doc(uid);

    await deleteSubCollection(scoresRef, 'categoryScores');

    await Promise.all([
      userRef.delete().catch(() => null),
      scoresRef.delete().catch(() => null)
    ]);

    return true;
  } catch (error) {
    console.log('Delete user data failed');
    return false;
  }
};

export const checkUsernameAvailable = async (username) => {
  const normalized = (username || '').trim().toLowerCase();
  if (!normalized) return false;

  try {
    if (!db) return true;
    const snapshot = await db
      .collection('users')
      .where('username', '==', normalized)
      .limit(1)
      .get();
    return snapshot.empty;
  } catch (error) {
    console.log('Username check failed');
    return false;
  }
};

export const createUserProfile = async (uid, data) => {
  try {
    if (!db) return { uid, ...data };
    await db.collection('users').doc(uid).set(data);
    return { uid, ...data };
  } catch (error) {
    console.log('Create profile failed');
    return null;
  }
};

export const updateUserProfile = async (uid, data) => {
  try {
    if (!db) return data;
    await db.collection('users').doc(uid).set(data, { merge: true });
    return data;
  } catch (error) {
    console.log('Update profile failed');
    return null;
  }
};

export const getUserProfile = async (uid) => {
  try {
    if (!db) return null;
    const doc = await db.collection('users').doc(uid).get();
    if (!doc.exists) return null;
    return doc.data();
  } catch (error) {
    console.log('Get profile failed');
    return null;
  }
};
