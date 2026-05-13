import Sidebar from "@/components/Sidebar"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen bg-gray-50 isolate overflow-hidden">
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(16,185,129,0.09),transparent_35%),radial-gradient(circle_at_86%_82%,rgba(20,184,166,0.07),transparent_40%)]" />
        <div
          className="absolute -top-16 -right-20 h-[420px] w-[420px] bg-contain bg-no-repeat opacity-[0.18]"
          style={{ backgroundImage: "url('/LOGOS/logo%20biorest.png')" }}
        />
        <div
          className="absolute -bottom-20 left-8 h-[360px] w-[360px] bg-contain bg-no-repeat opacity-[0.16]"
          style={{ backgroundImage: "url('/LOGOS/Carte%20biorest.png')" }}
        />
      </div>

      <div className="relative z-20">
        <Sidebar />
      </div>
      {/* Main content */}
      <div className="relative z-10 lg:pl-64">
        <main className="relative min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}