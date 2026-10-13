import { responseTime } from '.'
import { Hono } from '../../hono'

describe('Response Time Middleware', () => {
  const app = new Hono()
  app.use('/default/*', responseTime())
  app.use('/header/*', responseTime({ header: 'Server-Duration' }))
  app.use('/digits/*', responseTime({ digits: 0 }))
  app.use('/no-suffix/*', responseTime({ suffix: false }))
  app.get('/default/error', () => {
    throw new Error('boom')
  })
  app.get('*', (c) => c.text('Hello'))

  it('Should set X-Response-Time with two digits and ms', async () => {
    const res = await app.request('/default')
    expect(res.status).toBe(200)
    expect(res.headers.get('X-Response-Time')).toMatch(/^\d+\.\d{2}ms$/)
  })

  it('Should use a custom header name', async () => {
    const res = await app.request('/header')
    expect(res.headers.get('Server-Duration')).toMatch(/^\d+\.\d{2}ms$/)
    expect(res.headers.get('X-Response-Time')).toBeNull()
  })

  it('Should respect digits', async () => {
    const res = await app.request('/digits')
    expect(res.headers.get('X-Response-Time')).toMatch(/^\d+ms$/)
  })

  it('Should omit the suffix', async () => {
    const res = await app.request('/no-suffix')
    expect(res.headers.get('X-Response-Time')).toMatch(/^\d+\.\d{2}$/)
  })

  it('Should set the header on error responses', async () => {
    const res = await app.request('/default/error')
    expect(res.status).toBe(500)
    expect(res.headers.get('X-Response-Time')).toMatch(/^\d+\.\d{2}ms$/)
  })
})
