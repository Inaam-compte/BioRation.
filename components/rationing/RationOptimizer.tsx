"use client"

import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, AlertTriangle, PlusCircle } from 'lucide-react'
import { FeedSelector } from '@/components/rationing/FeedSelector'
import { NutritionCharts } from '@/components/rationing/NutritionCharts'
import { NutritionSummary } from '@/components/rationing/NutritionSummary'
import { RationTable } from '@/components/rationing/RationTable'
import { DairyCowNeeds, BeefBullNeeds, SheepNeeds } from '@/lib/inra-calculations'
import {
  AlimentDispo,
  evaluerRationManuelle,
  proposerCorrection
} from '@/lib/ration-optimizer'
import type { AnimalType } from '@/components/rationing/BesoinsCalculator'

interface RationOptimizerProps {
  animalType: AnimalType
  besoins: DairyCowNeeds | BeefBullNeeds | SheepNeeds
  aliments: AlimentDispo[]
}

function getBesoinEnergie(besoins: DairyCowNeeds | BeefBullNeeds | SheepNeeds): number {
  return 'uflTotal' in besoins ? besoins.uflTotal : besoins.ufvTotal
}

/**
 * L'éleveur choisit lui-même les aliments qu'il a disponibles et entre les quantités
 * en kg. Le système évalue si cette ration couvre les besoins calculés pour l'animal :
 * - si oui, confirmation ("ça va")
 * - sinon, proposition de correction (aliments à ajouter en quantité, ou à réduire)
 */
export function RationOptimizer({ animalType, besoins, aliments }: RationOptimizerProps) {
  const [quantites, setQuantites] = useState<Record<string, number>>({})

  const handleQuantiteChange = (id: string, quantiteBrute: number) => {
    setQuantites(prev => ({ ...prev, [id]: quantiteBrute }))
  }

  const besoinEnergie = getBesoinEnergie(besoins)
  const besoinPDI = besoins.pdiTotal
  const capaciteIngestion = besoins.capaciteIngestion

  const saisies = useMemo(
    () => aliments
      .filter(a => (quantites[a.id] ?? 0) > 0)
      .map(a => ({ aliment: a, quantiteBrute: quantites[a.id] })),
    [aliments, quantites]
  )

  const rationActuelle = useMemo(
    () => saisies.length > 0 ? evaluerRationManuelle(saisies, besoinEnergie, besoinPDI, capaciteIngestion) : null,
    [saisies, besoinEnergie, besoinPDI, capaciteIngestion]
  )

  const correction = useMemo(() => {
    if (!rationActuelle || rationActuelle.statut === 'vert') return null
    return proposerCorrection(animalType, rationActuelle, besoinEnergie, besoinPDI, capaciteIngestion, aliments)
  }, [rationActuelle, animalType, besoinEnergie, besoinPDI, capaciteIngestion, aliments])

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1 space-y-4">
        <FeedSelector aliments={aliments} quantites={quantites} onQuantiteChange={handleQuantiteChange} />
      </div>

      <div className="lg:col-span-2 space-y-4">
        {!rationActuelle && (
          <Card className="border-dashed border-2 border-gray-300 bg-gray-50/50">
            <CardContent className="py-10 text-center text-gray-500">
              Cochez les aliments que vous avez et entrez les quantités en kg pour vérifier si votre ration couvre les besoins de l'animal.
            </CardContent>
          </Card>
        )}

        {rationActuelle && (
          <>
            {rationActuelle.statut === 'vert' ? (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="flex items-center gap-3 py-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <div className="font-semibold text-green-800">Ça va ! Votre ration est équilibrée.</div>
                    <div className="text-sm text-green-700">
                      Elle couvre les besoins calculés pour cet animal (énergie, protéines, matière sèche).
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="flex items-center gap-3 py-4">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                  <div>
                    <div className="font-semibold text-orange-800">Votre ration n'est pas équilibrée.</div>
                    <div className="text-sm text-orange-700">
                      Voir la correction proposée ci-dessous pour la compléter.
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <NutritionCharts ration={rationActuelle} />
            <NutritionSummary ration={rationActuelle} besoins={besoins} animalType={animalType} />
            <RationTable ration={rationActuelle} />

            {correction && correction.besoinCorrection && (
              <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <PlusCircle className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-base text-blue-900">Correction proposée</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-1 text-sm text-blue-900">
                    {correction.messages.map((m, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-0.5">•</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>

                  {correction.ajouts.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-blue-200">
                            <th className="text-left py-2 px-2 font-semibold">Aliment à ajouter</th>
                            <th className="text-right py-2 px-2 font-semibold">Quantité (kg brute/jour)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {correction.ajouts.map((a, idx) => (
                            <tr key={idx} className="border-b border-blue-100">
                              <td className="py-2 px-2">
                                {a.aliment.nom}
                                {a.aliment.biologique && <span className="ml-2 text-xs text-green-600">bio</span>}
                              </td>
                              <td className="text-right py-2 px-2 font-semibold">{a.quantiteAjoutee.toFixed(1)} kg</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {correction.ajouts.length > 0 && (
                    <div className="pt-2 border-t border-blue-200">
                      <p className="text-sm font-medium text-blue-900 mb-2">Ration corrigée (avec ces ajouts) :</p>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="rounded bg-white p-2 border border-blue-100">
                          <div className="text-xs text-gray-500">Énergie</div>
                          <div className="font-bold">{correction.rationCorrigee.couvertureUFL.toFixed(0)}%</div>
                        </div>
                        <div className="rounded bg-white p-2 border border-blue-100">
                          <div className="text-xs text-gray-500">Protéines</div>
                          <div className="font-bold">{correction.rationCorrigee.couverturePDI.toFixed(0)}%</div>
                        </div>
                        <div className="rounded bg-white p-2 border border-blue-100">
                          <div className="text-xs text-gray-500">Matière sèche</div>
                          <div className="font-bold">{correction.rationCorrigee.couvertureMS.toFixed(0)}%</div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
