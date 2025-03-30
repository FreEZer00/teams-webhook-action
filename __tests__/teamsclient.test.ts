import { defaultConnectorMessage } from '../src/teamsclient/types.js'
import { jest } from '@jest/globals'

import axios from '../__fixtures__/axios.js'

jest.unstable_mockModule('axios', () => {
  return {
    default: axios
  }
})

const { sendNotification } = await import('../src/teamsclient/main.js')

describe('Tests for the teams client', () => {
  const message = {
    ...defaultConnectorMessage,
    summary: 'summary',
    themeColor: 'color'
  }

  test('url not matching pattern', async function () {
    const url = 'not_a_url'
    await expect(
      sendNotification(url, message, false, console.log, console.error)
    ).rejects.toThrow('Webhook url not defined properly, not a URL')
    expect(axios.post).not.toHaveBeenCalled()
  })
  test('url matching pattern', async function () {
    axios.post.mockResolvedValue({
      status: 200,
      data: null,
      headers: {},
      request: null,
      config: {},
      statusText: 'statusText'
    })
    const url =
      'https://any.webhook.office.com/webhook/someid/1232153241312311/2313'
    await sendNotification(url, message, false, console.log, console.error)
    expect(axios.post).toHaveBeenCalled()
  })
})
