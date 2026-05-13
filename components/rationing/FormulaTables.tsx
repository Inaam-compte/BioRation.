'use client'

import Image from 'next/image'

export type FormulaTableData = {
  title?: string
  columns: string[]
  rows: string[][]
}

export type FormulaImage = {
  src: string
  alt: string
}

export function FormulaImages({ images }: { images: FormulaImage[] }) {
  if (images.length === 0) return null

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {images.map((image) => (
        <div key={image.src} className="overflow-hidden rounded-lg border border-emerald-100 bg-white p-2 shadow-sm">
          <Image
            src={image.src}
            alt={image.alt}
            width={520}
            height={320}
            className="h-auto w-full rounded-md object-contain"
          />
        </div>
      ))}
    </div>
  )
}

export function FormulaTable({ title, columns, rows }: FormulaTableData) {
  return (
    <div className="overflow-hidden rounded-lg border border-emerald-200 bg-white shadow-sm">
      {title ? (
        <div className="border-b border-emerald-200 bg-emerald-50/70 px-4 py-3">
          <h3 className="text-xl font-extrabold text-emerald-950">{title}</h3>
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-emerald-100 bg-white">
              {columns.map((column, index) => (
                <th
                  key={column}
                  className={`px-4 py-3 text-sm font-extrabold uppercase text-emerald-700 ${
                    index === 0 ? 'text-left text-gray-600' : 'min-w-32 text-right'
                  }`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-100">
            {rows.map((row) => (
              <tr key={row.join('|')}>
                {columns.map((_, index) => (
                  <td
                    key={index}
                    className={`px-4 py-3 text-base text-gray-800 ${
                      index === 0 ? 'font-bold text-gray-900' : 'text-right font-semibold'
                    }`}
                  >
                    {row[index] ?? ''}
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

export function FormulaSection({
  title,
  images = [],
  tables,
}: {
  title: string
  images?: FormulaImage[]
  tables: FormulaTableData[]
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-emerald-950">{title}</h2>
      </div>

      <FormulaImages images={images} />

      <div className="space-y-5">
        {tables.map((table) => (
          <FormulaTable key={table.title ?? table.columns.join('|')} {...table} />
        ))}
      </div>
    </div>
  )
}
