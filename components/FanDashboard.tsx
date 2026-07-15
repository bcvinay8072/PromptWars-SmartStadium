'use client';

import { useState, lazy, Suspense, memo } from 'react';
import { MOCK_METRICS } from '@/lib/constants';

const ChatInterface = lazy(() =>
  import('./ChatInterface').then((m) => ({ default: m.ChatInterface }))
);

/**
 * Fan-facing dashboard for the Nexus26 Smart Stadium application.
 * Provides AI-powered assistance, stadium navigation, and transport information.
 *
 * @returns The rendered FanDashboard component
 * @example
 * <FanDashboard />
 */
const FanDashboardBase = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'navigate' | 'transport'>('chat');

  return (
    <div className="flex flex-col gap-lg animate-slideUp">
      {/* Tab Navigation */}
      <nav className="flex gap-xs border-b" aria-label="Fan dashboard navigation">
        {[
          { id: 'chat' as const, label: '💬 AI Assistant', icon: '' },
          { id: 'navigate' as const, label: '🗺️ Navigate', icon: '' },
          { id: 'transport' as const, label: '🚌 Transport', icon: '' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            aria-pressed={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div className="animate-fadeIn">
        {activeTab === 'chat' && (
          <section aria-labelledby="fan-chat-heading">
            <h3 id="fan-chat-heading" className="visually-hidden">AI Assistant</h3>
            <Suspense fallback={<div className="glass-panel p-lg text-center text-muted h-chat flex items-center justify-center">Loading assistant...</div>}>
              <ChatInterface context="fan" />
            </Suspense>
          </section>
        )}

        {activeTab === 'navigate' && (
          <section aria-labelledby="navigate-heading" className="animate-fadeIn">
            <h3 id="navigate-heading" className="visually-hidden">Stadium Navigation</h3>
            <div className="grid grid-cols-2 gap-md">
              {[
                { icon: '🚻', label: 'Restrooms', desc: 'Sections 110, 225, 340', time: '2 min walk' },
                { icon: '🍔', label: 'Food Court', desc: 'Level 1 & Level 3', time: '4 min walk' },
                { icon: '🏥', label: 'First Aid', desc: 'Gates A & C', time: '3 min walk' },
                { icon: '♿', label: 'Accessibility', desc: 'Elevator at Gates A, C', time: '1 min walk' },
                { icon: '👶', label: 'Family Zone', desc: 'Section 150, Level 2', time: '5 min walk' },
                { icon: '💧', label: 'Water Refills', desc: 'Every gate entrance', time: '1 min walk' },
              ].map((item) => (
                <div key={item.label} className="glass-card p-lg">
                  <div className="flex items-center gap-sm mb-sm">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-lg text-primary">{item.label}</span>
                  </div>
                  <p className="text-body mb-xs">{item.desc}</p>
                  <span className="badge badge-accent">{item.time}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'transport' && (
          <section aria-labelledby="transport-heading" className="animate-fadeIn">
            <h3 id="transport-heading" className="visually-hidden">Transport Information</h3>
            <div className="flex flex-col gap-md">
              {[
                { icon: '🚇', label: 'Metro Line 4', status: 'On Time', next: '3 min', statusClass: 'badge-accent' },
                { icon: '🚌', label: 'Shuttle Bus S2', status: 'Delayed', next: '12 min', statusClass: 'badge-warning' },
                { icon: '🚗', label: 'Ride Share Zone', status: 'Available', next: 'Gate D', statusClass: 'badge-accent' },
                { icon: '🅿️', label: 'Parking P3', status: '45% Full', next: 'North Entry', statusClass: 'badge-accent' },
                { icon: '🅿️', label: 'Parking P1', status: 'Full', next: 'Closed', statusClass: 'badge-error' },
              ].map((item) => (
                <div key={item.label} className="glass-card p-md flex items-center justify-between">
                  <div className="flex items-center gap-md">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p className="text-primary text-lg">{item.label}</p>
                      <p className="text-small">{item.next}</p>
                    </div>
                  </div>
                  <span className={`badge ${item.statusClass}`}>{item.status}</span>
                </div>
              ))}
            </div>
            <div className="glass-card p-md mt-md">
              <p className="text-label mb-xs">Stadium Occupancy</p>
              <div className="flex items-center gap-md">
                <span className="metric-value text-accent">
                  {Math.round((MOCK_METRICS.attendance.value / MOCK_METRICS.attendance.capacity) * 100)}%
                </span>
                <span className="text-body">
                  {MOCK_METRICS.attendance.value.toLocaleString()} / {MOCK_METRICS.attendance.capacity.toLocaleString()}
                </span>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

/**
 * Memoized FanDashboard component to prevent unnecessary re-renders.
 */
export const FanDashboard = memo(FanDashboardBase);
FanDashboard.displayName = 'FanDashboard';
