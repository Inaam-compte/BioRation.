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

const tables: TableGroup[] = [
  {
    title: 'Pulpes et enveloppes de figue de barbarie (لب وقشور التين الشوكي)',
    columns: ['Valeur'],
    rows: [
      { label: 'MS (%)', values: ['14,05'] },
      { label: 'MO (% Brut)', values: ['12,92'] },
      { label: 'MAT (% Brut)', values: ['0,89'] },
      { label: 'EE (% Brut)', values: [''] },
      { label: 'Amidon (%Brut)', values: [''] },
      { label: 'CB (% Brut)', values: ['3,63'] },
      { label: 'NDF (% Brut)', values: ['4,13'] },
      { label: 'ADF (% Brut)', values: ['3,56'] },
      { label: 'ADL (% Brut)', values: ['1,26'] },
      { label: 'MM (% Brut)', values: ['1,09'] },
      { label: 'Source des données', values: ['PFE'], emphasis: true },
      { label: 'Référence', values: ['Boubakri Olfa, 2017'], emphasis: true },
    ],
  },
  {
    title: 'Gland (ثمرة البلوط)',
    columns: ['Gland décortiqué', 'Gland germé', 'Gland non germé'],
    rows: [
      { label: 'MS (%)', values: ['73,3', '76,4', '73,85'] },
      { label: 'MO (% Brut)', values: ['95,9', '74,26', '71,73'] },
      { label: 'MAT (% Brut)', values: ['9,1', '4,011', '3,53'] },
      { label: 'EE (% Brut)', values: ['', '1,71', '2,07'] },
      { label: 'Amidon (%Brut)', values: ['', '', ''] },
      { label: 'CB (% Brut)', values: ['3,3', '2,31', '3,53'] },
      { label: 'NDF (% Brut)', values: ['', '25,21', '20,42'] },
      { label: 'ADF (% Brut)', values: ['', '10,5', '9,43'] },
      { label: 'ADL (% Brut)', values: ['', '5,17', '5,04'] },
      { label: 'MM (% Brut)', values: ['', '2,13', '2,11'] },
      { label: 'Phenols totaux', values: ['', '391,1', '434,72'] },
      { label: 'Flavonoides totaux', values: ['', '0,0069', '0,0058'] },
      { label: 'Tannins totaux', values: ['', '33,65', '20,75'] },
      { label: 'Tannins condensés', values: ['', '', ''] },
      { label: 'Source des données', values: ['CTAB', 'Master', 'Master'], emphasis: true },
      { label: 'Référence', values: ['Haj AYED et al, 2005', 'Jlidi Dorra, 2019', 'Jlidi Dorra, 2019'], emphasis: true },
    ],
  },
  {
    title: 'Grignons d olives (فيتورة زيتون)',
    columns: ['Valeur'],
    rows: [
      { label: 'MS (%)', values: ['59,52'] },
      { label: 'MO (% Brut)', values: ['54,18'] },
      { label: 'MAT (% Brut)', values: ['4,08'] },
      { label: 'EE (% Brut)', values: ['6,2'] },
      { label: 'Amidon (%Brut)', values: [''] },
      { label: 'CB (% Brut)', values: ['28,56'] },
      { label: 'NDF (% Brut)', values: [''] },
      { label: 'ADF (% Brut)', values: [''] },
      { label: 'ADL (% Brut)', values: [''] },
      { label: 'MM (% Brut)', values: ['5,33'] },
      { label: 'Ca (g/Kg Brut)', values: ['0,71'] },
      { label: 'P (g/Kg Brut)', values: ['0,02'] },
      { label: 'Source des données', values: [''], emphasis: true },
      { label: 'Référence', values: ['H Yaich et al, 2016'], emphasis: true },
    ],
  },
  {
    title: 'Raquette de Cactus (ألواح الصبار)',
    columns: ['Valeur'],
    rows: [
      { label: 'MS (%)', values: ['11,54'] },
      { label: 'MO (% Brut)', values: ['97,47'] },
      { label: 'MAT (% Brut)', values: ['0,85'] },
      { label: 'EE (% Brut)', values: [''] },
      { label: 'Amidon (%Brut)', values: [''] },
      { label: 'CB (% Brut)', values: ['0,95'] },
      { label: 'NDF (% Brut)', values: ['3,8'] },
      { label: 'ADF (% Brut)', values: ['1,95'] },
      { label: 'ADL (% Brut)', values: ['0,84'] },
      { label: 'MM (% Brut)', values: ['2,53'] },
      { label: 'Source des données', values: ['PFE'], emphasis: true },
      { label: 'Référence', values: ['Boubakri Olfa, 2017'], emphasis: true },
    ],
  },
  {
    title: 'Sous produits de dattes (المنتجات الثانوية للتمور)',
    columns: ['Rebus de dattes', 'Rebus de dattes dénoyauté', 'Noyaux de dattes'],
    rows: [
      { label: 'MS (%)', values: ['88,75', '88,85', '92'] },
      { label: 'MO (% Brut)', values: ['97,17', '97,23', '98,5'] },
      { label: 'MAT (% Brut)', values: ['3,24', '2,88', '6'] },
      { label: 'EE (% Brut)', values: ['0,92', '0,35', '9,5'] },
      { label: 'Amidon (%Brut)', values: ['', '', ''] },
      { label: 'CB (% Brut)', values: ['14', '', '30'] },
      { label: 'NDF (% Brut)', values: ['18,11', '13,93', ''] },
      { label: 'ADF (% Brut)', values: ['13,01', '9,77', ''] },
      { label: 'ADL (% Brut)', values: ['5,99', '5,63', ''] },
      { label: 'MM(%Brut)', values: ['', '', '1,5'] },
      { label: 'UFL', values: ['0,98', '', '0,7'] },
      { label: 'UFV', values: ['0,95', '', '0,65'] },
      { label: 'Energie nette (Kcal/kg)', values: ['1,92', '2,02', ''] },
      { label: 'PDIE', values: ['88', '', '58'] },
      { label: 'PDIN', values: ['30', '', '35'] },
      { label: 'EMv (Kcal/Kg Brut)', values: ['2800', '', ''] },
      { label: 'Source des données', values: ['', '', ''], emphasis: true },
      { label: 'Référence', values: ['Najar et al, 2010', 'Najar et al, 2010', ''], emphasis: true },
    ],
  },
  {
    title: 'Pulpe de caroube (لبّ الخروب)',
    columns: [
      'Pulpe de caroube (Nabeul)',
      'Pulpe de caroube (Kairouan)',
      'Pulpe de caroube (Sousse)',
      'Pulpe de caroube (Siliana)',
    ],
    rows: [
      { label: 'MS (%)', values: ['91,18', '88,04', '88,81', '88,41'] },
      { label: 'MO (% Brut)', values: ['88,7', '85,54', '86,37', '86,68'] },
      { label: 'MAT (% Brut)', values: ['3,4', '3,64', '2,61', '2,35'] },
      { label: 'EE (% Brut)', values: ['0,24', '0,22', '0,42', '2,1'] },
      { label: 'Amidon (%Brut)', values: ['', '', '', ''] },
      { label: 'CB (% Brut)', values: ['', '', '', ''] },
      { label: 'NDF (% Brut)', values: ['28,36', '24,91', '26,83', '25,99'] },
      { label: 'ADF (% Brut)', values: ['19,13', '15,12', '17,32', '15,56'] },
      { label: 'ADL (% Brut)', values: ['7,16', '5,35', '6,55', '5,35'] },
      { label: 'MM (% Brut)', values: ['2,47', '2,49', '2,43', '1,72'] },
      { label: 'Phenols totaux', values: ['2,55(mg/100g Ms)', '6,84', '3,82', '2,76'] },
      { label: 'Flavonoides totaux', values: ['79,47(mg/100g Ms)', '276,51', '115,93', '74,89'] },
      { label: 'Tannins totaux', values: ['', '', '', ''] },
      { label: 'Tannins condensés', values: ['1,13(mg/100gMs)', '0,51', '1,04', '0,42'] },
      {
        label: 'Source des données',
        values: [
          'Tropical Animal Health and Production',
          'Tropical Animal Health and Production',
          'Tropical Animal Health and Production',
          'Tropical Animal Health and Production',
        ],
        emphasis: true,
      },
      {
        label: 'Référence',
        values: ['A Richane et al, 2022', 'A Richane et al, 2022', 'A Richane et al, 2022', 'A Richane et al, 2022'],
        emphasis: true,
      },
    ],
  },
]

export default function SousProduitsTables() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-3xl font-extrabold text-emerald-950">
          Sous produits (المنتجات الثانوية)
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {tables.map((table) => (
          <DataTable key={table.title} {...table} />
        ))}
      </div>
    </div>
  )
}
