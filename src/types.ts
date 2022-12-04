interface ActionInputs {
  webhookUrl: string
  job?: JobStatus
  needs: NeedsResult[]
}

interface NeedsResult {
  jobName: string
  result: Status
  success: boolean
  skipped: boolean
  failure: boolean
  cancelled: boolean
}
interface JobStatus {
  status: Status
  success: boolean
  skipped: boolean
  failure: boolean
  cancelled: boolean
}

type Status = 'success' | 'skipped' | 'failure' | 'cancelled'

export {Status, JobStatus, ActionInputs, NeedsResult}
