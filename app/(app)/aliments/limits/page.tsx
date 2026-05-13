
'use client'


import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { PlusIcon, TrashIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'

interface LimitRow {
  id: string
  aliment: string
  bovins: string
  volailles: string
  lapins: string
}

const STORAGE_KEY = 'bio-aliment-incorporation-limits-v1'

const defaultRows: LimitRow[] = [
  { id: 'mais', aliment: 'Maïs', bovins: '50 – 60%', volailles: '60-70%', lapins: '-' },
  { id: 'ble', aliment: 'Blé', bovins: '40 – 50%', volailles: 'Jeunes : 35% | Adultes : 65%', lapins: '10-15%' },
  { id: 'orge', aliment: 'Orge', bovins: '25%', volailles: 'Jeunes : 5% | Adultes : 20%', lapins: '10-30%' },
  { id: 'sorgho', aliment: 'Sorgho', bovins: '20 – 30%', volailles: 'Jeunes : 5% | Adultes : 10%', lapins: 'ND' },
  { id: 'triticale', aliment: 'Triticale', bovins: '15%', volailles: '20-40%', lapins: 'ND' },
  { id: 'seigle', aliment: 'Seigle', bovins: '50%', volailles: 'Jeunes : 5% | Adultes : 10%', lapins: '5%' },
  { id: 'avoine', aliment: 'Avoine', bovins: '20%', volailles: '30%', lapins: '10-20%' },
  { id: 'son-ble', aliment: 'Son de blé', bovins: '25%', volailles: 'Jeunes : 5% | Adultes : 10%', lapins: '50 – 60%' },
  { id: 'soja', aliment: 'Graines de soja extrudées', bovins: '5%', volailles: '12 à 13% en présence d\'autres huiles', lapins: '15-20%' },
  { id: 'pois', aliment: 'Pois protéagineux', bovins: '20-30% avec équilibration des acides aminés', volailles: 'Jeunes : 25% | Adultes : 20%', lapins: '10-30%' },
  { id: 'feverole', aliment: 'Féverole', bovins: '30-40% avec addition de méthionine', volailles: '10-20%', lapins: '10-37% avec équilibration des acides aminés' },
  { id: 'lupin', aliment: 'Lupin doux', bovins: '6 Kg/j', volailles: 'Jeunes : 15% | Adultes : 5%', lapins: '14-20%' },
  { id: 'pulpe', aliment: 'Pulpe de betterave', bovins: '40%', volailles: 'Jeunes : 3% | Croissance : 5%', lapins: '25%' },
  { id: 'grignons', aliment: 'Grignons d\'olives', bovins: '10-30%', volailles: 'ND', lapins: 'Jusqu\'à 30% (grignons épuisés)' },
  { id: 'dattes', aliment: 'Rebuts de dattes', bovins: '10-30%', volailles: '10-20%', lapins: '4-6%' },
]

export default function LimitsPage() {
  const [rows, setRows] = useState<LimitRow[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as LimitRow[]
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRows(parsed)
          return
        }
      }
    } catch {
      // Ignore invalid local storage content and fall back to defaults.
    }
    setRows(defaultRows)
  }, [])

  const handleRowChange = (id: string, key: keyof Omit<LimitRow, 'id'>, value: string) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row
        return {
          ...row,
          [key]: value,
        }
      })
    )
  }

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        aliment: '',
        bovins: '',
        volailles: '',
        lapins: '',
      },
    ])
  }

  const handleDeleteRow = (id: string) => {
    setRows((prev) => prev.filter((row) => row.id !== id))
  }

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
    alert('Données enregistrées avec succès!')
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/aliments" className="mb-4 inline-flex items-center gap-2 text-base font-bold text-emerald-600 hover:text-emerald-700">
            <ChevronLeftIcon className="h-5 w-5" />
            Retour
          </Link>
          <div className="bg-gradient-to-r from-emerald-700 via-green-600 to-teal-600 rounded-2xl p-6 sm:p-8 shadow-xl">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
              Limites d'incorporation
            </h1>
            <p className="text-base font-medium text-emerald-100">
              Tableau de limites d'incorporation par espèce (modifiable selon vos besoins).
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-emerald-300 bg-emerald-100 p-2 shadow-lg">
          <table className="min-w-full divide-y divide-emerald-100">
            <thead className="bg-emerald-700">
              <tr>
                <th className="px-4 py-5 text-left text-lg font-extrabold uppercase tracking-wider text-amber-100">Aliment</th>
                <th className="bg-emerald-700 px-4 py-5 text-left text-lg font-extrabold uppercase tracking-wider text-amber-100">Bovins</th>
                <th className="bg-emerald-700 px-4 py-5 text-left text-lg font-extrabold uppercase tracking-wider text-amber-100">Volailles</th>
                <th className="bg-emerald-700 px-4 py-5 text-left text-lg font-extrabold uppercase tracking-wider text-amber-100">Lapins</th>
                <th className="px-4 py-5 text-right text-lg font-extrabold uppercase tracking-wider text-amber-100">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-200 bg-emerald-50/80">
              {rows.map((row, index) => (
                <tr key={row.id} className={index % 2 === 0 ? 'bg-emerald-100' : 'bg-emerald-50'}>
                  <td className="px-4 py-3 align-top">
                    <input
                      type="text"
                      value={row.aliment}
                      onChange={(e) => handleRowChange(row.id, 'aliment', e.target.value)}
                      className="w-full rounded-lg border-2 border-teal-900 bg-lime-100 px-5 py-4 text-lg font-extrabold text-gray-950 shadow-sm focus:border-cyan-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </td>
                  <td className="px-4 py-3 align-top bg-emerald-100">
                    <textarea
                      value={row.bovins}
                      onChange={(e) => handleRowChange(row.id, 'bovins', e.target.value)}
                      rows={2}
                      className="w-full rounded-lg border border-emerald-200 bg-white px-5 py-4 text-lg font-bold text-gray-950 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    />
                  </td>
                  <td className="px-4 py-3 align-top bg-emerald-100">
                    <textarea
                      value={row.volailles}
                      onChange={(e) => handleRowChange(row.id, 'volailles', e.target.value)}
                      rows={2}
                      className="w-full rounded-lg border border-emerald-200 bg-white px-5 py-4 text-lg font-bold text-gray-950 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    />
                  </td>
                  <td className="px-4 py-3 align-top bg-emerald-100">
                    <textarea
                      value={row.lapins}
                      onChange={(e) => handleRowChange(row.id, 'lapins', e.target.value)}
                      rows={2}
                      className="w-full rounded-lg border border-emerald-200 bg-white px-5 py-4 text-lg font-bold text-gray-950 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    />
                  </td>
                  <td className="px-4 py-3 text-right align-top">
                    <button
                      type="button"
                      onClick={() => handleDeleteRow(row.id)}
                      className="inline-flex items-center rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-700 transition-colors hover:bg-red-100"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleAddRow}
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-base font-bold text-emerald-700 hover:bg-emerald-100"
          >
            <PlusIcon className="h-5 w-5" />
            Ajouter une ligne
          </button>

          <div className="flex items-center gap-3">
            <Link
              href="/aliments"
              className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-base font-bold text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </Link>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-lg bg-emerald-600 px-5 py-3 text-base font-bold text-white shadow-sm hover:bg-emerald-500"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
