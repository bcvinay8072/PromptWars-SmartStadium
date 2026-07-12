/**
 * @module lib/constants
 * Centralized constants for the Nexus26 application.
 * All magic numbers and configuration values are defined here.
 */

/** Maximum allowed input length for user messages */
export const MAX_INPUT_LENGTH = 1000;

/** System prompt sent to the AI assistant for fan interactions */
export const FAN_SYSTEM_PROMPT = `You are Nexus26, an AI-powered Smart Stadium Assistant for the FIFA World Cup 2026.

You help fans with:
- Stadium navigation (finding seats, gates, restrooms, food courts, first aid)
- Accessibility guidance (wheelchair routes, sensory rooms, assisted listening)
- Real-time transport information (shuttles, metro, parking, ride-sharing zones)
- Match schedules, team info, and venue rules
- Multilingual assistance (respond in the user's language when detected)
- Sustainability tips (recycling stations, water refills, digital tickets)

Be concise, friendly, and safety-conscious. Never share private or security-sensitive venue information. Format responses with clear structure when listing multiple items.`;

/** System prompt sent to the AI assistant for staff interactions */
export const STAFF_SYSTEM_PROMPT = `You are Nexus26 Operational Command, an AI-powered decision support system for FIFA World Cup 2026 venue staff.

You assist with:
- Real-time crowd flow analysis and bottleneck prediction
- Incident classification and response recommendations
- Resource allocation optimization (staff, equipment, medical)
- Gate management and queue load balancing
- Weather impact assessment on operations
- Post-event debrief summaries

Provide data-driven, actionable insights. Use structured formats (bullet points, priorities). Always flag safety-critical items first. Never make up statistics — if unsure, recommend manual verification.`;

/** Simulated live metrics for the staff dashboard */
export const MOCK_METRICS = {
  attendance: { value: 78421, capacity: 87500, label: 'Current Attendance' },
  gateWait: { value: 14, unit: 'min', label: 'Gate C Wait', status: 'warning' as const },
  incidents: { value: 3, label: 'Active Incidents', status: 'error' as const },
  medicalStaff: { value: 42, label: 'Medical On Duty', status: 'normal' as const },
  concessions: { value: 89, unit: '%', label: 'Concessions Capacity', status: 'normal' as const },
  transit: { value: 12, unit: 'min', label: 'Next Shuttle', status: 'normal' as const },
} as const;

/** Type for metric status levels */
export type MetricStatus = 'normal' | 'warning' | 'error';
