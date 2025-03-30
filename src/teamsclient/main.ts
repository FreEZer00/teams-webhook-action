import { ConnectorMessage } from './types.js'
import axios from 'axios'

function matchUrlPattern(url: string): boolean {
  const urlPattern =
    'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)'
  const regex = new RegExp(urlPattern)
  return !!url.match(regex)
}
async function sendNotification(
  webHookUrl: string,
  message: ConnectorMessage,
  dryrun?: boolean,
  log?: (logMessage: string) => void,
  errorLog?: (logMessage: string) => void
): Promise<void> {
  if (log) {
    log(`Connector message ${JSON.stringify(message, null, 2)}`)
  }
  if (dryrun) {
    return
  }
  if (!matchUrlPattern(webHookUrl)) {
    throw new Error('Webhook url not defined properly, not a URL')
  }
  try {
    const axiosResponse = await axios.post(webHookUrl, message)
    if (log) {
      log(
        `Posted connector message with response: HTTP ${axiosResponse.status}`
      )
    }
  } catch (error: unknown) {
    if (errorLog) {
      errorLog(
        `Error occurred when trying to post connector message: ${JSON.stringify(
          error
        )}`
      )
    }
    throw error
  }
}

export { sendNotification }
