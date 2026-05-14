import Link from 'next/link'
import Image from 'next/image'

const formulaSections = [
  {
    title: 'Ruminants',
    description: 'Formules pour bovins, ovins et caprins.',
    href: '/formules/ruminants',
    image: '/LOGOS/Bovins.png',
    imageAlt: 'Bovins',
  },
  {
    title: 'Monogastriques',
    description: 'Formules pour volailles et lapins.',
    href: '/formules/mono-gastriques',
    image: '/LOGOS/Volailles.png',
    imageAlt: 'Volailles',
  },
]

export default function FormulesPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-950">Formules</h1>
          <p className="mt-2 text-lg font-medium text-gray-600">
            Choisissez le type d&apos;animal pour consulter les formules adaptées.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {formulaSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group rounded-2xl border-2 border-emerald-200 bg-white p-6 shadow-sm transition hover:border-emerald-500 hover:bg-emerald-50 hover:shadow-md"
            >
              <div className="mb-5 h-24 w-24 overflow-hidden rounded-2xl border-2 border-emerald-200 bg-white shadow-sm">
                <Image
                  src={section.image}
                  alt={section.imageAlt}
                  width={120}
                  height={120}
                  className="h-full w-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-950 group-hover:text-emerald-900">
                {section.title}
              </h2>
              <p className="mt-2 text-base font-medium leading-relaxed text-gray-600">
                {section.description}
              </p>
              <div className="mt-5 inline-flex rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white">
                Ouvrir
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
