import { prisma } from '@/lib/prisma'
import { NewRationINRAClient } from '@/components/rationing/NewRationINRAClient'

const categories = [
  {
    title: 'Vaches laitières',
    description: 'Calculer une ration adaptée à la production laitière et au stade physiologique.',
    href: '/rationing/choix-espece?category=vache-laitiere',
    iconType: 'milk' as const,
    accent: 'border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-800',
    color: 'emerald' as const,
    type: 'vache' as const,
  },
  {
    title: 'Engraissement des taurillons',
    description: 'Formuler une ration équilibrée pour l\'engraissement des taurillons.',
    href: '/rationing/choix-espece?category=bovin-engrais',
    iconType: 'beef' as const,
    accent: 'border-amber-200 bg-amber-50/70 hover:bg-amber-100/80 text-amber-800',
    color: 'amber' as const,
    type: 'taurillon' as const,
  },
  {
    title: 'Engraissement des ovins',
    description: 'Créer une ration adaptée à l\'engraissement et à la croissance des ovins.',
    href: '/rationing/choix-espece?category=ovin',
    iconType: 'paw' as const,
    accent: 'border-sky-200 bg-sky-50/70 hover:bg-sky-100/80 text-sky-800',
    color: 'sky' as const,
    type: 'ovin' as const,
  }
]

export default async function NewRationPage() {
  const aliments = await prisma.aliment.findMany({
    orderBy: [
      { category_fr: 'asc' },
      { name_fr: 'asc' }
    ]
  })

  const alimentsData = aliments.map((aliment) => ({
    id: aliment.id,
    nom: aliment.name_fr,
    categorie: (aliment.category_fr.toLowerCase().includes('fourrage') ? 'fourrage' :
      aliment.category_fr.toLowerCase().includes('verdure') ? 'verdure' : 'concentre') as 'fourrage' | 'verdure' | 'concentre',
    ms_pourcentage: aliment.ms_percentage,
    ufl_par_kg_ms: aliment.ufl_per_kg_ms ?? aliment.ufl_per_kg_brut ?? 0,
    pdie_par_kg_ms: aliment.pdie_per_kg_ms ?? aliment.pdie_g_per_kg_brut ?? 0,
    pdin_par_kg_ms: aliment.pdin_per_kg_ms ?? aliment.pdin_g_per_kg_brut ?? 0,
    ufv_par_kg_ms: aliment.ufv_per_kg_ms ?? aliment.ufv_per_kg_brut ?? 0,
    ndf_par_kg_ms: aliment.ndf_per_kg_ms ?? aliment.ndf_percentage_brut ?? 0,
    calcium_par_kg_ms: aliment.ca_g_per_kg_brut ?? 0,
    phosphore_par_kg_ms: aliment.p_g_per_kg_brut ?? 0,
    biologique: aliment.isPublic ?? true
  }))

  return <NewRationINRAClient categories={categories} aliments={alimentsData} />
}
