"use client"

import React from 'react'
import { RationOptimale } from '@/lib/ration-optimizer'

interface Props {
  ration: RationOptimale
}

export function RationTable({ ration }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-2 font-semibold">Aliment</th>
            <th className="text-right py-2 px-2 font-semibold">Brute (kg)</th>
            <th className="text-right py-2 px-2 font-semibold">MS (kg)</th>
            <th className="text-right py-2 px-2 font-semibold">UFL/V</th>
            <th className="text-right py-2 px-2 font-semibold">PDI (g)</th>
            <th className="text-right py-2 px-2 font-semibold">Ca (g)</th>
            <th className="text-right py-2 px-2 font-semibold">P (g)</th>
            <th className="text-right py-2 px-2 font-semibold">Coût</th>
          </tr>
        </thead>
        <tbody>
          {ration.aliments.map((item, idx) => (
            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-2 px-2">
                {item.aliment.nom}
                {item.aliment.biologique && <span className="ml-2 text-xs text-green-600">bio</span>}
              </td>
              <td className="text-right py-2 px-2">{item.quantiteBrute.toFixed(1)}</td>
              <td className="text-right py-2 px-2">{item.quantiteMS.toFixed(1)}</td>
              <td className="text-right py-2 px-2">{item.apportUFL.toFixed(2)}</td>
              <td className="text-right py-2 px-2">{item.apportPDI.toFixed(0)}</td>
              <td className="text-right py-2 px-2">{item.apportCalcium.toFixed(1)}</td>
              <td className="text-right py-2 px-2">{item.apportPhosphore.toFixed(1)}</td>
              <td className="text-right py-2 px-2">{item.cout.toFixed(2)}</td>
            </tr>
          ))}
          <tr className="font-bold border-t-2 border-gray-300">
            <td className="py-2 px-2">TOTAL</td>
            <td className="text-right py-2 px-2">{ration.aliments.reduce((s, i) => s + i.quantiteBrute, 0).toFixed(1)}</td>
            <td className="text-right py-2 px-2">{ration.totalMS.toFixed(1)}</td>
            <td className="text-right py-2 px-2">{ration.totalUFL.toFixed(2)}</td>
            <td className="text-right py-2 px-2">{ration.totalPDI.toFixed(0)}</td>
            <td className="text-right py-2 px-2">{ration.totalCalcium.toFixed(1)}</td>
            <td className="text-right py-2 px-2">{ration.totalPhosphore.toFixed(1)}</td>
            <td className="text-right py-2 px-2">{ration.totalCout.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
