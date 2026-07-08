"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Check } from 'lucide-react'

interface Aliment {
  id: string
  nom: string
  categorie: 'fourrage' | 'verdure' | 'concentre'
  ms_pourcentage: number
}

interface AlimentsListProps {
  aliments: Aliment[]
  categoryName: string
  categoryColor: 'emerald' | 'amber' | 'sky'
}

export function AlimentsList({ aliments, categoryName, categoryColor }: AlimentsListProps) {
  const [selectedAliments, setSelectedAliments] = useState<string[]>([])
  const [quantities, setQuantities] = useState<{ [key: string]: string }>({})

  const toggleAliment = (alimentId: string) => {
    setSelectedAliments(prev =>
      prev.includes(alimentId)
        ? prev.filter(id => id !== alimentId)
        : [...prev, alimentId]
    )
  }

  const colorMap = {
    emerald: 'border-l-4 border-emerald-500 bg-emerald-50/50',
    amber: 'border-l-4 border-amber-500 bg-amber-50/50',
    sky: 'border-l-4 border-sky-500 bg-sky-50/50'
  }

  const buttonColorMap = {
    emerald: 'accent-emerald-600',
    amber: 'accent-amber-600',
    sky: 'accent-sky-600'
  }

  return (
    <Card className={`mt-4 ${colorMap[categoryColor]}`}>
      <CardHeader>
        <CardTitle className="text-base">Aliments disponibles</CardTitle>
        <CardDescription>Sélectionnez les aliments et quantités à ajouter à la ration</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {aliments.map((aliment) => (
            <div
              key={aliment.id}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-white/80 transition-colors"
            >
              <input
                type="checkbox"
                id={`cb-${aliment.id}`}
                checked={selectedAliments.includes(aliment.id)}
                onChange={() => toggleAliment(aliment.id)}
                className={`w-4 h-4 cursor-pointer ${buttonColorMap[categoryColor]}`}
              />
              <label htmlFor={`cb-${aliment.id}`} className="flex-1 cursor-pointer">
                <p className="font-medium text-sm text-gray-900">{aliment.nom}</p>
                <p className="text-xs text-gray-600">{aliment.ms_pourcentage}% MS</p>
              </label>
              {selectedAliments.includes(aliment.id) && (
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    placeholder="kg"
                    className="w-16 h-8 text-xs"
                    value={quantities[aliment.id] || ''}
                    onChange={(e) =>
                      setQuantities(prev => ({ ...prev, [aliment.id]: e.target.value }))
                    }
                  />
                  <Button size="sm" variant="outline" className="h-8" disabled>
                    <Check className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
