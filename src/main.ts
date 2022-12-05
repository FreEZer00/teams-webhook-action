import * as core from '@actions/core'
import {sendNotification} from './teamsclient/main'
import {ActionInputs, GithubValues, JobStatus, NeedsResult} from './types'
import {parseJob, parseNeeds} from './service/input-parsing'
import {buildConnectorMessage} from './service/webhook'
import {context as github} from '@actions/github'

function getGithubValues(): GithubValues {
  return {
    workflow: github.workflow,
    repositoryUrl: github.payload.repository?.html_url,
    run_id: github.runId,
    job: github.job,
    actor: github.actor
  }
}

async function run(): Promise<void> {
  try {
    const inputs = getInputs()
    const githubValues = getGithubValues()
    const connectorMessage = buildConnectorMessage(inputs, githubValues)
    await sendNotification(
      inputs.webhookUrl,
      false,
      connectorMessage,
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
  const title =
    core.getInput('title') !== '' ? core.getInput('title') : undefined
  const additionalButtonTitle =
    core.getInput('additional_button_title') !== ''
      ? core.getInput('additional_button_title')
      : undefined
  const additionalButtonUrl =
    core.getInput('additional_button_url') !== ''
      ? core.getInput('additional_button_url')
      : undefined

  const job: JobStatus | undefined = parseJob(jobInput)
  const needs: NeedsResult[] = parseNeeds(needsInput)

  return {
    webhookUrl,
    needs,
    job,
    title,
    additionalButton:
      additionalButtonTitle && additionalButtonUrl
        ? {displayName: additionalButtonTitle, url: additionalButtonUrl}
        : undefined
  }
}

run()
