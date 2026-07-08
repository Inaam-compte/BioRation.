"use client"

import { useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Calculator, Leaf, Droplets, Sunrise } from 'lucide-react'

const categories = [
  { title: 'Vaches laitières', description: 'Ration pour production laitière.', value: 'vache-laitiere', icon: Droplets, color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
  { title: 'Bovins à l’engrais', description: 'Ration pour engraissement.', value: 'bovin-engrais', icon: Leaf, color: 'bg-amber-50 border-amber-200 text-amber-800' },
  { title: 'Ovins', description: 'Ration pour ovins.', value: 'ovin', icon: Sunrise, color: 'bg-sky-50 border-sky-200 text-sky-800' },
]

export default function ChoixEspeceClient() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category') ?? ''

  const config = useMemo(() => ({ species: 'Animal' }), [])

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="border-b bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/rationing/new">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-green-800">Choix d'espèce</h1>
                <p className="text-sm text-gray-600">Choisissez la catégorie de l'animal.</p>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {categories.map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.value} className={`border-2 ${item.color} hover:shadow-lg transition-all`}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-white p-3 shadow-sm">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                      <Link href={`/rationing/choix-espece?category=${item.value}`}>
                        <Calculator className="h-4 w-4 mr-2" />
                        Sélectionner
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/rationing/new">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold text-green-800">Paramètres de l'animal</h1>
              <p className="text-sm text-gray-600">(Prévisualisation simple)</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Informations de l'animal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">Formulaire simple temporaire.</p>
            </CardContent>
          </Card>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Résultats calculés</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">Les résultats apparaîtront ici.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}