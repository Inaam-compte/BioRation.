"use client"

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Milk, Beef, PawPrint, ChevronDown, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DairyCowCalculator } from '@/components/rationing/DairyCowCalculator'
import { BeefBullCalculatorV2 } from '@/components/rationing/BeefBullCalculatorV2'
import { SheepCalculator } from '@/components/rationing/SheepCalculator'
import { NutritionSummary } from '@/components/rationing/NutritionSummary'
import { FeedSelector } from '@/components/rationing/FeedSelector'
import { RationTable } from '@/components/rationing/RationTable'
import { NutritionCharts } from '@/components/rationing/NutritionCharts'
import { DairyCowNeeds, BeefBullNeeds, SheepNeeds } from '@/lib/inra-calculations'
import { RationOptimale, optimiserRationVacheLaitiere, optimiserRationTaurillon, optimiserRationOvin, AlimentDispo } from '@/lib/ration-optimizer'

interface Aliment {
  id: string
  nom: string
  categorie: 'fourrage' | 'verdure' | 'concentre'
  ms_pourcentage: number
  ufl_par_kg_ms?: number
  pdie_par_kg_ms?: number
  pdin_par_kg_ms?: number
  ndf_par_kg_ms?: number
  calcium_par_kg_ms?: number
  phosphore_par_kg_ms?: number
  biologique?: boolean
}

interface CategoryData {
  title: string
  description: string
  iconType: 'milk' | 'beef' | 'paw'
  accent: string
  color: 'emerald' | 'amber' | 'sky'
  type: 'vache' | 'taurillon' | 'ovin'
}

interface NewRationINRAClientProps {
  categories: CategoryData[]
  aliments: Aliment[]
}

type StageType = 'selection' | 'calcul' | 'resultats'

function getIcon(iconType: 'milk' | 'beef' | 'paw') {
  switch (iconType) {
    case 'milk':
      return <Milk className="h-6 w-6" />
    case 'beef':
      return <Beef className="h-6 w-6" />
    case 'paw':
      return <PawPrint className="h-6 w-6" />
  }
}

// Données d'aliments avec valeurs nutritionnelles par défaut
const alimentsParDefaut: AlimentDispo[] = [
  {
    id: 'f1',
    nom: 'Foin de prairie',
    categorie: 'fourrage',
    ms_percentage: 87,
    ufl_par_kg_ms: 0.75,
    pdie_par_kg_ms: 55,
    pdin_par_kg_ms: 65,
    calcium_par_kg_ms: 5,
    phosphore_par_kg_ms: 2,
    biologique: true
  },
  {
    id: 'f2',
    nom: 'Foin de luzerne',
    categorie: 'fourrage',
    ms_percentage: 89,
    ufl_par_kg_ms: 0.68,
    pdie_par_kg_ms: 105,
    pdin_par_kg_ms: 120,
    calcium_par_kg_ms: 12,
    phosphore_par_kg_ms: 2.5,
    biologique: true
  },
  {
    id: 'v1',
    nom: 'Ensilage de maïs',
    categorie: 'verdure',
    ms_percentage: 32,
    ufl_par_kg_ms: 0.95,
    pdie_par_kg_ms: 65,
    pdin_par_kg_ms: 75,
    calcium_par_kg_ms: 2,
    phosphore_par_kg_ms: 2,
    biologique: false
  },
  {
    id: 'c1',
    nom: 'Orge',
    categorie: 'concentre',
    ms_percentage: 87,
    ufl_par_kg_ms: 1.15,
    pdie_par_kg_ms: 85,
    pdin_par_kg_ms: 95,
    calcium_par_kg_ms: 0.5,
    phosphore_par_kg_ms: 3.5,
    biologique: true
  },
  {
    id: 'c2',
    nom: 'Tourteau de soja',
    categorie: 'concentre',
    ms_percentage: 89,
    ufl_par_kg_ms: 1.25,
    pdie_par_kg_ms: 320,
    pdin_par_kg_ms: 350,
    calcium_par_kg_ms: 3,
    phosphore_par_kg_ms: 6,
    biologique: true
  }
]

export function NewRationINRAClient({ categories, aliments }: NewRationINRAClientProps) {
  const [stage, setStage] = useState<StageType>('selection')
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null)
  const [besoins, setBesoins] = useState<DairyCowNeeds | BeefBullNeeds | SheepNeeds | null>(null)
  const [ration, setRation] = useState<RationOptimale | null>(null)
  const [alimentsDispo, setAlimentsDispo] = useState<AlimentDispo[]>(() => (
    aliments && aliments.length > 0 ? aliments.map(a => ({
      id: a.id,
      nom: a.nom,
      categorie: a.categorie,
      ms_percentage: a.ms_pourcentage,
      ufl_par_kg_ms: (a as any).ufl_par_kg_ms ?? 0,
      pdie_par_kg_ms: (a as any).pdie_par_kg_ms ?? 0,
      pdin_par_kg_ms: (a as any).pdin_par_kg_ms ?? 0,
      calcium_par_kg_ms: (a as any).calcium_par_kg_ms ?? 0,
      phosphore_par_kg_ms: (a as any).phosphore_par_kg_ms ?? 0,
      biologique: (a as any).biologique ?? true,
      ndf_par_kg_ms: (a as any).ndf_par_kg_ms ?? 0
    })) : alimentsParDefaut
  ))

  const handleCategorySelect = (category: CategoryData) => {
    setSelectedCategory(category)
    setStage('calcul')
  }

  const handleBesoinsCalculated = (newBesoins: DairyCowNeeds | BeefBullNeeds | SheepNeeds) => {
    setBesoins(newBesoins)
    
    // Optimiser la ration automatiquement en utilisant la liste d'aliments disponible
    const alimentsPourOpt = alimentsDispo.map(a => ({
      ...a,
      ufl_par_kg_ms: a.ufl_par_kg_ms || 0.8,
      pdie_par_kg_ms: a.pdie_par_kg_ms || 60,
      pdin_par_kg_ms: a.pdin_par_kg_ms || 70,
      calcium_par_kg_ms: a.calcium_par_kg_ms || 3,
      phosphore_par_kg_ms: a.phosphore_par_kg_ms || 2,
      biologique: a.biologique || false
    }))

    let rationOptimale: RationOptimale
    
    if (selectedCategory?.type === 'vache' && 'uflTotal' in newBesoins) {
      rationOptimale = optimiserRationVacheLaitiere(newBesoins as DairyCowNeeds, alimentsPourOpt)
    } else if (selectedCategory?.type === 'taurillon' && 'ufvTotal' in newBesoins) {
      rationOptimale = optimiserRationTaurillon(newBesoins as BeefBullNeeds, alimentsPourOpt)
    } else if (selectedCategory?.type === 'ovin' && 'uflTotal' in newBesoins) {
      rationOptimale = optimiserRationOvin(newBesoins as SheepNeeds, alimentsPourOpt)
    } else {
      rationOptimale = { aliments: [], totalUFL: 0, totalPDI: 0, totalMS: 0, totalCalcium: 0, totalPhosphore: 0, couvertureUFL: 0, couverturePDI: 0, couvertureMS: 0, pourcentsForrage: 0, alertes: [] }
    }

    setRation(rationOptimale)
    setStage('resultats')
  }

  const handleReset = () => {
    setStage('selection')
    setSelectedCategory(null)
    setBesoins(null)
    setRation(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/rationing">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold text-green-800">Calcul INRA 2018</h1>
              <p className="text-sm text-gray-600">Calculateur de besoins nutritionnels en mode biologique</p>
            </div>
          </div>
          {stage !== 'selection' && (
            <Button variant="outline" size="sm" onClick={handleReset}>
              Recommencer
            </Button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* STAGE 1: Sélection de catégorie */}
        {stage === 'selection' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Choisissez votre type d'animal</h2>
              <p className="mt-2 max-w-2xl text-gray-600">
                Sélectionnez la catégorie d'animal pour accéder au calculateur INRA adapté et proposer une ration équilibrée.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((category) => (
                <button
                  key={category.title}
                  onClick={() => handleCategorySelect(category)}
                  className="group text-left"
                >
                  <Card className={`border-2 transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer ${category.accent}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div className="rounded-full bg-white/80 p-3 shadow-sm group-hover:scale-110 transition-transform">
                          {getIcon(category.iconType)}
                        </div>
                        <Badge variant="secondary">{category.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="text-lg mb-2">{category.title}</CardTitle>
                      <CardDescription className="text-sm leading-6">
                        {category.description}
                      </CardDescription>
                      <div className="flex items-center gap-2 mt-4 text-sm font-semibold">
                        Calculer <ArrowRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STAGE 2: Formulaire de calcul */}
        {stage === 'calcul' && selectedCategory && (
          <div className="space-y-8">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200">
              <div className="rounded-full bg-white p-2 shadow-sm">
                {getIcon(selectedCategory.iconType)}
              </div>
              <div>
                <h2 className="font-bold text-gray-900">{selectedCategory.title}</h2>
                <p className="text-sm text-gray-600">Remplissez les paramètres de votre animal pour calculer ses besoins INRA</p>
              </div>
            </div>

            {selectedCategory.type === 'vache' && (
              <DairyCowCalculator onCalculated={handleBesoinsCalculated} />
            )}
            {selectedCategory.type === 'taurillon' && (
              <BeefBullCalculatorV2 onCalculated={handleBesoinsCalculated} />
            )}
            {selectedCategory.type === 'ovin' && (
              <SheepCalculator onCalculated={handleBesoinsCalculated} />
            )}
          </div>
        )}

        {/* STAGE 3: Résultats */}
        {stage === 'resultats' && selectedCategory && besoins && ration && (
          <div className="space-y-8">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-green-50 to-green-100 border border-green-200">
              <div className="rounded-full bg-white p-2 shadow-sm">
                {getIcon(selectedCategory.iconType)}
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-gray-900">Ration proposée - {selectedCategory.title}</h2>
                <p className="text-sm text-gray-600">Résultats du calcul INRA 2018 et ration optimisée</p>
              </div>
              <Badge className="bg-green-600">Calculée</Badge>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-1 space-y-4">
                <FeedSelector
                  aliments={alimentsDispo}
                  onToggle={(id, enabled) => {
                    // placeholder: future enable/disable handling
                    console.log('toggle', id, enabled)
                  }}
                />
              </div>

              <div className="lg:col-span-2 space-y-4">
                <NutritionCharts ration={ration} />
                <NutritionSummary
                  ration={ration}
                  besoins={besoins}
                  animalType={selectedCategory.type}
                />
                <RationTable ration={ration} />
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={handleReset}>
                Nouvelle ration
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                Sauvegarder la ration
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
