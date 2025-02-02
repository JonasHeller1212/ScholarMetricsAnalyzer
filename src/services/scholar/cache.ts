import type { Author } from '../../types/scholar';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class ScholarCache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly TTL = 1000 * 60 * 60; // 1 hour cache TTL

  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  public set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  public clear(): void {
    this.cache.clear();
  }

  public clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.TTL) {
        this.cache.delete(key);
      }
    }
  }
}

export const scholarCache = new ScholarCache();