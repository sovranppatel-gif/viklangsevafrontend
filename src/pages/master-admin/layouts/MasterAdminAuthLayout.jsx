import { Outlet } from 'react-router-dom'

export default function MasterAdminAuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-navy">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 20% 10%, rgba(227,6,19,0.35), transparent), radial-gradient(ellipse 60% 40% at 90% 80%, rgba(26,58,92,0.9), transparent)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <Outlet />
      </div>
    </div>
  )
}
