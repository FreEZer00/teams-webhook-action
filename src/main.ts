import * as core from '@actions/core'
import {sendNotification} from './teamsclient/main'
import {ActionInputs, JobStatus, NeedsResult} from './types'

async function run(): Promise<void> {
  try {
    const inputs = getInputs()
    await sendNotification(inputs.webhookUrl, undefined, core.info, core.error)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

function parseNeeds(needs: string): NeedsResult[] {
  if (needs === '') {
    return []
  }
  const parsed = JSON.parse(needs)
  return Object.keys(parsed).map((key): NeedsResult => {
    const parseElement = parsed[key]
    return {
      jobName: key,
      result: parseElement.result,
      success: parseElement.result === 'success',
      skipped: parseElement.result === 'skipped',
      failure: parseElement.result === 'failure',
      cancelled: parseElement.result === 'canceled'
    }
  })
}

function parseJob(job: string): JobStatus | undefined {
  if (job === '') {
    return undefined
  }
  const parsed = JSON.parse(job)

  return {
    status: parsed.status,
    success: parsed.status === 'success',
    skipped: parsed.status === 'skipped',
    failure: parsed.status === 'failure',
    cancelled: parsed.status === 'canceled'
  }
}

const getInputs = (): ActionInputs => {
  const webhookUrl = core.getInput('webhookUrl')
  const jobInput = core.getInput('job')
  const job = parseJob(jobInput)

  const needsInput = core.getInput('needs')
  const needs = parseNeeds(needsInput)

  return {webhookUrl, needs, job}
}

run()
