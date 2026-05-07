import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext(null);

const SOUND_KEY = 'soundEnabled';
const USER_KEY = 'authUser';
const GUEST_KEY = 'guestMode';

export function AppProvider({ children }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [authUser, setAuthUser] = useState(null);
  const [guestMode, setGuestMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const [sound, user, guest] = await Promise.all([
          AsyncStorage.getItem(SOUND_KEY),
          AsyncStorage.getItem(USER_KEY),
          AsyncStorage.getItem(GUEST_KEY)
        ]);
        if (sound !== null) setSoundEnabled(sound === 'true');
        if (user) setAuthUser(JSON.parse(user));
        if (guest === 'true') setGuestMode(true);
      } catch (error) {
        console.log('Failed to restore app preferences');
      } finally {
        setLoading(false);
      }
    };

    hydrate();
  }, []);

  const toggleSound = async () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    try {
      await AsyncStorage.setItem(SOUND_KEY, String(next));
    } catch (error) {
      console.log('Failed to save sound preference');
    }
  };

  const signInAsGuest = async () => {
    setGuestMode(true);
    setAuthUser(null);
    try {
      await AsyncStorage.multiSet([[GUEST_KEY, 'true'], [USER_KEY, '']]);
    } catch (error) {
      console.log('Failed to set guest mode');
    }
  };

  const setSignedInUser = async (user) => {
    setAuthUser(user);
    setGuestMode(false);
    try {
      await AsyncStorage.multiSet([[USER_KEY, JSON.stringify(user)], [GUEST_KEY, 'false']]);
    } catch (error) {
      console.log('Failed to save user session');
    }
  };

  const signOutLocal = async () => {
    setAuthUser(null);
    setGuestMode(false);
    try {
      await AsyncStorage.multiSet([[USER_KEY, ''], [GUEST_KEY, 'false']]);
    } catch (error) {
      console.log('Failed to clear user session');
    }
  };

  const value = useMemo(() => ({
    loading,
    soundEnabled,
    toggleSound,
    authUser,
    guestMode,
    signInAsGuest,
    setSignedInUser,
    signOutLocal
  }), [loading, soundEnabled, authUser, guestMode]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const value = useContext(AppContext);
  if (!value) throw new Error('useAppContext must be used within AppProvider');
  return value;
}
