/**
 * Calculs INRA 2018 pour les besoins nutritionnels
 * Mode biologique
 */

// Types
export interface DairyCowNeeds {
  pv: number // Poids vif kg
  productionLait: number // kg/jour
  tauxButyreux: number // %
  stadeGestation: number // mois (0=non gestante, 7,8,9)
  primipare: boolean
  stageLactation: 'debut' | 'milieu' | 'fin'
  
  // Résultats
  uflEntretien: number
  uflProduction: number
  uflGestation: number
  uflCroissance: number
  uflTotal: number
  
  pdiEntretien: number
  pdiProduction: number
  pdiTotal: number
  
  msRecommandee: number
  capaciteIngestion: number
  
  calcium: number
  phosphore: number
  eauRecommandee: number
}

export interface BeefBullNeeds {
  pv: number // Poids vif kg
  gmq: number // Gain moyen quotidien (g/jour)
  age: number // mois
  
  // Résultats
  ufvEntretien: number
  ufvCroissance: number
  ufvTotal: number
  
  pdiTotal: number
  
  capaciteIngestion: number
  calcium: number
  phosphore: number
  eauRecommandee: number
}

export interface SheepNeeds {
  pv: number // Poids vif kg
  gmq: number // Gain moyen quotidien (g/jour)
  age: number // mois
  
  // Résultats
  uflEntretien: number
  uflCroissance: number
  uflTotal: number
  
  pdiTotal: number
  
  capaciteIngestion: number
  calcium: number
  phosphore: number
  eauRecommandee: number
}

// CALCULATEUR VACHES LAITIÈRES
export function calculateDairyCowNeeds(input: Omit<DairyCowNeeds, 'uflEntretien' | 'uflProduction' | 'uflGestation' | 'uflCroissance' | 'uflTotal' | 'pdiEntretien' | 'pdiProduction' | 'pdiTotal' | 'msRecommandee' | 'capaciteIngestion' | 'calcium' | 'phosphore' | 'eauRecommandee'>): DairyCowNeeds {
  const { pv, productionLait, tauxButyreux, stadeGestation, primipare, stageLactation } = input

  // UFL ENTRETIEN: 0.041 × PV^0.75
  const uflEntretien = 0.041 * Math.pow(pv, 0.75)

  // UFL PRODUCTION: 0.44 × kg lait
  // Correction selon taux butyreux: UFL = 0.4 + (0.006 × TB)
  const correctionTB = 0.4 + (0.006 * tauxButyreux)
  const uflProduction = correctionTB * productionLait

  // UFL GESTATION
  let uflGestation = 0
  if (stadeGestation === 7) {
    uflGestation = 0.8
  } else if (stadeGestation === 8) {
    uflGestation = 1.5
  } else if (stadeGestation === 9) {
    uflGestation = 3.0
  }

  // UFL CROISSANCE: 1 UFL si primipare
  const uflCroissance = primipare ? 1.0 : 0

  // UFL TOTAL
  const uflTotal = uflEntretien + uflProduction + uflGestation + uflCroissance

  // PDI ENTRETIEN: 3.25 × PV^0.75
  const pdiEntretien = 3.25 * Math.pow(pv, 0.75)

  // PDI PRODUCTION: 45 × kg lait × facteur stade
  let facteurStade = 1.0
  if (stageLactation === 'debut') facteurStade = 1.05
  else if (stageLactation === 'milieu') facteurStade = 1.0
  else if (stageLactation === 'fin') facteurStade = 0.95

  const pdiProduction = 45 * productionLait * facteurStade

  // PDI TOTAL
  const pdiTotal = pdiEntretien + pdiProduction

  // MS RECOMMANDÉE: % du PV selon production lait
  let pourcentageMS = 2.0 // Base
  if (productionLait > 20) pourcentageMS = 2.2
  if (productionLait > 25) pourcentageMS = 2.3
  if (productionLait > 30) pourcentageMS = 2.4
  
  const msRecommandee = (pv * pourcentageMS) / 100

  // CAPACITÉ D'INGESTION: 1.5% du PV en MS pour fourrage
  const capaciteIngestion = (pv * 1.5) / 100

  // MINÉRAUX (approximations)
  const calcium = pv * 0.008 + productionLait * 0.5
  const phosphore = pv * 0.005 + productionLait * 0.35

  // EAU: 4-5 L par kg lait + besoins entretien
  const eauRecommandee = productionLait * 4.5 + pv * 0.05

  return {
    pv,
    productionLait,
    tauxButyreux,
    stadeGestation,
    primipare,
    stageLactation,
    uflEntretien,
    uflProduction,
    uflGestation,
    uflCroissance,
    uflTotal,
    pdiEntretien,
    pdiProduction,
    pdiTotal,
    msRecommandee,
    capaciteIngestion,
    calcium,
    phosphore,
    eauRecommandee
  }
}

// CALCULATEUR TAURILLONS À L'ENGRAISSEMENT
export function calculateBeefBullNeeds(input: Omit<BeefBullNeeds, 'ufvEntretien' | 'ufvCroissance' | 'ufvTotal' | 'pdiTotal' | 'capaciteIngestion' | 'calcium' | 'phosphore' | 'eauRecommandee'>): BeefBullNeeds {
  const { pv, gmq, age } = input

  // UFV ENTRETIEN: 0.041 × PV^0.75 (identique à UFL pour bovins viande)
  const ufvEntretien = 0.041 * Math.pow(pv, 0.75)

  // UFV CROISSANCE selon GMQ
  let ufvCroissance = 0
  if (gmq <= 800) {
    ufvCroissance = 5.0
  } else if (gmq <= 1000) {
    ufvCroissance = 6.75 // Moyenne 6.5-7
  } else if (gmq <= 1200) {
    ufvCroissance = 8.0 // Moyenne 7.5-8.5
  } else if (gmq <= 1500) {
    ufvCroissance = 9.5 // Moyenne 9-10
  } else {
    ufvCroissance = 10.5
  }

  // UFV TOTAL
  const ufvTotal = ufvEntretien + ufvCroissance

  // PDI: 100 g par UFV
  const pdiTotal = ufvTotal * 100

  // CAPACITÉ D'INGESTION: 2-2.5% du PV en MS
  const capaciteIngestion = (pv * 2.2) / 100

  // MINÉRAUX
  const calcium = pv * 0.006
  const phosphore = pv * 0.004

  // EAU: 5-6 L par kg de poids vif
  const eauRecommandee = pv * 0.055

  return {
    pv,
    gmq,
    age,
    ufvEntretien,
    ufvCroissance,
    ufvTotal,
    pdiTotal,
    capaciteIngestion,
    calcium,
    phosphore,
    eauRecommandee
  }
}

// CALCULATEUR OVINS À L'ENGRAISSEMENT
export function calculateSheepNeeds(input: Omit<SheepNeeds, 'uflEntretien' | 'uflCroissance' | 'uflTotal' | 'pdiTotal' | 'capaciteIngestion' | 'calcium' | 'phosphore' | 'eauRecommandee'>): SheepNeeds {
  const { pv, gmq, age } = input

  // UFL ENTRETIEN: 0.036 × PV^0.75 (moins que bovins)
  const uflEntretien = 0.036 * Math.pow(pv, 0.75)

  // UFL CROISSANCE selon GMQ
  let uflCroissance = 0
  if (gmq <= 50) {
    uflCroissance = 0.8
  } else if (gmq <= 100) {
    uflCroissance = 1.2
  } else if (gmq <= 150) {
    uflCroissance = 1.6
  } else if (gmq <= 200) {
    uflCroissance = 2.0
  } else if (gmq <= 250) {
    uflCroissance = 2.4
  } else if (gmq <= 300) {
    uflCroissance = 2.8
  } else {
    uflCroissance = 3.2
  }

  // UFL TOTAL
  const uflTotal = uflEntretien + uflCroissance

  // PDI: 90 g par UFL
  const pdiTotal = uflTotal * 90

  // CAPACITÉ D'INGESTION: 2.5-3% du PV en MS
  const capaciteIngestion = (pv * 2.7) / 100

  // MINÉRAUX (plus faibles que bovins)
  const calcium = pv * 0.004
  const phosphore = pv * 0.003

  // EAU: 3-4 L par kg de poids vif
  const eauRecommandee = pv * 0.04

  return {
    pv,
    gmq,
    age,
    uflEntretien,
    uflCroissance,
    uflTotal,
    pdiTotal,
    capaciteIngestion,
    calcium,
    phosphore,
    eauRecommandee
  }
}
