export class RateLimiter {
  private timestamps: number[] = [];
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs = 60000, maxRequests = 10) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  public async acquireToken(): Promise<void> {
    const now = Date.now();
    
    // Remove timestamps outside the window
    this.timestamps = this.timestamps.filter(
      timestamp => now - timestamp < this.windowMs
    );

    if (this.timestamps.length >= this.maxRequests) {
      const oldestTimestamp = this.timestamps[0];
      const waitTime = this.windowMs - (now - oldestTimestamp);
      
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
      
      // Clean up old timestamps after waiting
      this.timestamps = this.timestamps.filter(
        timestamp => Date.now() - timestamp < this.windowMs
      );
    }

    this.timestamps.push(Date.now());
  }

  public clear(): void {
    this.timestamps = [];
  }
}

export const rateLimiter = new RateLimiter();