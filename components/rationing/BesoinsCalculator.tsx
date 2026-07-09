"use client"

import { DairyCowCalculator } from '@/components/rationing/DairyCowCalculator'
import { BeefBullCalculatorV2 } from '@/components/rationing/BeefBullCalculatorV2'
import { SheepCalculator } from '@/components/rationing/SheepCalculator'
import { DairyCowNeeds, BeefBullNeeds, SheepNeeds } from '@/lib/inra-calculations'

export type AnimalType = 'vache' | 'taurillon' | 'ovin'

interface BesoinsCalculatorProps {
  animalType: AnimalType
  onCalculated: (needs: DairyCowNeeds | BeefBullNeeds | SheepNeeds) => void
}

/**
 * Point d'entrée unique du module "Calcul des besoins INRA 2018" :
 * délègue au calculateur indépendant correspondant à l'espèce choisie.
 */
export function BesoinsCalculator({ animalType, onCalculated }: BesoinsCalculatorProps) {
  if (animalType === 'vache') {
    return <DairyCowCalculator onCalculated={onCalculated} />
  }
  if (animalType === 'taurillon') {
    return <BeefBullCalculatorV2 onCalculated={onCalculated} />
  }
  return <SheepCalculator onCalculated={onCalculated} />
}
