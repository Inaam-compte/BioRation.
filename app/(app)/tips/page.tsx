import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function TipsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au tableau de bord
              </Link>
            </Button>
            <h1 className="ml-3 text-xl font-bold text-blue-800">Conseils Journaliers</h1>
          </div>
        </div>
      </header>
    </div>
  )
}
