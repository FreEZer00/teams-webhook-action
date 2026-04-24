import { jest, describe, test, expect, beforeEach } from '@jest/globals'
import { defaultConnectorMessage } from '../src/teamsclient/types.js'

const { sendNotification } = await import('../src/teamsclient/main.js')

/* eslint-disable @typescript-eslint/no-explicit-any */
describe('Tests for the teams client', () => {
  let fetchMock: jest.Mock

  beforeEach(() => {
    fetchMock = jest.fn()
    global.fetch = fetchMock as unknown as typeof fetch
  })

  const message = {
    ...defaultConnectorMessage,
    summary: 'summary',
    themeColor: 'color'
  }

  test('url not matching pattern', async () => {
    const url = 'not_a_url'
    await expect(
      sendNotification(url, message, false, console.log, console.error)
    ).rejects.toThrow('Webhook url not defined properly, not a URL')

    expect(fetchMock).not.toHaveBeenCalled()
  })

  test('url matching pattern', async () => {
    ;(fetchMock as any).mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    )

    const url = 'https://any.webhook.office.com/webhook/someid/123/456'

    await sendNotification(url, message, false, console.log, console.error)

    expect(fetchMock).toHaveBeenCalled()
  })
})
