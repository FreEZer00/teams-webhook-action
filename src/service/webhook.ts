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
import {ActionInputs, GithubValues, NeedsResult, Status} from '../types'
import {GitHub} from '@actions/github/lib/utils'

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
  inputs: ActionInputs,
  githubValues?: GithubValues
): Section[] {
  const sections: Section[] = []
  if (inputs.needs.length !== 0) {
    const needsSection: Section = {
      activityTitle: 'Workflow jobs',
      activitySubtitle: githubValues
        ? `Triggered by ${githubValues.actor}`
        : '',
      facts: createNeedsFacts(inputs.needs),
      markdown: false
    }
    sections.push(needsSection)
  }
  if (inputs.job) {
    const jobSection: Section = {
      activityTitle: `${githubValues ? githubValues?.job : 'Job'} status: ${
        inputs.job?.status
      }`,
      facts: [],
      markdown: false
    }
    sections.push(jobSection)
  }
  return sections
}

function createPotentialAction(
  inputs: ActionInputs,
  githubValues?: GithubValues
): PotentialAction[] {
  const potentialAction: PotentialAction[] = []

  if (githubValues) {
    const workflowAction: OpenUriAction = {
      ...defaultOpenUriAction,
      name: 'Workflow run',
      targets: [
        {
          ...defaultTarget,
          uri: `${githubValues.repositoryUrl}/actions/runs/${githubValues.run_id}`
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

function getSummary(
  inputs: ActionInputs,
  overallStatus: Status,
  githubValues?: GithubValues
): string {
  if (inputs.title) {
    return inputs.title
  } else if (githubValues) {
    return `${githubValues.workflow} was ${overallStatus}`
  }
  return `Workflow run was ${overallStatus}`
}

function buildConnectorMessage(
  inputs: ActionInputs,
  githubValues?: GithubValues
): ConnectorMessage {
  const overallStatus = getOverallStatus(inputs)
  return {
    ...defaultConnectorMessage,
    summary: getSummary(inputs, overallStatus, githubValues),
    themeColor: determineColor(overallStatus),
    sections: createSections(overallStatus, inputs, githubValues),
    potentialAction: createPotentialAction(inputs, githubValues)
  }
}

export {buildConnectorMessage}
