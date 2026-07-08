import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SheepCalculator } from '@/components/rationing/SheepCalculator'

export default function SheepFatteningPage() {
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
              <h1 className="text-xl font-bold text-green-800">Engraissement des ovins</h1>
              <p className="text-sm text-gray-600">Module de calcul dédié aux ovins</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Calcul de ration</h2>
          <p className="mt-2 max-w-2xl text-gray-600">
            Ce module est structuré pour évoluer indépendamment de la logique des autres catégories d’animaux.
          </p>
        </div>

        <SheepCalculator />
      </main>
    </div>
  )
}
