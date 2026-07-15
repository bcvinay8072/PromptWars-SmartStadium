'use client';

import { useState, lazy, Suspense } from 'react';

/** Lazily loaded Fan Portal dashboard */
const FanDashboard = lazy(() =>
  import('@/components/FanDashboard').then((m) => ({ default: m.FanDashboard }))
);

/** Lazily loaded Staff Command dashboard */
const StaffDashboard = lazy(() =>
  import('@/components/StaffDashboard').then((m) => ({ default: m.StaffDashboard }))
);

/**
 * The available user roles in the Nexus26 application.
 */
type UserRole = 'fan' | 'staff' | null;

/**
 * Role selection landing page with lazy-loaded dashboards.
 * Provides a stunning hero section and animated role selection cards.
 *
 * @returns The rendered RoleSelector component
 * @example
 * <RoleSelector />
 */
export default function RoleSelector(): React.ReactNode {
  const [role, setRole] = useState<UserRole>(null);

  if (role === 'fan') {
    return (
      <div className="max-w-md mx-auto p-lg min-h-screen">
        <header className="flex items-center justify-between mb-lg">
          <div className="flex items-center gap-sm">
            <span className="text-xl">⚽</span>
            <span className="text-lg text-primary">Nexus26</span>
          </div>
          <button onClick={() => setRole(null)} className="btn-ghost" aria-label="Return to role selection">
            ← Back
          </button>
        </header>
        <main id="main-content" role="main">
          <h1 className="text-title mb-sm">Fan Portal</h1>
          <p className="text-subtitle mb-lg">Your AI-powered stadium guide</p>
          <Suspense fallback={<div className="glass-panel p-lg text-center text-muted">Loading Fan Portal...</div>}>
            <FanDashboard />
          </Suspense>
        </main>
      </div>
    );
  }

  if (role === 'staff') {
    return (
      <div className="max-w-md mx-auto p-lg min-h-screen">
        <header className="flex items-center justify-between mb-lg">
          <div className="flex items-center gap-sm">
            <span className="text-xl">🎯</span>
            <span className="text-lg text-primary">Nexus26 Ops</span>
          </div>
          <button onClick={() => setRole(null)} className="btn-ghost" aria-label="Return to role selection">
            ← Back
          </button>
        </header>
        <main id="main-content" role="main">
          <h1 className="text-title mb-sm">Operational Command</h1>
          <p className="text-subtitle mb-lg">Real-time venue intelligence</p>
          <Suspense fallback={<div className="glass-panel p-lg text-center text-muted">Loading Staff Portal...</div>}>
            <StaffDashboard />
          </Suspense>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="hero-section relative">
        <div className="relative z-1">
          <div className="mb-md">
            <span className="badge badge-accent mb-md">FIFA World Cup 2026</span>
          </div>
          <h1 className="text-display mb-md">Nexus26</h1>
          <p className="text-subtitle max-w-sm mx-auto mb-xs">
            AI-Powered Smart Stadium Experience
          </p>
          <p className="text-small max-w-sm mx-auto">
            Enhancing navigation, crowd management, accessibility, and real-time operations
          </p>
        </div>
      </div>

      {/* Role Selection */}
      <main id="main-content" role="main" className="max-w-md mx-auto px-lg w-full">
        <p className="text-label text-center mb-lg">Select Your Experience</p>

        <div className="grid grid-cols-2 gap-lg">
          {/* Fan Card */}
          <button
            onClick={() => setRole('fan')}
            className="role-card text-center"
            aria-label="Enter as a Fan"
          >
            <div className="relative z-1">
              <div className="mb-md">
                <span className="text-display">⚽</span>
              </div>
              <h2 className="text-title mb-xs">Fan</h2>
              <p className="text-small">
                Navigation, food, transport &amp; accessibility assistance
              </p>
            </div>
          </button>

          {/* Staff Card */}
          <button
            onClick={() => setRole('staff')}
            className="role-card text-center"
            aria-label="Enter as Venue Staff"
          >
            <div className="relative z-1">
              <div className="mb-md">
                <span className="text-display">🎯</span>
              </div>
              <h2 className="text-title mb-xs">Staff</h2>
              <p className="text-small">
                Crowd management, incidents &amp; operational intelligence
              </p>
            </div>
          </button>
        </div>

        {/* Feature List */}
        <div className="mt-xl glass-panel p-lg">
          <p className="text-label mb-md">Powered by GenAI</p>
          <div className="flex flex-col gap-sm">
            {[
              '🏟️ Real-time stadium navigation & wayfinding',
              '👥 AI-driven crowd flow analysis',
              '♿ Comprehensive accessibility guidance',
              '🚗 Live transport & parking updates',
              '🌍 Multilingual support',
              '🛡️ Secure & privacy-first architecture',
            ].map((feature) => (
              <p key={feature} className="text-body">{feature}</p>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-lg mt-lg">
        <p className="text-small">Nexus26 — Smart Stadiums for FIFA World Cup 2026</p>
      </footer>
    </div>
  );
}
