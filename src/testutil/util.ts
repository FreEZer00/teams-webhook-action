import { JobStatus, NeedsResult } from '../types'

function createFailedNeed(): NeedsResult {
  return {
    jobName: 'neededJob',
    result: 'failure',
    success: false,
    failure: true,
    cancelled: false,
    skipped: false
  }
}

function createCancelledNeed(): NeedsResult {
  return {
    jobName: 'neededJob',
    result: 'cancelled',
    success: false,
    failure: false,
    cancelled: true,
    skipped: false
  }
}

function createSuccessNeed(): NeedsResult {
  return {
    jobName: 'neededJob',
    result: 'success',
    success: true,
    failure: false,
    cancelled: false,
    skipped: false
  }
}

function createFailureJob(): JobStatus {
  return {
    status: 'failure',
    success: false,
    failure: true,
    cancelled: false,
    skipped: false
  }
}
function createSuccessJob(): JobStatus {
  return {
    status: 'success',
    success: true,
    failure: false,
    cancelled: false,
    skipped: false
  }
}

export {
  createFailedNeed,
  createCancelledNeed,
  createSuccessNeed,
  createSuccessJob,
  createFailureJob
}
