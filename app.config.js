/** @type {import('expo/config').ExpoConfig} */
module.exports = ({ config }) => ({
  ...config,
  // expo-speech-recognition needs a dev build (npx expo run:android). Omit plugin for Expo Go.
  plugins: [...(config.plugins ?? []), 'expo-localization'],
  extra: {
    ...config.extra,
    apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1',
  },
});
