import {ConnectorMessage} from './types'
import axios from 'axios'

async function sendNotification(
  webHookUrl: string,
  message: ConnectorMessage,
  log?: (logMessage: string) => void,
  errorLog?: (logMessage: string) => void
): Promise<void> {
  !log || log(`Connector message ${JSON.stringify(message, null, 2)}`)
  if (!webHookUrl) {
    !log || log('Webhook url not defined')
    return
  }
  const axiosInstance = axios.create()
  try {
    const axiosResponse = await axiosInstance.post(webHookUrl, message)
    !log ||
      log(
        `Posted connector message with response: HTTP ${axiosResponse.status}`
      )
  } catch (error: unknown) {
    !errorLog ||
      errorLog(
        `Error occurred when trying to post connector message: ${JSON.stringify(
          error
        )}`
      )
    throw error
  }
}

export {sendNotification}
