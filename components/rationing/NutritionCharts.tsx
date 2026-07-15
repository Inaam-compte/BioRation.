"use client"

import React from 'react'
import { RationOptimale } from '@/lib/ration-optimizer'

interface Props {
  ration: RationOptimale
}

const STATUT_BAR: Record<string, string> = {
  vert: 'bg-green-500',
  orange: 'bg-orange-500',
  rouge: 'bg-red-500'
}

function Bar({ label, value, className }: { label: string; value: number; className: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span>{label}</span>
        <span>{value.toFixed(0)}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${className}`} style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  )
}

export function NutritionCharts({ ration }: Props) {
  const barColor = STATUT_BAR[ration.statut] ?? 'bg-gray-400'

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="rounded-lg border p-3 space-y-2">
        <div className="text-sm text-gray-600">Énergie (UFL/UFV)</div>
        <div className="text-xl font-bold">{ration.totalUFL.toFixed(2)}</div>
        <Bar label="Couverture" value={ration.couvertureUFL} className={barColor} />
      </div>

      <div className="rounded-lg border p-3 space-y-2">
        <div className="text-sm text-gray-600">Protéines (PDI g)</div>
        <div className="text-xl font-bold">{ration.totalPDI.toFixed(0)}</div>
        <Bar label="Couverture" value={ration.couverturePDI} className={barColor} />
      </div>

      <div className="rounded-lg border p-3 space-y-2">
        <div className="text-sm text-gray-600">Matière sèche (kg)</div>
        <div className="text-xl font-bold">{ration.totalMS.toFixed(1)}</div>
        <Bar label="Fourrages" value={ration.pourcentsForrage} className="bg-emerald-500" />
      </div>
    </div>
  )
}
