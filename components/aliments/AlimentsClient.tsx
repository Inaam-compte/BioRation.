'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { 
  CubeIcon, 
  MagnifyingGlassIcon, 
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'
import { AddAlimentModal, IncorporationLimitModal } from './index'
import AlimentsGrossiersTables from './AlimentsGrossiersTables'
import MatieresPremieresTables from './MatieresPremieresTables'
import SousProduitsTables from './SousProduitsTables'

interface Aliment {
  id: string
  name_fr: string
  name_ar: string
  category_fr: string
  category_ar: string
  ms_percentage: number
  ufl_per_kg_ms: number | null
  pdie_per_kg_ms: number | null
  pdin_per_kg_ms: number | null
  ndf_per_kg_ms: number
  mo_percentage?: number | null
  mat_percentage?: number | null
  mm_percentage?: number | null
  adf_percentage?: number | null
  ca_g_per_kg_brut?: number | null
  p_g_per_kg_brut?: number | null
  emv_kcal_per_kg_brut?: number | null
  ed_lapins_kcal_per_kg_brut?: number | null
  lys_percentage?: number | null
  meth_percentage?: number | null
  isPublic: boolean
  userId?: string | null
  stock?: {
    currentStock: number
    minStock: number
    maxStock: number
  } | null
}

const LOGO_IMAGES = [
  { src: '/LOGOS/Ray-gras.png', alt: 'Ray-gras' },
  { src: '/LOGOS/Paille (1).jpg', alt: 'Paille (1)' },
  { src: '/LOGOS/Paille (2).jpg', alt: 'Paille (2)' },
  { src: '/LOGOS/Paille (3).jpg', alt: 'Paille (3)' },
  { src: '/LOGOS/Paille (4).jpg', alt: 'Paille (4)' },
  { src: '/LOGOS/Paille (5).jpg', alt: 'Paille (5)' },
]

const NUTRITION_DISPLAY_FIELDS = [
  { key: 'ms_percentage', label: 'MS', unit: '%' },
  { key: 'ufl_per_kg_ms', label: 'UFL/kg MS', unit: '' },
  { key: 'pdie_per_kg_ms', label: 'PDIE', unit: 'g' },
  { key: 'pdin_per_kg_ms', label: 'PDIN', unit: 'g' },
  { key: 'emv_kcal_per_kg_brut', label: 'EMv', unit: ' kcal/kg' },
  { key: 'ed_lapins_kcal_per_kg_brut', label: 'ED Lapins', unit: ' kcal/kg' },
  { key: 'mo_percentage', label: 'MO', unit: '%' },
  { key: 'mat_percentage', label: 'MAT', unit: '%' },
  { key: 'adf_percentage', label: 'ADF', unit: '%' },
  { key: 'ca_g_per_kg_brut', label: 'Ca', unit: ' g/kg' },
] as const

const normalizeCategory = (category: string) =>
  ['Concentré', 'Matières premières'].includes(category) ? 'Aliments concentrés'
    : ['Fourrage grossier', 'Fourrages grossiers'].includes(category) ? 'Aliments grossiers'
      : category

const hideCategoryImages = (category: string) =>
  ['Verdure', 'Compléments', 'Aliments grossiers', 'Aliments concentrés', 'Sous-produits'].includes(normalizeCategory(category))

const HIDDEN_CATEGORIES = new Set(['Verdure'])

const CATEGORY_ORDER = ['Aliments grossiers', 'Aliments concentrés', 'Sous-produits', 'Compléments']

const getCategoryOrder = (category: string) => {
  const index = CATEGORY_ORDER.indexOf(normalizeCategory(category))
  return index === -1 ? CATEGORY_ORDER.length : index
}

const getCategoryLabel = (category: string) => {
  const normalizedCategory = normalizeCategory(category)

  switch (normalizedCategory) {
    case 'Aliments grossiers':
      return 'اعلاف خشنة - Aliments grossiers'
    case 'Aliments concentrés':
      return 'اعلاف مركبة - Aliments concentrés'
    case 'Sous-produits':
      return 'منتجات ثانوية - Sous-produits'
    case 'Compléments':
      return 'مكملات غذائية - Compléments'
    default:
      return normalizedCategory
  }
}

interface AlimentsClientProps {
  initialAliments: Record<string, Aliment[]>
  categories: string[]
  openAddOnLoad?: boolean
  initialMode?: 'category' | 'all'
}

export default function AlimentsClient({
  initialAliments,
  categories,
  openAddOnLoad = false,
  initialMode = 'all',
}: AlimentsClientProps) {
  const [aliments, setAliments] = useState(initialAliments)
  const [selectedCategory, setSelectedCategory] = useState<string>(initialMode === 'category' ? '' : 'all')
  const [nameSort, setNameSort] = useState<'default' | 'asc' | 'desc'>('default')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showIncorporationModal, setShowIncorporationModal] = useState(false)
  const [editingAliment, setEditingAliment] = useState<Aliment | null>(null)

  useEffect(() => {
    if (openAddOnLoad) {
      setEditingAliment(null)
      setShowAddModal(true)
    }
  }, [openAddOnLoad])

  const filteredAliments = React.useMemo(() => {
    let filtered = { ...aliments }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = { [selectedCategory]: aliments[selectedCategory] || [] }
    }

    filtered = Object.fromEntries(
      Object.entries(filtered).filter(([category]) => !HIDDEN_CATEGORIES.has(normalizeCategory(category)))
    )

    Object.keys(filtered).forEach(category => {
      if (nameSort === 'default') return

      filtered[category].sort((a, b) => (
        nameSort === 'asc'
          ? a.name_fr.localeCompare(b.name_fr)
          : b.name_fr.localeCompare(a.name_fr)
      ))
    })

    return Object.fromEntries(
      Object.entries(filtered).sort(([categoryA], [categoryB]) => {
        const orderDiff = getCategoryOrder(categoryA) - getCategoryOrder(categoryB)
        if (orderDiff !== 0) return orderDiff
        return normalizeCategory(categoryA).localeCompare(normalizeCategory(categoryB))
      })
    )
  }, [aliments, selectedCategory, nameSort])

  const totalAliments = Object.values(aliments).reduce((sum, categoryAliments) => sum + categoryAliments.length, 0)
  const customAliments = Object.values(aliments).reduce((sum, categoryAliments) => 
    sum + categoryAliments.filter(a => !a.isPublic).length, 0)
  const stockedAliments = Object.values(aliments).reduce((sum, categoryAliments) => 
    sum + categoryAliments.filter(a => a.stock && a.stock.currentStock > 0).length, 0)

  const refreshAliments = async () => {
    try {
      const response = await fetch('/api/aliments')
      if (response.ok) {
        const newAliments = await response.json()
        // Re-categorize the aliments
        const categorized = newAliments.reduce((acc: Record<string, Aliment[]>, aliment: Aliment) => {
          const category = normalizeCategory(aliment.category_fr)
          if (!acc[category]) {
            acc[category] = []
          }
          acc[category].push(aliment)
          return acc
        }, {})
        setAliments(categorized)
      }
    } catch (error) {
      console.error('Failed to refresh aliments:', error)
    }
  }

  const handleEditAliment = (aliment: Aliment) => {
    if (aliment.isPublic) return
    setEditingAliment(aliment)
    setShowAddModal(true)
  }

  const handleDeleteAliment = async (aliment: Aliment) => {
    if (aliment.isPublic) return

    const confirmDelete = window.confirm(`Supprimer l'aliment "${aliment.name_fr}" ?`)
    if (!confirmDelete) return

    try {
      const response = await fetch(`/api/aliments/${aliment.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Échec de la suppression')
      }

      await refreshAliments()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur lors de la suppression')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des aliments</h1>
          <p className="mt-2 text-gray-600">
            Gérez vos ingrédients et vos paramètres de composition nutritionnelle
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setShowIncorporationModal(true)}
            className="inline-flex items-center gap-x-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 transition-colors"
          >
            <ChartBarIcon className="h-4 w-4" />
            Limite d&apos;incorporation
          </button>
          <button
            onClick={() => {
              setEditingAliment(null)
              setShowAddModal(true)
            }}
            className="inline-flex items-center gap-x-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            Ajouter un aliment
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CubeIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total aliments</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalAliments}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Catégories</dt>
                  <dd className="text-lg font-medium text-gray-900">{categories.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PlusIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Aliments personnalisés</dt>
                  <dd className="text-lg font-medium text-gray-900">{customAliments}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CubeIcon className="h-6 w-6 text-orange-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">En stock</dt>
                  <dd className="text-lg font-medium text-gray-900">{stockedAliments}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="rounded-lg border-2 border-emerald-800 bg-emerald-100 p-6 shadow">
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-extrabold text-gray-900">البحث عن الأعلاف - Recherche des aliments</h2>
          <div className="flex flex-col gap-3 flex-1">
            <div className="flex items-center gap-2">
              <MagnifyingGlassIcon className="h-5 w-5 shrink-0 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full max-w-md rounded-md border-2 border-emerald-800 py-4 pl-5 pr-10 text-lg font-bold focus:border-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="all">حسب الفئة - Par catégorie</option>
                {categories
                  .filter(category => !HIDDEN_CATEGORIES.has(normalizeCategory(category)))
                  .sort((a, b) => {
                    const orderDiff = getCategoryOrder(a) - getCategoryOrder(b)
                    if (orderDiff !== 0) return orderDiff
                    return normalizeCategory(a).localeCompare(normalizeCategory(b))
                  })
                  .map(category => (
                    <option key={category} value={category}>{getCategoryLabel(category)}</option>
                  ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <MagnifyingGlassIcon className="h-5 w-5 shrink-0 text-gray-400" />
              <select
                value={nameSort}
                onChange={(e) => setNameSort(e.target.value as 'default' | 'asc' | 'desc')}
                className="w-full max-w-md rounded-md border-2 border-emerald-800 py-4 pl-5 pr-10 text-lg font-bold focus:border-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="default">حسب الإسم - Par nom</option>
                <option value="asc">Nom A-Z</option>
                <option value="desc">أ - ي</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Aliments Display (when category selected) */}
      {(initialMode === 'category' || selectedCategory !== '') ? (
        <div className="space-y-8">
          {Object.entries(filteredAliments).map(([category, categoryAliments], index) => (
            <div key={category}>
              {/* 1ère couche (images) à la même hauteur que la liste filtrée, donc recalculée à chaque changement de catégorie */}
              {index === 0 && !hideCategoryImages(category) && !hideCategoryImages(selectedCategory) && (
                <div className="w-full mb-4">
                  <div className="grid grid-cols-2 justify-items-center gap-6 sm:grid-cols-3">
                    {LOGO_IMAGES.map((logo, logoIdx) => (
                      <div 
                        key={logoIdx} 
                        className="group flex h-60 w-60 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-sm ring-1 ring-emerald-200 transition-shadow hover:shadow-md"
                      >
                        <div className="relative h-full w-full">
                          <Image
                            src={logo.src}
                            alt={logo.alt}
                            fill
                            sizes="240px"
                            className="object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {normalizeCategory(category) === 'Aliments concentrés' ? (
                <MatieresPremieresTables />
              ) : normalizeCategory(category) === 'Sous-produits' ? (
                <SousProduitsTables />
              ) : normalizeCategory(category) === 'Aliments grossiers' ? (
                <AlimentsGrossiersTables />
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{normalizeCategory(category)}</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">


                    {categoryAliments.map((aliment) => (

                      <div key={aliment.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-2 ${aliment.isPublic ? 'bg-blue-400' : 'bg-green-400'}`} />
                              <span className="text-xs text-gray-500">
                                {aliment.isPublic ? 'Public' : 'Personnalisé'}
                              </span>
                            </div>
                            {aliment.stock && (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                aliment.stock.currentStock > aliment.stock.minStock
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {aliment.stock.currentStock > aliment.stock.minStock ? 'En stock' : 'Stock faible'}
                              </span>
                            )}
                          </div>
                          
                          <h4 className="text-lg font-medium text-gray-900 mb-2">{aliment.name_fr}</h4>
                          <p className="text-sm text-gray-600 mb-4">{aliment.name_ar}</p>

                          {!aliment.isPublic && (
                            <div className="mb-4 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleEditAliment(aliment)}
                                className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                              >
                                <PencilSquareIcon className="h-3.5 w-3.5" />
                                Modifier
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteAliment(aliment)}
                                className="inline-flex items-center gap-1 rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                              >
                                <TrashIcon className="h-3.5 w-3.5" />
                                Supprimer
                              </button>
                            </div>
                          )}
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">MS:</span>
                              <span className="font-medium">{aliment.ms_percentage}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">UFL/kg MS:</span>
                              <span className="font-medium">{aliment.ufl_per_kg_ms}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">PDIE:</span>
                              <span className="font-medium">{aliment.pdie_per_kg_ms}g</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">PDIN:</span>
                              <span className="font-medium">{aliment.pdin_per_kg_ms}g</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">MO:</span>
                              <span className="font-medium">{aliment.mo_percentage ?? 0}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">MAT:</span>
                              <span className="font-medium">{aliment.mat_percentage ?? 0}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">ADF:</span>
                              <span className="font-medium">{aliment.adf_percentage ?? 0}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Ca:</span>
                              <span className="font-medium">{aliment.ca_g_per_kg_brut ?? 0} g/kg</span>
                            </div>
                            {NUTRITION_DISPLAY_FIELDS.map((field) => (
                              <div key={field.key} className="flex justify-between">
                                <span className="text-gray-500">{field.label}:</span>
                                <span className="font-medium">{aliment[field.key] ?? 0}{field.unit}</span>
                              </div>
                            ))}
                          </div>

                          {aliment.stock && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Stock actuel:</span>
                                <span className="font-medium">{aliment.stock.currentStock} kg</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MS %
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  UFL/kg MS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PDIE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.values(filteredAliments).flat().map((aliment) => (
                <tr key={aliment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{aliment.name_fr}</div>
                      <div className="text-sm text-gray-500">{aliment.name_ar}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {normalizeCategory(aliment.category_fr)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {aliment.ms_percentage}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {aliment.ufl_per_kg_ms}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {aliment.pdie_per_kg_ms}g
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {aliment.stock ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        aliment.stock.currentStock > aliment.stock.minStock
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {aliment.stock.currentStock} kg
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">Aucun stock</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      aliment.isPublic ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {aliment.isPublic ? 'Public' : 'Personnalisé'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {!aliment.isPublic ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditAliment(aliment)}
                          className="inline-flex items-center rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50"
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAliment(aliment)}
                          className="inline-flex items-center rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                        >
                          Supprimer
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">Protégé</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {Object.keys(filteredAliments).length === 0 && (
        <div className="text-center py-12">
          <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun aliment trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            {selectedCategory !== 'all'
              ? 'Essayez d\'ajuster vos critères de recherche.'
              : 'Commencez par ajouter votre premier aliment.'}
          </p>
          {selectedCategory === 'all' && (
            <div className="mt-6">
              <button
                onClick={() => {
                  setEditingAliment(null)
                  setShowAddModal(true)
                }}
                className="inline-flex items-center gap-x-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
              >
                <PlusIcon className="h-4 w-4" />
                Ajouter un aliment
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add Aliment Modal */}
      <AddAlimentModal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setEditingAliment(null)
        }}
        onSuccess={refreshAliments}
        mode={editingAliment ? 'edit' : 'create'}
        alimentId={editingAliment?.id}
        initialData={editingAliment ? (editingAliment as unknown as Record<string, unknown>) : undefined}
      />

      <IncorporationLimitModal
        open={showIncorporationModal}
        onClose={() => setShowIncorporationModal(false)}
      />
    </div>
  )
}
