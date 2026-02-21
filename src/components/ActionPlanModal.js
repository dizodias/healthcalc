import React from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function ActionPlanModal({ visible, onClose, data }) {
  const { t } = useTranslation();

  if (!data) return null;

  // --- DATA MAPPING ---
  const genderMap = {
    'masculino': t('profile.male'),
    'feminino': t('profile.female')
  };

  const trainingMap = {
    '0': t('routine.freqOptions.sedentary'),
    '1-2': t('routine.freqOptions.light'),
    '3-4': t('routine.freqOptions.moderate'),
    '5+': t('routine.freqOptions.intense'),
  };

  // --- RENDER ---
  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <BlurView intensity={90} tint="dark" style={styles.container}>
        <View style={styles.content}>
          
          {/* HEADER */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>{t('modal.title', { name: data.nome.split(' ')[0] })}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={20}>
               <Ionicons name="close-circle" size={30} color="rgba(255,255,255,0.3)" />
            </TouchableOpacity>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            
            {/* 1. ORIGINAL DATA */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('modal.originalData')}</Text>
              <View style={styles.dataGrid}>
                <View style={styles.dataItem}>
                  <Text style={styles.label}>{t('modal.age')}</Text>
                  <Text style={styles.value}>{data.idade} {t('modal.years')}</Text>
                </View>
                <View style={styles.dataItem}>
                  <Text style={styles.label}>{t('modal.weight')}</Text>
                  <Text style={styles.value}>{data.pesoOriginal} {data.unidadePeso}</Text>
                </View>
                <View style={styles.dataItem}>
                  <Text style={styles.label}>{t('modal.height')}</Text>
                  <Text style={styles.value}>{data.alturaOriginal} {data.unidadePeso === 'kg' ? 'm' : 'in'}</Text>
                </View>
                <View style={styles.dataItem}>
                  <Text style={styles.label}>{t('modal.waterIntake')}</Text>
                  <Text style={styles.value}>{data.aguaIngerida} {data.unidadeAgua}</Text>
                </View>
                <View style={styles.dataItem}>
                  <Text style={styles.label}>{t('modal.gender')}</Text>
                  <Text style={styles.value}>{genderMap[data.genero] || data.genero}</Text>
                </View>
                <View style={styles.dataItem}>
                  <Text style={styles.label}>{t('modal.training')}</Text>
                  <Text style={styles.value}>{trainingMap[data.frequenciaExercicio] || data.frequenciaExercicio}</Text>
                </View>
              </View>
            </View>

            {/* 2. DIAGNOSIS */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('modal.diagnosis')}</Text>
              <View style={styles.row}>
                <Text style={styles.boldText}>{t('modal.bmi')}</Text>
                <Text style={[styles.boldText, { color: data.cor }]}>{data.imc} - {data.diagnostico}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.boldText}>{t('modal.tdee')}</Text>
                <Text style={styles.value}>{data.calorias} kcal</Text>
              </View>
            </View>

            {/* 3. ACTION PLAN */}
            <View style={[styles.section, { backgroundColor: 'rgba(10, 132, 255, 0.1)' }]}>
              <Text style={styles.sectionTitle}>{t('modal.actionPlan')}</Text>
              
              <Text style={styles.highlightText}>{data.plano.objetivo}</Text>
              <Text style={styles.text}>{data.plano.acaoCalorica}</Text>
              
              <View style={{ marginTop: 15 }}>
                <Text style={[styles.boldText, { color: '#0A84FF', marginBottom: 5 }]}>{t('modal.tips')}</Text>
                {data.plano.dicas.map((dica, i) => (
                  <Text key={i} style={styles.text}>• {dica}</Text>
                ))}
              </View>

              <View style={{ marginTop: 15 }}>
                <Text style={[styles.boldText, { color: '#30D158', marginBottom: 5 }]}>{t('modal.exercises')}</Text>
                {data.plano.exercicios.map((ex, i) => (
                  <View key={i} style={[styles.row, { borderBottomWidth: 0, marginBottom: 4, paddingBottom: 0 }]}>
                    <Text style={styles.boldText}>{ex.tipo}</Text>
                    <Text style={styles.subText}>{ex.tempo}</Text>
                  </View>
                ))}
              </View>
            </View>

          </ScrollView>
        </View>
      </BlurView>
    </Modal>
  );
}

// --- STYLESHEET ---
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end' },
  content: { backgroundColor: '#1C1C1E', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, maxHeight: '90%' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  section: { marginBottom: 15, backgroundColor: 'rgba(255,255,255,0.05)', padding: 15, borderRadius: 15 },
  sectionTitle: { color: '#0A84FF', fontSize: 13, fontWeight: '800', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  dataGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  dataItem: { width: '45%', marginBottom: 10 },
  label: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 'bold', marginBottom: 2 },
  value: { color: 'white', fontSize: 14, fontWeight: '600' },
  text: { color: '#E5E5EA', fontSize: 14, lineHeight: 22, marginBottom: 4 },
  highlightText: { color: '#FF9F0A', fontSize: 22, fontWeight: '800', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)', paddingBottom: 8 },
  boldText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  subText: { color: '#8E8E93', fontSize: 13 }
});