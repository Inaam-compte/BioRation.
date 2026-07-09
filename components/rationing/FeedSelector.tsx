"use client"

import React from 'react'
import { Input } from '@/components/ui/input'
import { AlimentDispo } from '@/lib/ration-optimizer'

interface Props {
  aliments: AlimentDispo[]
  quantites: Record<string, number>
  onQuantiteChange: (id: string, quantiteBrute: number) => void
}

export function FeedSelector({ aliments, quantites, onQuantiteChange }: Props) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">Mes aliments disponibles</h3>
      <p className="text-xs text-gray-500">
        Cochez les aliments que vous avez et entrez la quantité en kg que vous comptez donner par jour.
      </p>
      <div className="space-y-2">
        {aliments.map((a) => {
          const active = (quantites[a.id] ?? 0) > 0
          return (
            <div key={a.id} className="flex items-center gap-2 border p-2 rounded">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => onQuantiteChange(a.id, e.target.checked ? (quantites[a.id] || 1) : 0)}
              />
              <div className="flex-1 text-sm">
                <div className="font-medium flex items-center gap-2">
                  {a.nom}
                  {a.biologique && <span className="text-xs text-green-600 font-normal">bio</span>}
                </div>
                <div className="text-xs text-gray-500">{a.categorie} — MS {a.ms_percentage}%</div>
              </div>
              <Input
                type="number"
                min={0}
                step={0.1}
                disabled={!active}
                placeholder="kg"
                value={quantites[a.id] ?? ''}
                onChange={(e) => onQuantiteChange(a.id, parseFloat(e.target.value) || 0)}
                className="w-20 h-8 text-xs"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
