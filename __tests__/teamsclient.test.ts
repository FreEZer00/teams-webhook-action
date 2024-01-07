import { sendNotification } from '../src/teamsclient/main'
import { defaultConnectorMessage } from '../src/teamsclient/types'
import axios from 'axios'
jest.mock('axios')

describe('Tests for the teams client', () => {
  const message = {
    ...defaultConnectorMessage,
    summary: 'summary',
    themeColor: 'color'
  }

  const axiosPostMock = (axios.post = jest.fn())
  axiosPostMock.mockReturnValueOnce({
    status: 200,
    data: null,
    headers: {},
    request: null,
    config: {},
    statusText: 'statusText'
  })
  test('url not matching pattern', async function () {
    const url = 'not_a_url'
    await expect(
      sendNotification(url, message, false, console.log, console.error)
    ).rejects.toThrow('Webhook url not defined properly, not a URL')
    expect(axiosPostMock).not.toHaveBeenCalled()
  })
  test('url matching pattern', async function () {
    const url =
      'https://any.webhook.office.com/webhook/someid/1232153241312311/2313'
    await sendNotification(url, message, false, console.log, console.error)
    expect(axiosPostMock).toHaveBeenCalled()
  })
})
