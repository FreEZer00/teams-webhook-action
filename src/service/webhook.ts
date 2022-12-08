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
import {
  ActionInputs,
  GithubValues,
  JobStatus,
  NeedsResult,
  Status
} from '../types'

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

function createFacts(
  needs: NeedsResult[],
  githubValues: GithubValues,
  job?: JobStatus
): Fact[] {
  const facts: Fact[] = needs.map(
    (n): Fact => ({name: n.jobName, value: n.result})
  )
  if (job) {
    facts.push({name: `${githubValues.job}`, value: job.status})
  }
  return facts
}

function createSections(
  overallStatus: Status,
  inputs: ActionInputs,
  githubValues: GithubValues
): Section[] {
  const sections: Section[] = []
  if (inputs.needs.length !== 0) {
    const needsSection: Section = {
      activityTitle: `Workflow "${githubValues.workflow}" ran with result ${overallStatus}`,
      activitySubtitle: `Triggered by ${githubValues.actor}`,
      facts: createFacts(inputs.needs, githubValues, inputs.job),
      markdown: false
    }
    sections.push(needsSection)
  }
  return sections
}

function createPotentialAction(
  inputs: ActionInputs,
  githubValues: GithubValues
): PotentialAction[] {
  const potentialAction: PotentialAction[] = []

  if (githubValues.repositoryUrl) {
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

  for (const button of inputs.additionalButtons) {
    const additionalAction: OpenUriAction = {
      ...defaultOpenUriAction,
      name: `${button.displayName}`,
      targets: [
        {
          ...defaultTarget,
          uri: `${button.url}`
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
  githubValues: GithubValues
): string {
  if (inputs.title) {
    return inputs.title
  }
  return `${githubValues.workflow} was ${overallStatus}`
}

function buildConnectorMessage(
  inputs: ActionInputs,
  githubValues: GithubValues
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
