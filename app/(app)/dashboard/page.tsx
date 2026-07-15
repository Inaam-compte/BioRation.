import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { DEFAULT_USER_ID } from '@/lib/auth-utils'

// Page basée sur des données live (animaux, aliments, conseils) : ne jamais la
// pré-rendre statiquement au build, sinon elle resterait figée jusqu'au prochain déploiement.
export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const userId = DEFAULT_USER_ID

  const [animals, alimentCount, recentAnimals, tips] = await Promise.all([
    prisma.animal.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        species: true,
        physiologicalPhase: true,
        weight: true,
        milkProduction: true,
        daysInLactation: true,
        daysInGestation: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.aliment.count({
      where: {
        OR: [
          { isPublic: true },
          { userId }
        ]
      }
    }),
    prisma.animal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: { id: true, name: true, species: true, physiologicalPhase: true, milkProduction: true, weight: true }
    }),
    prisma.dailyTip.findMany({
      orderBy: { createdAt: 'desc' },
      take: 2,
      select: { id: true, title_fr: true, content_fr: true, category: true }
    })
  ])

  const speciesCount = new Map<string, number>()
  let lactating = 0
  for (const a of animals) {
    speciesCount.set(a.species, (speciesCount.get(a.species) || 0) + 1)
    if (a.physiologicalPhase === 'Lactation') lactating++
  }
  const avgProd = animals.length > 0
    ? Math.round(animals.reduce((s, a) => s + (a.milkProduction || 0), 0) / animals.length * 10) / 10
    : 0

  const tools = [
    {
      title: 'Aliments',
      desc: 'Gestion des aliments',
      href: '/aliments',
      icon: '🌾',
      iconBg: 'bg-amber-500',
    },
    {
      title: 'Animaux',
      desc: 'Suivre vos troupeaux et performances',
      href: '/animals',
      icon: '🐄',
      iconBg: 'bg-sky-500',
    },
    {
      title: 'Rationnement',
      desc: 'Formuler des rations équilibrées pour vos animaux',
      href: '/rationing',
      icon: '📊',
      iconBg: 'bg-green-500',
    },
    {
      title: 'Conseils',
      desc: 'Alimentation par espèce et stade',
      href: '/tips',
      icon: '💡',
      iconBg: 'bg-purple-500',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">

        {/* Main grid: content only (no right sidebar) */}
        <div className="grid grid-cols-1 gap-6">

          {/* Left / main content */}
          <div className="space-y-6">

            {/* Welcome banner */}
            <div className="relative overflow-hidden rounded-2xl p-4 shadow-xl bg-gradient-to-br from-emerald-700 via-green-600 to-teal-500">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15),_transparent_65%)]" />
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
              <div className="relative grid grid-cols-1 items-center gap-4 lg:grid-cols-[180px_minmax(0,1fr)_104px] xl:grid-cols-[220px_minmax(0,1fr)_116px]">
                {/* Left: Carte Biorest - larger and more visible */}
                <div className="mx-auto flex h-40 w-40 items-center justify-center overflow-hidden rounded-2xl border border-white/40 bg-white/5 sm:h-44 sm:w-44 lg:h-44 lg:w-full xl:h-52">
                  <Image
                    src="/LOGOS/Carte Biorest .png"
                    alt="Carte Biorest"
                    width={260}
                    height={320}
                    className="w-full h-full object-contain"
                    priority
                  />
                </div>

                {/* Center: Bienvenue text */}
                <div className="min-w-0 text-center">
                  <p className="mb-2 flex items-center justify-center gap-2 text-2xl font-semibold uppercase tracking-widest text-emerald-100 sm:text-3xl xl:text-4xl">
                    <span className="text-3xl sm:text-4xl xl:text-5xl">👋</span> Bienvenue
                  </p>
                  <p className="mx-auto max-w-2xl text-balance text-xl font-extrabold leading-tight text-white drop-shadow sm:text-2xl xl:text-3xl">
                    Votre assistant nutritionnel pour l&apos;élevage biologique
                  </p>
                </div>
                
                {/* Right: Bio-Aliment logo + Biorest logo below */}
                <div className="mx-auto flex flex-row items-center justify-center gap-2 lg:flex-col">
                  <div className="h-20 w-20 overflow-hidden rounded-2xl border border-white/40 bg-white/5 lg:h-24 lg:w-24">
                    <Image
                      src="/logo/Logo%20fond%20Noir.png"
                      alt="Logo Bio-Aliment"
                      width={120}
                      height={120}
                      className="w-full h-full object-contain"
                      priority
                    />
                  </div>
                  <div className="h-9 w-24 overflow-hidden rounded-xl border border-white/40 bg-white/5 lg:h-10">
                    <Image
                      src="/LOGOS/LOGO BIOREST.jpg"
                      alt="Logo Biorest"
                      width={120}
                      height={50}
                      className="w-full h-full object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>
              
              {/* Horizontal navigation menu inside banner */}
              <div className="relative mt-4 flex flex-wrap items-center justify-center gap-1.5 rounded-xl bg-white/95 p-2">
                <Link href="/dashboard" className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-bold text-emerald-700 hover:bg-emerald-50 transition-colors whitespace-nowrap">
                  <span>🏠</span>
                  <span>Accueil</span>
                </Link>
                <span className="text-sm text-gray-300">/</span>
                <Link href="/aliments" className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-bold text-emerald-700 hover:bg-emerald-50 transition-colors whitespace-nowrap">
                  <span>🌾</span>
                  <span>Aliments</span>
                </Link>
                <span className="text-sm text-gray-300">/</span>
                <Link href="/formules" className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-bold text-emerald-700 hover:bg-emerald-50 transition-colors whitespace-nowrap">
                  <span>📋</span>
                  <span>Formules</span>
                </Link>
                <span className="text-sm text-gray-300">/</span>
                <Link href="/animals" className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-bold text-emerald-700 hover:bg-emerald-50 transition-colors whitespace-nowrap">
                  <span>🐄</span>
                  <span>Animaux</span>
                </Link>
                <span className="text-sm text-gray-300">/</span>
                <Link href="/rationing" className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-bold text-emerald-700 hover:bg-emerald-50 transition-colors whitespace-nowrap">
                  <span>📊</span>
                  <span>Rationnement</span>
                </Link>
                <span className="text-sm text-gray-300">/</span>
                <Link href="/tips" className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-bold text-emerald-700 hover:bg-emerald-50 transition-colors whitespace-nowrap">
                  <span>💡</span>
                  <span>Conseils</span>
                </Link>
                <span className="text-sm text-gray-300">/</span>
                <Link href="/settings" className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-bold text-emerald-700 hover:bg-emerald-50 transition-colors whitespace-nowrap">
                  <span>⚙️</span>
                  <span>Paramètres</span>
                </Link>
              </div>
            </div>

            {/* Tools grid */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🧰</span>
                <h2 className="text-lg font-extrabold text-gray-800 uppercase tracking-wider">Outils</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tools.map((tool) => (
                  <Link
                    key={tool.title}
                    href={tool.href}
                    className="group relative overflow-hidden rounded-2xl border-2 border-teal-300 bg-teal-50/30 p-6 transition-all duration-200 hover:border-teal-500 hover:bg-teal-50 hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl ${tool.iconBg} flex items-center justify-center text-xl shadow-md`}>
                        {tool.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-extrabold text-gray-950">{tool.title}</h3>
                        <p className="mt-1 text-sm font-medium leading-relaxed text-teal-900/75">{tool.desc}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* Action buttons - Green block */}
              <div className="mt-6 rounded-2xl bg-gradient-to-br from-emerald-700 via-green-600 to-teal-500 p-6 shadow-xl">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Total animaux', value: animals.length, icon: '🐄', href: '/animals', accent: 'text-green-600' },
                    { label: 'Total aliments', value: alimentCount, icon: '🌾', href: '/aliments', accent: 'text-amber-600' },
                    { label: 'Rapports', value: '📋', icon: '📋', href: '/reports', accent: 'text-indigo-600' },
                    { label: 'Analyses', value: '🔬', icon: '🔬', href: '/analytics', accent: 'text-cyan-600' },
                  ].map((s) => (
                    <Link
                      key={s.label}
                      href={s.href}
                      className="rounded-xl bg-white border border-gray-200 p-4 text-center transition-all hover:shadow-md hover:border-gray-300"
                    >
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-2xl">{s.icon}</span>
                      </div>
                      <span className="text-xs font-medium text-gray-700 block">{s.label}</span>
                      {typeof s.value === 'number' && <p className={`text-xl font-bold ${s.accent} mt-1`}>{s.value}</p>}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent animals */}
            {recentAnimals.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🐮</span>
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Animaux récents</h2>
                  </div>
                  <Link href="/animals" className="text-xs text-green-600 hover:text-green-700 font-medium">
                    Voir tous →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {recentAnimals.map((a) => (
                    <Link
                      key={a.id}
                      href={`/rationing/${a.id}/formulation`}
                      className="rounded-xl bg-white border border-gray-200 p-4 hover:border-green-300 hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900 text-sm truncate">{a.name || 'Sans nom'}</span>
                        <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-medium">{a.species}</span>
                      </div>
                      <div className="space-y-1 text-xs text-gray-500">
                        <div className="flex justify-between">
                          <span>Phase</span>
                          <span className="text-gray-700">{a.physiologicalPhase}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Poids</span>
                          <span className="text-gray-700">{a.weight} kg</span>
                        </div>
                        {a.milkProduction && (
                          <div className="flex justify-between">
                            <span>Production</span>
                            <span className="text-green-600 font-medium">{a.milkProduction} L/j</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right sidebar - hidden */}
          <div className="hidden space-y-5">

            {/* Weather-like info widget */}
            <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Aujourd&apos;hui · Tunisie</span>
                <span className="text-2xl">☀️</span>
              </div>
              <div className="mb-2 rounded-xl bg-emerald-50/80 p-3 ring-1 ring-emerald-100">
                <div className="grid grid-cols-[110px_1fr] items-center gap-3">
                  <div className="rounded-xl bg-white p-2 shadow-sm ring-1 ring-emerald-200">
                    <Image
                      src="/LOGOS/Carte Biorest .png"
                      alt="Carte Biorest"
                      width={150}
                      height={220}
                      className="mx-auto h-32 w-auto object-contain"
                      priority
                    />
                  </div>
                  <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-emerald-200">
                    <Image
                      src="/LOGOS/logo%20biorest.png"
                      alt="Logo Biorest"
                      width={220}
                      height={100}
                      className="mx-auto h-16 w-auto object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Plateforme réalisée avec Biorest
              </p>
            </div>

            {/* Mon troupeau summary */}
            <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🐄</span>
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Mon troupeau</h3>
                </div>
                <Link href="/animals?action=add" className="text-xs text-green-600 hover:text-green-700 font-medium">
                  + Nouveau
                </Link>
              </div>
              {animals.length === 0 ? (
                <div className="text-center py-6">
                  <span className="text-4xl block mb-2">🐮</span>
                  <p className="text-sm text-gray-500">Aucun animal enregistré</p>
                  <Link
                    href="/animals?action=add"
                    className="inline-block mt-3 text-xs font-semibold text-green-600 border border-green-200 rounded-lg px-4 py-2 hover:bg-green-50 transition-colors"
                  >
                    Ajouter un animal
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {Array.from(speciesCount.entries()).map(([species, count]) => (
                    <div key={species} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{species}</span>
                      <span className="text-sm font-bold text-gray-900 bg-gray-100 rounded-full px-3 py-0.5">{count}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Total</span>
                    <span className="text-sm font-bold text-green-600">{animals.length}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Conseil / tips */}
            <div className="rounded-2xl bg-green-50 border border-green-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-green-600 text-base">💡</span>
                <h3 className="text-xs font-bold text-green-600 uppercase tracking-wider">Conseil Bio-Aliment</h3>
              </div>
              {tips.length > 0 ? (
                <div className="space-y-3">
                  {tips.map((tip) => (
                    <div key={tip.id}>
                      <p className="text-sm font-semibold text-gray-900 mb-1">{tip.title_fr}</p>
                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{tip.content_fr}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-600 leading-relaxed">
                  Pour une alimentation bio optimale, assurez-vous que vos rations couvrent les besoins en énergie (UFL) et en protéines (PDI) de chaque animal selon son stade physiologique.
                </p>
              )}
              <Link
                href="/tips"
                className="inline-block mt-3 text-xs font-medium text-green-600 hover:text-green-700"
              >
                Voir tous les conseils →
              </Link>
            </div>

            {/* Quick add buttons */}
            <div className="space-y-2">
              <Link
                href="/aliments?action=add"
                className="flex items-center gap-3 rounded-xl bg-white border border-gray-200 p-4 hover:border-green-300 hover:shadow-sm transition-all"
              >
                <span className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-base">🌾</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Ajouter un aliment</p>
                  <p className="text-[11px] text-gray-500">Enrichir la base nutritionnelle</p>
                </div>
              </Link>
              <Link
                href="/rationing"
                className="flex items-center gap-3 rounded-xl bg-white border border-gray-200 p-4 hover:border-green-300 hover:shadow-sm transition-all"
              >
                <span className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center text-base">📊</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Calculer une ration</p>
                  <p className="text-[11px] text-gray-500">Formulation équilibrée</p>
                </div>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
