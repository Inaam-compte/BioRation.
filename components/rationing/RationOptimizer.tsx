"use client"

import { useMemo, useState } from 'react'
import { FeedSelector } from '@/components/rationing/FeedSelector'
import { NutritionCharts } from '@/components/rationing/NutritionCharts'
import { NutritionSummary } from '@/components/rationing/NutritionSummary'
import { RationTable } from '@/components/rationing/RationTable'
import { DairyCowNeeds, BeefBullNeeds, SheepNeeds } from '@/lib/inra-calculations'
import {
  AlimentDispo,
  optimiserRationVacheLaitiere,
  optimiserRationTaurillon,
  optimiserRationOvin
} from '@/lib/ration-optimizer'
import type { AnimalType } from '@/components/rationing/BesoinsCalculator'

interface RationOptimizerProps {
  animalType: AnimalType
  besoins: DairyCowNeeds | BeefBullNeeds | SheepNeeds
  aliments: AlimentDispo[]
}

/**
 * Moteur de formulation automatique : à partir des besoins calculés et des aliments
 * enregistrés, propose une ration équilibrée (priorité au bio, minimum 60% fourrages,
 * respect de la capacité d'ingestion) et affiche le résultat.
 */
export function RationOptimizer({ animalType, besoins, aliments }: RationOptimizerProps) {
  const [alimentsActifs, setAlimentsActifs] = useState<Set<string>>(
    () => new Set(aliments.map(a => a.id))
  )

  const handleToggle = (id: string, enabled: boolean) => {
    setAlimentsActifs(prev => {
      const next = new Set(prev)
      if (enabled) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const alimentsFiltres = useMemo(
    () => aliments.filter(a => alimentsActifs.has(a.id)),
    [aliments, alimentsActifs]
  )

  const ration = useMemo(() => {
    if (animalType === 'vache') {
      return optimiserRationVacheLaitiere(besoins as DairyCowNeeds, alimentsFiltres)
    }
    if (animalType === 'taurillon') {
      return optimiserRationTaurillon(besoins as BeefBullNeeds, alimentsFiltres)
    }
    return optimiserRationOvin(besoins as SheepNeeds, alimentsFiltres)
  }, [animalType, besoins, alimentsFiltres])

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1 space-y-4">
        <FeedSelector aliments={aliments} onToggle={handleToggle} />
      </div>

      <div className="lg:col-span-2 space-y-4">
        <NutritionCharts ration={ration} />
        <NutritionSummary ration={ration} besoins={besoins} animalType={animalType} />
        <RationTable ration={ration} />
      </div>
    </div>
  )
}
