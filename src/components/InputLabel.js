import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function InputLabel({ 
  label, 
  value, 
  onChange, 
  theme, 
  placeholder, 
  keyboard = 'default', 
  metade = false 
}) {
  return (
    <View style={[
      styles.inputWrapper, 
      metade && styles.metade, 
      { backgroundColor: theme.inputBg }
    ]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, { color: theme.texto }]}
        placeholder={placeholder}
        placeholderTextColor={theme.placeholder}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboard}
        autoCorrect={false}
        autoComplete="off"
        spellCheck={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 12,
  },
  metade: {
    width: '48%',
  },
  label: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  input: {
    fontSize: 16,
    paddingVertical: 4,
  },
});