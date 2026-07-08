import { Suspense } from 'react'
import ChoixEspeceClient from './ChoixEspeceClient'

export default function ChoixEspecePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50">Chargement...</div>}>
      <ChoixEspeceClient />
    </Suspense>
  )
}
