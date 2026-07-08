"use client"

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Milk, Beef, PawPrint } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlimentsList } from '@/components/rationing/AlimentsList'
import { ChevronDown } from 'lucide-react'

interface Aliment {
  id: string
  nom: string
  categorie: 'fourrage' | 'verdure' | 'concentre'
  ms_pourcentage: number
}

interface CategoryData {
  title: string
  description: string
  href: string
  iconType: 'milk' | 'beef' | 'paw'
  accent: string
  color: 'emerald' | 'amber' | 'sky'
}

interface NewRationClientProps {
  categories: CategoryData[]
  aliments: Aliment[]
}

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

export function NewRationClient({ categories, aliments }: NewRationClientProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const toggleCategory = (categoryTitle: string) => {
    setExpandedCategory(expandedCategory === categoryTitle ? null : categoryTitle)
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
              <h1 className="text-xl font-bold text-green-800">Nouvelle ration</h1>
              <p className="text-sm text-gray-600">Choisissez une catégorie d'animaux</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Créer une nouvelle ration</h2>
          <p className="mt-2 max-w-2xl text-gray-600">
            Sélectionnez la catégorie correspondant à votre animal pour accéder au module de calcul adapté.
          </p>
        </div>

        <div className="space-y-8">
          {categories.map((category) => {
            const isExpanded = expandedCategory === category.title

            return (
              <div key={category.title}>
                <div className="cursor-pointer" onClick={() => toggleCategory(category.title)}>
                  <Card className={`border-2 transition-all hover:-translate-y-1 hover:shadow-lg ${category.accent}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="rounded-full bg-white/80 p-3 shadow-sm">
                            {getIcon(category.iconType)}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{category.title}</CardTitle>
                          </div>
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm leading-6 text-gray-700">
                        {category.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>

                {isExpanded && (
                  <div className="mt-4">
                    <AlimentsList
                      aliments={aliments}
                      categoryName={category.title}
                      categoryColor={category.color}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
