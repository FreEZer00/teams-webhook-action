import { ConnectorMessage } from './types.js'

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
  const response = await fetch(webHookUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(message)
  })
  if (response.ok) {
    if (log) {
      log(`Posted connector message with response: HTTP ${response.status}`)
    }
  } else {
    if (errorLog) {
      errorLog(
        `Error occurred when trying to post connector message: ${JSON.stringify(
          response.body
        )}`
      )
    }
    throw new Error(
      `Connector message post failed with status ${response.status}`
    )
  }
}

export { sendNotification }
