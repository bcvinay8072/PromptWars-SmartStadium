import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should return initial value', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('should set value', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'));
    act(() => {
      result.current[1]('new');
    });
    expect(result.current[0]).toBe('new');
    expect(window.localStorage.getItem('key')).toBe(JSON.stringify('new'));
  });

  it('should handle functional updates', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0));
    act(() => {
      result.current[1]((prev) => prev + 1);
    });
    expect(result.current[0]).toBe(1);
    expect(window.localStorage.getItem('count')).toBe(JSON.stringify(1));
  });
});
