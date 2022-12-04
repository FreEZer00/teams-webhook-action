import * as core from '@actions/core'
import {sendNotification} from './teamsclient/main'

async function run(): Promise<void> {
  try {
    const inputs = getInputs()
    await sendNotification(inputs.webhookUrl, undefined, core.info, core.error)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

interface ActionInputs {
  webhookUrl: string
}

const getInputs = (): ActionInputs => {
  const webhookUrl = core.getInput('webhookUrl')
  const job = core.getInput('job')
  core.info(job)
  const steps = core.getInput('steps')
  core.info(steps)
  const needs = core.getInput('needs')
  core.info(needs)

  return {webhookUrl}
}

run()
