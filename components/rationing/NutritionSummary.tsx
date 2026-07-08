"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, AlertTriangle, Zap, Leaf, Droplet } from 'lucide-react'
import { RationOptimale } from '@/lib/ration-optimizer'
import { DairyCowNeeds, BeefBullNeeds, SheepNeeds } from '@/lib/inra-calculations'

interface NutritionSummaryProps {
  ration: RationOptimale
  besoins: DairyCowNeeds | BeefBullNeeds | SheepNeeds
  animalType: 'vache' | 'taurillon' | 'ovin'
}

function getCoverageColor(percentage: number): string {
  if (percentage >= 95 && percentage <= 105) return 'text-green-600 bg-green-50'
  if (percentage >= 90 && percentage < 95) return 'text-orange-600 bg-orange-50'
  if (percentage > 105) return 'text-blue-600 bg-blue-50'
  return 'text-red-600 bg-red-50'
}

function getCoverageIcon(percentage: number) {
  if (percentage >= 95 && percentage <= 105) return <CheckCircle className="h-4 w-4" />
  if (percentage >= 90) return <AlertTriangle className="h-4 w-4" />
  return <AlertCircle className="h-4 w-4" />
}

export function NutritionSummary({ ration, besoins, animalType }: NutritionSummaryProps) {
  const besoinsUFL = 'uflTotal' in besoins ? besoins.uflTotal : ('ufvTotal' in besoins ? besoins.ufvTotal : 0)
  const besoinsPDI = besoins.pdiTotal
  const besoinMS = 'msRecommandee' in besoins ? besoins.msRecommandee : ((besoins.pv * 2.2) / 100)

  return (
    <div className="space-y-6">
      {/* Alertes */}
      {ration.alertes.length > 0 && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-orange-900">Validations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {ration.alertes.map((alerte, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-orange-800">
                  <span className="mt-0.5">•</span>
                  <span>{alerte}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Grille des résultats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Énergie */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-base">Énergie (UFL/UFV)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Fournis</span>
                <span className="font-bold">{ration.totalUFL.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Besoins</span>
                <span className="font-bold">{besoinsUFL.toFixed(2)}</span>
              </div>
            </div>
            
            <div className={`p-3 rounded-lg ${getCoverageColor(ration.couvertureUFL)}`}>
              <div className="flex items-center gap-2">
                {getCoverageIcon(ration.couvertureUFL)}
                <div>
                  <div className="text-xs opacity-75">Couverture</div>
                  <div className="text-lg font-bold">{ration.couvertureUFL.toFixed(0)}%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Protéines */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              <CardTitle className="text-base">Protéines (PDI)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Fournis (g)</span>
                <span className="font-bold">{ration.totalPDI.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Besoins (g)</span>
                <span className="font-bold">{besoinsPDI.toFixed(0)}</span>
              </div>
            </div>
            
            <div className={`p-3 rounded-lg ${getCoverageColor(ration.couverturePDI)}`}>
              <div className="flex items-center gap-2">
                {getCoverageIcon(ration.couverturePDI)}
                <div>
                  <div className="text-xs opacity-75">Couverture</div>
                  <div className="text-lg font-bold">{ration.couverturePDI.toFixed(0)}%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Matière sèche */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Droplet className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base">Matière sèche (MS)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Proposée (kg)</span>
                <span className="font-bold">{ration.totalMS.toFixed(1)}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Capacité (kg)</span>
                <span className="font-bold">{besoinMS.toFixed(1)}</span>
              </div>
            </div>
            
            <div className={`p-3 rounded-lg ${getCoverageColor(ration.couvertureMS)}`}>
              <div className="flex items-center gap-2">
                {getCoverageIcon(ration.couvertureMS)}
                <div>
                  <div className="text-xs opacity-75">Couverture</div>
                  <div className="text-lg font-bold">{ration.couvertureMS.toFixed(0)}%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Minéraux */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Minéraux</CardTitle>
          <CardDescription>Équilibre des minéraux essentiels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-gray-200 p-3">
              <div className="text-xs text-gray-500 mb-1">Calcium</div>
              <div className="text-lg font-bold text-gray-900">{ration.totalCalcium.toFixed(0)} g</div>
              <div className="text-xs text-gray-400 mt-1">fournis par jour</div>
            </div>
            <div className="rounded-lg border border-gray-200 p-3">
              <div className="text-xs text-gray-500 mb-1">Phosphore</div>
              <div className="text-lg font-bold text-gray-900">{ration.totalPhosphore.toFixed(0)} g</div>
              <div className="text-xs text-gray-400 mt-1">fournis par jour</div>
            </div>
            <div className="rounded-lg border border-gray-200 p-3">
              <div className="text-xs text-gray-500 mb-1">Ratio Ca:P</div>
              <div className="text-lg font-bold text-gray-900">{(ration.totalCalcium / ration.totalPhosphore).toFixed(2)}:1</div>
              <div className="text-xs text-gray-400 mt-1">idéal: 1.5-2:1</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Composition */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Composition de la ration</CardTitle>
          <CardDescription>Répartition des catégories d'aliments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Fourrages</span>
                <span className="font-semibold">{ration.pourcentsForrage.toFixed(0)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${Math.min(100, ration.pourcentsForrage)}%` }}
                />
              </div>
              {ration.pourcentsForrage < 60 && (
                <p className="text-xs text-orange-600 mt-1">⚠️ En-dessous du minimum de 60%</p>
              )}
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Concentrés</span>
                <span className="font-semibold">{(100 - ration.pourcentsForrage).toFixed(0)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500"
                  style={{ width: `${100 - ration.pourcentsForrage}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau détaillé */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Détail des aliments proposés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-2 font-semibold">Aliment</th>
                  <th className="text-right py-2 px-2 font-semibold">Brute (kg)</th>
                  <th className="text-right py-2 px-2 font-semibold">MS (kg)</th>
                  <th className="text-right py-2 px-2 font-semibold">UFL/V</th>
                  <th className="text-right py-2 px-2 font-semibold">PDI (g)</th>
                </tr>
              </thead>
              <tbody>
                {ration.aliments.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-2">{item.aliment.nom}</td>
                    <td className="text-right py-2 px-2">{item.quantiteBrute.toFixed(1)}</td>
                    <td className="text-right py-2 px-2">{item.quantiteMS.toFixed(1)}</td>
                    <td className="text-right py-2 px-2">{item.apportUFL.toFixed(2)}</td>
                    <td className="text-right py-2 px-2">{item.apportPDI.toFixed(0)}</td>
                  </tr>
                ))}
                <tr className="font-bold border-t-2 border-gray-300">
                  <td className="py-2 px-2">TOTAL</td>
                  <td className="text-right py-2 px-2">{ration.aliments.reduce((s, i) => s + i.quantiteBrute, 0).toFixed(1)}</td>
                  <td className="text-right py-2 px-2">{ration.totalMS.toFixed(1)}</td>
                  <td className="text-right py-2 px-2">{ration.totalUFL.toFixed(2)}</td>
                  <td className="text-right py-2 px-2">{ration.totalPDI.toFixed(0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
