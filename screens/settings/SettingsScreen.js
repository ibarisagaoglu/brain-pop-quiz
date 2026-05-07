import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View
} from 'react-native';
import Slider from '@react-native-community/slider';
import { CATEGORIES } from '../../utils/helpers';
import { useSettings } from '../../utils/settings';
import { useTranslation } from '../../utils/i18n';
import { useLanguage } from '../../utils/LanguageContext';
import { useAppContext } from '../../context/AppContext';
import { deleteUserData, disconnectAccount, signInWithGoogle, signOut } from '../../utils/auth';

const questionCountOptions = [10, 20, 30, 50, 100];
const delayOptions = [1000, 1500, 2000, 3000];

const languageOptions = [
  { code: 'en', labelKey: 'language_english' },
  { code: 'tr', labelKey: 'language_turkish' },
  { code: 'ru', labelKey: 'language_russian' },
  { code: 'fr', labelKey: 'language_french' },
  { code: 'de', labelKey: 'language_german' },
  { code: 'pl', labelKey: 'language_polish' }
];

function ToggleRow({ label, value, onChange }) {
  return (
    <View style={styles.rowBetween}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

function OptionRow({ label, values, selected, onSelect, formatValue }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.chipWrap}>
        {values.map((value) => (
          <Pressable
            key={String(value)}
            style={[styles.chip, selected === value && styles.chipActive]}
            onPress={() => onSelect(value)}
          >
            <Text style={styles.chipText}>{formatValue ? formatValue(value) : value}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function SettingsScreen({ navigation }) {
  const { settings, updateSetting, resetSettings } = useSettings();
  const { currentLanguage, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const { authUser, setSignedInUser, signInAsGuest, signOutLocal } = useAppContext();
  const [displayNameInput, setDisplayNameInput] = useState(settings.settings_display_name || authUser?.displayName || '');
  const [modalType, setModalType] = useState(null);

  const blockList = settings.settings_block_list || [];
  const defaultCategoryOptions = useMemo(() => [t('settings_default_any'), ...CATEGORIES], [t]);

  const openLink = (url) => Linking.openURL(url).catch(() => Alert.alert(t('common_error_restart')));

  const onGoogleSignIn = async () => {
    const user = await signInWithGoogle();
    if (!user) return;
    await setSignedInUser(user);
    navigation.navigate('AuthFlow', { screen: 'ProfileSetup', params: { user } });
  };

  const handleSignOut = async () => {
    await signOut();
    await signInAsGuest();
    setModalType(null);
    navigation.navigate('MainTabs');
  };

  const handleDisconnect = async () => {
    await disconnectAccount();
    await signInAsGuest();
    setModalType(null);
    navigation.navigate('MainTabs');
  };

  const handleDelete = async () => {
    if (authUser?.uid) {
      await deleteUserData(authUser.uid);
    }
    await signOut();
    await signOutLocal();
    await signInAsGuest();
    setModalType(null);
    navigation.navigate('MainTabs');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← {t('settings_back')}</Text>
        </Pressable>
        <Text style={styles.title}>{t('settings_title')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings_sound_music')}</Text>
          <ToggleRow
            label={t('settings_sound_effects')}
            value={settings.settings_sound}
            onChange={(value) => updateSetting('settings_sound', value)}
          />
          <ToggleRow
            label={t('settings_background_music')}
            value={settings.settings_music}
            onChange={(value) => updateSetting('settings_music', value)}
          />
          <Text style={styles.rowLabel}>{t('settings_master_volume')}: {settings.settings_volume}</Text>
          <Slider
            value={settings.settings_volume}
            minimumValue={0}
            maximumValue={100}
            step={1}
            minimumTrackTintColor="#4CAF50"
            maximumTrackTintColor="#9CA3AF"
            thumbTintColor="#4CAF50"
            onValueChange={(value) => updateSetting('settings_volume', value)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings_account')}</Text>
          {authUser ? (
            <>
              <View style={styles.accountCard}>
                <Image source={{ uri: authUser.photoURL || 'https://i.pravatar.cc/100' }} style={styles.avatar} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.accountText}>{authUser.username || authUser.displayName || 'player'}</Text>
                  <Text style={styles.accountSubtext}>{authUser.email || '-'}</Text>
                </View>
              </View>
              <Pressable style={styles.button} onPress={() => setModalType('signout')}><Text style={styles.buttonText}>{t('settings_sign_out')}</Text></Pressable>
              <Pressable style={styles.button} onPress={() => setModalType('disconnect')}><Text style={styles.buttonText}>{t('settings_disconnect_account')}</Text></Pressable>
              <Pressable style={styles.buttonDanger} onPress={() => setModalType('delete')}><Text style={styles.buttonText}>{t('settings_delete_account')}</Text></Pressable>
            </>
          ) : (
            <Pressable style={styles.button} onPress={onGoogleSignIn}><Text style={styles.buttonText}>{t('settings_signin_google')}</Text></Pressable>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings_language_title')}</Text>
          <View style={styles.languageGrid}>
            {languageOptions.map((item) => (
              <Pressable
                key={item.code}
                style={[styles.languageCard, currentLanguage === item.code && styles.languageCardActive]}
                onPress={async () => {
                  await setLanguage(item.code);
                  await updateSetting('settings_language', item.code);
                }}
              >
                <Text style={styles.languageText}>{t(item.labelKey)}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings_game_preferences')}</Text>
          <OptionRow
            label={t('settings_default_question_count')}
            values={questionCountOptions}
            selected={settings.settings_default_question_count}
            onSelect={(value) => updateSetting('settings_default_question_count', value)}
          />
          <OptionRow
            label={t('settings_default_category')}
            values={defaultCategoryOptions}
            selected={settings.settings_default_category}
            onSelect={(value) => updateSetting('settings_default_category', value)}
          />
          <ToggleRow
            label={t('settings_haptic_feedback')}
            value={settings.settings_haptics}
            onChange={(value) => updateSetting('settings_haptics', value)}
          />
          <ToggleRow
            label={t('settings_show_timer')}
            value={settings.settings_show_timer}
            onChange={(value) => updateSetting('settings_show_timer', value)}
          />
          <ToggleRow
            label={t('settings_show_correct_timeout')}
            value={settings.settings_show_correct_timeout}
            onChange={(value) => updateSetting('settings_show_correct_timeout', value)}
          />
          <OptionRow
            label={t('settings_auto_advance_delay')}
            values={delayOptions}
            selected={settings.settings_auto_advance_delay}
            onSelect={(value) => updateSetting('settings_auto_advance_delay', value)}
            formatValue={(value) => `${value / 1000}s`}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings_multiplayer')}</Text>
          <Text style={styles.rowLabel}>{t('settings_display_name')}</Text>
          <TextInput
            value={displayNameInput}
            onChangeText={setDisplayNameInput}
            style={styles.input}
            placeholder={t('settings_display_name')}
            placeholderTextColor="#9CA3AF"
            onBlur={() => updateSetting('settings_display_name', displayNameInput.trim())}
          />
          <ToggleRow
            label={t('settings_auto_accept')}
            value={settings.settings_auto_accept_friends}
            onChange={(value) => updateSetting('settings_auto_accept_friends', value)}
          />
          <ToggleRow
            label={t('settings_online_status')}
            value={settings.settings_show_online_status}
            onChange={(value) => updateSetting('settings_show_online_status', value)}
          />
          <Text style={[styles.rowLabel, { marginTop: 10 }]}>{t('settings_block_list')}</Text>
          {blockList.length ? blockList.map((item) => (
            <View key={item} style={styles.blockRow}>
              <Text style={styles.accountText}>{item}</Text>
              <Pressable onPress={() => updateSetting('settings_block_list', blockList.filter((entry) => entry !== item))}>
                <Text style={styles.linkText}>{t('settings_unblock')}</Text>
              </Pressable>
            </View>
          )) : <Text style={styles.accountSubtext}>—</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings_about')}</Text>
          <Text style={styles.accountSubtext}>{t('settings_version')}: 1.0.0</Text>
          <Pressable onPress={() => openLink('https://policies.google.com/privacy')}><Text style={styles.linkText}>{t('settings_privacy_policy')}</Text></Pressable>
          <Pressable onPress={() => openLink('https://example.com/terms')}><Text style={styles.linkText}>{t('settings_terms')}</Text></Pressable>
          <Pressable onPress={() => openLink('https://example.com/rate')}><Text style={styles.linkText}>{t('settings_rate')}</Text></Pressable>
          <Pressable onPress={() => openLink('mailto:feedback@brainpopquiz.app?subject=Brain%20Pop%20Quiz%20Feedback')}><Text style={styles.linkText}>{t('settings_feedback')}</Text></Pressable>
          <Pressable style={[styles.button, { marginTop: 12 }]} onPress={resetSettings}><Text style={styles.buttonText}>{t('settings_reset_all')}</Text></Pressable>
        </View>
      </ScrollView>

      <Modal transparent visible={!!modalType} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {modalType === 'signout' ? t('settings_signout_confirm') : modalType === 'disconnect' ? t('settings_disconnect_confirm') : t('settings_delete_warning')}
            </Text>
            <Pressable
              style={[styles.button, modalType === 'delete' && styles.buttonDanger]}
              onPress={() => {
                if (modalType === 'signout') handleSignOut();
                if (modalType === 'disconnect') handleDisconnect();
                if (modalType === 'delete') handleDelete();
              }}
            >
              <Text style={styles.buttonText}>{t('common_confirm')}</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => setModalType(null)}>
              <Text style={styles.buttonText}>{t('common_cancel')}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  topRow: { paddingTop: 48, paddingHorizontal: 16, paddingBottom: 10, flexDirection: 'row', alignItems: 'center' },
  backButton: { marginRight: 10 },
  backText: { color: '#93C5FD', fontFamily: 'Nunito_700Bold' },
  title: { color: '#fff', fontSize: 30, fontFamily: 'Nunito_700Bold' },
  content: { padding: 14, paddingBottom: 40 },
  section: { backgroundColor: '#1E293B', borderRadius: 12, padding: 12, marginBottom: 12 },
  sectionTitle: { color: '#fff', fontFamily: 'Nunito_700Bold', fontSize: 18, marginBottom: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  rowLabel: { color: '#E2E8F0', fontFamily: 'Nunito_700Bold', flex: 1, marginRight: 8 },
  accountCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 10 },
  accountText: { color: '#fff', fontFamily: 'Nunito_700Bold' },
  accountSubtext: { color: '#CBD5E1', fontFamily: 'Nunito_400Regular', marginBottom: 6 },
  button: { backgroundColor: '#334155', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12, marginBottom: 8 },
  buttonDanger: { backgroundColor: '#DC2626' },
  buttonText: { color: '#fff', textAlign: 'center', fontFamily: 'Nunito_700Bold' },
  languageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  languageCard: { width: '48%', backgroundColor: '#334155', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: 'transparent' },
  languageCardActive: { borderColor: '#4CAF50' },
  languageText: { color: '#fff', fontFamily: 'Nunito_700Bold' },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  chip: { backgroundColor: '#334155', borderRadius: 999, paddingVertical: 7, paddingHorizontal: 12 },
  chipActive: { backgroundColor: '#4CAF50' },
  chipText: { color: '#fff', fontFamily: 'Nunito_700Bold' },
  input: { backgroundColor: '#334155', borderRadius: 10, color: '#fff', padding: 10, marginBottom: 10, fontFamily: 'Nunito_700Bold' },
  blockRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, backgroundColor: '#334155', borderRadius: 8, padding: 8 },
  linkText: { color: '#93C5FD', fontFamily: 'Nunito_700Bold', marginBottom: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', padding: 20 },
  modalBox: { backgroundColor: '#1E293B', borderRadius: 12, padding: 16 },
  modalTitle: { color: '#fff', marginBottom: 12, fontFamily: 'Nunito_700Bold' }
});
