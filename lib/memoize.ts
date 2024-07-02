import { unstable_cache } from "next/cache"
import { cache } from "react"
import { cache as cfCache } from "./cache"


type Callback<Parameters extends unknown[], ReturnType> = (...args: Parameters) => ReturnType | Promise<ReturnType>

export type MemoizeOptionType<Parameters extends unknown[]> = {
  persist?: boolean,
  duration?: number,
  log?: ('dedupe' | 'datacache' | 'verbose')[],
  logid?: string
  revalidateTags?: ((...params: Parameters) => Promise<string[]>) | ((...params: Parameters) => string[]) | string[],
  additionalCacheKey?: ((...params: Parameters) => Promise<string[]>) | ((...params: Parameters) => string[]) | string[],
  suppressWarnings?: boolean
}


export function memoize<P extends unknown[], R>(
  cb: Callback<P, R>,
  opts?: MemoizeOptionType<P>
) {
  if (typeof window !== "undefined") {
    // Fallback to original function if window is defined (client side)
    if (!opts?.suppressWarnings) {
      console.warn("⚠️ Memoize: this function will not work in the client environment.")
    }
    return async (...args: P) => {
      return cb(...args)
    };
  }
  const isDevRuntime = process?.env?.NODE_ENV === "development"
  const cacheFunctionToUse = isDevRuntime ? unstable_cache : cfCache

  if (typeof cache === "undefined" && typeof cacheFunctionToUse === "undefined") {
    // Fallback to the original function if there's no caching functions (ex. on react native)
    if (!opts?.suppressWarnings) {
      console.warn("⚠️ Memoize: cache or unstable_cache function not found. Falling back to original function")
    }
    return async (...args: P) => {
        return cb(...args);
    };
  }
  
  const { // default values
    persist = true,
    duration = Infinity,
    log = [],
    revalidateTags: revalidateTagsFn,
    additionalCacheKey: additionalCacheKeyFn
  } = opts ?? {}
  const logDataCache = log.includes('datacache')
  const logDedupe = log.includes('dedupe')
  const logVerbose = log.includes('verbose')
  const logID = opts?.logid ? `${opts.logid} ` : ''

  let oldData: any
  let renderCacheHit: boolean
  renderCacheHit = false

  

  const cachedFn = cache(
    async (...args: P) => {
      renderCacheHit = true
      if (persist) {
        // Initialize unstable_cache
        const additionalCacheKey =
          additionalCacheKeyFn ?
            typeof additionalCacheKeyFn === 'function' ?
              additionalCacheKeyFn(...args) : additionalCacheKeyFn
            : []
        const revalidateTags =
          revalidateTagsFn ?
            typeof revalidateTagsFn === 'function' ?
              revalidateTagsFn(...args) : revalidateTagsFn
            : [];
        const cacheKey = [cb.toString(), JSON.stringify(args), ...(await additionalCacheKey)]
        const nextOpts = {
          revalidate: duration,
          tags: ['all', ...(await revalidateTags)]
        }
        if (logDataCache) {
          let dataCacheMiss = false
          const audit = new Audit()
          const data = await cacheFunctionToUse(
            async () => {
              dataCacheMiss = true
              return cb(...args)
            },
            cacheKey, nextOpts
          )()
          const time = audit!.getSec()
          const isSame = oldData === data
          // console.log(
          //     `${chalk.hex('AA7ADB').bold("Data Cache")} - `
          //   + `${chalk.hex('A0AFBF')(`${logID}${cb.name}`)} ${chalk.hex('#AA7ADB').bold(dataCacheMiss ? "MISS" : "HIT")} `
          //   + `${chalk.hex('A0AFBF')(time.toPrecision(3) + 's')} `
          //   + `${chalk.hex('AA7ADB').bold(dataCacheMiss ? isSame ? 'background-revalidation' : 'on-demand revalidation' : "")} `
          // )
          // if (logVerbose)
            // console.log(`${chalk.hex('6A7C8E').bold(` └ ${cb.name ?? "Anon Func"} ${JSON.stringify(args)}`)}`)
          oldData = data
          return data

        } else {
          const data = await cacheFunctionToUse(
            async () => {
              return cb(...args)
            }, [cb.toString(), JSON.stringify(args), ...(await additionalCacheKey)], {
            revalidate: 100000000,
            tags: ['all', ...(await revalidateTags)]
          }
          )()
          return data
        }
      } else {
        // return callback directly
        return cb(...args)
      }

    }
  )
  return async (...args: P) => {

    if (logDedupe) {
      let audit2 = new Audit()
      let data = await cachedFn(...args)
      let time = audit2.getSec()
      // console.log(
      //     `${chalk.hex('#FFB713').bold("Memoization")} - `
      //   + `${chalk.hex('A0AFBF')(`${logID}${cb.name}`)} ${chalk.hex('#FFC94E').bold(renderCacheHit ? "HIT" : "MISS")} `
      //   + `${chalk.hex('A0AFBF')(time.toPrecision(3) + 's')} `
      // )
      renderCacheHit = false
      return data
    } else {
      return await cachedFn(...args)
    }
  }
}



class Audit {
  private _start: number = performance.now()
  private _end: number | null = null
  getSec() {
    this._end = performance.now()
    return ((this._end - this._start) / 1000)
  }
}