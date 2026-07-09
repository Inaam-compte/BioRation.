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

export function estCompatible(aliment: AlimentDispo, espece: Espece): boolean {
  if (!aliment.especesCompatibles || aliment.especesCompatibles.length === 0) return true
  return aliment.especesCompatibles.includes(espece)
}

function construireItem(aliment: AlimentDispo, quantiteBrute: number): RationItem {
  const quantiteMS = quantiteBrute * (aliment.ms_percentage / 100)
  return {
    aliment,
    quantiteBrute,
    quantiteMS,
    apportUFL: quantiteMS * aliment.ufl_par_kg_ms,
    apportPDI: quantiteMS * aliment.pdie_par_kg_ms,
    apportCalcium: quantiteMS * aliment.calcium_par_kg_ms,
    apportPhosphore: quantiteMS * aliment.phosphore_par_kg_ms,
    cout: quantiteBrute * (aliment.prix_par_kg ?? 0),
    pourcentageBesoins: 0
  }
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
    ration.push(construireItem(aliment, quantiteBrute))
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

export function calculerTotaux(
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

  // Seuils alignés sur statutCouverture() : pas d'alerte tant qu'on reste dans la
  // marge qui vaut un statut "vert", pour éviter de contredire l'indicateur global.
  const alertes: string[] = []

  if (couvertureUFL < 80) {
    alertes.push(`❌ Énergie insuffisante: ${totalUFL.toFixed(1)} UFL fournis vs ${besoinUFL.toFixed(1)} UFL besoins`)
  } else if (couvertureUFL < 95) {
    alertes.push(`⚠️ Énergie légèrement insuffisante (${couvertureUFL.toFixed(0)}%)`)
  }

  if (couverturePDI < 80) {
    alertes.push(`❌ Protéines insuffisantes (${couverturePDI.toFixed(0)}%)`)
  } else if (couverturePDI < 95) {
    alertes.push(`⚠️ Protéines légèrement insuffisantes (${couverturePDI.toFixed(0)}%)`)
  }

  if (totalMS > besoinMS * 1.05) {
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

// ---------------------------------------------------------------------------
// Saisie manuelle : l'éleveur choisit lui-même les aliments qu'il a disponibles
// et entre la quantité en kg brute. Le système évalue ensuite si cette ration
// couvre les besoins, et propose une correction (aliments à ajouter) sinon.
// ---------------------------------------------------------------------------

export interface SaisieAliment {
  aliment: AlimentDispo
  quantiteBrute: number // kg de matière brute saisis par l'utilisateur
}

/**
 * Évalue la ration telle que saisie par l'utilisateur (aucune quantité n'est
 * choisie par le système ici — uniquement les valeurs entrées par l'éleveur).
 */
export function evaluerRationManuelle(
  saisies: SaisieAliment[],
  besoinEnergie: number,
  besoinPDI: number,
  capaciteIngestion: number
): RationOptimale {
  const ration = saisies
    .filter(s => s.quantiteBrute > 0)
    .map(s => construireItem(s.aliment, s.quantiteBrute))
  return calculerTotaux(ration, besoinEnergie, besoinPDI, capaciteIngestion)
}

export interface AjoutPropose {
  aliment: AlimentDispo
  quantiteAjoutee: number // kg brute à ajouter
}

export interface CorrectionRation {
  besoinCorrection: boolean
  ajouts: AjoutPropose[]
  rationCorrigee: RationOptimale
  messages: string[]
}

/**
 * Quand la ration saisie par l'utilisateur ne couvre pas les besoins (ou les
 * dépasse trop), propose une correction : aliments supplémentaires à ajouter
 * (priorité au bio, respect de la capacité d'ingestion et du minimum de
 * fourrages), ou un message de réduction si la capacité est déjà dépassée.
 */
export function proposerCorrection(
  espece: Espece,
  rationActuelle: RationOptimale,
  besoinEnergie: number,
  besoinPDI: number,
  capaciteIngestion: number,
  alimentsDisponibles: AlimentDispo[]
): CorrectionRation {
  if (rationActuelle.statut === 'vert') {
    return {
      besoinCorrection: false,
      ajouts: [],
      rationCorrigee: rationActuelle,
      messages: ['✅ Ration équilibrée, aucune correction nécessaire.']
    }
  }

  const messages: string[] = []
  const ajouts: AjoutPropose[] = []
  const dejaUtilisesIds = new Set(rationActuelle.aliments.map(i => i.aliment.id))

  const trierBioPuisEnergie = (a: AlimentDispo, b: AlimentDispo) => {
    if (a.biologique !== b.biologique) return a.biologique ? -1 : 1
    return b.ufl_par_kg_ms - a.ufl_par_kg_ms
  }

  const compatibles = alimentsDisponibles
    .filter(a => estCompatible(a, espece))
    .filter(a => !dejaUtilisesIds.has(a.id))

  const fourrages = compatibles
    .filter(a => a.categorie === 'fourrage' || a.categorie === 'verdure')
    .sort(trierBioPuisEnergie)
  const concentres = compatibles
    .filter(a => a.categorie === 'concentre')
    .sort(trierBioPuisEnergie)

  if (rationActuelle.totalMS > capaciteIngestion * 1.02) {
    messages.push(
      `Réduire les quantités actuelles : la ration dépasse la capacité d'ingestion de ${(rationActuelle.totalMS - capaciteIngestion).toFixed(1)} kg MS. Diminuer en priorité les concentrés.`
    )
  } else {
    const energieManquante = Math.max(0, besoinEnergie - rationActuelle.totalUFL)
    const pdiManquant = Math.max(0, besoinPDI - rationActuelle.totalPDI)
    let msDisponible = Math.max(0, capaciteIngestion - rationActuelle.totalMS)

    if (energieManquante > 0 || pdiManquant > 0) {
      if (msDisponible <= 0.05) {
        messages.push(
          "La capacité d'ingestion est déjà atteinte : remplacer certains aliments actuels par des aliments plus riches en énergie/protéines plutôt que d'en ajouter."
        )
      } else {
        // Respecter le minimum de 60% de fourrages : si on est déjà en-dessous, prioriser le fourrage
        const candidats = rationActuelle.pourcentsForrage < 60 ? [...fourrages, ...concentres] : [...concentres, ...fourrages]

        let energieCumulee = 0
        let pdiCumule = 0

        for (const candidat of candidats) {
          if (msDisponible <= 0.05) break
          if (energieCumulee >= energieManquante && pdiCumule >= pdiManquant) break

          const uflRestant = Math.max(0, energieManquante - energieCumulee)
          const quantiteParEnergie = candidat.ufl_par_kg_ms > 0 ? uflRestant / candidat.ufl_par_kg_ms : msDisponible
          const quantiteMS = Math.max(0, Math.min(3, quantiteParEnergie || msDisponible, msDisponible))

          if (quantiteMS <= 0.05) continue

          const quantiteBrute = quantiteMS / (candidat.ms_percentage / 100)
          ajouts.push({ aliment: candidat, quantiteAjoutee: quantiteBrute })

          msDisponible -= quantiteMS
          energieCumulee += quantiteMS * candidat.ufl_par_kg_ms
          pdiCumule += quantiteMS * candidat.pdie_par_kg_ms
        }

        if (ajouts.length === 0) {
          messages.push("Aucun aliment disponible supplémentaire ne permet de combler l'écart avec la capacité restante.")
        }
      }
    }
  }

  const itemsCorriges = [
    ...rationActuelle.aliments,
    ...ajouts.map(a => construireItem(a.aliment, a.quantiteAjoutee))
  ]
  const rationCorrigee = calculerTotaux(itemsCorriges, besoinEnergie, besoinPDI, capaciteIngestion)

  if (ajouts.length > 0) {
    messages.push(
      rationCorrigee.statut === 'vert'
        ? '✅ Avec ces ajouts, la ration couvrirait les besoins.'
        : '⚠️ Ces ajouts améliorent la ration sans la rendre totalement équilibrée — vérifier la disponibilité d\'aliments plus riches.'
    )
  }

  return {
    besoinCorrection: true,
    ajouts,
    rationCorrigee,
    messages
  }
}
