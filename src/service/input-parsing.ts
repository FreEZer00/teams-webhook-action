import { JobStatus, NeedsResult } from '../types'

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

export { parseJob, parseNeeds }
