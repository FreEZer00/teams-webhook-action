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

interface NeedsResult {
  jobName: string
  result: string
  success: boolean
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
  const needsList: NeedsResult[] = Object.keys(parse).map(
    (key): NeedsResult => {
      const parseElement = parse[key]
      return {
        jobName: key,
        result: parseElement.result,
        success: parseElement.result === 'Success'
      }
    }
  )
  for (const n of needsList) {
    core.info(`${n.jobName} ${n.result} ${n.success}`)
  }
  core.info(`Parsed needs : ${needsList}`)

  return {webhookUrl}
}

run()
