import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Home from './src/screens/Home';
import './src/locales';

export default function App() {
  return (
    <SafeAreaProvider>
      <Home />
    </SafeAreaProvider>
  );
}