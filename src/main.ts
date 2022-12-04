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

interface NeedsResults {
  jobName: string
  result: string
}
const getInputs = (): ActionInputs => {
  const webhookUrl = core.getInput('webhookUrl')
  const job = core.getInput('job')
  core.info(job)
  const steps = core.getInput('steps')
  core.info(steps)
  const needs = core.getInput('needs')
  core.info(needs)
  const parse = JSON.parse(needs)
  const needsList: NeedsResults[] = Object.keys(parse).map(
    (value): NeedsResults => {
      const parseElement = parse[value]
      return {jobName: value, result: parseElement.result}
    }
  )
  core.info(`Parsed needs : ${needsList}`)

  return {webhookUrl}
}

run()
