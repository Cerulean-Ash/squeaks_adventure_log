import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

const adventure = { icon: '🪓', name: 'Axe Throwing' }

describe('notifyAshley', () => {
  beforeEach(() => {
    vi.resetModules()
    global.fetch = vi.fn(() => Promise.resolve({ ok: true }))
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  async function load() {
    // Re-import after stubbing env so the module-level NTFY_TOPIC is fresh.
    return (await import('./utils.js')).notifyAshley
  }

  it('POSTs to the topic from VITE_NTFY_TOPIC with the right headers + body', async () => {
    vi.stubEnv('VITE_NTFY_TOPIC', 'adv-test123')
    const notifyAshley = await load()

    notifyAshley(adventure, null)

    expect(global.fetch).toHaveBeenCalledTimes(1)
    const [url, opts] = global.fetch.mock.calls[0]
    expect(url).toBe('https://ntfy.sh/adv-test123')
    expect(opts.method).toBe('POST')
    expect(opts.headers).toMatchObject({
      Title: 'Squeaks has picked an adventure!',
      Tags: 'tada,heart',
      Priority: 'high',
    })
    expect(opts.body).toBe('🪓 Axe Throwing — she said yes!')
  })

  it('appends a formatted date when one is given', async () => {
    vi.stubEnv('VITE_NTFY_TOPIC', 'adv-test123')
    const notifyAshley = await load()

    notifyAshley(adventure, '2026-06-13')

    const { body } = global.fetch.mock.calls[0][1]
    // en-GB long format, locale-independent of the runner's TZ (noon avoids DST edges).
    expect(body).toContain('Axe Throwing — she said yes! — ')
    expect(body).toContain('13 June')
    expect(body).toContain('Saturday')
  })

  it('keeps headers ISO-8859-1 safe (no emoji in headers)', async () => {
    vi.stubEnv('VITE_NTFY_TOPIC', 'adv-test123')
    const notifyAshley = await load()

    notifyAshley(adventure, null)

    const { headers } = global.fetch.mock.calls[0][1]
    for (const v of Object.values(headers)) {
      // eslint-disable-next-line no-control-regex
      expect(v).toMatch(/^[\x00-\xFF]*$/)
    }
  })

  it('is a no-op when no topic is configured', async () => {
    vi.stubEnv('VITE_NTFY_TOPIC', '')
    const notifyAshley = await load()

    notifyAshley(adventure, null)

    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('swallows fetch rejections', async () => {
    vi.stubEnv('VITE_NTFY_TOPIC', 'adv-test123')
    global.fetch = vi.fn(() => Promise.reject(new Error('network down')))
    const notifyAshley = await load()

    await expect(
      Promise.resolve(notifyAshley(adventure, null)),
    ).resolves.toBeUndefined()
  })
})
