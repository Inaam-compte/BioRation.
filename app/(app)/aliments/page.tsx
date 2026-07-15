import { prisma } from '@/lib/prisma'
import { DEFAULT_USER_ID } from '@/lib/auth-utils'
import AlimentsClient from '@/components/aliments/AlimentsClient'

// Ne jamais pré-rendre statiquement : les aliments ajoutés/modifiés doivent
// apparaître immédiatement ici, sans attendre le prochain déploiement.
export const dynamic = 'force-dynamic'

const alimentListSelect = {
  id: true,
  name_fr: true,
  name_ar: true,
  category_fr: true,
  category_ar: true,
  ms_percentage: true,
  ufl_per_kg_ms: true,
  pdie_per_kg_ms: true,
  pdin_per_kg_ms: true,
  ndf_per_kg_ms: true,
  userId: true,
  isPublic: true,
} as const

export default async function AlimentsPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string }>
}) {
  const userId = DEFAULT_USER_ID
  const { action } = await searchParams

  // Fetch only the stable fields required by the aliments list. This keeps the
  // page compatible with production databases that may not have optional
  // composition columns migrated yet.
  const aliments = await prisma.aliment.findMany({
    where: {
      OR: [
        { isPublic: true },
        { userId: userId }
      ]
    },
    orderBy: { name_fr: 'asc' },
    select: alimentListSelect,
  })

  type StockSummary = {
    alimentId: string
    currentStock: number
    minStock: number
    maxStock: number
  }

  // Stock tables are optional for this screen. If a production database is
  // missing stock migrations, the aliments page should still render.
  let stocks: StockSummary[] = []
  try {
    stocks = await prisma.stock.findMany({
      where: { userId },
      select: {
        alimentId: true,
        currentStock: true,
        minStock: true,
        maxStock: true,
      },
    })
  } catch (error) {
    console.error('Unable to load stocks for aliments page:', error)
  }

  // Group aliments by category and add stock information
  type AlimentWithStock = typeof aliments[0] & { stock: Omit<StockSummary, 'alimentId'> | null }
  const normalizeCategory = (category: string) =>
    category === 'Concentré' ? 'Matières premières' : category
  
  const categorizedAliments = aliments.reduce((acc, aliment) => {
    const category = normalizeCategory(aliment.category_fr)
    if (!acc[category]) {
      acc[category] = []
    }
    
    // Find corresponding stock for this aliment
    const stock = stocks.find(s => s.alimentId === aliment.id)
    
    acc[category].push({
      ...aliment,
      stock: stock
        ? {
            currentStock: stock.currentStock,
            minStock: stock.minStock,
            maxStock: stock.maxStock,
          }
        : null
    } as AlimentWithStock)
    return acc
  }, {} as Record<string, AlimentWithStock[]>)

  const categories = Object.keys(categorizedAliments)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <AlimentsClient
            initialAliments={categorizedAliments}
            categories={categories}
            openAddOnLoad={action === 'add'}
            initialMode="category"
          />
        </div>
      </div>
    </div>
  )
}
