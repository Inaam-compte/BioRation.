"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { calculateSheepNeeds, SheepNeeds } from '@/lib/inra-calculations'

interface Props {
  onCalculated?: (needs: SheepNeeds) => void
}

export function SheepCalculator({ onCalculated }: Props) {
  const [pv, setPv] = useState<number>(60)
  const [gmq, setGmq] = useState<number>(200)
  const [age, setAge] = useState<number>(6)

  const handleCalculate = () => {
    const needs = calculateSheepNeeds({ pv, gmq, age })
    onCalculated?.(needs)
  }

  return (
    <div className="space-y-6">
      <Card className="border-sky-200 bg-sky-50/50">
        <CardHeader>
          <CardTitle className="text-sky-900">Paramètres de l'ovin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Poids vif (kg)</Label>
              <Input type="number" value={pv} onChange={(e) => setPv(Number(e.target.value))} />
            </div>
            <div>
              <Label>GMQ (g/jour)</Label>
              <Input type="number" value={gmq} onChange={(e) => setGmq(Number(e.target.value))} />
            </div>
            <div>
              <Label>Âge (mois)</Label>
              <Input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button onClick={handleCalculate} className="bg-sky-600 hover:bg-sky-700 text-white">Calculer</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
