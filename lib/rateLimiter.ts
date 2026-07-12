/**
 * @module lib/rateLimiter
 * Token Bucket Rate Limiter to prevent API abuse.
 */
export class RateLimiter {
  tokens: number;
  readonly maxTokens: number;
  readonly refillRate: number;
  lastRefill: number;

  constructor(maxTokens = 10, refillRateMs = 2000) {
    this.maxTokens = maxTokens;
    this.tokens = maxTokens;
    this.refillRate = refillRateMs;
    this.lastRefill = Date.now();
  }

  /**
   * Returns true if request can proceed, consuming one token.
   * @returns {boolean} Whether the request is allowed
   */
  canProceed(): boolean {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    this.tokens = Math.min(this.maxTokens, this.tokens + Math.floor(elapsed / this.refillRate));
    if (elapsed >= this.refillRate) {
      this.lastRefill = now - (elapsed % this.refillRate);
    }
    if (this.tokens > 0) {
      this.tokens--;
      return true;
    }
    return false;
  }
}

export const globalRateLimiter = new RateLimiter();
