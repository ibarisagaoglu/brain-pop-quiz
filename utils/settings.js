import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAudioSettings } from './sounds';

export const SETTINGS_DEFAULTS = {
  settings_sound: true,
  settings_music: false,
  settings_volume: 80,
  settings_language: 'en',
  settings_default_question_count: 10,
  settings_default_category: 'Any',
  settings_haptics: true,
  settings_show_timer: true,
  settings_show_correct_timeout: true,
  settings_auto_advance_delay: 1500,
  settings_display_name: '',
  settings_auto_accept_friends: false,
  settings_show_online_status: true,
  settings_block_list: []
};

const SETTINGS_KEYS = Object.keys(SETTINGS_DEFAULTS);
const SettingsContext = createContext(null);

const parseStoredValue = (key, value) => {
  if (value === null || value === undefined) return SETTINGS_DEFAULTS[key];

  const defaultValue = SETTINGS_DEFAULTS[key];
  if (typeof defaultValue === 'boolean') return value === 'true';
  if (typeof defaultValue === 'number') return Number(value);
  if (Array.isArray(defaultValue)) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : defaultValue;
    } catch (error) {
      return defaultValue;
    }
  }
  return value;
};

const serializeStoredValue = (value) => {
  if (Array.isArray(value) || typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

export async function loadAllSettings() {
  const entries = await AsyncStorage.multiGet(SETTINGS_KEYS);
  return entries.reduce((acc, [key, value]) => {
    acc[key] = parseStoredValue(key, value);
    return acc;
  }, { ...SETTINGS_DEFAULTS });
}

export async function saveSettings(key, value) {
  await AsyncStorage.setItem(key, serializeStoredValue(value));
}

export async function resetAllSettings() {
  await AsyncStorage.multiRemove(SETTINGS_KEYS);
  return { ...SETTINGS_DEFAULTS };
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({ ...SETTINGS_DEFAULTS });
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const loaded = await loadAllSettings();
        setSettings(loaded);
      } catch (error) {
        console.log('Failed to load settings');
      } finally {
        setSettingsLoaded(true);
      }
    };

    hydrate();
  }, []);

  useEffect(() => {
    setAudioSettings({
      soundEnabled: settings.settings_sound,
      musicEnabled: settings.settings_music,
      volume: settings.settings_volume
    });
  }, [settings.settings_sound, settings.settings_music, settings.settings_volume]);

  const updateSetting = async (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    try {
      await saveSettings(key, value);
    } catch (error) {
      console.log('Failed to save setting');
    }
  };

  const resetSettings = async () => {
    try {
      const defaults = await resetAllSettings();
      setSettings(defaults);
    } catch (error) {
      console.log('Failed to reset settings');
    }
  };

  const value = useMemo(() => ({
    settings,
    settingsLoaded,
    updateSetting,
    resetSettings
  }), [settings, settingsLoaded]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const value = useContext(SettingsContext);
  if (!value) throw new Error('useSettings must be used within SettingsProvider');
  return value;
}

export { SettingsContext };
