import { RuminantsTabs } from "@/components/rationing/RuminantsTabs"
import { DEFAULT_USER_ID } from "@/lib/auth-utils"

export default async function FormulesRuminantsPage() {
  // Prototype: ration formulation component currently uses internal demo data.
  // We pass `null` for besoins for now because this page does not yet fetch animal-specific requirements.
  void DEFAULT_USER_ID

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="mb-6">
        <h1 className="text-4xl font-extrabold text-gray-900">Formules - Ruminants</h1>
        <p className="mt-2 text-lg font-medium text-gray-600">Choisissez et formulez une ration pour les ruminants.</p>

        <div className="mt-4">
          <div className="mb-3 text-lg font-bold text-gray-700">Ruminants</div>
          <RuminantsTabs className="" />
        </div>
      </div>

    </div>
  )
}

