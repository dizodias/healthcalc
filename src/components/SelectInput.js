import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

export default function SelectInput({ label, value, options, onSelect, theme }) {
  const [visible, setVisible] = useState(false);
  const selectedLabel = options.find(opt => opt.value === value)?.label || 'Selecione...';

  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity 
        style={[styles.inputButton, { backgroundColor: theme.inputBg }]} 
        onPress={() => setVisible(true)}
      >
        <Text style={[styles.inputText, { color: value ? theme.texto : theme.placeholder }]}>
          {selectedLabel}
        </Text>
        <Ionicons name="chevron-down" size={20} color={theme.placeholder} />
      </TouchableOpacity>

      <Modal transparent visible={visible} animationType="fade" onRequestClose={() => setVisible(false)}>
        <BlurView intensity={50} tint="dark" style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.vidroBg === 'light' ? '#FFF' : '#1C1C1E' }]}>
            <Text style={[styles.modalTitle, { color: theme.texto }]}>Selecione uma opção</Text>
            
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.optionItem, { borderBottomColor: theme.cardBorder }]}
                  onPress={() => {
                    onSelect(item.value);
                    setVisible(false);
                  }}
                >
                  <Text style={[styles.optionText, { color: theme.texto }]}>{item.label}</Text>
                  {value === item.value && <Ionicons name="checkmark" size={20} color={theme.accent} />}
                </TouchableOpacity>
              )}
            />
            
            <TouchableOpacity style={styles.closeButton} onPress={() => setVisible(false)}>
              <Text style={styles.closeText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: 'rgba(128,128,128,0.8)', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4, marginLeft: 4
  },
  inputButton: {
    padding: 14, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
  },
  inputText: { fontSize: 16 },
  modalOverlay: { flex: 1, justifyContent: 'center', padding: 20 },
  modalContent: { borderRadius: 20, padding: 20, maxHeight: '60%', overflow: 'hidden' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  optionItem: { paddingVertical: 15, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between' },
  optionText: { fontSize: 16 },
  closeButton: { marginTop: 15, padding: 15, alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.1)', borderRadius: 12 },
  closeText: { fontWeight: 'bold', color: '#FF453A' }
});