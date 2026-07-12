import { sanitizeInput } from '../utils';

describe('sanitizeInput', () => {
  it('returns empty string for empty input', () => {
    expect(sanitizeInput('')).toBe('');
  });

  it('returns empty string for null-like input', () => {
    expect(sanitizeInput(undefined as unknown as string)).toBe('');
  });

  it('strips HTML tags', () => {
    expect(sanitizeInput('<script>alert("xss")</script>Hello')).toBe('alert("xss")Hello');
  });

  it('strips javascript: protocol', () => {
    expect(sanitizeInput('javascript:alert(1)')).toBe('alert(1)');
  });

  it('strips javascript: case insensitively', () => {
    expect(sanitizeInput('JAVASCRIPT:alert(1)')).toBe('alert(1)');
  });

  it('strips event handlers', () => {
    expect(sanitizeInput('onerror=alert(1)')).toBe('alert(1)');
  });

  it('strips onclick handlers', () => {
    expect(sanitizeInput('onclick =doEvil()')).toBe('doEvil()');
  });

  it('strips data: URIs', () => {
    expect(sanitizeInput('data:text/html,<h1>evil</h1>')).toBe('text/html,evil');
  });

  it('trims whitespace', () => {
    expect(sanitizeInput('  hello world  ')).toBe('hello world');
  });

  it('truncates to 1000 chars', () => {
    const longString = 'a'.repeat(2000);
    expect(sanitizeInput(longString).length).toBe(1000);
  });

  it('handles normal text without modification', () => {
    expect(sanitizeInput('Where is gate B?')).toBe('Where is gate B?');
  });

  it('preserves safe special characters', () => {
    expect(sanitizeInput('Hello! How are you? #good')).toBe('Hello! How are you? #good');
  });

  it('handles multiple attack vectors at once', () => {
    const malicious = '<img onerror=alert(1) src="javascript:void(0)">';
    const result = sanitizeInput(malicious);
    expect(result).not.toContain('<');
    expect(result).not.toContain('onerror');
    expect(result).not.toContain('javascript:');
  });
});
