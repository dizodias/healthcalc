/**
 * Módulo de Cálculos - HealthCalc
 * Focado em UX Clara e Linguagem Acessível
 */

// Cálculo do IMC com diagnóstico simples
export const calcularIMC = (peso, altura) => {
  const imc = peso / (altura * altura);
  let diagnostico = '', cor = '';

  if (imc < 18.5) { diagnostico = 'Abaixo do peso'; cor = '#FF9F0A'; }
  else if (imc < 24.9) { diagnostico = 'Peso Saudável'; cor = '#30D158'; }
  else if (imc < 29.9) { diagnostico = 'Sobrepeso'; cor = '#FFD60A'; }
  else { diagnostico = 'Obesidade'; cor = '#FF453A'; }

  return { valor: imc.toFixed(2), diagnostico, cor };
};

// Cálculo da necessidade diária de água em litros
export const calcularAgua = (peso, frequenciaExercicio) => {
  let baseMl = 35;
  if (frequenciaExercicio === '3-4') baseMl = 38;
  if (frequenciaExercicio === '5+') baseMl = 42;
  return ((peso * baseMl) / 1000).toFixed(1);
};

export const calcularTDEE = (peso, altura, idade, genero, tipoTrabalho, frequenciaExercicio) => {
  const alturaCm = altura * 100;
  
  // TMB (Harris-Benedict)
  let tmb = genero === 'masculino' 
    ? 88.36 + (13.4 * peso) + (4.8 * alturaCm) - (5.7 * idade)
    : 447.6 + (9.2 * peso) + (3.1 * alturaCm) - (4.3 * idade);

  // Fator de Atividade
  let fator = 1.2;
  if (tipoTrabalho === 'fisico') fator += 0.2;
  switch (frequenciaExercicio) {
    case '1-2': fator += 0.15; break;
    case '3-4': fator += 0.30; break;
    case '5+': fator += 0.50; break;
  }

  return parseInt(tmb * fator);
};

export const obterDataFormatada = () => new Date().toLocaleDateString('pt-BR');

// Geração de Plano de Ação
export const gerarPlanoDeAcao = (pesoAtual, altura, tdee, aguaIngerida, aguaMeta, frequenciaExercicio) => {
  const pesoIdeal = (22 * altura * altura);
  const diferenca = pesoAtual - pesoIdeal;
  
  let objetivo = '', acaoCalorica = '', caloriasDiarias = 0;
  let dicas = [], exercicios = [];

  const diferencaAgua = parseFloat(aguaMeta) - parseFloat(aguaIngerida);
  let statusAgua = diferencaAgua > 0 
    ? `⚠️ Beba mais ${diferencaAgua.toFixed(1)}L hoje.` 
    : `✅ Hidratação em dia!`;

  if (diferenca > 2) { 
    objetivo = 'Perder Gordura';
    const deficit = 500;
    caloriasDiarias = tdee - deficit;
    acaoCalorica = `Seu corpo gasta cerca de ${tdee} calorias por dia.\nPara emagrecer sem passar fome, sua meta é comer até ${caloriasDiarias} calorias diárias.`;
    dicas = ["Coma mais proteínas (ovos, frango) para não sentir fome.", "Evite doces e farinha branca.", statusAgua];

    if (frequenciaExercicio === '0' || frequenciaExercicio === '1-2') {
      exercicios = [
        { tipo: "Caminhada Rápida", tempo: "30 min todo dia", gasto: "Para começar a queimar" },
        { tipo: "Musculação Leve", tempo: "2x na semana", gasto: "Para fortalecer" }
      ];
    } else {
      exercicios = [
        { tipo: "Cardio Intenso", tempo: "30 min pós-treino", gasto: "Queima máxima" },
        { tipo: "Musculação", tempo: "4x na semana", gasto: "Acelerar metabolismo" }
      ];
    }

  } else if (diferenca < -2) {
    objetivo = 'Ganhar Massa';
    const superavit = 350;
    caloriasDiarias = tdee + superavit;
    acaoCalorica = `Seu corpo gasta ${tdee} calorias.\nPara ganhar músculos, você precisa comer mais do que gasta. Sua meta é ${caloriasDiarias} calorias por dia.`;
    
    dicas = ["Nunca pule refeições.", "Use azeite e abacate para calorias boas.", statusAgua];
    exercicios = [
      { tipo: "Treino Pesado", tempo: "45-60 min", gasto: "Foco em força" },
      { tipo: "Descanso", tempo: "Dormir 8h", gasto: "O músculo cresce no sono" }
    ];

  } else {
    objetivo = 'Manter Peso';
    caloriasDiarias = tdee;
    acaoCalorica = `Você está no peso ideal! Continue comendo cerca de ${tdee} calorias para se manter saudável e com energia.`;
    
    dicas = ["Mantenha sua rotina atual.", "Varie as frutas e legumes.", statusAgua];
    exercicios = [{ tipo: "Sua atividade favorita", tempo: "30 min", gasto: "Saúde e bem-estar" }];
  }

  if (caloriasDiarias < 1200) caloriasDiarias = 1200;

  return {
    pesoIdeal: pesoIdeal.toFixed(1),
    objetivo,
    acaoCalorica,
    caloriasDiarias: parseInt(caloriasDiarias),
    dicas,
    exercicios
  };
};