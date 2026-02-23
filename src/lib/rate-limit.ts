/**
 * Simple in-memory sliding-window rate limiter.
 *
 * Each instance tracks request timestamps per key (typically IP address).
 * Not shared across serverless invocations, but provides meaningful
 * protection on long-lived or edge deployments (Vercel Serverless Functions
 * reuse the same process for multiple requests within a window).
 */

interface RateLimitOptions {
  /** Maximum requests allowed within the window */
  limit: number;
  /** Window size in milliseconds */
  windowMs: number;
}

export function rateLimit({ limit, windowMs }: RateLimitOptions) {
  const store = new Map<string, number[]>();

  return {
    /** Returns true if the request should be allowed, false if rate-limited */
    check(key: string): boolean {
      const now = Date.now();
      const timestamps = store.get(key) ?? [];

      // Remove timestamps outside the window
      const valid = timestamps.filter((t) => now - t < windowMs);

      if (valid.length >= limit) {
        store.set(key, valid);
        return false;
      }

      valid.push(now);
      store.set(key, valid);

      // Periodically prune stale keys (every 100 checks)
      if (store.size > 500) {
        for (const [k, v] of store) {
          const fresh = v.filter((t) => now - t < windowMs);
          if (fresh.length === 0) store.delete(k);
          else store.set(k, fresh);
        }
      }

      return true;
    },
  };
}

/** Rate limiter for the availability endpoint: 30 requests per minute per IP */
export const availabilityLimiter = rateLimit({ limit: 30, windowMs: 60_000 });

/** Rate limiter for the booking endpoint: 5 requests per minute per IP */
export const bookingLimiter = rateLimit({ limit: 5, windowMs: 60_000 });
