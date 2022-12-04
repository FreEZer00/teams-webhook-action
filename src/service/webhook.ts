import {ConnectorMessage, defaultConnectorMessage} from '../teamsclient/types'
import {ActionInputs} from '../types'
import {context} from '@actions/github'
import * as core from '@actions/core'

function buildConnectorMessage(
  inputs: ActionInputs,
  title: string
): ConnectorMessage {
  return {
    ...defaultConnectorMessage,
    summary: `${title}` || `${context.workflow}`,
    themeColor: '#2cbe4e'
  }
}

export {buildConnectorMessage}
