import { MOCK_METRICS, FAN_SYSTEM_PROMPT, STAFF_SYSTEM_PROMPT, MAX_INPUT_LENGTH } from '../constants';

describe('Constants', () => {
  it('defines MAX_INPUT_LENGTH as 1000', () => {
    expect(MAX_INPUT_LENGTH).toBe(1000);
  });

  it('FAN_SYSTEM_PROMPT contains stadium assistant context', () => {
    expect(FAN_SYSTEM_PROMPT).toContain('Stadium Assistant');
    expect(FAN_SYSTEM_PROMPT).toContain('FIFA World Cup 2026');
  });

  it('STAFF_SYSTEM_PROMPT contains operational context', () => {
    expect(STAFF_SYSTEM_PROMPT).toContain('Operational Command');
    expect(STAFF_SYSTEM_PROMPT).toContain('crowd flow');
  });

  it('MOCK_METRICS contains all required metric keys', () => {
    expect(MOCK_METRICS).toHaveProperty('attendance');
    expect(MOCK_METRICS).toHaveProperty('gateWait');
    expect(MOCK_METRICS).toHaveProperty('incidents');
    expect(MOCK_METRICS).toHaveProperty('medicalStaff');
    expect(MOCK_METRICS).toHaveProperty('concessions');
    expect(MOCK_METRICS).toHaveProperty('transit');
  });

  it('attendance metric has valid capacity values', () => {
    expect(MOCK_METRICS.attendance.value).toBeLessThanOrEqual(MOCK_METRICS.attendance.capacity);
    expect(MOCK_METRICS.attendance.value).toBeGreaterThan(0);
  });

  it('metrics have correct status types', () => {
    expect(MOCK_METRICS.gateWait.status).toBe('warning');
    expect(MOCK_METRICS.incidents.status).toBe('error');
    expect(MOCK_METRICS.medicalStaff.status).toBe('normal');
  });
});
