'use client';

import { useState, useRef, useEffect, useMemo, lazy, Suspense, memo } from 'react';
import { MOCK_METRICS } from '@/lib/constants';
import type { MetricStatus } from '@/lib/constants';

const ChatInterface = lazy(() =>
  import('./ChatInterface').then((m) => ({ default: m.ChatInterface }))
);

/**
 * Returns the appropriate CSS class for a metric status dot.
 *
 * @param status - The status level of the metric
 * @returns The CSS class name for the status indicator
 * @example
 * getStatusClass('warning') // returns 'status-dot-warning'
 */
function getStatusClass(status: MetricStatus): string {
  if (status === 'warning') return 'status-dot-warning';
  if (status === 'error') return 'status-dot-error';
  return 'status-dot';
}

/**
 * Staff-facing operational dashboard for the Nexus26 Smart Stadium application.
 * Provides real-time venue metrics, incident tracking, and AI-powered operational intelligence.
 *
 * @returns The rendered StaffDashboard component
 * @example
 * <StaffDashboard />
 */
const StaffDashboardBase = (): React.ReactNode => {
  const [activeTab, setActiveTab] = useState<'overview' | 'intelligence'>('overview');
  const progressBarRef = useRef<HTMLDivElement>(null);

  /** Computed stadium capacity percentage */
  const capacityPercent = useMemo(
    () => (MOCK_METRICS.attendance.value / MOCK_METRICS.attendance.capacity) * 100,
    []
  );

  useEffect(() => {
    progressBarRef.current?.style.setProperty('--progress-width', `${capacityPercent}%`);
  }, [capacityPercent]);

  return (
    <div className="flex flex-col gap-lg animate-slideUp">
      {/* Header with System Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-sm">
          <div className="status-dot" />
          <span className="text-small text-accent">All Systems Operational</span>
        </div>
        <span className="badge badge-accent">Live</span>
      </div>

      {/* Tab Navigation */}
      <nav className="flex gap-xs border-b" aria-label="Staff dashboard navigation">
        <button
          onClick={() => setActiveTab('overview')}
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          aria-pressed={activeTab === 'overview'}
        >
          📊 Live Overview
        </button>
        <button
          onClick={() => setActiveTab('intelligence')}
          className={`tab-btn ${activeTab === 'intelligence' ? 'active' : ''}`}
          aria-pressed={activeTab === 'intelligence'}
        >
          🧠 AI Intelligence
        </button>
      </nav>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <section aria-labelledby="overview-heading" className="animate-fadeIn">
          <h3 id="overview-heading" className="visually-hidden">Live Overview Metrics</h3>

          {/* Attendance Hero */}
          <div className="glass-panel p-lg mb-lg">
            <div className="flex items-center justify-between mb-md">
              <div>
                <p className="metric-label">{MOCK_METRICS.attendance.label}</p>
                <p className="metric-value text-accent">
                  {MOCK_METRICS.attendance.value.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="metric-label">Capacity</p>
                <p className="text-xl text-primary">
                  {Math.round((MOCK_METRICS.attendance.value / MOCK_METRICS.attendance.capacity) * 100)}%
                </p>
              </div>
            </div>
            {/* Capacity Bar */}
            <div className="rounded-full overflow-hidden" aria-hidden="true">
              <div
                ref={progressBarRef}
                className="rounded-full progress-bar-fill"
                role="progressbar"
                aria-valuenow={MOCK_METRICS.attendance.value}
                aria-valuemin={0}
                aria-valuemax={MOCK_METRICS.attendance.capacity}
                aria-label="Stadium capacity"
              />
            </div>
          </div>

          {/* Metric Grid */}
          <div className="grid grid-cols-2 gap-md">
            {Object.entries(MOCK_METRICS)
              .filter(([key]) => key !== 'attendance')
              .map(([key, metric]) => (
                <div key={key} className="metric-card">
                  <div className="flex items-center justify-between mb-sm">
                    <p className="metric-label">{metric.label}</p>
                    {'status' in metric && (
                      <div className={getStatusClass(metric.status)} />
                    )}
                  </div>
                  <p className={`metric-value ${'status' in metric ? (metric.status === 'error' ? 'text-error' : metric.status === 'warning' ? 'text-warning' : 'text-accent') : 'text-accent'}`}>
                    {metric.value}
                    {'unit' in metric && (
                      <span className="text-body"> {metric.unit}</span>
                    )}
                  </p>
                </div>
              ))}
          </div>
        </section>
      )}

      {activeTab === 'intelligence' && (
        <section aria-labelledby="intelligence-heading" className="animate-fadeIn">
          <h3 id="intelligence-heading" className="visually-hidden">AI Operational Intelligence</h3>
          <Suspense fallback={<div className="glass-panel p-lg text-center text-muted h-chat flex items-center justify-center">Loading intelligence module...</div>}>
            <ChatInterface context="staff" />
          </Suspense>
        </section>
      )}
    </div>
  );
};

/**
 * Memoized StaffDashboard component to prevent unnecessary re-renders.
 */
export const StaffDashboard = memo(StaffDashboardBase);
StaffDashboard.displayName = 'StaffDashboard';
