import React from 'react';
import { StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

/**
 * Componente GlassCard
 * Cria um container com efeito de vidro fosco (Glassmorphism).
 * * @param {ReactNode} children - Os elementos dentro do card
 * @param {Object} style - Estilos extras opcionais
 * @param {boolean} escuro - Define se o tema é dark mode
 * @param {Object} theme - Objeto de tema contendo cores e tints
 */
export default function GlassCard({ children, style, escuro, theme }) {
  return (
    <BlurView 
      intensity={escuro ? 40 : 60} 
      tint={theme.vidroTint} 
      style={[
        styles.card, 
        { 
          backgroundColor: theme.vidroBg, 
          borderColor: escuro ? '#333' : 'rgba(255,255,255,0.4)' 
        }, 
        style
      ]}
    >
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
});