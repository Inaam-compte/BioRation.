/**
 * Optimiseur de rations automatique
 * Propose une ration équilibrée selon les besoins calculés (INRA 2018, mode biologique)
 */

import { DairyCowNeeds, BeefBullNeeds, SheepNeeds } from './inra-calculations'

export type Espece = 'vache' | 'taurillon' | 'ovin'

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
  prix_par_kg?: number // coût par kg de matière brute
  especesCompatibles?: Espece[] // si absent: compatible avec toutes les espèces
}

export interface RationItem {
  aliment: AlimentDispo
  quantiteBrute: number // kg brute
  quantiteMS: number // kg matière sèche
  apportUFL: number
  apportPDI: number
  apportCalcium: number
  apportPhosphore: number
  cout: number
  pourcentageBesoins: number
}

export type CouvertureStatut = 'vert' | 'orange' | 'rouge'

export interface RationOptimale {
  aliments: RationItem[]
  totalUFL: number
  totalPDI: number
  totalMS: number
  totalCalcium: number
  totalPhosphore: number
  totalCout: number
  couvertureUFL: number // %
  couverturePDI: number // %
  couvertureMS: number // %
  pourcentsForrage: number // %
  statut: CouvertureStatut
  alertes: string[]
}

function estCompatible(aliment: AlimentDispo, espece: Espece): boolean {
  if (!aliment.especesCompatibles || aliment.especesCompatibles.length === 0) return true
  return aliment.especesCompatibles.includes(espece)
}

function statutCouverture(couvertureUFL: number, couverturePDI: number, couvertureMS: number): CouvertureStatut {
  const min = Math.min(couvertureUFL, couverturePDI)
  if (min >= 95 && couvertureMS <= 105) return 'vert'
  if (min >= 80) return 'orange'
  return 'rouge'
}

/**
 * Moteur de formulation générique :
 * 1. Filtre les aliments compatibles avec l'espèce
 * 2. Priorise les fourrages biologiques
 * 3. Respecte un minimum de 60% de fourrages (MS) pour les ruminants
 * 4. Complète avec des concentrés (bio en priorité) pour couvrir l'énergie
 * 5. Respecte la capacité d'ingestion
 */
function construireRation(
  espece: Espece,
  besoinUFL: number,
  besoinPDI: number,
  capaciteIngestion: number,
  aliments: AlimentDispo[]
): RationItem[] {
  const compatibles = aliments.filter(a => estCompatible(a, espece))

  const trierBioPuisEnergie = (a: AlimentDispo, b: AlimentDispo) => {
    if (a.biologique !== b.biologique) return a.biologique ? -1 : 1
    return b.ufl_par_kg_ms - a.ufl_par_kg_ms
  }

  const fourrages = compatibles
    .filter(a => a.categorie === 'fourrage' || a.categorie === 'verdure')
    .sort(trierBioPuisEnergie)

  const concentres = compatibles
    .filter(a => a.categorie === 'concentre')
    .sort(trierBioPuisEnergie)

  const ration: RationItem[] = []
  const msMinFourrage = capaciteIngestion * 0.6
  let msFourrage = 0

  const ajouter = (aliment: AlimentDispo, quantiteMS: number) => {
    if (quantiteMS <= 0) return
    const quantiteBrute = quantiteMS / (aliment.ms_percentage / 100)
    ration.push({
      aliment,
      quantiteBrute,
      quantiteMS,
      apportUFL: quantiteMS * aliment.ufl_par_kg_ms,
      apportPDI: quantiteMS * aliment.pdie_par_kg_ms,
      apportCalcium: quantiteMS * aliment.calcium_par_kg_ms,
      apportPhosphore: quantiteMS * aliment.phosphore_par_kg_ms,
      cout: quantiteBrute * (aliment.prix_par_kg ?? 0),
      pourcentageBesoins: 0
    })
  }

  // 1. Fourrages jusqu'au minimum de 60% de la capacité d'ingestion
  for (const fourrage of fourrages) {
    if (msFourrage >= msMinFourrage) break
    const quantiteMS = Math.min(5, msMinFourrage - msFourrage)
    ajouter(fourrage, quantiteMS)
    msFourrage += quantiteMS
  }

  // 2. Concentrés pour couvrir l'énergie restante, sans dépasser la capacité d'ingestion
  let msTotale = ration.reduce((s, i) => s + i.quantiteMS, 0)
  let uflActuelle = ration.reduce((s, i) => s + i.apportUFL, 0)

  for (const concentre of concentres) {
    if (uflActuelle >= besoinUFL) break
    if (msTotale >= capaciteIngestion) break

    const uflManquante = besoinUFL - uflActuelle
    const msParEnergie = concentre.ufl_par_kg_ms > 0 ? uflManquante / concentre.ufl_par_kg_ms : 0
    const msDisponible = capaciteIngestion - msTotale
    const quantiteMS = Math.max(0, Math.min(3, msParEnergie, msDisponible))

    ajouter(concentre, quantiteMS)
    msTotale += quantiteMS
    uflActuelle += quantiteMS * concentre.ufl_par_kg_ms
  }

  // 3. Si l'énergie reste insuffisante et de la capacité est encore disponible, ajouter plus de fourrage
  msTotale = ration.reduce((s, i) => s + i.quantiteMS, 0)
  uflActuelle = ration.reduce((s, i) => s + i.apportUFL, 0)

  for (const fourrage of fourrages) {
    if (uflActuelle >= besoinUFL) break
    if (msTotale >= capaciteIngestion) break

    const msDisponible = capaciteIngestion - msTotale
    const quantiteMS = Math.min(3, msDisponible)
    ajouter(fourrage, quantiteMS)
    msTotale += quantiteMS
    uflActuelle += quantiteMS * fourrage.ufl_par_kg_ms
  }

  return ration
}

function calculerTotaux(
  ration: RationItem[],
  besoinUFL: number,
  besoinPDI: number,
  besoinMS: number
): RationOptimale {
  const totalUFL = ration.reduce((sum, item) => sum + item.apportUFL, 0)
  const totalPDI = ration.reduce((sum, item) => sum + item.apportPDI, 0)
  const totalMS = ration.reduce((sum, item) => sum + item.quantiteMS, 0)
  const totalCalcium = ration.reduce((sum, item) => sum + item.apportCalcium, 0)
  const totalPhosphore = ration.reduce((sum, item) => sum + item.apportPhosphore, 0)
  const totalCout = ration.reduce((sum, item) => sum + item.cout, 0)

  const msFourrage = ration
    .filter(item => item.aliment.categorie === 'fourrage' || item.aliment.categorie === 'verdure')
    .reduce((sum, item) => sum + item.quantiteMS, 0)
  const pourcentsForrage = totalMS > 0 ? (msFourrage / totalMS) * 100 : 0

  const couvertureUFL = besoinUFL > 0 ? (totalUFL / besoinUFL) * 100 : 0
  const couverturePDI = besoinPDI > 0 ? (totalPDI / besoinPDI) * 100 : 0
  const couvertureMS = besoinMS > 0 ? (totalMS / besoinMS) * 100 : 0

  const alertes: string[] = []

  if (couvertureUFL < 90) {
    alertes.push(`❌ Énergie insuffisante: ${totalUFL.toFixed(1)} UFL fournis vs ${besoinUFL.toFixed(1)} UFL besoins`)
  } else if (couvertureUFL < 100) {
    alertes.push(`⚠️ Énergie légèrement insuffisante (${couvertureUFL.toFixed(0)}%)`)
  }

  if (couverturePDI < 90) {
    alertes.push(`❌ Protéines insuffisantes (${couverturePDI.toFixed(0)}%)`)
  } else if (couverturePDI < 100) {
    alertes.push(`⚠️ Protéines légèrement insuffisantes (${couverturePDI.toFixed(0)}%)`)
  }

  if (totalMS > besoinMS * 1.02) {
    alertes.push(`⚠️ MS proposée dépasse la capacité d'ingestion`)
  }

  if (pourcentsForrage < 60) {
    alertes.push(`⚠️ Fourrages en-dessous du minimum de 60% de la MS (${pourcentsForrage.toFixed(0)}%)`)
  }

  if (alertes.length === 0) {
    alertes.push('✅ Ration équilibrée')
  }

  return {
    aliments: ration,
    totalUFL,
    totalPDI,
    totalMS,
    totalCalcium,
    totalPhosphore,
    totalCout,
    couvertureUFL,
    couverturePDI,
    couvertureMS,
    pourcentsForrage,
    statut: statutCouverture(couvertureUFL, couverturePDI, couvertureMS),
    alertes
  }
}

// Optimiseur pour vaches laitières
export function optimiserRationVacheLaitiere(
  besoins: DairyCowNeeds,
  aliments: AlimentDispo[]
): RationOptimale {
  const ration = construireRation('vache', besoins.uflTotal, besoins.pdiTotal, besoins.capaciteIngestion, aliments)
  return calculerTotaux(ration, besoins.uflTotal, besoins.pdiTotal, besoins.capaciteIngestion)
}

// Optimiseur pour taurillons à l'engraissement
export function optimiserRationTaurillon(
  besoins: BeefBullNeeds,
  aliments: AlimentDispo[]
): RationOptimale {
  const ration = construireRation('taurillon', besoins.ufvTotal, besoins.pdiTotal, besoins.capaciteIngestion, aliments)
  return calculerTotaux(ration, besoins.ufvTotal, besoins.pdiTotal, besoins.capaciteIngestion)
}

// Optimiseur pour ovins à l'engraissement
export function optimiserRationOvin(
  besoins: SheepNeeds,
  aliments: AlimentDispo[]
): RationOptimale {
  const ration = construireRation('ovin', besoins.uflTotal, besoins.pdiTotal, besoins.capaciteIngestion, aliments)
  return calculerTotaux(ration, besoins.uflTotal, besoins.pdiTotal, besoins.capaciteIngestion)
}
