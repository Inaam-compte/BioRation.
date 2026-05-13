'use client'

import React, { useMemo, useState } from 'react'
import { FormulaSection, type FormulaTableData } from './FormulaTables'

type RuminantKey = 'laitieres' | 'engraissement' | 'ovins'

type Props = {
  className?: string
}

const nutritionVl: FormulaTableData = {
  title: 'Caractéristiques nutritionnelles minimales (/kg aliment)',
  columns: ['Paramètre', 'Valeur'],
  rows: [
    ['UFL', '0,95'],
    ['Protéines brutes (%)', '18'],
    ['PDIN (g)', '100'],
    ['PDIE (g)', '100'],
  ],
}

const nutritionEngraissement: FormulaTableData = {
  title: 'Caractéristiques nutritionnelles minimales (/kg aliment)',
  columns: ['Paramètre', 'Valeur'],
  rows: [
    ['UFV', '0,9'],
    ['Protéines brutes (%)', '17'],
    ['PDIN (g)', '92'],
    ['PDIE (g)', '92'],
  ],
}

const nutritionOvins: FormulaTableData = {
  title: 'Caractéristiques nutritionnelles minimales (/kg)',
  columns: ['Paramètre', 'Valeur'],
  rows: [
    ['UFV', '0,90'],
    ['Protéines brutes (%)', '17'],
    ['PDIN', '90'],
    ['PDIE', '90'],
  ],
}

function VachesLaitieres() {
  return (
    <FormulaSection
      title="Vaches laitières"
      images={[
        { src: '/LOGOS/La Montbéliarde.jpg', alt: 'La Montbéliarde' },
        { src: '/LOGOS/LA PRIM’HOLSTEIN.png', alt: 'LA PRIM’HOLSTEIN' },
      ]}
      tables={[
        {
          title: 'Formules vaches laitières',
          columns: ['Matière première', 'Formule 1 Vaches Laitières', 'Formule 2 Vaches Laitières'],
          rows: [
            ['Blé /triticale', '30', '40'],
            ['T Soja Bio', '5', '10'],
            ['Orge bio', '25', '20'],
            ['Son de blé bio', '15', '15'],
            ['Féverole Bio', '20', '10'],
            ['Sel', '1', '1'],
            ['CMV VL bio*', '4', '4'],
          ],
        },
        nutritionVl,
      ]}
    />
  )
}

function Taurillons() {
  return (
    <FormulaSection
      title="Engraissement de taurillons"
      images={[{ src: '/LOGOS/Taurillons engraissement.png', alt: 'Taurillons engraissement' }]}
      tables={[
        {
          title: 'Formules engraissement bovins',
          columns: ['Matière première', 'Formule 1 Engraissement Bovins', 'Formule 2 Engraissement Bovins'],
          rows: [
            ['Maïs Bio', '', ''],
            ['T Soja Bio', '6', ''],
            ['Blé/Triticale /Sorgho bio', '36', '30'],
            ['Orge bio', '20', '24'],
            ['Son de blé bio', '15', '15'],
            ['Féverole Bio', '18', '26'],
            ['Sel', '1', '1'],
            ['CMV Eng B bio*', '4', '4'],
          ],
        },
        nutritionEngraissement,
      ]}
    />
  )
}

function Ovins() {
  return (
    <FormulaSection
      title="Engraissement ovins"
      images={[
        { src: '/LOGOS/Ovins 1.png', alt: 'Ovins 1' },
        { src: '/LOGOS/ovins 2.png', alt: 'Ovins 2' },
      ]}
      tables={[
        {
          title: 'Formules engraissement ovins',
          columns: ['Matière première', 'Formule 1 Engraissement Ovins', 'Formule 2 Engraissement Ovins'],
          rows: [
            ['T Soja Bio', '5', ''],
            ['Blé bio', '20', '20'],
            ['Triticale /Sorgho bio', '35', '23'],
            ['Orge bio', '', '10'],
            ['Son de blé bio', '20', '20'],
            ['Féverole Bio', '15', '22'],
            ['Sel', '1', '1'],
            ['CMV Ovins bio*', '4', '4'],
          ],
        },
        nutritionOvins,
      ]}
    />
  )
}

export function RuminantsTabs({ className }: Props) {
  const [active, setActive] = useState<RuminantKey>('laitieres')

  const buttons = useMemo(
    () => [
      { key: 'laitieres' as const, label: 'Vaches laitières' },
      {
        key: 'engraissement' as const,
        label: 'Engraissement de taurillons',
        children: [{ key: 'ovins' as const, label: 'Engraissement ovins' }],
      },
    ],
    []
  )

  return (
    <div className={className}>
      <div className="mt-3 flex flex-col gap-6 lg:flex-row">
        <div className="w-full flex-shrink-0 lg:w-72">
          <div className="space-y-3">
            {buttons.map((button) => (
              <div key={button.key}>
                <button
                  type="button"
                  onClick={() => setActive(button.key)}
                  className={`w-full rounded-lg px-5 py-5 text-left text-xl font-extrabold leading-snug ring-1 transition-colors ${
                    active === button.key
                      ? 'bg-emerald-200 text-emerald-950 ring-emerald-400'
                      : 'bg-white text-gray-700 ring-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {button.label}
                </button>

                {'children' in button && button.children ? (
                  <div className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 p-2">
                    {button.children.map((child) => (
                      <button
                        key={child.key}
                        type="button"
                        onClick={() => setActive(child.key)}
                        className={`w-full rounded-md px-5 py-4 text-left text-lg font-extrabold leading-snug ring-1 transition-colors ${
                          active === child.key
                            ? 'bg-emerald-300 text-emerald-950 ring-emerald-500'
                            : 'bg-emerald-50 text-emerald-800 ring-emerald-100 hover:bg-emerald-100'
                        }`}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          {active === 'laitieres' ? <VachesLaitieres /> : active === 'engraissement' ? <Taurillons /> : <Ovins />}
        </div>
      </div>
    </div>
  )
}
