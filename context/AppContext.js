import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext(null);

const USER_KEY = 'authUser';
const GUEST_KEY = 'guestMode';

export function AppProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [guestMode, setGuestMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const [user, guest] = await Promise.all([
          AsyncStorage.getItem(USER_KEY),
          AsyncStorage.getItem(GUEST_KEY)
        ]);
        if (user) setAuthUser(JSON.parse(user));
        if (guest === 'true') setGuestMode(true);
      } catch (error) {
        console.log('Failed to restore user state');
      } finally {
        setLoading(false);
      }
    };

    hydrate();
  }, []);

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
    authUser,
    guestMode,
    signInAsGuest,
    setSignedInUser,
    signOutLocal
  }), [loading, authUser, guestMode]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const value = useContext(AppContext);
  if (!value) throw new Error('useAppContext must be used within AppProvider');
  return value;
}
