'use client'

import React, { useEffect, useState } from 'react'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface LimitRow {
  id: string
  aliment: string
  bovins: string
  volailles: string
  lapins: string
}

interface IncorporationLimitModalProps {
  open: boolean
  onClose: () => void
}

const STORAGE_KEY = 'bio-aliment-incorporation-limits-v1'

const defaultRows: LimitRow[] = [
  { id: 'mais', aliment: 'Maïs', bovins: '50 - 60%', volailles: '60 - 70%', lapins: '-' },
  { id: 'ble', aliment: 'Blé', bovins: '40 - 50%', volailles: 'Jeunes : 35% | Adultes : 65%', lapins: '10 - 15%' },
  { id: 'orge', aliment: 'Orge', bovins: '25%', volailles: 'Jeunes : 5% | Adultes : 20%', lapins: '10 - 30%' },
  { id: 'sorgho', aliment: 'Sorgho', bovins: '20 - 30%', volailles: 'Jeunes : 5% | Adultes : 10%', lapins: 'ND' },
  { id: 'triticale', aliment: 'Triticale', bovins: '15%', volailles: '20 - 40%', lapins: 'ND' },
  { id: 'seigle', aliment: 'Seigle', bovins: '50%', volailles: 'Jeunes : 5% | Adultes : 10%', lapins: '5%' },
  { id: 'avoine', aliment: 'Avoine', bovins: '20%', volailles: '30%', lapins: '10 - 20%' },
  { id: 'son-ble', aliment: 'Son de blé', bovins: '25%', volailles: 'Jeunes : 5% | Adultes : 10%', lapins: '50 - 60%' },
  { id: 'soja', aliment: 'Graines de soja extrudées', bovins: '5%', volailles: '12 à 13% en présence d’autres huiles', lapins: '15 - 20%' },
  { id: 'pois', aliment: 'Pois protéagineux', bovins: '20 - 30% avec équilibration des acides aminés', volailles: 'Jeunes : 25% | Adultes : 20%', lapins: '10 - 30%' },
  { id: 'feverole', aliment: 'Féverole', bovins: '30 - 40% avec addition de méthionine', volailles: '10 - 20%', lapins: '10 - 37% avec équilibration des acides aminés' },
  { id: 'lupin', aliment: 'Lupin doux', bovins: '6 Kg/j', volailles: 'Jeunes : 15% | Adultes : 5%', lapins: '14 - 20%' },
  { id: 'pulpe', aliment: 'Pulpe de betterave', bovins: '40%', volailles: 'Jeunes : 3% | Croissance : 5%', lapins: '25%' },
  { id: 'grignons', aliment: 'Grignons d’olives', bovins: '10 - 30%', volailles: 'ND', lapins: 'Jusqu’à 30% (grignons épuisés)' },
  { id: 'dattes', aliment: 'Rebuts de dattes', bovins: '10 - 30%', volailles: '10 - 20%', lapins: '4 - 6%' },
]

export default function IncorporationLimitModal({ open, onClose }: IncorporationLimitModalProps) {
  const [rows, setRows] = useState<LimitRow[]>([])

  useEffect(() => {
    if (!open) return

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
  }, [open])

  const handleRowChange = (id: string, key: keyof Omit<LimitRow, 'id'>, value: string | number) => {
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
    onClose()
  }

  return (
    <Transition appear show={open}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                <div className="bg-gradient-to-r from-emerald-700 via-green-600 to-teal-600 px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <DialogTitle as="h3" className="text-3xl md:text-4xl font-extrabold leading-tight text-white">
                        Limite d'incorporation
                      </DialogTitle>
                      <p className="mt-2 text-sm text-emerald-100">
                        Tableau de limites d'incorporation par espèce (modifiable selon vos besoins).
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="rounded-lg bg-white/15 p-1.5 text-white hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/70"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">Bovins</span>
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">Volailles</span>
                    <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-200">Lapins</span>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Aliment</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50/60">Bovins</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50/60">Volailles</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50/60">Lapins</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">Action</th>
                      </tr>
                    </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {rows.map((row, index) => (
                          <tr key={row.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}>
                            <td className="px-4 py-3 align-top">
                              <input
                                type="text"
                                value={row.aliment}
                                onChange={(e) => handleRowChange(row.id, 'aliment', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                              />
                            </td>
                            <td className="px-4 py-3 align-top bg-emerald-50/30">
                              <textarea
                                value={row.bovins}
                                onChange={(e) => handleRowChange(row.id, 'bovins', e.target.value)}
                                rows={2}
                                className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                              />
                            </td>
                            <td className="px-4 py-3 align-top bg-amber-50/30">
                              <textarea
                                value={row.volailles}
                                onChange={(e) => handleRowChange(row.id, 'volailles', e.target.value)}
                                rows={2}
                                className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
                              />
                            </td>
                            <td className="px-4 py-3 align-top bg-sky-50/30">
                              <textarea
                                value={row.lapins}
                                onChange={(e) => handleRowChange(row.id, 'lapins', e.target.value)}
                                rows={2}
                                className="w-full rounded-lg border border-sky-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                              />
                            </td>
                            <td className="px-4 py-3 text-right align-top">
                              <button
                                type="button"
                                onClick={() => handleDeleteRow(row.id)}
                                className="inline-flex items-center rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100"
                              >
                                <TrashIcon className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleAddRow}
                      className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                    >
                      <PlusIcon className="h-4 w-4" />
                      Ajouter une ligne
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        Annuler
                      </button>
                      <button
                        type="button"
                        onClick={handleSave}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}