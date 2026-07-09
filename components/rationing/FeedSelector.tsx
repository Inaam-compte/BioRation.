"use client"

import React from 'react'
import { AlimentDispo } from '@/lib/ration-optimizer'

interface Props {
  aliments: AlimentDispo[]
  onToggle?: (id: string, enabled: boolean) => void
}

export function FeedSelector({ aliments, onToggle }: Props) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">Aliments disponibles</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {aliments.map((a) => (
          <label key={a.id} className="flex items-center gap-2 border p-2 rounded">
            <input type="checkbox" defaultChecked onChange={(e) => onToggle?.(a.id, e.target.checked)} />
            <div className="flex-1 text-sm">
              <div className="font-medium flex items-center gap-2">
                {a.nom}
                {a.biologique && <span className="text-xs text-green-600 font-normal">bio</span>}
              </div>
              <div className="text-xs text-gray-500">{a.categorie} — MS {a.ms_percentage}%</div>
            </div>
            <div className="text-xs font-semibold">{typeof a.ufl_par_kg_ms === 'number' ? a.ufl_par_kg_ms.toFixed(2) : '-'}</div>
          </label>
        ))}
      </div>
    </div>
  )
}
