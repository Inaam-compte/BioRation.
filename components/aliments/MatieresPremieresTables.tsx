'use client'

import React from 'react'

type TableRow = {
  label: string
  values: string[]
  emphasis?: boolean
}

type TableGroup = {
  title: string
  subtitle?: string
  columns: string[]
  rows: TableRow[]
}

function DataTable({ title, subtitle, columns, rows }: TableGroup) {
  return (
    <div className="overflow-hidden rounded-lg border border-emerald-200 bg-white shadow-sm">
      <div className="border-b border-green-700 bg-green-600 px-4 py-3">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        {subtitle ? <p className="mt-1 text-sm font-medium text-green-50">{subtitle}</p> : null}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-max text-base">
          <thead>
            <tr className="border-b border-emerald-100 bg-white">
              <th className="min-w-40 px-4 py-3 text-left text-lg font-extrabold uppercase text-gray-700">
                Paramètre
              </th>
              {columns.map((column) => (
                <th
                  key={column}
                  className="min-w-36 whitespace-nowrap px-4 py-3 text-right text-lg font-extrabold uppercase text-emerald-800"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-100">
            {rows.map((row) => (
              <tr key={row.label} className={row.emphasis ? 'bg-emerald-800' : undefined}>
                <td className={`min-w-40 whitespace-nowrap px-4 py-3 font-medium ${row.emphasis ? 'text-emerald-50' : 'text-gray-800'}`}>{row.label}</td>
                {columns.map((_, index) => (
                  <td key={index} className={`min-w-36 whitespace-nowrap px-4 py-3 text-right ${row.emphasis ? 'font-semibold text-emerald-50' : 'text-gray-700'}`}>
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

const graminees: TableGroup[] = [
  {
    title: 'Avoine (شوفان)',
    columns: ['Valeur'],
    rows: [
      { label: 'MS (%)', values: ['87.6'] },
      { label: 'MO (% Brut)', values: [''] },
      { label: 'MAT (% Brut)', values: ['16,95'] },
      { label: 'EE (% Brut)', values: ['5,42'] },
      { label: 'Amidon (%Brut)', values: ['63,3'] },
      { label: 'CB (% Brut)', values: [''] },
      { label: 'NDF (% Brut)', values: [''] },
      { label: 'ADF (% Brut)', values: [''] },
      { label: 'ADL (% Brut)', values: [''] },
      { label: 'MM (% Brut)', values: ['2,19'] },
      { label: 'Source des données', values: ['JCereal Sci'], emphasis: true },
      { label: 'Référence', values: ['Capouchova et al., 2021'], emphasis: true },
    ],
  },
  {
    title: 'Blé (القمح)',
    columns: ['Valeur 1', 'Valeur 2', 'Valeur 3', 'Valeur 4', 'Valeur 5', 'Valeur 6'],
    rows: [
      { label: 'MS (%)', values: ['89,28', '85,5', '88', '89,43', '89,93', '89,77'] },
      { label: 'MO (% Brut)', values: ['', '97,1', '98,15', '1,75', '98.56', '98.62'] },
      { label: 'MAT (% Brut)', values: ['10,73', '16', '11,62', '11,4', '9,52', '11'] },
      { label: 'EE (% Brut)', values: ['', '', '3,006', '2,023', '1,69', '1.75'] },
      { label: 'Amidon (%Brut)', values: ['', '', '73,65', '73,37', '', ''] },
      { label: 'CB (% Brut)', values: ['2,42', '4', '', '', '', ''] },
      { label: 'NDF (% Brut)', values: ['', '', '', '', '18,22', '17.58'] },
      { label: 'ADF (% Brut)', values: ['', '', '', '', '2,41', '3.43'] },
      { label: 'ADL (% Brut)', values: ['', '', '', '', '1,29', '1.43'] },
      { label: 'MM (% Brut)', values: ['', '', '1,85', '1,76', '1,44', '1,38'] },
      { label: 'UFL', values: ['', '', '', '', '1,23', '1,1'] },
      { label: 'UFV', values: ['', '', '', '', '1,1', '0,92'] },
      { label: 'Source des données', values: ['CTAB', 'CTAB', 'RADS J Food Biosc', 'RADS J Food Biosc', '', ''], emphasis: true },
      { label: 'Référence', values: ['Haj AYED et al,2005', 'Haj AYED et al,2005', 'Khokhar et al,2024', 'Khokhar et al,2024', 'Labo INAT', 'Labo INAT'], emphasis: true },
    ],
  },
  {
    title: 'Orge (الشعير)',
    columns: ['Valeur 1', 'Valeur 2', 'Valeur 3'],
    rows: [
      { label: 'MS (%)', values: ['94,82', '90', '89,15'] },
      { label: 'MO (% Brut)', values: ['96,61', '', '97,81'] },
      { label: 'MAT (% Brut)', values: ['10,12', '9,16', '11,40'] },
      { label: 'EE (% Brut)', values: ['', '', '1,68'] },
      { label: 'Amidon (%Brut)', values: ['', '', ''] },
      { label: 'CB (% Brut)', values: ['7,22', '6,08', ''] },
      { label: 'NDF (% Brut)', values: ['', '', '24,58'] },
      { label: 'ADF (% Brut)', values: ['', '', '6,41'] },
      { label: 'ADL (% Brut)', values: ['', '', '1,86'] },
      { label: 'MM (% Brut)', values: ['', '', '2,19'] },
      { label: 'UFL', values: ['', '', '0.6'] },
      { label: 'UFV', values: ['', '', '0.31'] },
      { label: 'Source des données', values: ['CTAB', 'CTAB', ''], emphasis: true },
      { label: 'Référence', values: ['H HAMDI, 2011', 'Haj AYED et al, 2005', 'Labo INAT'], emphasis: true },
    ],
  },
  {
    title: 'Maïs (الذرة)',
    columns: ['Valeur 1', 'Valeur 2'],
    rows: [
      { label: 'MS (%)', values: ['79,40', '89,18'] },
      { label: 'MO (% Brut)', values: ['98,68', '98,62'] },
      { label: 'MAT (% Brut)', values: ['6,12', '7,12'] },
      { label: 'EE (% Brut)', values: ['4,03', '3,93'] },
      { label: 'NDF (% Brut)', values: ['7,85', '8,68'] },
      { label: 'ADF (% Brut)', values: ['2,65', '1,95'] },
      { label: 'ADL (% Brut)', values: ['1,17', '0,70'] },
      { label: 'MM (% Brut)', values: ['1,32', '1,38'] },
      { label: 'UFL', values: ['1,6', '1,63'] },
      { label: 'UFV', values: ['1,43', '1,52'] },
      { label: 'Référence', values: ['Labo INAT', 'Labo INAT'], emphasis: true },
    ],
  },
  {
    title: 'Sorgho blanc (الدرع العلفي الأبيض)',
    columns: ['Valeur'],
    rows: [
      { label: 'MS (%)', values: ['88,75'] },
      { label: 'MO (% Brut)', values: ['97,65'] },
      { label: 'MAT (% Brut)', values: ['9,74'] },
      { label: 'EE (% Brut)', values: ['3,80'] },
      { label: 'NDF (% Brut)', values: ['36,08'] },
      { label: 'ADF (% Brut)', values: ['3,11'] },
      { label: 'ADL (% Brut)', values: ['1,39'] },
      { label: 'MM (% Brut)', values: ['2,35'] },
      { label: 'UFL', values: ['1,46'] },
      { label: 'UFV', values: ['1,29'] },
      { label: 'Référence', values: ['Labo INAT'], emphasis: true },
    ],
  },
  {
    title: 'Triticale (التريتيكال)',
    columns: ['Valeur 1', 'Valeur 2'],
    rows: [
      { label: 'MS (%)', values: ['88,18', '88,03'] },
      { label: 'MO (% Brut)', values: ['', ''] },
      { label: 'MAT (% Brut)', values: ['7,27', '9,1'] },
      { label: 'EE (% Brut)', values: ['', ''] },
      { label: 'Amidon (%Brut)', values: ['70,6', '68,3'] },
      { label: 'CB (% Brut)', values: ['15,56', '19,18'] },
      { label: 'NDF (% Brut)', values: ['', ''] },
      { label: 'ADF (% Brut)', values: ['', ''] },
      { label: 'ADL (% Brut)', values: ['', ''] },
      { label: 'MM (% Brut)', values: ['', ''] },
      { label: 'Source des données', values: ['Proceed Acad Sci', 'Proceed Acad Sci'], emphasis: true },
      { label: 'Référence', values: ['Straumîte et al, 2017', 'Straumîte et al, 2017'], emphasis: true },
    ],
  },
]

const legumineuses: TableGroup[] = [
  {
    title: 'Fève (فول)',
    columns: ['Valeur'],
    rows: [
      { label: 'MS (%)', values: ['95,43'] },
      { label: 'MO (% Brut)', values: ['95,04'] },
      { label: 'MAT (% Brut)', values: ['25,12'] },
      { label: 'EE (% Brut)', values: [''] },
      { label: 'Amidon (%Brut)', values: [''] },
      { label: 'CB (% Brut)', values: ['9,32'] },
      { label: 'NDF (% Brut)', values: [''] },
      { label: 'ADF (% Brut)', values: [''] },
      { label: 'ADL (% Brut)', values: [''] },
      { label: 'MM (% Brut)', values: [''] },
      { label: 'Source des données', values: ['CTAB'], emphasis: true },
      { label: 'Référence', values: ['H HAMDI, 2011'], emphasis: true },
    ],
  },
  {
    title: 'Fèverole (الفول المصري)',
    columns: ['Valeur 1', 'Valeur 2'],
    rows: [
      { label: 'MS (%)', values: ['88,45', '88,91'] },
      { label: 'MO (% Brut)', values: ['', '96,88'] },
      { label: 'MAT (% Brut)', values: ['21,99', '23,28'] },
      { label: 'EE (% Brut)', values: ['', '1,26'] },
      { label: 'Amidon (%Brut)', values: ['', ''] },
      { label: 'CB (% Brut)', values: ['8,49', ''] },
      { label: 'NDF (% Brut)', values: ['', '38,20'] },
      { label: 'ADF (% Brut)', values: ['', '10,23'] },
      { label: 'ADL (% Brut)', values: ['', '2,41'] },
      { label: 'MM (% Brut)', values: ['', '3,12'] },
      { label: 'Source des données', values: ['CTAB', ''], emphasis: true },
      { label: 'Référence', values: ['Haj AYED et al, 2005', 'Labo INAT'], emphasis: true },
    ],
  },
]

const autresGrains: TableGroup[] = [
  {
    title: 'Lin (الكتان)',
    columns: ['Valeur'],
    rows: [
      { label: 'MS (%)', values: ['93,64'] },
      { label: 'MO (% Brut)', values: ['96,86'] },
      { label: 'MAT (% Brut)', values: ['22,65'] },
      { label: 'EE (% Brut)', values: ['26,23'] },
      { label: 'NDF (% Brut)', values: ['41,85'] },
      { label: 'ADF (% Brut)', values: ['24,20'] },
      { label: 'ADL (% Brut)', values: ['17,43'] },
      { label: 'MM (% Brut)', values: ['3,14'] },
      { label: 'Source des données', values: [''], emphasis: true },
      { label: 'Référence', values: ['Labo INAT'], emphasis: true },
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

export default function MatieresPremieresTables() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-3xl font-extrabold text-emerald-950">
          Aliments concentrés (الأعلاف المركزة)
        </h2>
      </div>

      <Section title="Graminées (النجليات)">
        {graminees.map((table) => (
          <DataTable key={table.title} {...table} />
        ))}
      </Section>

      <Section title="Légumineuse (البقوليات)">
        {legumineuses.map((table) => (
          <DataTable key={table.title} {...table} />
        ))}
      </Section>

      <Section title="Autre type de grains (أنواع أخرى من الحبوب)">
        {autresGrains.map((table) => (
          <DataTable key={table.title} {...table} />
        ))}
      </Section>
    </div>
  )
}
