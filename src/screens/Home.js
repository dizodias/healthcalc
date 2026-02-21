import React, { useState, useMemo, useEffect } from 'react';
import { 
  View, Text, TouchableOpacity, ScrollView, 
  KeyboardAvoidingView, Platform, Keyboard, Alert, StyleSheet 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';

import { calcularIMC, calcularAgua, calcularTDEE, obterDataFormatada, gerarPlanoDeAcao } from '../utils/healthCalculations';
import { temas } from '../theme/styles';
import GlassCard from '../components/GlassCard';
import InputLabel from '../components/InputLabel';
import SelectInput from '../components/SelectInput';
import ActionPlanModal from '../components/ActionPlanModal';

export default function Home() {
  const { t, i18n } = useTranslation();

  // --- THEME & METRICS STATE ---
  const [escuro, setEscuro] = useState(false);
  const tema = escuro ? temas.escuro : temas.claro;
  const [isMetric, setIsMetric] = useState(true);

  // --- FORM DATA STATE ---
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [aguaIngerida, setAguaIngerida] = useState('');
  
  // --- CONTEXT DATA STATE ---
  const [genero, setGenero] = useState('masculino');
  const [tipoTrabalho, setTipoTrabalho] = useState('escritorio'); 
  const [frequenciaExercicio, setFrequenciaExercicio] = useState('0');

  // --- BUSINESS LOGIC STATE ---
  const [registros, setRegistros] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [registroSelecionado, setRegistroSelecionado] = useState(null);

  // --- EFFECTS ---
  useEffect(() => {
    setPeso('');
    setAltura('');
    setAguaIngerida('');
  }, [isMetric]);

  // --- MEMOIZED DATA ---
  const opcoesExercicio = useMemo(() => [
    { label: t('routine.freqOptions.sedentary'), value: '0' },
    { label: t('routine.freqOptions.light'), value: '1-2' },
    { label: t('routine.freqOptions.moderate'), value: '3-4' },
    { label: t('routine.freqOptions.intense'), value: '5+' },
  ], [t]);

  // --- HANDLERS ---
  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en-US' ? 'pt-BR' : 'en-US';
    i18n.changeLanguage(nextLang);
  };

  const handleCalcular = () => {
    if (!nome || !idade || !peso || !altura) {
      Alert.alert(t('alerts.missingData.title'), t('alerts.missingData.message'));
      return;
    }

    let pesoNum = parseFloat(peso.replace(',', '.'));
    let alturaNum = parseFloat(altura.replace(',', '.'));
    let aguaIngeridaNum = aguaIngerida ? parseFloat(aguaIngerida.replace(',', '.')) : 0;
    const idadeNum = parseInt(idade, 10);

    if (isNaN(pesoNum) || isNaN(alturaNum) || pesoNum <= 0) return;

    if (!isMetric) {
      pesoNum = pesoNum / 2.20462;
      alturaNum = alturaNum * 0.0254;
      aguaIngeridaNum = aguaIngeridaNum / 33.814;
    } else {
      if (alturaNum > 3) alturaNum = alturaNum / 100;
    }

    const resultadoIMC = calcularIMC(pesoNum, alturaNum, t);
    const metaAgua = calcularAgua(pesoNum, frequenciaExercicio);
    const tdee = calcularTDEE(pesoNum, alturaNum, idadeNum, genero, tipoTrabalho, frequenciaExercicio);
    const plano = gerarPlanoDeAcao(pesoNum, alturaNum, tdee, aguaIngeridaNum, metaAgua, frequenciaExercicio, t, isMetric);

    const novoRegistro = {
      id: Date.now().toString(),
      nome, 
      idade, 
      genero,
      tipoTrabalho,
      frequenciaExercicio,
      pesoOriginal: parseFloat(peso.replace(',', '.')), 
      alturaOriginal: parseFloat(altura.replace(',', '.')),
      unidadePeso: isMetric ? 'kg' : 'lbs',
      unidadeAgua: isMetric ? 'L' : 'oz',
      imc: resultadoIMC.valor,
      diagnostico: resultadoIMC.diagnostico,
      cor: resultadoIMC.cor,
      aguaIngerida: aguaIngeridaNum,
      aguaMeta: metaAgua,
      calorias: tdee,
      plano,
      data: obterDataFormatada()
    };

    setRegistros([novoRegistro, ...registros]);
    Keyboard.dismiss();
    setNome(''); 
    setPeso(''); 
    setAguaIngerida('');
  };

  // --- RENDER ---
  return (
    <LinearGradient colors={tema.gradiente} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style="light" />
        
        {/* HEADER SECTION */}
        <View style={styles.header}>
          <Text style={[styles.titulo, { color: tema.titulo }]}>
            {t('header.title').replace('Calc', '')}
            <Text style={{fontWeight:'300'}}>Calc</Text>
          </Text>

          <View style={styles.headerControls}>
            <TouchableOpacity onPress={() => setIsMetric(!isMetric)} activeOpacity={0.7}>
              <BlurView intensity={40} tint={escuro ? "dark" : "light"} style={styles.glassPill}>
                <Text style={[styles.langText, { color: tema.texto }]}>
                  {isMetric ? 'KG/M' : 'LBS/IN'}
                </Text>
              </BlurView>
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleLanguage} activeOpacity={0.7}>
              <BlurView intensity={40} tint={escuro ? "dark" : "light"} style={styles.glassPill}>
                <Text style={[styles.langText, { color: tema.texto }]}>
                  {t('language')}
                </Text>
              </BlurView>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setEscuro(!escuro)} style={[styles.btnTema, { backgroundColor: tema.inputBg }]}>
              <Ionicons name={escuro ? "moon" : "sunny"} size={22} color={tema.texto} />
            </TouchableOpacity>
          </View>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            
            {/* INPUT FORM SECTION */}
            <GlassCard escuro={escuro} theme={tema}>
              <Text style={[styles.sectionHeader, { color: tema.texto }]}>{t('profile.title')}</Text>
              
              <View style={[styles.segmentedControl, { backgroundColor: tema.inputBg }]}>
                <TouchableOpacity 
                  style={[styles.segmentBtn, genero === 'masculino' && { backgroundColor: tema.vidroBg === 'light' ? '#FFF' : '#3f3f46' }]} 
                  onPress={() => setGenero('masculino')}>
                  <Text style={[styles.segmentText, { color: tema.texto }]}>{t('profile.male')}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.segmentBtn, genero === 'feminino' && { backgroundColor: tema.vidroBg === 'light' ? '#FFF' : '#3f3f46' }]} 
                  onPress={() => setGenero('feminino')}>
                  <Text style={[styles.segmentText, { color: tema.texto }]}>{t('profile.female')}</Text>
                </TouchableOpacity>
              </View>

              <InputLabel label={t('profile.fullName')} value={nome} onChange={setNome} theme={tema} />
              
              <View style={styles.row}>
                <InputLabel label={t('profile.age')} value={idade} onChange={setIdade} keyboard="numeric" metade theme={tema} />
                <InputLabel label={isMetric ? t('profile.weightKg') : t('profile.weightLbs')} value={peso} onChange={setPeso} keyboard="numeric" metade theme={tema} />
              </View>
              <View style={styles.row}>
                <InputLabel label={isMetric ? t('profile.heightM') : t('profile.heightIn')} value={altura} onChange={setAltura} keyboard="numeric" metade theme={tema} />
                <InputLabel label={isMetric ? t('profile.waterL') : t('profile.waterOz')} placeholder={t('profile.waterPlaceholder')} value={aguaIngerida} onChange={setAguaIngerida} keyboard="numeric" metade theme={tema} />
              </View>

              <View style={{height: 15}} />
              <Text style={[styles.sectionHeader, { color: tema.texto }]}>{t('routine.title')}</Text>
              
              <View style={{marginBottom: 10}}>
                <Text style={styles.labelSmall}>{t('routine.workspace')}</Text>
                <View style={[styles.segmentedControl, { backgroundColor: tema.inputBg }]}>
                  <TouchableOpacity 
                    style={[styles.segmentBtn, tipoTrabalho === 'escritorio' && { backgroundColor: tema.vidroBg === 'light' ? '#FFF' : '#3f3f46' }]} 
                    onPress={() => setTipoTrabalho('escritorio')}>
                    <Text style={[styles.segmentText, { color: tema.texto }]}>{t('routine.office')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.segmentBtn, tipoTrabalho === 'fisico' && { backgroundColor: tema.vidroBg === 'light' ? '#FFF' : '#3f3f46' }]} 
                    onPress={() => setTipoTrabalho('fisico')}>
                    <Text style={[styles.segmentText, { color: tema.texto }]}>{t('routine.active')}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <SelectInput 
                label={t('routine.trainingFreq')}
                value={frequenciaExercicio}
                options={opcoesExercicio}
                onSelect={setFrequenciaExercicio}
                theme={tema}
              />

              <TouchableOpacity style={[styles.btnCalcular, { backgroundColor: tema.accent }]} onPress={handleCalcular}>
                <Text style={styles.txtBtn}>{t('button.calculate')}</Text>
              </TouchableOpacity>
            </GlassCard>

            {/* RESULTS SECTION */}
            {registros.map((item) => (
              <TouchableOpacity key={item.id} onPress={() => { setRegistroSelecionado(item); setModalVisivel(true); }} activeOpacity={0.7}>
                <GlassCard escuro={escuro} theme={tema} style={styles.cardResult}>
                  <View style={styles.rowBetween}>
                    <View style={{flex: 1}}>
                      <Text style={[styles.cardTitle, { color: tema.texto }]}>{item.nome}</Text>
                      <Text style={[styles.cardSubtitle, { color: tema.placeholder }]}>{item.data} • {item.idade} {t('profile.age').toLowerCase()}</Text>
                      <View style={styles.badgesContainer}>
                        <View style={[styles.badge, { backgroundColor: 'rgba(255, 149, 0, 0.15)' }]}>
                           <Text style={[styles.badgeText, { color: '#FF9500' }]}>{t('results.goal', { kcal: item.plano.caloriasDiarias })}</Text>
                        </View>
                        <View style={[styles.badge, { backgroundColor: tema.inputBg }]}>
                           <Text style={[styles.badgeText, { color: tema.texto }]}>{t('results.bmi', { bmi: item.imc })}</Text>
                        </View>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color={tema.placeholder} style={{alignSelf:'center'}} />
                  </View>
                </GlassCard>
              </TouchableOpacity>
            ))}

            {/* FOOTER SECTION */}
            <View style={styles.footerContainer}>
              <View style={styles.divider} />
              <View style={styles.footerContent}>
                <View>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                  <Text style={styles.footerLabel}>{t('footer.sources')}</Text>
                  <Text style={styles.footerSource}>{t('footer.source1')}</Text>
                  <Text style={styles.footerSource}>{t('footer.source2')}</Text>
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

// --- STYLESHEET ---
const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginTop: 10, marginBottom: 20 },
  titulo: { fontSize: 30, fontWeight: '700', letterSpacing: -0.5 },
  headerControls: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  glassPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)', shadowColor: 'rgba(31, 38, 135, 0.37)', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 32 },
  langText: { fontSize: 14, fontWeight: '700', letterSpacing: 1 },
  btnTema: { padding: 10, borderRadius: 50 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionHeader: { fontSize: 12, fontWeight: '700', opacity: 0.7, marginBottom: 10, marginTop: 5, letterSpacing: 1 },
  segmentedControl: { flexDirection: 'row', padding: 4, borderRadius: 10, marginBottom: 15 },
  segmentBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  segmentText: { fontSize: 13, fontWeight: '600' },
  labelSmall: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4, marginLeft: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  btnCalcular: { padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
  txtBtn: { color: 'white', fontWeight: 'bold', fontSize: 16, letterSpacing: 0.5 },
  cardResult: { paddingVertical: 16, paddingHorizontal: 20, borderRadius: 18, marginBottom: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  cardTitle: { fontSize: 17, fontWeight: '600', marginBottom: 2 },
  cardSubtitle: { fontSize: 13, marginBottom: 8 },
  badgesContainer: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  footerContainer: { marginTop: 30, marginBottom: 20, opacity: 0.6 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: 15 },
  footerContent: { flexDirection: 'row', justifyContent: 'space-between' },
  footerName: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  footerCourse: { color: '#94a3b8', fontSize: 10, marginTop: 2, width: '90%' },
  footerDate: { color: '#64748b', fontSize: 10 },
  footerLabel: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold', marginBottom: 2 },
  footerSource: { color: '#64748b', fontSize: 9 }
});