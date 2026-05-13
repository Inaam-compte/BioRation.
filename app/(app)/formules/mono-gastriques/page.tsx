import { MonogastriquesTabs } from "@/components/rationing/MonogastriquesTabs"
import { DEFAULT_USER_ID } from "@/lib/auth-utils"

export default async function FormulesMonoGastriquesPage() {
  // Prototype: ration formulation component currently uses internal demo data.
  // We pass `null` for besoins for now because this page does not yet fetch animal-specific requirements.
  void DEFAULT_USER_ID
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Formules - Mono-gastriques</h1>
        <p className="text-sm text-gray-600">Choisissez et formulez une ration pour les mono-gastriques.</p>
      </div>
      <MonogastriquesTabs />
    </div>
  )
}

