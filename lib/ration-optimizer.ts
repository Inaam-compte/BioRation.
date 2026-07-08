/**
 * Optimiseur de rations automatique
 * Propose une ration équilibrée selon les besoins calculés
 */

import { DairyCowNeeds, BeefBullNeeds, SheepNeeds } from './inra-calculations'

export interface AlimentDispo {
  id: string
  nom: string
  categorie: 'fourrage' | 'verdure' | 'concentre'
  ms_percentage: number
  ufl_par_kg_ms: number
  pdie_par_kg_ms: number
  pdin_par_kg_ms: number
  calcium_par_kg_ms: number
  phosphore_par_kg_ms: number
  biologique: boolean
}

export interface RationItem {
  aliment: AlimentDispo
  quantiteBrute: number // kg brute
  quantiteMS: number // kg matière sèche
  apportUFL: number
  apportPDI: number
  apportCalcium: number
  apportPhosphore: number
  pourcentageBesoins: number
}

export interface RationOptimale {
  aliments: RationItem[]
  totalUFL: number
  totalPDI: number
  totalMS: number
  totalCalcium: number
  totalPhosphore: number
  couvertureUFL: number // %
  couverturePDI: number // %
  couvertureMS: number // %
  pourcentsForrage: number // %
  alertes: string[]
}

// Optimiseur pour vaches laitières
export function optimiserRationVacheLaitiere(
  besoins: DairyCowNeeds,
  aliments: AlimentDispo[]
): RationOptimale {
  const ration: RationItem[] = []
  const alimentsDisponibles = [...aliments]
  
  // 1. Sélectionner fourrages biologiques en priorité
  const fourragesBio = alimentsDisponibles.filter(
    a => a.categorie === 'fourrage' && a.biologique
  ).sort((a, b) => b.ufl_par_kg_ms - a.ufl_par_kg_ms)

  const fourragesTous = alimentsDisponibles.filter(
    a => a.categorie === 'fourrage'
  ).sort((a, b) => b.ufl_par_kg_ms - a.ufl_par_kg_ms)

  // 2. Ajouter fourrages (60% minimum de MS)
  let msFourrage = 0
  const msMin = besoins.msRecommandee * 0.6
  
  const fourrageSelection = fourragesBio.length > 0 ? fourragesBio : fourragesTous
  
  for (const fourrage of fourrageSelection) {
    if (msFourrage >= msMin) break
    
    const quantiteMS = Math.min(5, msMin - msFourrage) // Max 5kg MS par fourrage
    const quantiteBrute = quantiteMS / (fourrage.ms_percentage / 100)
    
    ration.push({
      aliment: fourrage,
      quantiteBrute,
      quantiteMS,
      apportUFL: quantiteMS * fourrage.ufl_par_kg_ms,
      apportPDI: quantiteMS * fourrage.pdie_par_kg_ms,
      apportCalcium: quantiteMS * fourrage.calcium_par_kg_ms,
      apportPhosphore: quantiteMS * fourrage.phosphore_par_kg_ms,
      pourcentageBesoins: 0
    })
    
    msFourrage += quantiteMS
  }

  // 3. Ajouter concentrés pour couvrir l'énergie restante
  const uflActuelle = ration.reduce((sum, item) => sum + item.apportUFL, 0)
  const uflManquante = Math.max(0, besoins.uflTotal - uflActuelle)

  const concentres = alimentsDisponibles
    .filter(a => a.categorie === 'concentre')
    .sort((a, b) => b.ufl_par_kg_ms - a.ufl_par_kg_ms)

  for (const concentre of concentres) {
    if (uflActuelle >= besoins.uflTotal) break
    
    const quantiteMS = Math.min(3, uflManquante / concentre.ufl_par_kg_ms)
    const quantiteBrute = quantiteMS / (concentre.ms_percentage / 100)
    
    ration.push({
      aliment: concentre,
      quantiteBrute,
      quantiteMS,
      apportUFL: quantiteMS * concentre.ufl_par_kg_ms,
      apportPDI: quantiteMS * concentre.pdie_par_kg_ms,
      apportCalcium: quantiteMS * concentre.calcium_par_kg_ms,
      apportPhosphore: quantiteMS * concentre.phosphore_par_kg_ms,
      pourcentageBesoins: 0
    })
  }

  // 4. Calculer totaux et vérifications
  const totalUFL = ration.reduce((sum, item) => sum + item.apportUFL, 0)
  const totalPDI = ration.reduce((sum, item) => sum + item.apportPDI, 0)
  const totalMS = ration.reduce((sum, item) => sum + item.quantiteMS, 0)
  const totalCalcium = ration.reduce((sum, item) => sum + item.apportCalcium, 0)
  const totalPhosphore = ration.reduce((sum, item) => sum + item.apportPhosphore, 0)

  const pourcentsForrage = (ration
    .filter(item => item.aliment.categorie === 'fourrage')
    .reduce((sum, item) => sum + item.quantiteMS, 0) / totalMS) * 100

  const alertes: string[] = []
  
  if (totalUFL < besoins.uflTotal * 0.9) {
    alertes.push(`❌ Énergie insuffisante: ${totalUFL.toFixed(1)} UFL fournis vs ${besoins.uflTotal.toFixed(1)} UFL besoins`)
  } else if (totalUFL < besoins.uflTotal) {
    alertes.push(`⚠️ Énergie légèrement insuffisante`)
  }

  if (totalPDI < besoins.pdiTotal * 0.9) {
    alertes.push(`❌ Protéines insuffisantes`)
  }

  if (totalMS > besoins.capaciteIngestion) {
    alertes.push(`⚠️ MS proposée dépasse capacité d'ingestion`)
  }

  if (pourcentsForrage < 60) {
    alertes.push(`⚠️ Fourrages en-dessous de 60% de la MS`)
  }

  if (alertes.length === 0) {
    alertes.push(`✅ Ration équilibrée`)
  }

  return {
    aliments: ration,
    totalUFL,
    totalPDI,
    totalMS,
    totalCalcium,
    totalPhosphore,
    couvertureUFL: (totalUFL / besoins.uflTotal) * 100,
    couverturePDI: (totalPDI / besoins.pdiTotal) * 100,
    couvertureMS: (totalMS / besoins.msRecommandee) * 100,
    pourcentsForrage,
    alertes
  }
}

// Optimiseur pour taurillons
export function optimiserRationTaurillon(
  besoins: BeefBullNeeds,
  aliments: AlimentDispo[]
): RationOptimale {
  // Logique similaire aux vaches laitières
  // mais avec UFV au lieu de UFL
  const ration: RationItem[] = []
  
  // Implémentation simplifiée pour MVP
  // Utiliser 70% fourrages, 30% concentrés
  const fourrages = aliments.filter(a => a.categorie === 'fourrage')
  const concentres = aliments.filter(a => a.categorie === 'concentre')

  const msCapacite = (besoins.pv * 2.2) / 100

  // 70% fourrages
  if (fourrages.length > 0) {
    const msForrage = msCapacite * 0.7
    const quantiteBrute = msForrage / (fourrages[0].ms_percentage / 100)
    
    ration.push({
      aliment: fourrages[0],
      quantiteBrute,
      quantiteMS: msForrage,
      apportUFL: msForrage * fourrages[0].ufl_par_kg_ms,
      apportPDI: msForrage * fourrages[0].pdie_par_kg_ms,
      apportCalcium: msForrage * fourrages[0].calcium_par_kg_ms,
      apportPhosphore: msForrage * fourrages[0].phosphore_par_kg_ms,
      pourcentageBesoins: 0
    })
  }

  // 30% concentrés
  if (concentres.length > 0) {
    const msConcentre = msCapacite * 0.3
    const quantiteBrute = msConcentre / (concentres[0].ms_percentage / 100)
    
    ration.push({
      aliment: concentres[0],
      quantiteBrute,
      quantiteMS: msConcentre,
      apportUFL: msConcentre * concentres[0].ufl_par_kg_ms,
      apportPDI: msConcentre * concentres[0].pdie_par_kg_ms,
      apportCalcium: msConcentre * concentres[0].calcium_par_kg_ms,
      apportPhosphore: msConcentre * concentres[0].phosphore_par_kg_ms,
      pourcentageBesoins: 0
    })
  }

  const totalUFL = ration.reduce((sum, item) => sum + item.apportUFL, 0)
  const totalPDI = ration.reduce((sum, item) => sum + item.apportPDI, 0)
  const totalMS = ration.reduce((sum, item) => sum + item.quantiteMS, 0)
  const totalCalcium = ration.reduce((sum, item) => sum + item.apportCalcium, 0)
  const totalPhosphore = ration.reduce((sum, item) => sum + item.apportPhosphore, 0)

  const pourcentsForrage = (ration
    .filter(item => item.aliment.categorie === 'fourrage')
    .reduce((sum, item) => sum + item.quantiteMS, 0) / totalMS) * 100

  return {
    aliments: ration,
    totalUFL,
    totalPDI,
    totalMS,
    totalCalcium,
    totalPhosphore,
    couvertureUFL: (totalUFL / besoins.ufvTotal) * 100,
    couverturePDI: (totalPDI / besoins.pdiTotal) * 100,
    couvertureMS: (totalMS / ((besoins.pv * 2.2) / 100)) * 100,
    pourcentsForrage,
    alertes: ['✅ Ration proposée']
  }
}

// Optimiseur pour ovins
export function optimiserRationOvin(
  besoins: SheepNeeds,
  aliments: AlimentDispo[]
): RationOptimale {
  // Logique pour ovins (70% fourrages, 30% concentrés)
  const ration: RationItem[] = []
  
  const fourrages = aliments.filter(a => a.categorie === 'fourrage')
  const concentres = aliments.filter(a => a.categorie === 'concentre')

  const msCapacite = (besoins.pv * 2.7) / 100

  if (fourrages.length > 0) {
    const msForrage = msCapacite * 0.7
    const quantiteBrute = msForrage / (fourrages[0].ms_percentage / 100)
    
    ration.push({
      aliment: fourrages[0],
      quantiteBrute,
      quantiteMS: msForrage,
      apportUFL: msForrage * fourrages[0].ufl_par_kg_ms,
      apportPDI: msForrage * fourrages[0].pdie_par_kg_ms,
      apportCalcium: msForrage * fourrages[0].calcium_par_kg_ms,
      apportPhosphore: msForrage * fourrages[0].phosphore_par_kg_ms,
      pourcentageBesoins: 0
    })
  }

  if (concentres.length > 0) {
    const msConcentre = msCapacite * 0.3
    const quantiteBrute = msConcentre / (concentres[0].ms_percentage / 100)
    
    ration.push({
      aliment: concentres[0],
      quantiteBrute,
      quantiteMS: msConcentre,
      apportUFL: msConcentre * concentres[0].ufl_par_kg_ms,
      apportPDI: msConcentre * concentres[0].pdie_par_kg_ms,
      apportCalcium: msConcentre * concentres[0].calcium_par_kg_ms,
      apportPhosphore: msConcentre * concentres[0].phosphore_par_kg_ms,
      pourcentageBesoins: 0
    })
  }

  const totalUFL = ration.reduce((sum, item) => sum + item.apportUFL, 0)
  const totalPDI = ration.reduce((sum, item) => sum + item.apportPDI, 0)
  const totalMS = ration.reduce((sum, item) => sum + item.quantiteMS, 0)
  const totalCalcium = ration.reduce((sum, item) => sum + item.apportCalcium, 0)
  const totalPhosphore = ration.reduce((sum, item) => sum + item.apportPhosphore, 0)

  const pourcentsForrage = (ration
    .filter(item => item.aliment.categorie === 'fourrage')
    .reduce((sum, item) => sum + item.quantiteMS, 0) / totalMS) * 100

  return {
    aliments: ration,
    totalUFL,
    totalPDI,
    totalMS,
    totalCalcium,
    totalPhosphore,
    couvertureUFL: (totalUFL / besoins.uflTotal) * 100,
    couverturePDI: (totalPDI / besoins.pdiTotal) * 100,
    couvertureMS: (totalMS / ((besoins.pv * 2.7) / 100)) * 100,
    pourcentsForrage,
    alertes: ['✅ Ration proposée']
  }
}
