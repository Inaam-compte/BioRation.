'use client'

import React from 'react'

type TableRow = {
  label: string
  values: string[]
  emphasis?: boolean
}

type TableGroup = {
  title: string
  columns: string[]
  rows: TableRow[]
}

function DataTable({ title, columns, rows }: TableGroup) {
  return (
    <div className="overflow-hidden rounded-lg border border-emerald-200 bg-white shadow-sm">
      <div className="border-b border-green-700 bg-green-600 px-4 py-3">
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-base">
          <thead>
            <tr className="border-b border-emerald-100 bg-white">
              <th className="px-4 py-3 text-left text-lg font-extrabold uppercase text-gray-700">
                Paramètre
              </th>
              {columns.map((column) => (
                <th
                  key={column}
                  className="min-w-28 px-4 py-3 text-right text-lg font-extrabold uppercase text-emerald-800"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-100">
            {rows.map((row) => (
              <tr key={row.label} className={row.emphasis ? 'bg-emerald-800' : undefined}>
                <td className={`px-4 py-3 font-medium ${row.emphasis ? 'text-emerald-50' : 'text-gray-800'}`}>{row.label}</td>
                {columns.map((_, index) => (
                  <td key={index} className={`px-4 py-3 text-right ${row.emphasis ? 'font-semibold text-emerald-50' : 'text-gray-700'}`}>
                    {row.values[index] ?? ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const fourragesVerts: TableGroup[] = [
  {
    title: 'Arbuste Phillyrea (الفيلارية)',
    columns: ['Valeur'],
    rows: [
      { label: '% MS', values: ['81,46'] },
      { label: '% MM', values: ['2,96'] },
      { label: '% MG', values: ['1,70'] },
      { label: '% MAT', values: ['4,99'] },
      { label: '% NDF', values: ['36,98'] },
      { label: '% ADF', values: ['26,83'] },
      { label: '% ADL', values: ['15,19'] },
      { label: 'Référence', values: ['Labo INAT'], emphasis: true },
    ],
  },
  {
    title: 'Blé (قمح)',
    columns: ['Valeur'],
    rows: [
      { label: 'MS (%)', values: ['20'] },
      { label: 'MO (% Brut)', values: ['93,8'] },
      { label: 'MAT (% Brut)', values: ['5,23'] },
      { label: 'EE (% Brut)', values: [''] },
      { label: 'Amidon (%Brut)', values: [''] },
      { label: 'CB (% Brut)', values: [''] },
      { label: 'NDF (% Brut)', values: ['56,3'] },
      { label: 'ADF (% Brut)', values: ['27,8'] },
      { label: 'ADL (% Brut)', values: ['5,52'] },
      { label: 'Source des données', values: ['CIHEAM Options Mediterrannéennes'], emphasis: true },
      { label: 'Référence', values: ['Tejido et al., 2011'], emphasis: true },
    ],
  },
  {
    title: 'Luzerne (فصة)',
    columns: ['Valeur 1', 'Valeur 2'],
    rows: [
      { label: 'MS (%)', values: ['21,22', '92,82'] },
      { label: 'MO (% Brut)', values: ['', '89,89'] },
      { label: 'MAT (% Brut)', values: ['20,97', '17,60'] },
      { label: 'EE (% Brut)', values: ['', '1,59'] },
      { label: 'Amidon (%Brut)', values: ['', ''] },
      { label: 'CB (% Brut)', values: ['25,53', ''] },
      { label: 'NDF (% Brut)', values: ['', '36,33'] },
      { label: 'ADF (% Brut)', values: ['', '26,78'] },
      { label: 'ADL (% Brut)', values: ['', '6,50'] },
      { label: 'MM (% Brut)', values: ['', '10,11'] },
      { label: 'Source des données', values: ['CTAB', ''], emphasis: true },
      { label: 'Référence', values: ['Haj AYED et al, 2005', 'Labo INAT'], emphasis: true },
    ],
  },
  {
    title: 'Orge (شعير)',
    columns: ['Valeur 1', 'Valeur 2'],
    rows: [
      { label: 'MS (%)', values: ['33,5', ''] },
      { label: 'MO (% Brut)', values: ['90,95', '93,7'] },
      { label: 'MAT (% Brut)', values: ['7,28', '6,28'] },
      { label: 'EE (% Brut)', values: ['', ''] },
      { label: 'Amidon (%Brut)', values: ['', ''] },
      { label: 'CB (% Brut)', values: ['24,49', ''] },
      { label: 'NDF (% Brut)', values: ['', '56,5'] },
      { label: 'ADF (% Brut)', values: ['', '24,5'] },
      { label: 'ADL (% Brut)', values: ['', '3,95'] },
      { label: 'Source des données', values: ['CTAB', 'CIHEAM Options Mediterrannéennes'], emphasis: true },
      { label: 'Référence', values: ['H HAMDI, 2011', 'Tejido et al., 2011'], emphasis: true },
    ],
  },
  {
    title: 'Ray Grass (منجور)',
    columns: ['Valeur'],
    rows: [
      { label: 'MS (%)', values: ['24'] },
      { label: 'MO (% Brut)', values: [''] },
      { label: 'MAT (% Brut)', values: ['10,63'] },
      { label: 'EE (% Brut)', values: [''] },
      { label: 'Amidon (%Brut)', values: [''] },
      { label: 'CB (% Brut)', values: ['27,49'] },
      { label: 'NDF (% Brut)', values: [''] },
      { label: 'ADF (% Brut)', values: [''] },
      { label: 'ADL (% Brut)', values: [''] },
      { label: 'Source des données', values: ['CTAB'], emphasis: true },
      { label: 'Référence', values: ['Haj AYED et al, 2005'], emphasis: true },
    ],
  },
]

const fourragesSecs: TableGroup[] = [
  {
    title: 'Foin d\'avoine (الڨرط)',
    columns: ['Valeur 1', 'Valeur 2', 'Valeur 3'],
    rows: [
      { label: 'MS (%)', values: ['90,68', '92,31', '92,54'] },
      { label: 'MO (% Brut)', values: ['92,78', '95,27', '94,73'] },
      { label: 'MAT (% Brut)', values: ['3,63', '6,10', '3,75'] },
      { label: 'EE (% Brut)', values: ['', '1,74', '1,02'] },
      { label: 'Amidon (%Brut)', values: ['', '', ''] },
      { label: 'CB (% Brut)', values: ['40,24', '', ''] },
      { label: 'NDF (% Brut)', values: ['', '65,57', '60,61'] },
      { label: 'ADF (% Brut)', values: ['', '33,83', '37,78'] },
      { label: 'ADL (% Brut)', values: ['', '3,02', '8,63'] },
      { label: 'MM (% Brut)', values: ['', '4,73', '5,27'] },
      { label: 'UFL', values: ['', '0,6', '0,4'] },
      { label: 'UFV', values: ['', '0,49', '0,33'] },
      { label: 'Source des données', values: ['CTAB', '', ''], emphasis: true },
      { label: 'Référence', values: ['H HAMDI, 2011', 'Labo INAT', 'Labo INAT'], emphasis: true },
    ],
  },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">{children}</div>
    </section>
  )
}

export default function AlimentsGrossiersTables() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-3xl font-extrabold text-emerald-950">
          Aliments grossiers
        </h2>
      </div>

      <Section title="Fourrages verts (أعلاف خضراء)">
        {fourragesVerts.map((table) => (
          <DataTable key={table.title} {...table} />
        ))}
      </Section>

      <Section title="Fourrages secs (أعلاف جافة)">
        {fourragesSecs.map((table) => (
          <DataTable key={table.title} {...table} />
        ))}
      </Section>
    </div>
  )
}
