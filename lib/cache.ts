import { getRequestContext } from '@cloudflare/next-on-pages';
import { revalidateTag as nextRevalidateTag } from 'next/cache';

const YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

interface CacheOptions {
  tags?: string[];
  revalidate?: number | false;
}

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

interface RequestContext {
  ctx: {
    waitUntil(promise: Promise<any>): void;
  };
  env: {
    CACHE_TAG_STORE: KVNamespace;
  };
}

function cache<T extends (...args: any[]) => Promise<any>>(
  cb: T,
  keyParts: string | string[],
  options: CacheOptions = {}
): T {
  const fixedKey = `${cb.toString()}-${Array.isArray(keyParts) ? keyParts.join(',') : keyParts}`;
  const cachedCb = async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const context = getRequestContext() as RequestContext;
    const cacheTagStore = createCfKvCacheTagStore(context.env.CACHE_TAG_STORE);
    const objectCache = createCfCacheObjectCache(caches.open('cache'));
    const invocationKey = `${fixedKey}-${JSON.stringify(args)}`;
    const tagsCacheKey = options.tags
      ? await cacheTagStore.getTagsCacheKey(options.tags)
      : '';
    const totalCacheKey = `${tagsCacheKey}-${invocationKey}`;
    const cachedResult = await objectCache.get<ReturnType<T>>(totalCacheKey);
    if (cachedResult.found) return cachedResult.data!;

    const result = await cb(...args);
    context.ctx.waitUntil(
      objectCache.set(
        totalCacheKey,
        result,
        options.revalidate !== false
          ? options.revalidate ?? YEAR_IN_SECONDS
          : 0
      )
    );
    return result;
  };
  return cachedCb as unknown as T;
}

function revalidateTag(tag: string): void {
  const context = getRequestContext() as RequestContext;
  nextRevalidateTag(tag);
  const cacheTagStore = createCfKvCacheTagStore(context.env.CACHE_TAG_STORE);
  context.ctx.waitUntil(cacheTagStore.revalidateTag(tag));
}

const constructCacheUrl = (key: string): string => {
  return `http://cache/${encodeURIComponent(key)}`;
};

function createCfCacheObjectCache(cachePromise: Promise<Cache>) {
  return {
    async get<T>(key: string): Promise<{ found: true; data: T } | { found: false }> {
      const resolvedCache = await cachePromise;
      const response = await resolvedCache.match(constructCacheUrl(key));
      if (response) {
        const data = (await response.json()) as T;
        return {
          found: true,
          data,
        };
      }
      return {
        found: false,
      };
    },
    async set(key: string, value: any, duration: number): Promise<void> {
      const resolvedCache = await cachePromise;
      const response = new Response(JSON.stringify(value), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': `public, max-age=${duration}`,
        },
      });
      await resolvedCache.put(constructCacheUrl(key), response);
    },
  };
}

function createCfKvCacheTagStore(kvNamespace: KVNamespace) {
  return {
    async getTagsCacheKey(tags: string[]): Promise<string> {
      const tagDates = await Promise.all(
        tags.map(async (tag) => {
          const date = await kvNamespace.get(tag);
          return date ?? '0';
        })
      );
      return tagDates.join(',');
    },
    async revalidateTag(tag: string): Promise<void> {
      await kvNamespace.put(tag, `${Date.now()}`);
    },
  };
}

export {
  cache,
  createCfCacheObjectCache,
  createCfKvCacheTagStore,
  revalidateTag,
};
