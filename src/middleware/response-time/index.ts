/**
 * @module
 * Response Time Middleware for Hono.
 */
import type { MiddlewareHandler } from '../../types'

export type ResponseTimeOptions = {
  /**
   * The header name used for the response time.
   * @default X-Response-Time
   */
  header?: string
  /**
   * The number of digits after the decimal point.
   * @default 2
   */
  digits?: number
  /**
   * Whether to append `ms` to the value.
   * @default true
   */
  suffix?: boolean
}

/**
 * Response Time Middleware for Hono.
 *
 * @param options - The options for the Response Time Middleware.
 * @returns {MiddlewareHandler} The middleware handler function.
 *
 * @example
 * ```ts
 * import { responseTime } from 'hono/response-time'
 *
 * const app = new Hono()
 *
 * app.use(responseTime()) // X-Response-Time: 1.23ms
 * ```
 */
export const responseTime = ({
  header = 'X-Response-Time',
  digits = 2,
  suffix = true,
}: ResponseTimeOptions = {}): MiddlewareHandler => {
  return async function responseTime(c, next) {
    const start = performance.now()
    await next()
    const value = (performance.now() - start).toFixed(digits)
    c.res.headers.set(header, suffix ? `${value}ms` : value)
  }
}
