import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, ScrollView, 
  KeyboardAvoidingView, Platform, Keyboard, Alert, StyleSheet 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { calcularIMC, calcularAgua, calcularTDEE, obterDataFormatada, gerarPlanoDeAcao } from '../utils/healthCalculations';
import { temas } from '../theme/styles';
import GlassCard from '../components/GlassCard';
import InputLabel from '../components/InputLabel';
import SelectInput from '../components/SelectInput';
import ActionPlanModal from '../components/ActionPlanModal';

export default function Home() {

  // --- Global State ---
  const [escuro, setEscuro] = useState(false);
  const tema = escuro ? temas.escuro : temas.claro;

  // --- Form Data ---
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [aguaIngerida, setAguaIngerida] = useState('');
  
  // --- Context Data ---
  const [genero, setGenero] = useState('masculino');
  const [tipoTrabalho, setTipoTrabalho] = useState('escritorio'); 
  const [frequenciaExercicio, setFrequenciaExercicio] = useState('0');

  // --- App Logic ---
  const [registros, setRegistros] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [registroSelecionado, setRegistroSelecionado] = useState(null);

  const opcoesExercicio = [
    { label: 'Sedentário (Zero)', value: '0' },
    { label: '1 a 2 vezes/semana', value: '1-2' },
    { label: '3 a 4 vezes/semana', value: '3-4' },
    { label: '5+ vezes/semana (Intenso)', value: '5+' },
  ];

  function handleCalcular() {
    if (!nome || !idade || !peso || !altura) {
      Alert.alert('Dados Pendentes', 'Preencha todos os campos para prosseguir.');
      return;
    }

    const pesoNum = parseFloat(peso.replace(',', '.'));
    let alturaNum = parseFloat(altura.replace(',', '.'));
    const idadeNum = parseInt(idade);
    const aguaIngeridaNum = aguaIngerida ? parseFloat(aguaIngerida.replace(',', '.')) : 0;

    if (isNaN(pesoNum) || isNaN(alturaNum) || pesoNum <= 0) return;
    if (alturaNum > 3) alturaNum = alturaNum / 100;

    const resultadoIMC = calcularIMC(pesoNum, alturaNum);
    const metaAgua = calcularAgua(pesoNum, frequenciaExercicio);
    const tdee = calcularTDEE(pesoNum, alturaNum, idadeNum, genero, tipoTrabalho, frequenciaExercicio);
    const plano = gerarPlanoDeAcao(pesoNum, alturaNum, tdee, aguaIngeridaNum, metaAgua, frequenciaExercicio);

    const novoRegistro = {
      id: Date.now().toString(),
      nome, 
      idade, 
      genero,
      tipoTrabalho,
      frequenciaExercicio,
      peso: pesoNum, 
      altura: alturaNum,
      imc: resultadoIMC.valor,
      diagnostico: resultadoIMC.diagnostico,
      cor: resultadoIMC.cor,
      aguaIngerida: aguaIngeridaNum,
      aguaMeta: metaAgua,
      calorias: tdee,
      plano: plano,
      data: obterDataFormatada()
    };

    setRegistros([novoRegistro, ...registros]);
    Keyboard.dismiss();
    setNome(''); setPeso(''); setAguaIngerida('');
  }

  return (
    <LinearGradient colors={tema.gradiente} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style="light" />
        
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={[styles.titulo, { color: tema.titulo }]}>
            Health<Text style={{fontWeight:'300'}}>Calc</Text>
          </Text>
          <TouchableOpacity onPress={() => setEscuro(!escuro)} style={[styles.btnTema, { backgroundColor: tema.inputBg }]}>
            <Ionicons name={escuro ? "moon" : "sunny"} size={22} color={tema.texto} />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            
            {/* INPUT CARD */}
            <GlassCard escuro={escuro} theme={tema}>
              <Text style={[styles.sectionHeader, { color: tema.texto }]}>PERFIL BIOLÓGICO</Text>
              
              <View style={[styles.segmentedControl, { backgroundColor: tema.inputBg }]}>
                <TouchableOpacity 
                  style={[styles.segmentBtn, genero === 'masculino' && { backgroundColor: tema.vidroBg === 'light' ? '#FFF' : '#3f3f46' }]} 
                  onPress={() => setGenero('masculino')}>
                  <Text style={[styles.segmentText, { color: tema.texto }]}>Masculino</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.segmentBtn, genero === 'feminino' && { backgroundColor: tema.vidroBg === 'light' ? '#FFF' : '#3f3f46' }]} 
                  onPress={() => setGenero('feminino')}>
                  <Text style={[styles.segmentText, { color: tema.texto }]}>Feminino</Text>
                </TouchableOpacity>
              </View>

              <InputLabel label="Nome Completo" value={nome} onChange={setNome} theme={tema} />
              
              <View style={styles.row}>
                <InputLabel label="Idade" value={idade} onChange={setIdade} keyboard="numeric" metade theme={tema} />
                <InputLabel label="Peso (kg)" value={peso} onChange={setPeso} keyboard="numeric" metade theme={tema} />
              </View>
              <View style={styles.row}>
                <InputLabel label="Altura (m)" value={altura} onChange={setAltura} keyboard="numeric" metade theme={tema} />
                <InputLabel label="Água (L)" placeholder="Hoje" value={aguaIngerida} onChange={setAguaIngerida} keyboard="numeric" metade theme={tema} />
              </View>

              <View style={{height: 15}} />
              <Text style={[styles.sectionHeader, { color: tema.texto }]}>ROTINA & METABOLISMO</Text>
              
              <View style={{marginBottom: 10}}>
                <Text style={styles.labelSmall}>Ambiente de Trabalho</Text>
                <View style={[styles.segmentedControl, { backgroundColor: tema.inputBg }]}>
                  <TouchableOpacity 
                    style={[styles.segmentBtn, tipoTrabalho === 'escritorio' && { backgroundColor: tema.vidroBg === 'light' ? '#FFF' : '#3f3f46' }]} 
                    onPress={() => setTipoTrabalho('escritorio')}>
                    <Text style={[styles.segmentText, { color: tema.texto }]}>🏢 Escritório</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.segmentBtn, tipoTrabalho === 'fisico' && { backgroundColor: tema.vidroBg === 'light' ? '#FFF' : '#3f3f46' }]} 
                    onPress={() => setTipoTrabalho('fisico')}>
                    <Text style={[styles.segmentText, { color: tema.texto }]}>🔨 Ativo</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <SelectInput 
                label="Frequência de Treinos"
                value={frequenciaExercicio}
                options={opcoesExercicio}
                onSelect={setFrequenciaExercicio}
                theme={tema}
              />

              <TouchableOpacity style={[styles.btnCalcular, { backgroundColor: tema.accent }]} onPress={handleCalcular}>
                <Text style={styles.txtBtn}>Processar Avaliação</Text>
              </TouchableOpacity>
            </GlassCard>

            {/* RESULTS */}
            {registros.map((item) => (
              <TouchableOpacity key={item.id} onPress={() => { setRegistroSelecionado(item); setModalVisivel(true); }} activeOpacity={0.7}>
                <GlassCard escuro={escuro} theme={tema} style={styles.cardResult}>
                  <View style={styles.rowBetween}>
                    <View style={{flex: 1}}>
                      <Text style={[styles.cardTitle, { color: tema.texto }]}>{item.nome}</Text>
                      <Text style={[styles.cardSubtitle, { color: tema.placeholder }]}>{item.data} • {item.idade} anos</Text>
                      <View style={styles.badgesContainer}>
                        <View style={[styles.badge, { backgroundColor: 'rgba(255, 149, 0, 0.15)' }]}>
                           <Text style={[styles.badgeText, { color: '#FF9500' }]}>Meta: {item.plano.caloriasDiarias} kcal</Text>
                        </View>
                        <View style={[styles.badge, { backgroundColor: tema.inputBg }]}>
                           <Text style={[styles.badgeText, { color: tema.texto }]}>IMC {item.imc}</Text>
                        </View>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color={tema.placeholder} style={{alignSelf:'center'}} />
                  </View>
                </GlassCard>
              </TouchableOpacity>
            ))}

            {/* FOOTER */}
            <View style={styles.footerContainer}>
              <View style={styles.divider} />
              <View style={styles.footerContent}>
                <View>
                  <Text style={styles.footerName}>Lucas Geisler Dias</Text>
                  <Text style={styles.footerCourse}>Professor Vilson Moro • React Native Básico • Proway</Text>
                  <Text style={styles.footerDate}>Janeiro | 2026</Text>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                  <Text style={styles.footerLabel}>Fontes Científicas:</Text>
                  <Text style={styles.footerSource}>• Equação Harris-Benedict (1984)</Text>
                  <Text style={styles.footerSource}>• Diretrizes OMS (IMC/Hidratação)</Text>
                </View>
              </View>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>

        <ActionPlanModal visible={modalVisivel} onClose={() => setModalVisivel(false)} data={registroSelecionado} />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginTop: 10, marginBottom: 20 },
  titulo: { fontSize: 30, fontWeight: '700', letterSpacing: -0.5 },
  btnTema: { padding: 10, borderRadius: 50 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionHeader: { fontSize: 12, fontWeight: '700', opacity: 0.7, marginBottom: 10, marginTop: 5, letterSpacing: 1 },
  segmentedControl: { flexDirection: 'row', padding: 4, borderRadius: 10, marginBottom: 15 },
  segmentBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  segmentText: { fontSize: 13, fontWeight: '600' },
  labelSmall: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4, marginLeft: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  btnCalcular: { padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 20, shadowColor: "#000", shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 10 },
  txtBtn: { color: 'white', fontWeight: 'bold', fontSize: 16, letterSpacing: 0.5 },
  cardResult: { paddingVertical: 16, paddingHorizontal: 20, borderRadius: 18, marginBottom: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  cardTitle: { fontSize: 17, fontWeight: '600', marginBottom: 2 },
  cardSubtitle: { fontSize: 13, marginBottom: 8 },
  badgesContainer: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  
  // FOOTER STYLES
  footerContainer: { marginTop: 30, marginBottom: 20, opacity: 0.6 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: 15 },
  footerContent: { flexDirection: 'row', justifyContent: 'space-between' },
  footerName: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  footerCourse: { color: '#94a3b8', fontSize: 10, marginTop: 2 },
  footerDate: { color: '#64748b', fontSize: 10 },
  footerLabel: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold', marginBottom: 2 },
  footerSource: { color: '#64748b', fontSize: 9 }
});