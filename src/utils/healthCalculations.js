/**
 * Módulo de Cálculos - HealthCalc
 */

export const calcularIMC = (peso, altura, t) => {
  const imc = peso / (altura * altura);
  let diagnostico = '', cor = '';

  if (imc < 18.5) { diagnostico = t('bmi.underweight'); cor = '#FF9F0A'; }
  else if (imc < 24.9) { diagnostico = t('bmi.normal'); cor = '#30D158'; }
  else if (imc < 29.9) { diagnostico = t('bmi.overweight'); cor = '#FFD60A'; }
  else { diagnostico = t('bmi.obese'); cor = '#FF453A'; }

  return { valor: imc.toFixed(2), diagnostico, cor };
};

export const calcularAgua = (peso, frequenciaExercicio) => {
  let baseMl = 35;
  if (frequenciaExercicio === '3-4') baseMl = 38;
  if (frequenciaExercicio === '5+') baseMl = 42;
  return ((peso * baseMl) / 1000).toFixed(2); // Retorna em Litros
};

export const calcularTDEE = (peso, altura, idade, genero, tipoTrabalho, frequenciaExercicio) => {
  const alturaCm = altura * 100;
  
  let tmb = genero === 'masculino' 
    ? 88.36 + (13.4 * peso) + (4.8 * alturaCm) - (5.7 * idade)
    : 447.6 + (9.2 * peso) + (3.1 * alturaCm) - (4.3 * idade);

  let fator = 1.2;
  if (tipoTrabalho === 'fisico') fator += 0.2;
  switch (frequenciaExercicio) {
    case '1-2': fator += 0.15; break;
    case '3-4': fator += 0.30; break;
    case '5+': fator += 0.50; break;
  }

  return parseInt(tmb * fator);
};

export const obterDataFormatada = () => {
  // Ajusta a data conforme o locale (ex: MM/DD/YYYY para US)
  return new Date().toLocaleDateString(); 
};

export const gerarPlanoDeAcao = (pesoAtual, altura, tdee, aguaIngerida, aguaMeta, frequenciaExercicio, t, isMetric) => {
  const pesoIdealKg = (22 * altura * altura);
  const diferencaKg = pesoAtual - pesoIdealKg;
  
  let objetivo = '', acaoCalorica = '', caloriasDiarias = 0;
  let dicas = [], exercicios = [];

  // Tratamento de Água (L ou oz)
  const diferencaAgua = parseFloat(aguaMeta) - parseFloat(aguaIngerida);
  const diffExibicao = isMetric ? diferencaAgua.toFixed(1) : (diferencaAgua * 33.814).toFixed(0);
  const unidadeAgua = isMetric ? 'L' : 'oz';
  
  let statusAgua = diferencaAgua > 0 
    ? t('plan.waterMore', { amount: diffExibicao, unit: unidadeAgua })
    : t('plan.waterOk');

  // Lógica de Calorias e Dicas (Mapeado pelo JSON)
  if (diferencaKg > 2) { 
    objetivo = t('plan.loseFat');
    caloriasDiarias = tdee - 500;
    acaoCalorica = t('plan.loseFatDesc', { tdee, caloriasDiarias });
    dicas = [t('plan.tips.protein'), t('plan.tips.noSweets'), statusAgua];
    
    exercicios = (frequenciaExercicio === '0' || frequenciaExercicio === '1-2')
      ? [ { tipo: t('plan.ex.walk'), tempo: "30 min", gasto: t('plan.ex.burn') }, { tipo: t('plan.ex.lightLift'), tempo: "2x", gasto: t('plan.ex.strength') } ]
      : [ { tipo: t('plan.ex.hiit'), tempo: "30 min", gasto: t('plan.ex.maxBurn') }, { tipo: t('plan.ex.lift'), tempo: "4x", gasto: t('plan.ex.metabolism') } ];

  } else if (diferencaKg < -2) {
    objetivo = t('plan.gainMuscle');
    caloriasDiarias = tdee + 350;
    acaoCalorica = t('plan.gainMuscleDesc', { tdee, caloriasDiarias });
    dicas = [t('plan.tips.noSkip'), t('plan.tips.goodFats'), statusAgua];
    
    exercicios = [
      { tipo: t('plan.ex.heavyLift'), tempo: "45-60 min", gasto: t('plan.ex.strengthFocus') },
      { tipo: t('plan.ex.rest'), tempo: "8h", gasto: t('plan.ex.grow') }
    ];
  } else {
    objetivo = t('plan.maintain');
    caloriasDiarias = tdee;
    acaoCalorica = t('plan.maintainDesc', { tdee });
    dicas = [t('plan.tips.routine'), t('plan.tips.veggies'), statusAgua];
    exercicios = [{ tipo: t('plan.ex.favorite'), tempo: "30 min", gasto: t('plan.ex.health') }];
  }

  if (caloriasDiarias < 1200) caloriasDiarias = 1200;

  return {
    pesoIdeal: isMetric ? pesoIdealKg.toFixed(1) : (pesoIdealKg * 2.20462).toFixed(1),
    objetivo,
    acaoCalorica,
    caloriasDiarias: parseInt(caloriasDiarias),
    dicas,
    exercicios
  };
};