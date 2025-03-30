import { JobStatus, NeedsResult } from '../types.js';
declare function createFailedNeed(): NeedsResult;
declare function createCancelledNeed(): NeedsResult;
declare function createSuccessNeed(): NeedsResult;
declare function createFailureJob(): JobStatus;
declare function createSuccessJob(): JobStatus;
export { createFailedNeed, createCancelledNeed, createSuccessNeed, createSuccessJob, createFailureJob };
