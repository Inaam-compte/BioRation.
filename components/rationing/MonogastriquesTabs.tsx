'use client'

import React, { useState } from 'react'
import { FormulaSection, type FormulaTableData } from './FormulaTables'

type MonogastriqueKey = 'poulet' | 'lapins'

const demarrageNutrition: FormulaTableData = {
  title: 'Caractéristiques nutritionnelles minimales',
  columns: ['Paramètre', 'Formule 1', 'Formule 2'],
  rows: [
    ['Energie métabolisable', '3000', '2900'],
    ['Protéines brutes', '20', '18'],
    ['Lysine', '1', '0,9'],
    ['Methionine', '0,5', '0,4'],
  ],
}

const croissanceNutrition: FormulaTableData = {
  title: 'Caractéristiques nutritionnelles minimales',
  columns: ['Paramètre', 'Formule 1', 'Formule 2'],
  rows: [
    ['Energie métabolisable', '2850', '2850'],
    ['Protéines brutes', '19', '17,5'],
    ['Lysine', '0,8', '0,8'],
    ['Methionine', '0,4', '0,35'],
  ],
}

const finitionNutrition: FormulaTableData = {
  title: 'Caractéristiques nutritionnelles minimales',
  columns: ['Paramètre', 'Formule 1', 'Formule 2'],
  rows: [
    ['Energie métabolisable', '2900', '2900'],
    ['Protéines brutes', '18', '16'],
    ['Lysine', '0,8', '0,7'],
    ['Methionine', '0,4', '0,35'],
  ],
}

function PouletDeChair() {
  return (
    <FormulaSection
      title="Volailles - Poulet de chair"
      images={[
        { src: '/LOGOS/Poulet de chair.png', alt: 'Poulet de chair' },
        { src: '/LOGOS/poulets bio.png', alt: 'Poulets bio' },
      ]}
      tables={[
        {
          title: 'a - Démarrage',
          columns: ['Matière première', 'Formule 1 Démarrage', 'Formule 2 Démarrage'],
          rows: [
            ['Maïs Bio', '62', ''],
            ['T Soja Bio', '34', '10'],
            ['Blé bio', '', '40'],
            ['Triticale /Sorgho bio', '', '23'],
            ['Orge bio', '', '7'],
            ['Son de blé bio', '', ''],
            ['Féverole Bio', '', '15'],
            ['Huile végétale bio', '1', '1'],
            ['CMV bio*', '4', '4'],
          ],
        },
        demarrageNutrition,
        {
          title: 'b - Croissance',
          columns: ['Matière première', 'Formule 1 Croissance', 'Formule 2 Croissance'],
          rows: [
            ['Maïs Bio', '64,8', ''],
            ['T Soja Bio', '30', '8'],
            ['Blé bio', '', '40'],
            ['Triticale /Sorgho bio', '', '25'],
            ['Orge bio', '', '5'],
            ['Son de blé bio', '', ''],
            ['Féverole Bio', '', '15'],
            ['Huile végétale bio', '1,2', '1'],
            ['CMV bio*', '4', '4'],
          ],
        },
        croissanceNutrition,
        {
          title: 'c - Finition',
          columns: ['Matière première', 'Formule 1 Finition', 'Formule 2 Finition'],
          rows: [
            ['Maïs Bio', '36', '5'],
            ['T Soja Bio', '26', '8'],
            ['Blé bio', '33', '25'],
            ['Triticale /Sorgho bio', '', '27'],
            ['Orge bio', '', '10'],
            ['Son de blé bio', '', ''],
            ['Féverole Bio', '', '20'],
            ['Huile végétale bio', '1', '1'],
            ['CMV bio*', '4', '4'],
          ],
        },
        finitionNutrition,
      ]}
    />
  )
}

function Lapins() {
  return (
    <FormulaSection
      title="Lapins"
      images={[
        { src: '/LOGOS/Lapin.png', alt: 'Lapin' },
        { src: '/LOGOS/lapins.png', alt: 'Lapins' },
      ]}
      tables={[
        {
          title: 'Formules lapins',
          columns: ['Matière première', 'Maternité', 'Lapereaux'],
          rows: [
            ['Blé/Triticale', '10', '10'],
            ['Luzerne Bio', '30', '35'],
            ['Orge bio', '15', '10'],
            ['Son de blé bio', '18', '15'],
            ['Féverole Bio', '22', '20'],
            ['Sel', '1', '1'],
            ['CMV Ovins bio*', '4', '4'],
          ],
        },
        {
          title: 'Caractéristiques nutritionnelles minimales (/kg)',
          columns: ['Paramètre', 'Maternité', 'Lapereaux'],
          rows: [
            ['ED (Kcal)', '2700', '2600'],
            ['Protéines brutes (%)', '17', '16'],
            ['CB (%)', '14', '14'],
          ],
        },
      ]}
    />
  )
}

export function MonogastriquesTabs() {
  const [active, setActive] = useState<MonogastriqueKey>('poulet')

  return (
    <div className="mt-4 flex flex-col gap-6 lg:flex-row">
      <div className="w-full flex-shrink-0 lg:w-64">
        <div className="space-y-3">
          <div>
            <button
              type="button"
              onClick={() => setActive('poulet')}
              className={`w-full rounded-lg px-5 py-3 text-left text-base font-bold ring-1 transition-colors ${
                active === 'poulet'
                  ? 'bg-emerald-100 text-emerald-900 ring-emerald-300'
                  : 'bg-white text-gray-700 ring-gray-200 hover:bg-gray-50'
              }`}
            >
              Volailles
            </button>
            <div className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 p-2">
              <button
                type="button"
                onClick={() => setActive('poulet')}
                className={`w-full rounded-md px-3 py-2 text-left text-sm font-semibold ring-1 transition-colors ${
                  active === 'poulet'
                    ? 'bg-orange-100 text-orange-900 ring-orange-300'
                    : 'bg-emerald-50 text-emerald-800 ring-emerald-100 hover:bg-emerald-100'
                }`}
              >
                Poulet de chair
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActive('lapins')}
            className={`w-full rounded-lg px-5 py-3 text-left text-base font-bold ring-1 transition-colors ${
              active === 'lapins'
                ? 'bg-emerald-100 text-emerald-900 ring-emerald-300'
                : 'bg-white text-gray-700 ring-gray-200 hover:bg-gray-50'
            }`}
          >
            Lapins
          </button>
        </div>
      </div>

      <div className="min-w-0 flex-1">{active === 'poulet' ? <PouletDeChair /> : <Lapins />}</div>
    </div>
  )
}
