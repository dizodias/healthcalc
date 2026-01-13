import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Home from './src/screens/Home';

export default function App() {
  return (
    <SafeAreaProvider>
      <Home />
    </SafeAreaProvider>
  );
}