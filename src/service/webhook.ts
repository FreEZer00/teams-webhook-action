import {
  ConnectorMessage,
  defaultConnectorMessage,
  defaultOpenUriAction,
  defaultTarget,
  Fact,
  OpenUriAction,
  PotentialAction,
  Section
} from '../teamsclient/types'
import {ActionInputs, NeedsResult, Status} from '../types'
import {context as github} from '@actions/github'

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

function createNeedsFacts(needs: NeedsResult[]): Fact[] {
  return needs.map((n): Fact => {
    return {name: n.jobName, value: n.result}
  })
}

function createSections(
  overallStatus: Status,
  inputs: ActionInputs
): Section[] {
  const sections: Section[] = []
  if (inputs.needs.length !== 0) {
    const needsSection: Section = {
      activityTitle: 'Previous jobs',
      activitySubtitle: 'Results of previous jobs',
      facts: createNeedsFacts(inputs.needs),
      markdown: false
    }
    sections.push(needsSection)
  }
  if (inputs.job) {
    const jobSection: Section = {
      activityTitle: `Job status: ${inputs.job?.status}`,
      facts: [],
      markdown: false
    }
    sections.push(jobSection)
  }
  return sections
}

function createPotentialAction(inputs: ActionInputs): PotentialAction[] {
  const potentialAction: PotentialAction[] = []
  if (github.payload.repository) {
    const workflowAction: OpenUriAction = {
      ...defaultOpenUriAction,
      name: 'Workflow',
      targets: [
        {
          ...defaultTarget,
          uri: `${github.payload.repository.html_url}/actions/workflows/${github.workflow}`
        }
      ]
    }
    potentialAction.push(workflowAction)
  }
  if (inputs.additionalButton) {
    const additionalAction: OpenUriAction = {
      ...defaultOpenUriAction,
      name: `${inputs.additionalButton.displayName}`,
      targets: [
        {
          ...defaultTarget,
          uri: `${inputs.additionalButton.url}`
        }
      ]
    }
    potentialAction.push(additionalAction)
  }
  return potentialAction
}

function buildConnectorMessage(inputs: ActionInputs): ConnectorMessage {
  const overallStatus = getOverallStatus(inputs)
  return {
    ...defaultConnectorMessage,
    summary: inputs.title || `Workflow run was ${overallStatus}`,
    themeColor: determineColor(overallStatus),
    sections: createSections(overallStatus, inputs),
    potentialAction: createPotentialAction(inputs)
  }
}

export {buildConnectorMessage}
