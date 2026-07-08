"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { calculateBeefBullNeeds, BeefBullNeeds } from '@/lib/inra-calculations'
import { Zap, AlertCircle, Leaf } from 'lucide-react'

interface BeefBullCalculatorProps {
  onCalculated?: (needs: BeefBullNeeds) => void
}

export function BeefBullCalculatorV2({ onCalculated }: BeefBullCalculatorProps) {
  const [formData, setFormData] = useState({
    pv: 500,
    gmq: 1200,
    age: 16
  })

  const [results, setResults] = useState<BeefBullNeeds | null>(null)
  const [showResults, setShowResults] = useState(false)

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCalculate = () => {
    const needs = calculateBeefBullNeeds({
      pv: formData.pv,
      gmq: formData.gmq,
      age: formData.age
    })
    setResults(needs)
    setShowResults(true)
    onCalculated?.(needs)
  }

  return (
    <div className="space-y-6">
      {/* Formulaire */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader>
          <CardTitle className="text-amber-900">Paramètres du taurillon</CardTitle>
          <CardDescription>Entrez les caractéristiques de votre animal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Poids vif */}
            <div className="space-y-2">
              <Label htmlFor="pv" className="text-sm font-medium">
                Poids vif (kg)
              </Label>
              <Input
                id="pv"
                type="number"
                value={formData.pv}
                onChange={(e) => handleInputChange('pv', parseFloat(e.target.value))}
                className="border-amber-200 focus:border-amber-500"
                placeholder="300-700"
              />
              <p className="text-xs text-gray-500">Poids actuel du taurillon</p>
            </div>

            {/* GMQ */}
            <div className="space-y-2">
              <Label htmlFor="gmq" className="text-sm font-medium">
                Gain moyen quotidien (g/jour)
              </Label>
              <Input
                id="gmq"
                type="number"
                step="50"
                value={formData.gmq}
                onChange={(e) => handleInputChange('gmq', parseFloat(e.target.value))}
                className="border-amber-200 focus:border-amber-500"
                placeholder="800-1500"
              />
              <p className="text-xs text-gray-500">Croissance quotidienne visée</p>
            </div>

            {/* Âge */}
            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-medium">
                Âge (mois)
              </Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', parseFloat(e.target.value))}
                className="border-amber-200 focus:border-amber-500"
                placeholder="6-36"
              />
              <p className="text-xs text-gray-500">Âge actuel</p>
            </div>
          </div>

          <Button
            onClick={handleCalculate}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            size="lg"
          >
            Calculer les besoins
          </Button>
        </CardContent>
      </Card>

      {/* Résultats */}
      {showResults && results && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Énergie */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  <CardTitle className="text-base">Énergie</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Entretien (UFV)</span>
                  <span className="font-semibold">{results.ufvEntretien.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Croissance (UFV)</span>
                  <span className="font-semibold">{results.ufvCroissance.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-sm font-bold text-amber-700">
                    <span>TOTAL</span>
                    <span className="text-lg">{results.ufvTotal.toFixed(2)} UFV</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Protéines */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-base">Protéines</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">PDI total (g)</span>
                  <span className="font-semibold">{results.pdiTotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">par UFV</span>
                  <span className="font-semibold">{(results.pdiTotal / results.ufvTotal).toFixed(0)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Capacité d'ingestion */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-base">Ingestion</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Capacité (kg MS)</span>
                  <span className="font-semibold">{results.capaciteIngestion.toFixed(1)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">% PV</span>
                  <span className="font-semibold">{((results.capaciteIngestion / results.pv) * 100).toFixed(1)}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Minéraux */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Minéraux & Eau</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Calcium (g/jour)</span>
                  <span className="font-semibold">{results.calcium.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phosphore (g/jour)</span>
                  <span className="font-semibold">{results.phosphore.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Eau (L/jour)</span>
                  <span className="font-semibold">{results.eauRecommandee.toFixed(0)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
