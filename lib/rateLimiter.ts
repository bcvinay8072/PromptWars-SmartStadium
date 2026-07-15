/**
 * @module lib/rateLimiter
 * Token Bucket Rate Limiter to prevent API abuse.
 */
/**
 * Token Bucket Rate Limiter to prevent API abuse.
 * Uses a refilling token bucket algorithm where tokens are consumed per request
 * and refilled at a configurable rate.
 *
 * @example
 * const limiter = new RateLimiter(10, 2000);
 * if (limiter.canProceed()) { // process request }
 */
export class RateLimiter {
  /** Current number of available tokens */
  tokens: number;
  /** Maximum number of tokens the bucket can hold */
  readonly maxTokens: number;
  /** Time in milliseconds between token refills */
  readonly refillRate: number;
  /** Timestamp of the last token refill */
  lastRefill: number;

  /**
   * Creates a new RateLimiter instance.
   * @param maxTokens - Maximum tokens in the bucket (default: 10)
   * @param refillRateMs - Milliseconds between token refills (default: 2000)
   */
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

/** Global rate limiter instance shared across all API requests */
export const globalRateLimiter = new RateLimiter();
