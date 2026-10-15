"use client"

import React, { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { AlimentDispo } from '@/lib/ration-optimizer'

const GROUP_ORDER = ['fourrage', 'verdure', 'concentre'] as const

const GROUP_LABELS: Record<string, { title: string; emoji: string; hint: string }> = {
  fourrage: { title: 'Fourrages', emoji: '🌾', hint: 'Base de la ration' },
  verdure: { title: 'Verdures / Ensilages', emoji: '🌿', hint: 'Humides et appétents' },
  concentre: { title: 'Concentrés', emoji: '🌽', hint: 'Énergie et protéines' },
}

interface Props {
  aliments: AlimentDispo[]
  quantites: Record<string, number>
  onQuantiteChange: (id: string, quantiteBrute: number) => void
}

export function FeedSelector({ aliments, quantites, onQuantiteChange }: Props) {
  // Coché indépendamment de la quantité : cocher un aliment affiche 0 kg par défaut
  // (à l'utilisateur de saisir la vraie quantité), sans se décocher automatiquement.
  const [cochés, setCochés] = useState<Set<string>>(new Set())

  const toggle = (id: string, checked: boolean) => {
    setCochés(prev => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
    onQuantiteChange(id, checked ? (quantites[id] || 0) : 0)
  }

  const grouped = useMemo(() => {
    const map = new Map<string, AlimentDispo[]>()
    for (const a of aliments) {
      const key = (a.categorie || 'autre').toLowerCase()
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(a)
    }
    // Ordre connu d'abord, puis autres types alphabétiques
    const orderedKeys = [
      ...GROUP_ORDER.filter((k) => map.has(k)),
      ...[...map.keys()].filter((k) => !(GROUP_ORDER as readonly string[]).includes(k)).sort(),
    ]
    return orderedKeys.map((key) => ({ key, items: map.get(key)! }))
  }, [aliments])

  const renderRow = (a: AlimentDispo) => {
    const active = cochés.has(a.id)
    return (
      <div key={a.id} className="flex items-center gap-2 border p-2 rounded bg-white">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => toggle(a.id, e.target.checked)}
        />
        <div className="flex-1 text-sm">
          <div className="font-medium flex items-center gap-2">
            {a.nom}
            {a.biologique && <span className="text-xs text-green-600 font-normal">bio</span>}
          </div>
          <div className="text-xs text-gray-500">MS {a.ms_percentage}%</div>
        </div>
        <Input
          type="number"
          min={0}
          step={0.1}
          disabled={!active}
          placeholder="kg"
          value={active ? (quantites[a.id] ?? 0) : ''}
          onChange={(e) => onQuantiteChange(a.id, parseFloat(e.target.value) || 0)}
          className="w-20 h-8 text-xs"
        />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">Mes aliments disponibles</h3>
      <p className="text-xs text-gray-500">
        Cochez les aliments que vous avez et entrez la quantité en kg que vous comptez donner par jour.
      </p>
      <div className="space-y-4">
        {grouped.map((group) => {
          const meta = GROUP_LABELS[group.key] ?? { title: group.key, emoji: '📦', hint: '' }
          const selectedInGroup = group.items.filter((a) => cochés.has(a.id)).length
          return (
            <div key={group.key} className="space-y-2">
              <div className="flex items-center justify-between rounded-md bg-gray-100 px-2 py-1.5">
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-700">
                  <span className="mr-1">{meta.emoji}</span>
                  {meta.title}
                  <span className="ml-2 font-normal normal-case text-gray-500">
                    {group.items.length} aliment{group.items.length > 1 ? 's' : ''}
                    {meta.hint ? ` — ${meta.hint}` : ''}
                  </span>
                </div>
                {selectedInGroup > 0 && (
                  <span className="rounded-full bg-green-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                    {selectedInGroup} sélectionné{selectedInGroup > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                {group.items.map(renderRow)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
