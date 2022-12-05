import * as core from '@actions/core'
import {sendNotification} from './teamsclient/main'
import {ActionInputs, JobStatus, NeedsResult} from './types'
import {parseJob, parseNeeds} from './service/input-parsing'
import {buildConnectorMessage} from './service/webhook'

async function run(): Promise<void> {
  try {
    const inputs = getInputs()
    const connectorMessage = buildConnectorMessage(inputs)
    await sendNotification(
      inputs.webhookUrl,
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
  const title = core.getInput('title') ? core.getInput('title') : undefined

  const job: JobStatus | undefined = parseJob(jobInput)
  const needs: NeedsResult[] = parseNeeds(needsInput)

  return {webhookUrl, needs, job, title}
}

run()
