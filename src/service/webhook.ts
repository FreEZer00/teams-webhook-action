import {ConnectorMessage, defaultConnectorMessage} from '../teamsclient/types'
import {ActionInputs, Status} from '../types'

function determineColor(status: Status): string {
  if (status === 'failure') {
    return '#b80707'
  } else if (status === 'cancelled') {
    return '#7a7c7a'
  }
  return '#2cbe4e'
}

function getOverallStatus(inputs: ActionInputs): Status {
  if (inputs.needs.some(need => need.failure) || inputs.job?.failure) {
    return 'failure'
  } else if (
    inputs.needs.some(need => need.cancelled) ||
    inputs.job?.cancelled
  ) {
    return 'cancelled'
  }
  return 'success'
}

function buildConnectorMessage(inputs: ActionInputs): ConnectorMessage {
  const overallStatus = getOverallStatus(inputs)
  return {
    ...defaultConnectorMessage,
    summary: inputs.title || `Workflow run was ${overallStatus}`,
    themeColor: determineColor(overallStatus)
  }
}

export {buildConnectorMessage}
