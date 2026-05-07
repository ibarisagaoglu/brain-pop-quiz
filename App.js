import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import QuestionCountScreen from './screens/QuestionCountScreen';
import QuizScreen from './screens/QuizScreen';
import ResultScreen from './screens/ResultScreen';
import LoginScreen from './screens/auth/LoginScreen';
import ProfileSetupScreen from './screens/auth/ProfileSetupScreen';
import LeaderboardScreen from './screens/social/LeaderboardScreen';
import FriendsScreen from './screens/social/FriendsScreen';
import ProfileScreen from './screens/social/ProfileScreen';
import GuestLockScreen from './screens/social/GuestLockScreen';
import MultiplayerMenuScreen from './screens/multiplayer/MultiplayerMenuScreen';
import LobbyScreen from './screens/multiplayer/LobbyScreen';
import MultiplayerQuizScreen from './screens/multiplayer/MultiplayerQuizScreen';
import MultiplayerResultScreen from './screens/multiplayer/MultiplayerResultScreen';
import SettingsScreen from './screens/settings/SettingsScreen';
import { AppProvider, useAppContext } from './context/AppContext';
import { loadSounds, unloadSounds } from './utils/sounds';

SplashScreen.preventAutoHideAsync();

const RootStack = createStackNavigator();
const HomeStack = createStackNavigator();
const AuthStack = createStackNavigator();
const MultiplayerStack = createStackNavigator();
const Tabs = createBottomTabNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Categories" component={CategoriesScreen} />
      <HomeStack.Screen name="QuestionCount" component={QuestionCountScreen} />
      <HomeStack.Screen name="Quiz" component={QuizScreen} />
      <HomeStack.Screen name="Result" component={ResultScreen} />
      <HomeStack.Screen name="Settings" component={SettingsScreen} />
    </HomeStack.Navigator>
  );
}

function MultiplayerStackNavigator() {
  return (
    <MultiplayerStack.Navigator screenOptions={{ headerShown: false }}>
      <MultiplayerStack.Screen name="MultiplayerMenu" component={MultiplayerMenuScreen} />
      <MultiplayerStack.Screen name="Lobby" component={LobbyScreen} />
      <MultiplayerStack.Screen name="MultiplayerQuiz" component={MultiplayerQuizScreen} />
      <MultiplayerStack.Screen name="MultiplayerResult" component={MultiplayerResultScreen} />
    </MultiplayerStack.Navigator>
  );
}

function AuthStackNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    </AuthStack.Navigator>
  );
}

function MainTabs() {
  const { authUser, guestMode } = useAppContext();
  const locked = guestMode || !authUser;

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: '#111827', borderTopColor: '#1f2937' },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarIcon: ({ color, size }) => {
          const iconMap = {
            HomeTab: 'home-outline',
            LeaderboardTab: 'trophy-outline',
            FriendsTab: 'people-outline',
            ProfileTab: 'person-outline'
          };
          return <Ionicons name={iconMap[route.name]} size={size} color={color} />;
        }
      })}
    >
      <Tabs.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: 'Home' }} />
      <Tabs.Screen name="LeaderboardTab" component={locked ? GuestLockScreen : LeaderboardScreen} options={{ title: 'Leaderboard' }} />
      <Tabs.Screen name="FriendsTab" component={locked ? GuestLockScreen : FriendsScreen} options={{ title: 'Friends' }} />
      <Tabs.Screen name="ProfileTab" component={locked ? GuestLockScreen : ProfileScreen} options={{ title: 'Profile' }} />
    </Tabs.Navigator>
  );
}

function AppNavigation() {
  const { loading, authUser, guestMode } = useAppContext();

  useEffect(() => {
    loadSounds();
    return () => {
      unloadSounds();
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1a1a2e' }}>
        <ActivityIndicator color="#ffffff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {authUser || guestMode ? (
          <>
            <RootStack.Screen name="MainTabs" component={MainTabs} />
            <RootStack.Screen name="AuthFlow" component={AuthStackNavigator} />
            <RootStack.Screen name="Multiplayer" component={MultiplayerStackNavigator} />
          </>
        ) : (
          <>
            <RootStack.Screen name="AuthFlow" component={AuthStackNavigator} />
            <RootStack.Screen name="MainTabs" component={MainTabs} />
            <RootStack.Screen name="Multiplayer" component={MultiplayerStackNavigator} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold
  });

  const appReady = fontsLoaded || !!fontError;

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync().catch(() => null);
    }
  }, [appReady]);

  if (!appReady) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1a1a2e' }}>
        <ActivityIndicator color="#ffffff" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <AppNavigation />
      </AppProvider>
    </SafeAreaProvider>
  );
}
