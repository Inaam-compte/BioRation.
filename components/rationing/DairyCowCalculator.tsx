"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { calculateDairyCowNeeds, DairyCowNeeds } from '@/lib/inra-calculations'

interface Props {
  onCalculated?: (needs: DairyCowNeeds) => void
}

export function DairyCowCalculator({ onCalculated }: Props) {
  const [pv, setPv] = useState<number>(600)
  const [production, setProduction] = useState<number>(20)
  const [taux, setTaux] = useState<number>(3.8)
  const [stadeGest, setStadeGest] = useState<number>(0)
  const [primipare, setPrimipare] = useState<boolean>(false)
  const [stageLact, setStageLact] = useState<'debut' | 'milieu' | 'fin'>('milieu')

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const needs = calculateDairyCowNeeds({
      pv,
      productionLait: production,
      tauxButyreux: taux,
      stadeGestation: stadeGest,
      primipare,
      stageLactation: stageLact
    })

    if (onCalculated) onCalculated(needs)
  }

  return (
    <Card className="border-emerald-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl text-emerald-800">Calculateur vaches laitières (INRA)</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Poids vif (kg)</Label>
            <Input type="number" value={pv} onChange={(e) => setPv(Number(e.target.value))} />
          </div>

          <div>
            <Label>Production de lait (kg/jour)</Label>
            <Input type="number" value={production} onChange={(e) => setProduction(Number(e.target.value))} />
          </div>

          <div>
            <Label>Taux butyreux (%)</Label>
            <Input type="number" value={taux} step="0.1" onChange={(e) => setTaux(Number(e.target.value))} />
          </div>

          <div>
            <Label>Stade de lactation</Label>
            <select className="w-full rounded-md border p-2" value={stageLact} onChange={(e) => setStageLact(e.target.value as any)}>
              <option value="debut">Début</option>
              <option value="milieu">Milieu</option>
              <option value="fin">Fin</option>
            </select>
          </div>

          <div>
            <Label>Stade de gestation (mois)</Label>
            <select className="w-full rounded-md border p-2" value={stadeGest} onChange={(e) => setStadeGest(Number(e.target.value))}>
              <option value={0}>Non gestante</option>
              <option value={7}>7 mois</option>
              <option value={8}>8 mois</option>
              <option value={9}>9 mois</option>
            </select>
          </div>

          <div>
            <Label>Primipare</Label>
            <div className="mt-2">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={primipare} onChange={(e) => setPrimipare(e.target.checked)} />
                <span className="text-sm">Oui</span>
              </label>
            </div>
          </div>

          <div className="md:col-span-3 flex gap-2 justify-end">
            <Button type="submit">Calculer</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
