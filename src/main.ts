import * as core from '@actions/core'
import {sendNotification} from './teamsclient/main'
import {ActionInputs, JobStatus, NeedsResult} from './types'
import {parseJob, parseNeeds} from './service/input-parsing'

async function run(): Promise<void> {
  try {
    const inputs = getInputs()
    await sendNotification(inputs.webhookUrl, undefined, core.info, core.error)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

const getInputs = (): ActionInputs => {
  const webhookUrl = core.getInput('webhookUrl')
  const jobInput = core.getInput('job')
  const needsInput = core.getInput('needs')

  const job: JobStatus | undefined = parseJob(jobInput)
  const needs: NeedsResult[] = parseNeeds(needsInput)

  return {webhookUrl, needs, job}
}

run()
