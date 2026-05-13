'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon, 
  CubeIcon, 
  UsersIcon, 
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  CalculatorIcon,
  ChevronDownIcon,
  LightBulbIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline'

const mainNavigation = [
  {
    name: 'Accueil',
    href: '/dashboard',
    icon: HomeIcon,
    emoji: '🏠',
  },
  {
    name: 'Aliments',
    href: '/aliments',
    icon: CubeIcon,
    emoji: '🌾',
    children: [
      { name: 'Gestion des aliments', href: '/aliments' },
      { name: 'Limites d\'incorporation', href: '/aliments/limits' },
      { name: 'Gestion des stocks', href: '/supply' },
    ],
  },
  {
    name: 'Formules',
    href: '/formules',
    icon: CubeIcon,
    emoji: '📋',
    children: [
      { name: 'Ruminants', href: '/formules/ruminants' },
      { name: 'Mono-gastriques', href: '/formules/mono-gastriques' },
    ],
  },
  {
    name: 'Animaux',
    href: '/animals',
    icon: UsersIcon,
    emoji: '🐄',
    children: [
      { name: 'Liste des animaux', href: '/animals' },
    ],
  },
  {
    name: 'Rationnement',
    href: '/rationing',
    icon: CalculatorIcon,
    emoji: '📊',
    children: [
      { name: 'Nouvelle ration', href: '/rationing' },
      { name: 'Analyses', href: '/analytics' },
      { name: 'Rapports', href: '/reports' },
    ],
  },
  {
    name: 'Conseils',
    href: '/tips',
    icon: LightBulbIcon,
    emoji: '💡',
  },
  {
    name: 'Paramètres',
    href: '/settings',
    icon: Cog6ToothIcon,
    emoji: '⚙️',
    children: [
      { name: 'Général', href: '/settings' },
      { name: 'Profil', href: '/profile' },
    ],
  },
]

function NavItem({ item, pathname, onClose, isDesktop }: {
  item: typeof mainNavigation[0]
  pathname: string
  onClose?: () => void
  isDesktop?: boolean
}) {
  const isActive = pathname === item.href || item.children?.some(c => pathname === c.href)
  const hasChildren = !!item.children?.length
  const [expanded, setExpanded] = useState(isActive || false)

  return (
    <li>
      <div
        className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 cursor-pointer ${
          isActive
            ? 'bg-white/75 text-emerald-800 shadow-sm'
            : 'text-emerald-800 hover:text-emerald-800 hover:bg-white/60'
        }`}
      >
        <Link
          href={item.href}
          onClick={onClose}
          className="flex items-center gap-3 flex-1"
        >
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ${
            isActive
              ? 'bg-emerald-100 ring-emerald-300'
              : 'bg-white/80 ring-emerald-200'
          }`}>
            <item.icon className={`h-5 w-5 ${isActive ? 'text-emerald-800' : 'text-emerald-700 group-hover:text-emerald-900'}`} />
          </span>
          <span className="text-lg font-bold">{item.name}</span>
        </Link>
        {hasChildren && (
          <button type="button" onClick={() => setExpanded(!expanded)} className="p-1 -mr-1">
            <ChevronDownIcon className={`h-4 w-4 text-emerald-700 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        )}
        {!hasChildren && isActive && (
          <div className="w-2 h-2 rounded-full bg-emerald-600" />
        )}
      </div>
      {hasChildren && expanded && (
        <ul className="mt-1 ml-8 space-y-0.5">
          {item.children?.map(child => (
            <li key={child.href}>
              <Link
                href={child.href}
                onClick={onClose}
                className={`block rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  pathname === child.href
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {child.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const sidebarContent = (onClose?: () => void, isDesktop?: boolean) => (
    <>
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-2">
        <Link href="/dashboard" className="flex items-center gap-2 relative" onClick={onClose}>
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/95 p-0.5 ring-1 ring-green-300/60 shadow-md flex-shrink-0">
            <Image
              src="/logo/Logo%20fond%20Noir.png"
              alt="Logo Bio-Aliment"
              width={48}
              height={48}
              className="h-full w-full object-contain rounded-lg"
              priority
            />
          </div>
          <div className="relative -ml-2 z-10">
            <span className="text-lg font-bold text-gray-900">Bio-Aliment</span>
          </div>
        </Link>
      </div>

      {/* Menu label */}
      <div className="px-3 mt-4 mb-2">
          <span className="inline-flex rounded-lg bg-white/70 px-3 py-1.5 text-base font-extrabold text-emerald-800 uppercase tracking-wider shadow-sm ring-1 ring-emerald-200/80">
          Menu
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-1">
        <ul className="space-y-0.5">
          {mainNavigation.map((item) => (
            <NavItem key={item.name} item={item} pathname={pathname} onClose={onClose} isDesktop={isDesktop} />
          ))}
        </ul>
      </nav>

      {/* Footer section */}
      <div className="mt-auto border-t border-gray-200 pt-3 px-2 pb-2 space-y-1">
        <Link
          href="/tips"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <ChatBubbleLeftIcon className="h-5 w-5 text-gray-400" />
          <span>Donner votre avis</span>
        </Link>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center gap-x-4 bg-white px-4 py-3 shadow-sm lg:hidden">
        <button
          type="button"
          className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          onClick={() => setSidebarOpen(true)}
        >
          <Bars3Icon className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 flex-1 relative">
          <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-green-300/60 bg-white flex-shrink-0">
            <Image
              src="/logo/Logo%20fond%20Noir.png"
              alt="Logo Bio-Aliment"
              width={32}
              height={32}
              className="h-full w-full object-contain rounded-md"
              priority
            />
          </div>
          <span className="text-sm font-bold text-gray-900 relative -ml-1 z-10">Bio-Aliment</span>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      <div className={`relative z-50 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-0 flex">
          <div className="relative mr-16 flex w-full max-w-[260px] flex-1">
            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
              <button type="button" onClick={() => setSidebarOpen(false)} className="p-2">
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="relative flex grow flex-col overflow-hidden bg-white px-4 pb-4 shadow-xl">
              <div className="pointer-events-none absolute inset-0 bg-green-400/30" />
              <div className="relative z-10 flex grow flex-col">
                {sidebarContent(() => setSidebarOpen(false))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="relative flex grow flex-col overflow-hidden bg-white border-r border-gray-200 px-4 pb-4">
          <div className="pointer-events-none absolute inset-0 bg-green-400/30" />
          <div className="relative z-10 flex grow flex-col">
            {sidebarContent(undefined, true)}
          </div>
        </div>
      </div>
    </>
  )
}
