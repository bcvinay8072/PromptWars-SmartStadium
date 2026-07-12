import { RateLimiter } from '../rateLimiter';

describe('RateLimiter', () => {
  it('allows requests when tokens are available', () => {
    const limiter = new RateLimiter(5, 1000);
    expect(limiter.canProceed()).toBe(true);
  });

  it('consumes tokens on each request', () => {
    const limiter = new RateLimiter(3, 1000);
    expect(limiter.canProceed()).toBe(true);
    expect(limiter.canProceed()).toBe(true);
    expect(limiter.canProceed()).toBe(true);
    expect(limiter.canProceed()).toBe(false);
  });

  it('blocks requests when tokens are exhausted', () => {
    const limiter = new RateLimiter(1, 10000);
    limiter.canProceed(); // consume the only token
    expect(limiter.canProceed()).toBe(false);
  });

  it('refills tokens over time', () => {
    const limiter = new RateLimiter(2, 100);
    limiter.canProceed();
    limiter.canProceed();
    expect(limiter.canProceed()).toBe(false);

    // Simulate time passing
    limiter.lastRefill = Date.now() - 200;
    expect(limiter.canProceed()).toBe(true);
  });

  it('does not exceed max tokens after refill', () => {
    const limiter = new RateLimiter(3, 100);
    limiter.lastRefill = Date.now() - 10000; // way in the past
    limiter.canProceed();
    expect(limiter.tokens).toBeLessThanOrEqual(3);
  });

  it('initializes with default values', () => {
    const limiter = new RateLimiter();
    expect(limiter.maxTokens).toBe(10);
    expect(limiter.refillRate).toBe(2000);
    expect(limiter.tokens).toBe(10);
  });

  it('initializes with custom values', () => {
    const limiter = new RateLimiter(5, 500);
    expect(limiter.maxTokens).toBe(5);
    expect(limiter.refillRate).toBe(500);
  });

  it('handles rapid sequential calls correctly', () => {
    const limiter = new RateLimiter(10, 10000);
    let allowed = 0;
    for (let i = 0; i < 15; i++) {
      if (limiter.canProceed()) allowed++;
    }
    expect(allowed).toBe(10);
  });
});
