"use client"

import React from 'react'
import { RationOptimale } from '@/lib/ration-optimizer'

interface Props {
  ration: RationOptimale
}

export function NutritionCharts({ ration }: Props) {
  // Simple textual charts (placeholder) — can be replaced by chart library later
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="rounded-lg border p-3">
        <div className="text-sm text-gray-600">Énergie (UFL)</div>
        <div className="text-xl font-bold">{ration.totalUFL.toFixed(2)}</div>
        <div className="text-xs text-gray-400">Couverture {ration.couvertureUFL.toFixed(0)}%</div>
      </div>

      <div className="rounded-lg border p-3">
        <div className="text-sm text-gray-600">Protéines (PDI g)</div>
        <div className="text-xl font-bold">{ration.totalPDI.toFixed(0)}</div>
        <div className="text-xs text-gray-400">Couverture {ration.couverturePDI.toFixed(0)}%</div>
      </div>

      <div className="rounded-lg border p-3">
        <div className="text-sm text-gray-600">Matière sèche (kg)</div>
        <div className="text-xl font-bold">{ration.totalMS.toFixed(1)}</div>
        <div className="text-xs text-gray-400">% Fourrages {ration.pourcentsForrage.toFixed(0)}%</div>
      </div>
    </div>
  )
}
