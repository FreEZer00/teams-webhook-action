import * as core from '@actions/core'
import { sendNotification } from './teamsclient/main.js'
import {
  ActionInputs,
  AdditionalButton,
  GithubValues,
  JobStatus,
  NeedsResult
} from './types.js'
import { parseJob, parseNeeds } from './service/input-parsing.js'
import { buildConnectorMessage } from './service/webhook.js'
import { context as github } from '@actions/github'

function getGithubValues(): GithubValues {
  return {
    workflow: github.workflow,
    repositoryUrl: github.payload.repository?.html_url,
    run_id: github.runId,
    job: github.job,
    actor: github.actor,
    repoName: github.payload.repository?.name
  }
}

export async function run(): Promise<void> {
  try {
    const inputs = getInputs()
    const githubValues = getGithubValues()
    const connectorMessage = buildConnectorMessage(inputs, githubValues)
    await sendNotification(
      inputs.webhookUrl,
      connectorMessage,
      inputs.dryRun,
      core.info,
      core.error
    )
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

const getInputs = (): ActionInputs => {
  const webhookUrl = core.getInput('webhook_url')
  const jobInput = core.getInput('job')
  const needsInput = core.getInput('needs')
  const dryRun = core.getBooleanInput('dry_run')
  const hideFacts = core.getBooleanInput('hide_facts')
  const title =
    core.getInput('title') !== '' ? core.getInput('title') : undefined
  const additionalButtonTitle = core.getMultilineInput(
    'additional_button_title'
  )
  const additionalButtonUrl = core.getMultilineInput('additional_button_url')

  if (additionalButtonTitle.length !== additionalButtonUrl.length) {
    throw new Error(
      'Number of additional buttons titles and urls does not match '
    )
  }
  const additionalButtons: AdditionalButton[] = additionalButtonUrl.map(
    (url: string, index: number): AdditionalButton => {
      return { displayName: additionalButtonTitle[index], url }
    }
  )

  const job: JobStatus | undefined = parseJob(jobInput)
  const needs: NeedsResult[] = parseNeeds(needsInput)

  return {
    webhookUrl,
    needs,
    job,
    title,
    additionalButtons,
    hideFacts,
    dryRun
  }
}
