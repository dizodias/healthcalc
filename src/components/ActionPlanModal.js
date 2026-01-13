import React from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

const labelTreino = {
  '0': 'Sedentário',
  '1-2': '1-2x/Semana',
  '3-4': '3-4x/Semana',
  '5+': 'Intenso (5+)',
};

export default function ActionPlanModal({ visible, onClose, data }) {
  if (!data) return null;

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <BlurView intensity={90} tint="dark" style={styles.container}>
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Avaliação de {data.nome.split(' ')[0]}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={20}>
               <Ionicons name="close-circle" size={30} color="rgba(255,255,255,0.3)" />
            </TouchableOpacity>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* 1. RESUMO DOS DADOS */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📋 Dados Originais</Text>
              <View style={styles.dataGrid}>
                <View style={styles.dataItem}><Text style={styles.label}>Idade</Text><Text style={styles.value}>{data.idade} anos</Text></View>
                <View style={styles.dataItem}><Text style={styles.label}>Peso</Text><Text style={styles.value}>{data.peso} kg</Text></View>
                <View style={styles.dataItem}><Text style={styles.label}>IMC</Text><Text style={[styles.value, {color: data.cor}]}>{data.imc}</Text></View>
                <View style={styles.dataItem}><Text style={styles.label}>Treino</Text><Text style={styles.value}>{labelTreino[data.frequenciaExercicio] || '-'}</Text></View>
              </View>
            </View>

            {/* 2. PLANO ALIMENTAR SIMPLIFICADO */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🍽️ Sua Meta: {data.plano.objetivo}</Text>
              <Text style={styles.highlightText}>
                {data.plano.objetivo === 'Perder Gordura' ? '🔥 Meta: ' : '🍲 Meta: '} 
                {data.plano.caloriasDiarias} kcal/dia
              </Text>
              <Text style={styles.text}>{data.plano.acaoCalorica}</Text>
            </View>

            {/* 3. EXERCÍCIOS */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💪 O que fazer?</Text>
              {data.plano.exercicios.map((ex, index) => (
                <View key={index} style={styles.row}>
                  <Text style={styles.boldText}>{ex.tipo}</Text>
                  <Text style={styles.subText}>{ex.tempo} ({ex.gasto})</Text>
                </View>
              ))}
            </View>

            {/* 4. HIDRATAÇÃO */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💧 Água</Text>
              <Text style={styles.text}>
                Você bebeu: {data.aguaIngerida}L {'\n'}
                O ideal seria: {data.aguaMeta}L
              </Text>
              <Text style={[styles.statusText, { color: data.aguaIngerida >= data.aguaMeta ? '#32D74B' : '#FF9500' }]}>
                {data.aguaIngerida >= data.aguaMeta ? 'Parabéns, meta batida!' : 'Tente beber um pouco mais.'}
              </Text>
            </View>

            {/* 5. DISCLAIMER */}
            <View style={styles.disclaimerBox}>
              <Ionicons name="medical" size={20} color="#FF9F0A" style={{marginBottom: 5}} />
              <Text style={styles.disclaimerTitle}>Importante</Text>
              <Text style={styles.disclaimerText}>
                Este aplicativo fornece estimativas baseadas em fórmulas matemáticas.
                Os resultados não substituem o acompanhamento de um Médico, Nutricionista ou Educador Físico.
                Faça check-ups anuais e nunca inicie dietas restritivas sem orientação profissional.
              </Text>
            </View>
            
            <View style={{height: 20}}/>
          </ScrollView>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  content: { backgroundColor: 'rgba(28, 28, 30, 0.95)', width: '100%', maxHeight: '90%', borderRadius: 25, padding: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  section: { marginBottom: 15, backgroundColor: 'rgba(255,255,255,0.05)', padding: 15, borderRadius: 15 },
  sectionTitle: { color: '#0A84FF', fontSize: 13, fontWeight: '800', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  
  dataGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  dataItem: { width: '45%', marginBottom: 5 },
  label: { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 'bold' },
  value: { color: 'white', fontSize: 14, fontWeight: '600' },
  
  text: { color: '#E5E5EA', fontSize: 14, lineHeight: 22 },
  statusText: { fontWeight: 'bold', marginTop: 5, fontSize: 13 },
  highlightText: { color: '#FF9F0A', fontSize: 22, fontWeight: '800', marginBottom: 8 },
  
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)', paddingBottom: 8 },
  boldText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  subText: { color: '#8E8E93', fontSize: 12 },

  // Estilos do Disclaimer
  disclaimerBox: { 
    marginTop: 10, 
    padding: 15, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 159, 10, 0.3)',
    backgroundColor: 'rgba(255, 159, 10, 0.05)',
    alignItems: 'center'
  },
  disclaimerTitle: { color: '#FF9F0A', fontWeight: 'bold', fontSize: 12, marginBottom: 4, textTransform: 'uppercase' },
  disclaimerText: { color: 'rgba(255,255,255,0.6)', fontSize: 11, textAlign: 'center', lineHeight: 16 }
});