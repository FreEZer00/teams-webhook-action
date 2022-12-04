import {ConnectorMessage, defaultConnectorMessage} from '../teamsclient/types'
import {ActionInputs} from '../types'
import {context} from '@actions/github'

function determineColor(inputs: ActionInputs): string {
  if (
    inputs.needs.some(need => need.result === 'failure') ||
    inputs.job?.status === 'failure'
  ) {
    return '#b80707'
  } else if (
    inputs.needs.some(need => need.result === 'cancelled') ||
    inputs.job?.status === 'cancelled'
  ) {
    return '#7a7c7a'
  }
  return '#2cbe4e'
}

function buildConnectorMessage(
  inputs: ActionInputs,
  title: string
): ConnectorMessage {
  return {
    ...defaultConnectorMessage,
    summary: `${title}` || `${context.workflow}`,
    themeColor: determineColor(inputs)
  }
}

export {buildConnectorMessage}
